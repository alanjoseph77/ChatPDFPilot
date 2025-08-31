import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

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

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...chatHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user' as const, content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return {
      content: response.choices[0].message.content || "I'm sorry, I couldn't generate a response.",
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`Failed to generate AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function summarizeDocument(documentContent: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert at summarizing documents. Provide a concise but comprehensive summary that captures the key points, main arguments, and important findings."
        },
        {
          role: "user",
          content: `Please summarize this document:\n\n${documentContent.substring(0, 8000)}`
        }
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    return response.choices[0].message.content || "Unable to generate summary.";
  } catch (error) {
    console.error('OpenAI summarization error:', error);
    throw new Error(`Failed to summarize document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
