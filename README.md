# ChatPDFPilot 🚀

**AI-Powered PDF Chat Application**  
*Upload PDFs and have intelligent conversations with your documents*

## ✨ Features

- **📄 PDF Upload & Processing**: Drag & drop PDF documents with instant text extraction
- **🤖 AI-Powered Chat**: Interactive conversations with your PDFs using Google Gemini AI
- **💡 Smart Question Suggestions**: Auto-generated relevant questions based on document content
- **⚡ Real-time Communication**: WebSocket-based instant messaging interface
- **📊 Document Management**: Upload, view, summarize, and delete documents
- **🎨 Modern UI**: Beautiful, responsive design with Tailwind CSS and Radix UI
- **🔒 Type-Safe**: Full TypeScript implementation across the entire stack
- **📦 Monorepo Structure**: Professional workspace organization with apps and packages

## 🛠️ Tech Stack

### Frontend (`apps/web`)
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **TanStack Query** for API state management
- **Wouter** for client-side routing

### Backend (`apps/api`)
- **Node.js** with Express.js
- **TypeScript** for type safety
- **WebSocket** for real-time communication
- **Multer** for file upload handling
- **PDF Processing** for document text extraction
- **Google Gemini AI** for document analysis and question generation
- **Drizzle ORM** for database operations

### Shared (`packages/shared`)
- **Zod** schemas for validation
- **Drizzle** database schemas
- **TypeScript** type definitions

### Database
- **PostgreSQL** with Drizzle ORM
- **Neon Database** for cloud hosting

## 📋 Prerequisites

- Node.js 18 or higher
- npm package manager
- Google Gemini API key 

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/alanjosephmonichan/ChatPDFPilot.git
   cd ChatPDFPilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   PORT=8080
   NODE_ENV=development
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```
   This starts both frontend (port 3000) and backend (port 8080) concurrently.

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📋 Available Scripts

### Development
- `npm run dev` - Start both frontend and backend concurrently
- `npm run dev:web` - Start frontend only (port 3000)
- `npm run dev:api` - Start backend only (port 8080)

### Production
- `npm run build` - Build all workspaces for production
- `npm run build:web` - Build frontend only
- `npm run build:api` - Build backend only
- `npm start` - Start production server
- `npm run start:win` - Start production server (Windows)

### Utilities
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## 🔧 Configuration

### Google Gemini AI Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the API key to your `.env` file as `GEMINI_API_KEY`

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini AI API key | Required |
| `PORT` | Server port | 8080 |
| `NODE_ENV` | Environment mode | development |

## 📁 Project Structure

```
ChatPDFPilot/                    # Monorepo root
├── apps/
│   ├── web/                     # Frontend React application
│   │   ├── src/
│   │   │   ├── components/      # Reusable UI components
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── lib/            # Utility functions
│   │   │   └── pages/          # Page components
│   │   ├── index.html
│   │   ├── package.json        # Web app dependencies
│   │   ├── vite.config.ts      # Vite configuration
│   │   └── tsconfig.json       # TypeScript config
│   └── api/                    # Backend Node.js application
│       ├── src/
│       │   ├── services/       # Business logic services
│       │   │   ├── gemini.ts   # AI integration
│       │   │   ├── pdf.ts      # PDF processing
│       │   │   └── websocket.ts # Real-time communication
│       │   ├── index.ts        # Server entry point
│       │   ├── routes.ts       # API routes
│       │   └── storage.ts      # Data persistence
│       ├── package.json        # API dependencies
│       └── tsconfig.json       # TypeScript config
├── packages/
│   └── shared/                 # Shared TypeScript types & schemas
│       ├── src/
│       │   ├── index.ts        # Main exports
│       │   └── schema.ts       # Database schemas
│       ├── package.json        # Shared package config
│       └── tsconfig.json       # TypeScript config
├── test/                       # Test files and data
├── .env                        # Environment variables
├── .env.example               # Environment template
├── drizzle.config.ts          # Database configuration
└── package.json               # Monorepo root configuration
```

## 🎯 Usage

1. **Upload a PDF** - Click the upload area or drag & drop a PDF file
2. **View Document** - Click on any uploaded document to view it
3. **Start Chatting** - Use the chat panel to ask questions about your document
4. **Get Summaries** - The AI automatically generates document summaries
5. **Manage Documents** - Delete documents you no longer need

## 🔒 Security Features

- Input validation and sanitization
- File type restrictions (PDF only)
- Size limits for uploads
- Error handling and logging
- Secure API key management

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Docker Deployment (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Setup for Production

- Set `NODE_ENV=production`
- Configure proper CORS settings
- Set up SSL/HTTPS
- Configure file upload limits
- Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Alan Joseph Monichan**
- GitHub: [@alanjoseph77](https://github.com/alanjoseph77)
- Project: [ChatPDFPilot](https://github.com/alanjoseph77/ChatPDFPilot)

## 🙏 Acknowledgments

- Google Gemini AI for powerful language processing
- Shadcn/ui for beautiful UI components
- The React and Node.js communities
- All contributors and users



---

**Made with ❤️ by Alan Joseph Monichan**
