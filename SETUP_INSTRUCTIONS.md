# Lead Capture Setup Instructions

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database
```bash
# Generate Prisma client
npm run prisma:generate

# Create database and run migrations
npm run prisma:migrate
```

### 3. Configure Environment Variables

Create/update `.env.local`:
```bash
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY=sk-your-key-here
HUBSPOT_PRIVATE_APP_TOKEN=pat-your-token-here
```

### 4. Create Uploads Directory
The uploads directory will be created automatically on first upload.

### 5. Start Development Servers

Terminal 1 (Backend):
```bash
npm run dev:server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

## Files Created/Modified

### Backend Files
- ✅ `prisma/schema.prisma` - Database schema
- ✅ `src/lib/db.ts` - Prisma client
- ✅ `src/lib/hubspot.ts` - HubSpot integration
- ✅ `src/lib/fileUpload.ts` - File upload & PDF extraction
- ✅ `src/server.ts` - API endpoints added

### Frontend Components
- ✅ `src/components/FileUpload.tsx` - File upload UI
- ✅ `src/components/FieldConfirmation.tsx` - Field confirmation/edit
- ✅ `src/components/IdentityForm.tsx` - Identity collection
- ✅ `src/components/EscalationModal.tsx` - Escalation modal
- ✅ `src/components/ChatCategoryPage.tsx` - Updated with new flow

### Package Updates
- ✅ `package.json` - Added dependencies (Prisma, HubSpot, pdf-parse, multer, uuid)

## API Endpoints

### POST /api/cases
Creates a new case and returns `caseId`.

### POST /api/cases/:id/upload
Uploads a file (PDF/image) and extracts fields.
- Body: multipart/form-data with `file` field
- Returns: `{ ok: true, fileUrl, extractedFields }`

### POST /api/cases/:id/confirm
Confirms extracted fields.
- Body: `{ fields: ExtractedFields }`
- Returns: `{ ok: true }`

### POST /api/cases/:id/identify
Saves identity and syncs to HubSpot.
- Body: `{ fullName: string, email?: string }`
- Returns: `{ ok: true, contactId, hubspotContactId }`

### POST /api/cases/:id/escalate
Escalates case to lawyer.
- Body: `{ phone: string, consent: boolean }`
- Returns: `{ ok: true }`

## Testing the Flow

### Upload Path
1. Navigate to traffic category chat
2. See welcome messages
3. Click "להעלות את הדוח"
4. Upload a PDF file
5. Review extracted fields
6. Confirm or edit fields
7. Enter name and email
8. Receive AI assessment
9. Click "להמשיך לעורך דין"
10. Enter phone and consent
11. Verify in database and HubSpot

### Manual Path
1. Navigate to traffic category chat
2. Click "למלא ידנית"
3. Answer 5 questions one by one
4. Enter name and email
5. Receive AI assessment
6. Test escalation

## Database Verification

```bash
# Open Prisma Studio
npm run prisma:studio
```

Check:
- `contacts` table for saved contacts
- `cases` table for case records
- `chat_messages` table for conversation history

## HubSpot Verification

1. Log into HubSpot
2. Go to Contacts → Check for new contact
3. Go to Deals → Check for new deal
4. Verify deal is associated with contact
5. Check deal notes for case details

## Production Deployment

### Environment Variables (Render/Production)
```
DATABASE_URL="file:./prod.db"  # Or use PostgreSQL
OPENAI_API_KEY=sk-...
HUBSPOT_PRIVATE_APP_TOKEN=pat-...
NODE_ENV=production
PORT=8080
```

### Build Commands
```bash
npm run build
npm run prisma:generate
npm run start
```

### Important Notes
- Uploads directory must be writable
- Database file must persist (use PostgreSQL in production recommended)
- HubSpot token must have proper permissions (contacts, deals, engagements)

## Troubleshooting

### Database Issues
- Run `npm run prisma:generate` after schema changes
- Run `npm run prisma:migrate` to apply migrations
- Check `DATABASE_URL` is correct

### HubSpot Issues
- Verify `HUBSPOT_PRIVATE_APP_TOKEN` is set
- Check token has required scopes
- Errors are logged but don't block the flow

### File Upload Issues
- Check uploads directory exists and is writable
- Verify file size < 10MB
- Check file type is PDF or image

## Next Steps

1. Test the complete flow end-to-end
2. Verify HubSpot integration
3. Check database records
4. Deploy to production
5. Monitor logs for errors
