# Lead Capture Chat Flow Implementation

## Overview
This document describes the implementation of the lead-capture chat flow for "Wallmans AI – תעבורה" with HubSpot integration.

## Files Created/Modified

### Backend Files
1. **prisma/schema.prisma** - Database schema (contacts, cases, chat_messages)
2. **src/lib/db.ts** - Prisma client singleton
3. **src/lib/hubspot.ts** - HubSpot integration service
4. **src/lib/fileUpload.ts** - File upload and PDF extraction
5. **src/server.ts** - Updated with new API endpoints

### Frontend Components
1. **src/components/FileUpload.tsx** - File upload UI component
2. **src/components/FieldConfirmation.tsx** - Field confirmation/edit form
3. **src/components/IdentityForm.tsx** - Identity collection form
4. **src/components/EscalationModal.tsx** - Escalation modal with phone input

### API Endpoints
- `POST /api/cases` - Create new case
- `POST /api/cases/:id/upload` - Upload file and extract fields
- `POST /api/cases/:id/confirm` - Confirm extracted fields
- `POST /api/cases/:id/identify` - Save identity and sync to HubSpot
- `POST /api/cases/:id/escalate` - Escalate to lawyer

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations (creates database)
npm run prisma:migrate

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

### 3. Environment Variables
Add to `.env.local`:
```
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY=sk-...
HUBSPOT_PRIVATE_APP_TOKEN=pat-...
```

### 4. Create Uploads Directory
The uploads directory will be created automatically, but ensure write permissions.

## Chat Flow for Traffic Category

### Step 1: Welcome Messages
1. "ברוכים הבאים ל-Wallmans AI – תעבורה"
2. "כדי שאוכל להבין את המקרה שלכם, אצטרך לשאול אתכם מספר שאלות קצרות. בואו נתחיל"

### Step 2: Choice (Upload vs Manual)
User chooses:
- Option A: "להעלות את הדוח" (Upload report)
- Option B: "למלא ידנית" (Fill manually)

### Step 3A: Upload Path
1. Show file uploader (PDF/images)
2. Upload to backend
3. Extract fields from PDF
4. Show confirmation form
5. User confirms or edits
6. Proceed to identity collection

### Step 3B: Manual Path
Ask 5 questions:
1. סוג הדוח (select)
2. מתי ואיפה זה קרה (date/time + location)
3. מה נרשם בדוח (free text + optional amount/points)
4. איך נמסר הדוח (select)
5. מה קרה בפועל לפי הגרסה שלכם (free text)

### Step 4: Identity Collection
Before final AI answer, collect:
- full_name (required)
- email (optional)

### Step 5: Final AI Answer
Generate and display final assessment.

### Step 6: Escalation
When user clicks "להמשיך לעורך דין":
- Show escalation modal
- Collect phone number
- Require consent checkbox
- Save and sync to HubSpot

## HubSpot Integration

### Contact Sync
- Upserts contact by email
- Stores: firstname, lastname, phone, email
- Sets lifecyclestage: lead
- Returns hubspot_contact_id

### Deal Creation
- Creates deal when case is ready_for_assessment
- Deal name: "Wallmans AI תעבורה - {name} - {fine_type}"
- Associates with contact
- Adds note with case details

### Custom Properties
Attempts to set (falls back to note if not available):
- fine_type
- fine_date_time
- fine_location
- fine_amount
- fine_points
- law_section
- case_id

## Database Schema

### Contacts Table
- id (uuid)
- full_name
- email (unique, nullable)
- phone
- hubspot_contact_id
- created_at, updated_at

### Cases Table
- id (uuid)
- contact_id (fk)
- source = "chat"
- status: draft | ready_for_assessment | escalated
- fine_type, date_time, location, amount, points, law_section, vehicle_plate, issuing_authority
- report_file_url
- extracted_summary_json
- user_confirmed
- escalation_requested
- hubspot_sync_status
- created_at, updated_at

### Chat Messages Table
- id (uuid)
- case_id (fk)
- role: system | assistant | user
- content
- created_at

## Testing Checklist

### Upload Path
1. Start chat for traffic category
2. Choose "להעלות את הדוח"
3. Upload PDF file
4. Verify fields extracted
5. Confirm or edit fields
6. Provide identity
7. Verify case created in DB
8. Verify HubSpot contact created
9. Verify HubSpot deal created

### Manual Path
1. Start chat for traffic category
2. Choose "למלא ידנית"
3. Answer 5 questions
4. Provide identity
5. Verify case created
6. Verify HubSpot sync

### Escalation
1. Complete chat flow
2. Click "להמשיך לעורך דין"
3. Enter phone number
4. Check consent
5. Submit
6. Verify escalation_requested = true
7. Verify phone saved
8. Verify HubSpot updated

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

## Notes

- PDF extraction uses basic pattern matching (can be enhanced with AI/ML)
- Images are marked as "needs_ocr" for future processing
- HubSpot failures don't block the flow (errors logged, data still saved to DB)
- Case ID is stored in localStorage to persist across page refreshes
- All API endpoints return HTTP 200 with ok: true/false pattern
