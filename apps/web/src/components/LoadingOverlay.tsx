import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  isVisible: boolean;
  title?: string;
  description?: string;
  progress?: number;
}

export function LoadingOverlay({ 
  isVisible, 
  title = "Processing Document", 
  description = "Extracting text and preparing for AI analysis...",
  progress = 65 
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-8 shadow-xl max-w-sm w-full mx-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">This may take a few moments</p>
        </div>
      </div>
    </div>
  );
}
