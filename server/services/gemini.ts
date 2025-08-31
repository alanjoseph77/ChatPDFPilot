import { GoogleGenAI } from "@google/genai";

// Use Gemini API for document analysis and chat
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ChatResponse {
  content: string;
  context?: string;
}

export async function generateChatResponse(
  userMessage: string,
  documentContent: string,
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<ChatResponse> {
  try {
    const systemPrompt = `You are an AI assistant that helps users understand and analyze PDF documents. 
    You have access to the full content of a document and can answer questions about it.
    
    Document content:
    ${documentContent.substring(0, 8000)} // Truncate to fit context window
    
    Please provide helpful, accurate answers based on the document content. If a question cannot be answered 
    from the document, clearly state that the information is not available in the provided document.`;

    // Convert chat history to Gemini format
    const conversationHistory = chatHistory.slice(-10).map(msg => 
      `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`
    ).join('\n');

    const fullPrompt = `${systemPrompt}\n\nConversation history:\n${conversationHistory}\n\nHuman: ${userMessage}\n\nAssistant:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    return {
      content: response.text || "I'm sorry, I couldn't generate a response.",
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(`Failed to generate AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function summarizeDocument(documentContent: string): Promise<string> {
  try {
    const prompt = `You are an expert at summarizing documents. Provide a concise but comprehensive summary that captures the key points, main arguments, and important findings.

Please summarize this document:

${documentContent.substring(0, 8000)}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Unable to generate summary.";
  } catch (error) {
    console.error('Gemini summarization error:', error);
    throw new Error(`Failed to summarize document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
