export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    if (!url || !token) {
      console.error('Missing KV Environment Variables');
      return res.status(500).json({ error: 'Database config missing' });
    }

    // Force a valid timestamp and capture location data
    const visitData = {
      page: req.body.page || 'unknown',
      referrer: req.body.referrer || 'direct',
      userAgent: req.body.userAgent || 'unknown',
      timestamp: req.body.timestamp || new Date().toISOString(), // Ensures valid date
      country: req.body.country || 'Unknown',
      city: req.body.city || 'Unknown',
      ip: req.headers['x-forwarded-for'] || 'unknown'
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
