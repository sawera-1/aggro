import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

const PORT = process.env.PORT || 5050;
const KINDWISE_API_KEY = process.env.KINDWISE_API_KEY;
const KINDWISE_BASE_URL = process.env.KINDWISE_BASE_URL || 'https://crop.kindwise.com/api/v1';

if (!KINDWISE_API_KEY) {
  console.warn('WARNING: KINDWISE_API_KEY is not set. Set it in .env');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Proxy endpoint for disease / pest / crop health identification
app.post('/api/health-assess', async (req, res) => {
  try {
    const { images } = req.body || {};

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'images array is required' });
    }

    const url = `${KINDWISE_BASE_URL}/identification`; 
    console.log('Calling Kindwise API:', url);

    const r = await axios.post(url, { images }, {
      headers: {
        'Api-Key': KINDWISE_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000,
    });

    console.log('Kindwise response:', r.data);
    res.json(r.data);

  } catch (error) {
    const details = error.response
      ? { status: error.response.status, data: error.response.data }
      : { message: error.message };
    res.status(500).json({ error: 'Proxy error', details });
  }
});


   

app.listen(PORT, () => {
  console.log(`Proxy listening on http://localhost:${PORT}`);
});
