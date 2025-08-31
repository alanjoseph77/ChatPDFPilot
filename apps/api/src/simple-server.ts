import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../../.env' });

const app = express();
const port = parseInt(process.env.PORT || '5000', 10);

app.use(express.json());

// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API server is working!',
    env: process.env.NODE_ENV,
    geminiKey: process.env.GEMINI_API_KEY ? 'Present' : 'Missing'
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ API server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Loaded' : 'Missing'}`);
});
