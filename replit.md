# Overview

This is a PDF Chat Application that allows users to upload PDF documents and have AI-powered conversations about their content. Users can upload PDFs, which are processed to extract text content, and then engage in real-time chat conversations where an AI assistant answers questions based on the document's content. The application features a three-panel interface with document management, PDF viewing, and chat functionality.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript, built using Vite for fast development and optimized builds
- **UI Components**: shadcn/ui component library with Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: TanStack Query for server state management and caching, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Communication**: WebSocket connection for live chat messaging with typing indicators

## Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful endpoints for document management with WebSocket for real-time chat
- **File Processing**: Multer for multipart form handling, pdf-parse for PDF text extraction
- **Development**: Vite middleware integration for hot module replacement in development

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Connection**: Neon Database serverless PostgreSQL for cloud-hosted database
- **Schema**: Three main entities - documents (PDF metadata and content), chat sessions (conversation contexts), and messages (individual chat exchanges)
- **Fallback**: In-memory storage implementation for development/testing scenarios
- **Session Management**: PostgreSQL session store with connect-pg-simple for persistent user sessions

## Authentication and Authorization
- **Session-based**: Express sessions with PostgreSQL session storage
- **File Validation**: PDF type checking and file size limits (10MB maximum)
- **CORS**: Configured for cross-origin requests with credentials support

# External Dependencies

## AI and Language Processing
- **OpenAI API**: GPT-5 model for document analysis and conversational AI responses
- **PDF Processing**: pdf-parse library for extracting text content from uploaded PDF files

## Database and Storage
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe database toolkit with schema validation using Zod

## UI and Styling
- **shadcn/ui**: Complete component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for consistent iconography
- **date-fns**: Date manipulation and formatting utilities

## Development and Build Tools
- **Vite**: Fast build tool with HMR for development
- **TypeScript**: Static type checking across frontend and backend
- **Replit Integration**: Development environment plugins for cartographer and error handling