import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export interface ExtractedFields {
  fine_type?: string;
  date_time?: string;
  location?: string;
  amount?: string;
  points?: string;
  law_section?: string;
  vehicle_plate?: string;
  issuing_authority?: string;
  needs_ocr?: boolean;
}

/**
 * Save uploaded file and return file URL
 */
export async function saveUploadedFile(
  file: Express.Multer.File,
  caseId: string
): Promise<string> {
  const fileExtension = path.extname(file.originalname);
  const fileName = `${caseId}-${uuidv4()}${fileExtension}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  fs.writeFileSync(filePath, file.buffer);

  // Return relative URL path
  return `/uploads/${fileName}`;
}

/**
 * Extract text from PDF
 */
async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Extract fields from text using simple pattern matching
 * This is a basic implementation - can be enhanced with AI/ML
 */
function extractFieldsFromText(text: string): ExtractedFields {
  const fields: ExtractedFields = {};

  // Extract date/time patterns (Hebrew and English formats)
  const dateTimePatterns = [
    /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/g,
    /(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/g,
    /(יום\s+\d{1,2}\s+ב\s+\w+)/g,
  ];
  for (const pattern of dateTimePatterns) {
    const match = text.match(pattern);
    if (match) {
      fields.date_time = match[0];
      break;
    }
  }

  // Extract amount (ש"ח, ₪, NIS patterns)
  const amountPatterns = [
    /(\d+)\s*ש"ח/g,
    /(\d+)\s*₪/g,
    /(\d+)\s*NIS/g,
    /סכום[:\s]+(\d+)/g,
  ];
  for (const pattern of amountPatterns) {
    const match = text.match(pattern);
    if (match) {
      fields.amount = match[1] || match[0];
      break;
    }
  }

  // Extract points
  const pointsPatterns = [
    /(\d+)\s*נקודות/g,
    /נקודות[:\s]+(\d+)/g,
    /points[:\s]+(\d+)/gi,
  ];
  for (const pattern of pointsPatterns) {
    const match = text.match(pattern);
    if (match) {
      fields.points = match[1] || match[0];
      break;
    }
  }

  // Extract location (look for common location keywords)
  const locationKeywords = ['רחוב', 'כביש', 'מחלף', 'צומת', 'שדרות', 'רח׳'];
  for (const keyword of locationKeywords) {
    const regex = new RegExp(`${keyword}[^\\n]{0,50}`, 'g');
    const match = text.match(regex);
    if (match) {
      fields.location = match[0].trim();
      break;
    }
  }

  // Extract vehicle plate (Israeli format: 123-45-678 or 12-345-67)
  const platePattern = /(\d{2,3}[-\s]\d{2,3}[-\s]\d{2,3})/g;
  const plateMatch = text.match(platePattern);
  if (plateMatch) {
    fields.vehicle_plate = plateMatch[0];
  }

  // Extract law section (סעיף, section)
  const lawSectionPatterns = [
    /סעיף[:\s]+(\d+[א-ת]?)/g,
    /section[:\s]+(\d+)/gi,
    /(\d+[א-ת]?)\s*לחוק/g,
  ];
  for (const pattern of lawSectionPatterns) {
    const match = text.match(pattern);
    if (match) {
      fields.law_section = match[1] || match[0];
      break;
    }
  }

  // Extract fine type (common violations)
  const fineTypes = [
    'חריגת מהירות',
    'עצירה אסורה',
    'אי ציות לתמרור',
    'נהיגה מסוכנת',
    'אי ציות לרמזור',
  ];
  for (const fineType of fineTypes) {
    if (text.includes(fineType)) {
      fields.fine_type = fineType;
      break;
    }
  }

  // Extract issuing authority
  const authorityKeywords = ['משטרת ישראל', 'רשות הרישוי', 'משטרה'];
  for (const keyword of authorityKeywords) {
    if (text.includes(keyword)) {
      fields.issuing_authority = keyword;
      break;
    }
  }

  return fields;
}

/**
 * Process uploaded file and extract fields
 */
export async function processUploadedFile(
  file: Express.Multer.File,
  caseId: string
): Promise<{ fileUrl: string; extractedFields: ExtractedFields }> {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const fileUrl = await saveUploadedFile(file, caseId);
  const filePath = path.join(UPLOAD_DIR, path.basename(fileUrl));

  let extractedFields: ExtractedFields = {};

  if (fileExtension === '.pdf') {
    try {
      const text = await extractTextFromPDF(filePath);
      extractedFields = extractFieldsFromText(text);
    } catch (error) {
      console.error('PDF processing error:', error);
      // Return empty fields if extraction fails
    }
  } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(fileExtension)) {
    // For images, mark as needing OCR
    extractedFields.needs_ocr = true;
    // Could add basic metadata extraction here if needed
  }

  return { fileUrl, extractedFields };
}
