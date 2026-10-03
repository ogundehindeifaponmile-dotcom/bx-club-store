export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    if (!url || !token) {
      console.error('Missing KV Environment Variables');
      return res.status(500).json({ error: 'Database config missing' });
    }

    // Vercel automatically provides these headers! Ad-blockers cannot block this.
    const country = req.headers['x-vercel-ip-country'] || req.headers['x-forwarded-country'] || 'Unknown';
    const city = req.headers['x-vercel-ip-city'] || req.headers['x-forwarded-city'] || 'Unknown';
    
    // Server guarantees a valid, unbreakable timestamp
    const timestamp = new Date().toISOString();

    const visitData = {
      page: req.body.page || 'unknown',
      referrer: req.body.referrer || 'direct',
      userAgent: req.body.userAgent || 'unknown',
      timestamp: timestamp, 
      country: country,
      city: city
    };

    await fetch(`${url}/lpush/bx_visits`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([JSON.stringify(visitData)])
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Track Error:', error);
    res.status(500).json({ error: 'Failed to track visit' });
  }
}
