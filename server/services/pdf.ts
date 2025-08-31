import pdf from 'pdf-parse';
import { Buffer } from 'buffer';

export interface PDFContent {
  text: string;
  numPages: number;
  metadata?: any;
}

export async function extractPDFContent(buffer: Buffer): Promise<PDFContent> {
  try {
    const data = await pdf(buffer);
    
    return {
      text: data.text,
      numPages: data.numpages,
      metadata: data.metadata
    };
  } catch (error) {
    throw new Error(`Failed to extract PDF content: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
