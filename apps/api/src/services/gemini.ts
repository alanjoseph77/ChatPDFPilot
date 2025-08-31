// Simple implementation without external dependencies for now
function getApiKey(): string {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  return API_KEY;
}

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
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${getApiKey()}`, {
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
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${getApiKey()}`, {
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

export async function generateSuggestedQuestions(documentContent: string): Promise<string[]> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${getApiKey()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Based on this document content, generate 4-5 relevant questions that users might want to ask. Return only the questions, one per line, without numbering or bullet points:

${documentContent.substring(0, 6000)}`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Parse questions from response
    const questions = text
      .split('\n')
      .map((q: string) => q.trim())
      .filter((q: string) => q.length > 10 && q.endsWith('?'))
      .slice(0, 5);

    return questions.length > 0 ? questions : [
      "What is the main topic of this document?",
      "Can you summarize the key points?",
      "What are the most important details?",
      "Are there any specific recommendations or conclusions?"
    ];
  } catch (error) {
    console.error('Question generation error:', error);
    return [
      "What is this document about?",
      "Can you explain the main concepts?",
      "What are the key takeaways?",
      "Are there any important details I should know?"
    ];
  }
}
