import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { generateChatResponse } from './gemini.js';
import { storage } from '../storage.js';

interface ChatMessage {
  type: 'message' | 'typing' | 'error';
  content?: string;
  sessionId?: string;
  isUser?: boolean;
  timestamp?: string;
}

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });
  
  console.log('WebSocket server initialized on path /ws');
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');
    
    ws.on('message', async (data) => {
      try {
        const message: ChatMessage = JSON.parse(data.toString());
        
        if (message.type === 'message' && message.sessionId) {
          // Store user message
          await storage.createMessage({
            sessionId: message.sessionId,
            content: message.content!,
            isUser: true,
          });
          
          // Get chat session and document
          const session = await storage.getChatSession(message.sessionId);
          if (!session) {
            ws.send(JSON.stringify({
              type: 'error',
              content: 'Chat session not found'
            }));
            return;
          }
          
          const document = await storage.getDocument(session.documentId);
          if (!document) {
            ws.send(JSON.stringify({
              type: 'error',
              content: 'Document not found'
            }));
            return;
          }
          
          // Send typing indicator
          ws.send(JSON.stringify({
            type: 'typing',
            timestamp: new Date().toISOString()
          }));
          
          // Get chat history
          const chatHistory = await storage.getMessagesBySession(message.sessionId);
          const history = chatHistory.map(msg => ({
            role: msg.isUser ? 'user' as const : 'assistant' as const,
            content: msg.content
          }));
          
          // Generate AI response
          const aiResponse = await generateChatResponse(
            message.content!,
            document.content,
            history
          );
          
          // Store AI response
          await storage.createMessage({
            sessionId: message.sessionId,
            content: aiResponse.content,
            isUser: false,
          });
          
          // Send AI response
          ws.send(JSON.stringify({
            type: 'message',
            content: aiResponse.content,
            isUser: false,
            timestamp: new Date().toISOString()
          }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          content: 'An error occurred processing your message'
        }));
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
  
  return wss;
}
