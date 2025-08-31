import { useEffect, useRef, useState } from "react";

interface WebSocketMessage {
  type: 'message' | 'typing' | 'error';
  content?: string;
  isUser?: boolean;
  timestamp?: string;
}

interface UseWebSocketProps {
  sessionId?: string;
  onMessage?: (message: WebSocketMessage) => void;
}

export function useWebSocket({ sessionId, onMessage }: UseWebSocketProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        if (message.type === 'typing') {
          setIsTyping(true);
          // Hide typing indicator after 3 seconds if no message comes
          setTimeout(() => setIsTyping(false), 3000);
        } else {
          setIsTyping(false);
          onMessage?.(message);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      ws.current?.close();
    };
  }, [onMessage]);

  const sendMessage = (content: string) => {
    if (ws.current?.readyState === WebSocket.OPEN && sessionId) {
      ws.current.send(JSON.stringify({
        type: 'message',
        content,
        sessionId,
        isUser: true,
        timestamp: new Date().toISOString(),
      }));
    }
  };

  return {
    isConnected,
    isTyping,
    sendMessage,
  };
}
