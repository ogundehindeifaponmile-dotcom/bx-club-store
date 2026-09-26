export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { page, referrer, userAgent, timestamp } = req.body;
    
    const visitData = {
      page: page || 'unknown',
      referrer: referrer || 'direct',
      userAgent: userAgent || 'unknown',
      timestamp: timestamp || new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    };

    // Save visit to Upstash
    await fetch(`${process.env.STORAGE_URL}/lpush/bx_visits`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.STORAGE_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([JSON.stringify(visitData)])
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Track Error:', error);
    res.status(500).json({ error: 'Failed to track visit' });
  }
}
