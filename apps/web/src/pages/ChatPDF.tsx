import { useState } from 'react';
import { DocumentSidebar } from '@/components/DocumentSidebar';
import { PDFViewer } from '@/components/PDFViewer';
import { ChatPanel } from '@/components/ChatPanel';

export default function ChatPDF() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <DocumentSidebar
        selectedDocumentId={selectedDocumentId}
        onDocumentSelect={handleDocumentSelect}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
      
      <div className="flex-1 flex flex-col lg:flex-row">
        <PDFViewer
          documentId={selectedDocumentId}
          onToggleSidebar={toggleSidebar}
        />
        
        <ChatPanel documentId={selectedDocumentId} />
      </div>
    </div>
  );
}
