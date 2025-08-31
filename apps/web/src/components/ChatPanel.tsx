import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Bot, User, Send, Zap, ListChecks, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

interface ChatPanelProps {
  documentId?: string;
}

export function ChatPanel({ documentId }: ChatPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    isLoading,
    isConnected,
    isTyping,
    sendMessage,
    summarizeDocument,
    isSummarizing,
  } = useChat(documentId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !documentId) return;
    
    sendMessage(inputValue.trim());
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'Summarize':
        summarizeDocument();
        break;
      case 'Key Points':
        setInputValue('What are the key points and main findings from this document?');
        inputRef.current?.focus();
        break;
      case 'Ask Question':
        setInputValue('');
        inputRef.current?.focus();
        setShowSuggestions(true);
        break;
    }
  };

  // Fetch dynamic suggestions based on document content
  const { data: suggestedQuestions } = useQuery({
    queryKey: [`/api/documents/${documentId}/questions`],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/api/documents/${documentId}/questions`);
      if (!response.ok) throw new Error('Failed to fetch questions');
      const data = await response.json();
      return data.questions;
    },
    enabled: !!documentId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const suggestions = suggestedQuestions || [
    'Summarize the key findings',
    'What methodology was used?',
    'Compare with other studies',
    'What are the main conclusions?',
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  if (!documentId) {
    return (
      <div className="w-full lg:w-96 bg-card border-l border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">AI Assistant</h3>
              <p className="text-xs text-muted-foreground">Select a document to start chatting</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Document Selected</h3>
            <p className="text-sm text-muted-foreground">
              Upload or select a PDF document to start an AI-powered conversation about its content.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-96 bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">ChatPDFPilot AI</h3>
              <p className="text-xs text-muted-foreground">Powered by Google Gemini</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isConnected ? "bg-green-500" : "bg-red-500"
            )} />
            <span className="text-xs text-muted-foreground">
              {isConnected ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="chat-messages">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                <div className="flex-1 bg-muted rounded-lg p-3 animate-pulse">
                  <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <Card className="p-6 text-center">
            <Bot className="h-12 w-12 text-primary mx-auto mb-3" />
            <h4 className="font-medium text-foreground mb-2">Start a Conversation</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Ask me anything about your document. I can summarize, explain concepts, or answer specific questions.
            </p>
            <div className="space-y-2">
              {suggestions.slice(0, 2).map((suggestion: string) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  className="text-xs w-full"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSuggestionClick(suggestion);
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </Card>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id} className="space-y-4">
                <div className={cn(
                  "flex items-start space-x-3",
                  message.isUser ? "justify-end" : ""
                )}>
                  {!message.isUser && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  
                  <div className={cn(
                    "rounded-2xl p-4 max-w-xs lg:max-w-sm shadow-md backdrop-blur-sm",
                    message.isUser 
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-blue-200" 
                      : "bg-gradient-to-br from-slate-50 to-white text-slate-800 border border-slate-200 shadow-slate-200"
                  )}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p className={cn(
                      "text-xs mt-2 font-medium",
                      message.isUser 
                        ? "text-blue-100" 
                        : "text-slate-500"
                    )}>
                      {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  
                  {message.isUser && (
                    <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-4 shadow-md">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" />
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="relative">
          {/* Suggestions */}
          {showSuggestions && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-popover border border-border rounded-lg shadow-lg p-2 space-y-1 z-10">
              {suggestions.map((suggestion: string) => (
                <Button
                  key={suggestion}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSuggestionClick(suggestion);
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}
          
          <div className="flex space-x-3">
            <div className="flex-1">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Ask anything about your document..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => !inputValue && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
                disabled={!isConnected}
                data-testid="chat-input"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || !isConnected}
              data-testid="button-send-message"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Send</span>
            </Button>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mt-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleQuickAction('Summarize')}
            disabled={isSummarizing || !isConnected}
            data-testid="button-summarize"
            className="flex-1 min-w-0 bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 border-emerald-200 shadow-sm"
          >
            <Zap className="h-3 w-3 mr-1.5" />
            {isSummarizing ? 'Summarizing...' : 'Summarize'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleQuickAction('Key Points')}
            disabled={!isConnected}
            data-testid="button-key-points"
            className="flex-1 min-w-0 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border-blue-200 shadow-sm"
          >
            <ListChecks className="h-3 w-3 mr-1.5" />
            Key Points
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleQuickAction('Ask Question')}
            disabled={!isConnected}
            data-testid="button-ask-question"
            className="flex-1 min-w-0 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border-purple-200 shadow-sm"
          >
            <HelpCircle className="h-3 w-3 mr-1.5" />
            Ask Question
          </Button>
        </div>
      </div>
    </div>
  );
}
