import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleGenerateContent } from './_lib/generateContent';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const output = await handleGenerateContent(body || {});
    return res.status(200).json(output);
  } catch (error: any) {
    console.error('generate-content handler error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error?.message });
  }
}
