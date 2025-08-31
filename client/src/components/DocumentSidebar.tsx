import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Document } from '@shared/schema';
import { FileUpload } from './FileUpload';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Eye, Trash2, X, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentSidebarProps {
  selectedDocumentId?: string;
  onDocumentSelect: (documentId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function DocumentSidebar({ 
  selectedDocumentId, 
  onDocumentSelect, 
  isOpen, 
  onToggle 
}: DocumentSidebarProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      await apiRequest('DELETE', `/api/documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      toast({
        title: "Document Deleted",
        description: "Document has been successfully removed.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: "Failed to delete the document. Please try again.",
      });
    },
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}
      
      <div className={cn(
        "fixed md:relative z-50 w-80 h-full bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">ChatPDF</h1>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={onToggle}
              data-testid="button-close-sidebar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">AI-powered document assistant</p>
        </div>

        {/* Upload Section */}
        <FileUpload onDocumentUploaded={onDocumentSelect} />

        {/* Document List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Recent Documents</h3>
            
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-muted rounded-lg animate-pulse">
                    <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : documents.length === 0 ? (
              <Card className="p-6 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
                <p className="text-xs text-muted-foreground mt-1">Upload a PDF to get started</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <Card
                    key={doc.id}
                    className={cn(
                      "p-4 cursor-pointer transition-colors hover:bg-accent",
                      selectedDocumentId === doc.id && "bg-accent border-primary"
                    )}
                    onClick={() => onDocumentSelect(doc.id)}
                    data-testid={`document-card-${doc.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate" title={doc.title}>
                          {doc.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Uploaded {formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true })}
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {doc.pageCount} pages
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(doc.size)}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDocumentSelect(doc.id);
                          }}
                          data-testid={`button-view-${doc.id}`}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMutation.mutate(doc.id);
                          }}
                          data-testid={`button-delete-${doc.id}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span data-testid="document-count">{documents.length} documents</span>
            <span data-testid="storage-used">{formatFileSize(totalSize)} used</span>
          </div>
        </div>
      </div>
    </>
  );
}
