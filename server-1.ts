import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { handleGenerateContent } from './api/_lib/generateContent';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY });
});

// AI Content Generation Endpoint (Captions, Video Scripts, Marketing Plans)
app.post('/api/generate-content', async (req, res) => {
  try {
    const output = await handleGenerateContent(req.body);
    res.json(output);
  } catch (error: any) {
    console.error('generate-content handler error:', error);
    res.status(500).json({ error: 'Internal server error', message: error?.message });
  }
});

// Start development or production server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tatna Crocheting Corner server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
