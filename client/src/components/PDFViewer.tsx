import { useQuery } from '@tanstack/react-query';
import { Document } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Menu, FileText, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface PDFViewerProps {
  documentId?: string;
  onToggleSidebar: () => void;
}

export function PDFViewer({ documentId, onToggleSidebar }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  const { data: document, isLoading } = useQuery<Document>({
    queryKey: ['/api/documents', documentId],
    enabled: !!documentId,
  });

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handlePageChange = (page: number) => {
    if (document && page >= 1 && page <= document.pageCount) {
      setCurrentPage(page);
    }
  };

  const handleDownload = () => {
    if (document) {
      // In a real implementation, you'd serve the original PDF file
      // For now, we'll just show a toast
      console.log('Download:', document.filename);
    }
  };

  if (!documentId) {
    return (
      <div className="flex-1 flex flex-col bg-muted/30">
        <div className="bg-card border-b border-border p-4 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden mr-3"
            onClick={onToggleSidebar}
            data-testid="button-open-sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <span className="text-muted-foreground">No document selected</span>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="p-8 text-center max-w-md">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Document Selected</h3>
            <p className="text-sm text-muted-foreground">
              Upload a PDF document or select one from the sidebar to start chatting with AI about its content.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col bg-muted/30">
        <div className="bg-card border-b border-border p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={onToggleSidebar}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="h-4 bg-muted rounded w-32 animate-pulse" />
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading document...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex-1 flex flex-col bg-muted/30">
        <div className="bg-card border-b border-border p-4">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onToggleSidebar}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center">
            <p className="text-destructive">Document not found</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-muted/30">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onToggleSidebar}
            data-testid="button-open-sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-destructive" />
            <span className="font-medium text-foreground" data-testid="document-title">
              {document.title}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span data-testid="current-page">Page {currentPage}</span>
            <span>of</span>
            <span data-testid="total-pages">{document.pageCount}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              data-testid="button-zoom-out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-2" data-testid="zoom-level">
              {zoomLevel}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              data-testid="button-zoom-in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            data-testid="button-download"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-auto bg-gradient-to-br from-muted/50 to-accent/50">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg overflow-hidden">
            <div className="p-8 space-y-6" style={{ fontSize: `${zoomLevel}%` }}>
              {/* Document Header */}
              <div className="text-center border-b border-border pb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">{document.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {document.pageCount} pages • {Math.round(document.size / 1024)} KB
                </p>
              </div>
              
              {/* Document Content Preview */}
              <div className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {/* Show first part of the content */}
                    {document.content.substring(0, 2000)}
                    {document.content.length > 2000 && (
                      <>
                        <span className="text-muted-foreground">
                          ... [Content continues for {document.pageCount} pages]
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                {document.content.length > 2000 && (
                  <div className="text-center py-6 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-4">
                      This is a preview of the document content. The full document is available for AI analysis.
                    </p>
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Full PDF
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-card border-t border-border p-4 flex items-center justify-center space-x-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          data-testid="button-previous-page"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={currentPage}
            onChange={(e) => handlePageChange(parseInt(e.target.value))}
            min={1}
            max={document.pageCount}
            className="w-16 px-2 py-1 text-center border border-input rounded bg-background text-foreground text-sm"
            data-testid="page-input"
          />
          <span className="text-muted-foreground text-sm">/ {document.pageCount}</span>
        </div>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= document.pageCount}
          data-testid="button-next-page"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
