// Simple implementation without external dependencies for now
const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCtmUbIVYWVbdHDF1xh0w5ZtJwIHFo6oT4";

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
    // Use fetch to call Gemini API directly
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCtmUbIVYWVbdHDF1xh0w5ZtJwIHFo6oT4`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an AI assistant that helps users understand and analyze PDF documents. 
            
Document content:
${documentContent.substring(0, 8000)}

Previous conversation:
${chatHistory.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

User question: ${userMessage}

Please provide a helpful answer based on the document content.`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";

    return {
      content: text,
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(`Failed to generate AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function summarizeDocument(documentContent: string): Promise<string> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Please provide a concise but comprehensive summary of this document:

${documentContent.substring(0, 8000)}`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate summary.";
  } catch (error) {
    console.error('Gemini summarization error:', error);
    throw new Error(`Failed to summarize document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
