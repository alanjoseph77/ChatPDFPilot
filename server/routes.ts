import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { setupWebSocket } from "./services/websocket.js";
import { extractPDFContent, validatePDFFile } from "./services/pdf.js";
import { summarizeDocument } from "./services/gemini.js";
import multer from "multer";
import { insertDocumentSchema, insertChatSessionSchema } from "@shared/schema";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Setup WebSocket
  setupWebSocket(httpServer);

  // Get all documents
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // Get single document
  app.get("/api/documents/:id", async (req, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  // Upload document
  app.post("/api/documents", (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: "File size must be less than 10MB" });
        }
        return res.status(400).json({ message: "File upload error: " + err.message });
      }
      next();
    });
  }, async (req, res) => {
    try {
      console.log("Upload attempt - File received:", !!req.file);
      
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      console.log("File details:", {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });

      validatePDFFile(req.file);
      
      const pdfContent = await extractPDFContent(req.file.buffer);
      
      const documentData = {
        title: req.file.originalname.replace(/\.pdf$/i, ''),
        filename: req.file.originalname,
        content: pdfContent.text,
        size: req.file.size,
        pageCount: pdfContent.numPages,
      };

      const validatedData = insertDocumentSchema.parse(documentData);
      const document = await storage.createDocument(validatedData);
      
      // Create initial chat session
      const session = await storage.createChatSession({
        documentId: document.id,
      });

      console.log("Document uploaded successfully:", document.id);

      res.status(201).json({
        document,
        sessionId: session.id,
      });
    } catch (error) {
      console.error("Upload processing error:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to upload document" });
    }
  });

  // Delete document
  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const success = await storage.deleteDocument(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  // Get chat session for document
  app.get("/api/documents/:id/chat", async (req, res) => {
    try {
      let session = await storage.getChatSessionByDocument(req.params.id);
      
      if (!session) {
        // Create new session if none exists
        session = await storage.createChatSession({
          documentId: req.params.id,
        });
      }

      const messages = await storage.getMessagesBySession(session.id);
      
      res.json({
        session,
        messages,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get chat session" });
    }
  });

  // Get document summary
  app.post("/api/documents/:id/summarize", async (req, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      const summary = await summarizeDocument(document.content);
      res.json({ summary });
    } catch (error) {
      console.error("Summarization error:", error);
      res.status(500).json({ message: "Failed to generate summary" });
    }
  });

  return httpServer;
}
