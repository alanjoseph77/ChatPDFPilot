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
    if (!sessionId) return;

    // Determine WebSocket URL based on environment
    let wsUrl: string;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      // Development: connect directly to server
      wsUrl = `ws://localhost:8080/ws`;
    } else {
      // Production: use same host as current page
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      wsUrl = `${protocol}//${window.location.host}/ws`;
    }
    
    console.log('Connecting to WebSocket:', wsUrl);
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connected successfully');
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

    ws.current.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      setIsConnected(false);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      if (ws.current && ws.current.readyState !== WebSocket.CLOSED) {
        console.log('Cleaning up WebSocket connection');
        ws.current.close();
      }
    };
  }, [sessionId]);

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
