import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Bot, User, Send, Zap, ListChecks, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatPanelProps {
  documentId?: string;
}

export function ChatPanel({ documentId }: ChatPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  const suggestions = [
    'Summarize the key findings',
    'What methodology was used?',
    'Compare with other studies',
    'What are the main conclusions?',
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
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
              <h3 className="font-semibold text-foreground">AI Assistant</h3>
              <p className="text-xs text-muted-foreground">Ready to help with your document</p>
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
              {suggestions.slice(0, 2).map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  className="text-xs w-full"
                  onClick={() => handleSuggestionClick(suggestion)}
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
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div className={cn(
                    "rounded-lg p-3 max-w-xs lg:max-w-sm",
                    message.isUser 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-accent text-foreground"
                  )}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={cn(
                      "text-xs mt-2",
                      message.isUser 
                        ? "text-primary-foreground/70" 
                        : "text-muted-foreground"
                    )}>
                      {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  
                  {message.isUser && (
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-accent rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
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
              {suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => handleSuggestionClick(suggestion)}
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
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
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
        <div className="flex flex-wrap gap-2 mt-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleQuickAction('Summarize')}
            disabled={isSummarizing || !isConnected}
            data-testid="button-summarize"
          >
            <Zap className="h-3 w-3 mr-1" />
            {isSummarizing ? 'Summarizing...' : 'Summarize'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleQuickAction('Key Points')}
            disabled={!isConnected}
            data-testid="button-key-points"
          >
            <ListChecks className="h-3 w-3 mr-1" />
            Key Points
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleQuickAction('Ask Question')}
            disabled={!isConnected}
            data-testid="button-ask-question"
          >
            <HelpCircle className="h-3 w-3 mr-1" />
            Ask Question
          </Button>
        </div>
      </div>
    </div>
  );
}
