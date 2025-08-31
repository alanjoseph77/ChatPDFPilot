# ChatPDFPilot 🚀

**AI-Powered PDF Chat Application**  
*Created by Alan Joseph Monichan*

ChatPDFPilot is a modern web application that allows users to upload PDF documents and have intelligent conversations about their content using Google's Gemini AI. Built with React, TypeScript, and Node.js.

## ✨ Features

- **📄 PDF Upload & Management** - Upload, view, and manage multiple PDF documents
- **🤖 AI-Powered Chat** - Ask questions about your documents and get intelligent responses
- **⚡ Real-time Communication** - WebSocket-based chat for instant responses
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices
- **🎨 Modern UI** - Clean, professional interface built with Tailwind CSS
- **🔍 Document Summarization** - Get AI-generated summaries of your PDFs
- **💾 Persistent Storage** - Documents and chat history are saved locally

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** components
- **React Query** for state management
- **Wouter** for routing

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **WebSocket** for real-time communication
- **Multer** for file uploads
- **PDF-Parse** for PDF text extraction
- **Google Gemini AI** for intelligent responses

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ChatPDFPilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   PORT=5000
   NODE_ENV=development
   ```

4. **Build the application**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

## 📋 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code quality
- `npm run type-check` - Run TypeScript type checking

## 🔧 Configuration

### Google Gemini AI Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the API key to your `.env` file as `GEMINI_API_KEY`

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini AI API key | Required |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |

## 📁 Project Structure

```
ChatPDFPilot/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── pages/         # Page components
│   └── index.html
├── server/                # Backend Node.js application
│   ├── services/          # Business logic services
│   │   ├── gemini.ts      # AI integration
│   │   ├── pdf.ts         # PDF processing
│   │   └── websocket.ts   # Real-time communication
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data persistence
├── shared/                # Shared TypeScript types
└── test/                  # Test files and data
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
- GitHub: [@alanjosephmonichan](https://github.com/alanjosephmonichan)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Google Gemini AI for powerful language processing
- Shadcn/ui for beautiful UI components
- The React and Node.js communities
- All contributors and users

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/ChatPDFPilot/issues) page
2. Create a new issue with detailed information
3. Contact the author directly

---

**Made with ❤️ by Alan Joseph Monichan**