import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import cors from 'cors';
import { askOpenAI, OpenAIChatMessage } from './lib/openai';

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

