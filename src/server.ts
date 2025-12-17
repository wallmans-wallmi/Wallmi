import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { askOpenAI, OpenAIChatMessage } from './lib/openai';
import { prisma } from './lib/db';
import { upsertHubSpotContact, createHubSpotDeal, updateHubSpotDealStage } from './lib/hubspot';
import { processUploadedFile } from './lib/fileUpload';

// Load environment variables
// In production, hosting providers set env vars directly, so only load .env files in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

const app = express();
// Use PORT env var (standard for hosting providers) or fallback to 5175 for dev
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5175;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and images are allowed.'));
    }
  },
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(process.cwd(), 'build');
  app.use(express.static(buildPath));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Server is running' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, topicId, intakeAnswers } = req.body;

    // Validate messages array
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(200).json({
        ok: false,
        errorCode: 'INTERNAL_SERVER_ERROR',
        errorMessage: 'messages array is required and must not be empty'
      });
    }

    // Validate message format
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return res.status(200).json({
          ok: false,
          errorCode: 'INTERNAL_SERVER_ERROR',
          errorMessage: 'Each message must have role and content fields'
        });
      }
      if (!['system', 'user', 'assistant'].includes(msg.role)) {
        return res.status(200).json({
          ok: false,
          errorCode: 'INTERNAL_SERVER_ERROR',
          errorMessage: 'Message role must be system, user, or assistant'
        });
      }
    }

    // Convert to OpenAIChatMessage format
    const openAIMessages: OpenAIChatMessage[] = messages.map((msg: any) => ({
      role: msg.role as 'system' | 'user' | 'assistant',
      content: msg.content
    }));

    // Call OpenAI
    const aiResponse = await askOpenAI({
      messages: openAIMessages,
      topicId,
      intakeAnswers
    });

    // Return success response
    return res.status(200).json({
      ok: true,
      content: aiResponse
    });

  } catch (error) {
    console.error('Error in /api/chat:', error);
    
    // Handle specific errors with proper error codes
    if (error instanceof Error) {
      const errorWithCode = error as Error & { code?: string };
      const errorCode = errorWithCode.code || 'INTERNAL_SERVER_ERROR';
      
      // Map error codes to user-friendly Hebrew messages
      let errorMessage = error.message || 'אירעה שגיאה בעת עיבוד הבקשה';
      
      if (errorCode === 'OPENAI_NOT_CONFIGURED') {
        errorMessage = 'לא הצלחתי להתחבר ל-AI כרגע, נסו שוב מאוחר יותר';
      } else if (errorCode === 'OPENAI_REQUEST_FAILED') {
        errorMessage = 'לא הצלחתי להתחבר ל-AI כרגע, נסו שוב מאוחר יותר';
      }
      
      return res.status(200).json({
        ok: false,
        errorCode: errorCode,
        errorMessage: errorMessage
      });
    }

    // Unknown error
    return res.status(200).json({
      ok: false,
      errorCode: 'INTERNAL_SERVER_ERROR',
      errorMessage: 'אירעה שגיאה לא ידועה'
    });
  }
});

// ===== Case Management Endpoints =====

// POST /api/cases - Create a new case
app.post('/api/cases', async (req, res) => {
  try {
    // Create a temporary contact if needed (will be updated when identity is collected)
    const contact = await prisma.contact.create({
      data: {
        fullName: 'Anonymous',
      },
    });

    const newCase = await prisma.case.create({
      data: {
        contactId: contact.id,
        source: 'chat',
        status: 'draft',
      },
    });

    return res.status(200).json({
      ok: true,
      caseId: newCase.id,
      contactId: contact.id,
    });
  } catch (error) {
    console.error('Error creating case:', error);
    return res.status(200).json({
      ok: false,
      errorCode: 'INTERNAL_SERVER_ERROR',
      errorMessage: 'Failed to create case',
    });
  }
});

// POST /api/cases/:id/upload - Upload file and extract fields
app.post('/api/cases/:id/upload', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(200).json({
        ok: false,
        errorCode: 'VALIDATION_ERROR',
        errorMessage: 'No file provided',
      });
    }

    const caseRecord = await prisma.case.findUnique({ where: { id } });
    if (!caseRecord) {
      return res.status(200).json({
        ok: false,
        errorCode: 'NOT_FOUND',
        errorMessage: 'Case not found',
      });
    }

    const { fileUrl, extractedFields } = await processUploadedFile(file, id);

    // Update case with file URL and extracted fields
    await prisma.case.update({
      where: { id },
      data: {
        reportFileUrl: fileUrl,
        extractedSummaryJson: JSON.stringify(extractedFields),
        fineType: extractedFields.fine_type,
        dateTime: extractedFields.date_time,
        location: extractedFields.location,
        amount: extractedFields.amount,
        points: extractedFields.points,
        lawSection: extractedFields.law_section,
        vehiclePlate: extractedFields.vehicle_plate,
        issuingAuthority: extractedFields.issuing_authority,
      },
    });

    return res.status(200).json({
      ok: true,
      fileUrl,
      extractedFields,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(200).json({
      ok: false,
      errorCode: 'INTERNAL_SERVER_ERROR',
      errorMessage: error instanceof Error ? error.message : 'Failed to upload file',
    });
  }
});

// POST /api/cases/:id/confirm - Confirm extracted fields
app.post('/api/cases/:id/confirm', async (req, res) => {
  try {
    const { id } = req.params;
    const { fields } = req.body;

    if (!fields || typeof fields !== 'object') {
      return res.status(200).json({
        ok: false,
        errorCode: 'VALIDATION_ERROR',
        errorMessage: 'Fields object is required',
      });
    }

    const caseRecord = await prisma.case.findUnique({ where: { id } });
    if (!caseRecord) {
      return res.status(200).json({
        ok: false,
        errorCode: 'NOT_FOUND',
        errorMessage: 'Case not found',
      });
    }

    // Update case with confirmed fields
    await prisma.case.update({
      where: { id },
      data: {
        fineType: fields.fine_type || caseRecord.fineType,
        dateTime: fields.date_time || caseRecord.dateTime,
        location: fields.location || caseRecord.location,
        amount: fields.amount || caseRecord.amount,
        points: fields.points || caseRecord.points,
        lawSection: fields.law_section || caseRecord.lawSection,
        vehiclePlate: fields.vehicle_plate || caseRecord.vehiclePlate,
        issuingAuthority: fields.issuing_authority || caseRecord.issuingAuthority,
        extractedSummaryJson: JSON.stringify(fields),
        userConfirmed: true,
        status: 'ready_for_assessment',
      },
    });

    return res.status(200).json({
      ok: true,
      message: 'Fields confirmed',
    });
  } catch (error) {
    console.error('Error confirming fields:', error);
    return res.status(200).json({
      ok: false,
      errorCode: 'INTERNAL_SERVER_ERROR',
      errorMessage: 'Failed to confirm fields',
    });
  }
});

// POST /api/cases/:id/identify - Save identity and sync to HubSpot
app.post('/api/cases/:id/identify', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email } = req.body;

    if (!fullName) {
      return res.status(200).json({
        ok: false,
        errorCode: 'VALIDATION_ERROR',
        errorMessage: 'Full name is required',
      });
    }

    const caseRecord = await prisma.case.findUnique({
      where: { id },
      include: { contact: true },
    });

    if (!caseRecord) {
      return res.status(200).json({
        ok: false,
        errorCode: 'NOT_FOUND',
        errorMessage: 'Case not found',
      });
    }

    // Update contact
    const contact = await prisma.contact.update({
      where: { id: caseRecord.contactId },
      data: {
        fullName,
        email: email || undefined,
      },
    });

    // Sync to HubSpot
    let hubspotContactId: string | null = null;
    try {
      hubspotContactId = await upsertHubSpotContact({
        email: contact.email || undefined,
        fullName: contact.fullName,
      });

      if (hubspotContactId) {
        await prisma.contact.update({
          where: { id: contact.id },
          data: { hubspotContactId },
        });
      }
    } catch (hubspotError) {
      console.error('HubSpot sync error:', hubspotError);
      // Continue even if HubSpot fails
    }

    // Create HubSpot deal if case is ready
    if (caseRecord.status === 'ready_for_assessment' && hubspotContactId) {
      try {
        const dealName = `Wallmans AI תעבורה - ${contact.fullName}${contact.email ? ` - ${contact.email}` : ''} - ${caseRecord.fineType || 'Unknown'}`;
        
        await createHubSpotDeal({
          dealName,
          contactId: hubspotContactId,
          fineType: caseRecord.fineType || undefined,
          fineDateTime: caseRecord.dateTime || undefined,
          fineLocation: caseRecord.location || undefined,
          fineAmount: caseRecord.amount || undefined,
          finePoints: caseRecord.points || undefined,
          lawSection: caseRecord.lawSection || undefined,
          caseId: caseRecord.id,
          reportFileUrl: caseRecord.reportFileUrl || undefined,
          extractedSummary: caseRecord.extractedSummaryJson || undefined,
        });

        await prisma.case.update({
          where: { id },
          data: { hubspotSyncStatus: 'success' },
        });
      } catch (dealError) {
        console.error('HubSpot deal creation error:', dealError);
        await prisma.case.update({
          where: { id },
          data: { hubspotSyncStatus: 'failed' },
        });
      }
    }

    return res.status(200).json({
      ok: true,
      contactId: contact.id,
      hubspotContactId,
    });
  } catch (error) {
    console.error('Error identifying contact:', error);
    return res.status(200).json({
      ok: false,
      errorCode: 'INTERNAL_SERVER_ERROR',
      errorMessage: 'Failed to save identity',
    });
  }
});

// POST /api/cases/:id/escalate - Escalate to lawyer
app.post('/api/cases/:id/escalate', async (req, res) => {
  try {
    const { id } = req.params;
    const { phone, consent } = req.body;

    if (!phone) {
      return res.status(200).json({
        ok: false,
        errorCode: 'VALIDATION_ERROR',
        errorMessage: 'Phone number is required',
      });
    }

    if (!consent) {
      return res.status(200).json({
        ok: false,
        errorCode: 'VALIDATION_ERROR',
        errorMessage: 'Consent is required',
      });
    }

    const caseRecord = await prisma.case.findUnique({
      where: { id },
      include: { contact: true },
    });

    if (!caseRecord) {
      return res.status(200).json({
        ok: false,
        errorCode: 'NOT_FOUND',
        errorMessage: 'Case not found',
      });
    }

    // Update contact with phone
    await prisma.contact.update({
      where: { id: caseRecord.contactId },
      data: { phone },
    });

    // Update case
    await prisma.case.update({
      where: { id },
      data: {
        escalationRequested: true,
        status: 'escalated',
      },
    });

    // Update HubSpot if contact exists
    if (caseRecord.contact.hubspotContactId) {
      try {
        await upsertHubSpotContact({
          email: caseRecord.contact.email || undefined,
          fullName: caseRecord.contact.fullName,
          phone,
        });

        // Update deal stage if exists (would need to track deal ID)
        // For now, just log
        console.log('Escalation requested for HubSpot contact:', caseRecord.contact.hubspotContactId);
      } catch (hubspotError) {
        console.error('HubSpot escalation update error:', hubspotError);
      }
    }

    return res.status(200).json({
      ok: true,
      message: 'Escalation requested successfully',
    });
  } catch (error) {
    console.error('Error escalating case:', error);
    return res.status(200).json({
      ok: false,
      errorCode: 'INTERNAL_SERVER_ERROR',
      errorMessage: 'Failed to escalate case',
    });
  }
});

// Serve React app for all non-API routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`🚀 Production server running on port ${PORT}`);
    console.log(`📡 API endpoint: /api/chat`);
  } else {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/chat`);
  }
  
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  WARNING: OPENAI_API_KEY is not set. AI features will not work.');
  }
});

