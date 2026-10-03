export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    if (!url || !token) {
      console.error('❌ Missing KV Environment Variables');
      return res.status(500).json({ error: 'Database config missing' });
    }

    const country = req.headers['x-vercel-ip-country'] || req.headers['x-forwarded-country'] || 'Unknown';
    const city = req.headers['x-vercel-ip-city'] || req.headers['x-forwarded-city'] || 'Unknown';
    const timestamp = new Date().toISOString();

    const visitData = {
      page: req.body.page || 'unknown',
      referrer: req.body.referrer || 'direct',
      userAgent: req.body.userAgent || 'unknown',
      timestamp: timestamp, 
      country: country,
      city: city
    };

    console.log('💾 Attempting to save to Upstash:', visitData);

    const saveRes = await fetch(`${url}/lpush/bx_visits`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([JSON.stringify(visitData)])
    });
    
    const saveData = await saveRes.json();
    console.log('✅ Upstash Response:', saveData);

    // THIS IS THE MAGIC LINE: It sends the data back to your console!
    res.status(200).json({ success: true, whatWeSaved: visitData });
    
  } catch (error) {
    console.error('❌ Track Error:', error);
    res.status(500).json({ error: 'Failed to track visit' });
  }
}
