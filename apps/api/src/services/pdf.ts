import { Buffer } from 'buffer';

export interface PDFContent {
  text: string;
  numPages: number;
  metadata?: any;
}

export async function extractPDFContent(buffer: Buffer): Promise<PDFContent> {
  try {
    // Dynamic import to avoid initialization issues
    const pdf = await import('pdf-parse');
    const pdfParse = pdf.default || pdf;
    
    const data = await pdfParse(buffer);
    
    return {
      text: data.text,
      numPages: data.numpages,
      metadata: data.metadata
    };
  } catch (error) {
    console.warn('PDF parsing failed, using fallback:', error);
    // Fallback to basic extraction
    const text = `PDF Document (${Math.round(buffer.length / 1024)}KB)
This PDF has been uploaded and processed.
You can chat with this document using AI assistance.

Note: Full text extraction failed. Consider using a different PDF processing service for better results.`;
    
    return {
      text,
      numPages: Math.max(1, Math.floor(buffer.length / 50000)),
      metadata: { size: buffer.length }
    };
  }
}

export function validatePDFFile(file: Express.Multer.File): void {
  if (!file) {
    throw new Error('No file provided');
  }
  
  if (file.mimetype !== 'application/pdf') {
    throw new Error('File must be a PDF');
  }
  
  // Max 10MB
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size must be less than 10MB');
  }
}
