import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Message } from '@shared/schema';
import { useWebSocket } from './useWebSocket';

interface ChatSession {
  id: string;
  documentId: string;
  createdAt: string;
}

interface ChatData {
  session: ChatSession;
  messages: Message[];
}

export function useChat(documentId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const queryClient = useQueryClient();

  // Fetch chat session and messages
  const { data: chatData, isLoading } = useQuery<ChatData>({
    queryKey: ['/api/documents', documentId, 'chat'],
    enabled: !!documentId,
  });

  // WebSocket for real-time messaging
  const { isConnected, isTyping, sendMessage } = useWebSocket({
    sessionId: chatData?.session.id,
    onMessage: (wsMessage) => {
      if (wsMessage.type === 'message' && wsMessage.content) {
        const newMessage: Message = {
          id: Date.now().toString(), // Temporary ID
          sessionId: chatData?.session.id || '',
          content: wsMessage.content,
          isUser: wsMessage.isUser || false,
          timestamp: new Date(wsMessage.timestamp || Date.now()),
        };
        
        setMessages(prev => [...prev, newMessage]);
      }
    },
  });

  // Update messages when chat data is loaded
  useEffect(() => {
    if (chatData?.messages) {
      setMessages(chatData.messages);
    }
  }, [chatData]);

  const sendChatMessage = (content: string) => {
    if (!chatData?.session.id) return;

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      sessionId: chatData.session.id,
      content,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Send via WebSocket
    sendMessage(content);
  };

  const summarizeDocument = useMutation({
    mutationFn: async () => {
      if (!documentId) throw new Error('No document ID');
      const response = await apiRequest('POST', `/api/documents/${documentId}/summarize`);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.summary && chatData?.session.id) {
        const summaryMessage: Message = {
          id: Date.now().toString(),
          sessionId: chatData.session.id,
          content: `Here's a summary of the document:\n\n${data.summary}`,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, summaryMessage]);
      }
    },
  });

  return {
    messages,
    isLoading,
    isConnected,
    isTyping,
    sendMessage: sendChatMessage,
    summarizeDocument: summarizeDocument.mutate,
    isSummarizing: summarizeDocument.isPending,
  };
}
