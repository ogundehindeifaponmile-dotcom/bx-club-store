export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    if (!url || !token) {
      console.error('❌ Missing KV Environment Variables');
      return res.status(500).json({ error: 'Database config missing' });
    }

    // 1. Safely extract request body
    const body = req.body || {};
    
    // 2. Extract location data from Vercel headers (fallback to 'Unknown' if not present)
    // Note: Vercel headers are always lowercase in Next.js API routes
    const country = req.headers['x-vercel-ip-country'] || req.headers['x-forwarded-country'] || 'Unknown';
    const city = req.headers['x-vercel-ip-city'] || req.headers['x-forwarded-city'] || 'Unknown';
    
    // 3. Generate a guaranteed valid timestamp
    const timestamp = new Date().toISOString();

    // 4. Construct the visit data object
    const visitData = {
      page: body.page || 'unknown',
      referrer: body.referrer || 'direct',
      userAgent: body.userAgent || 'unknown',
      timestamp: timestamp, 
      country: country,
      city: city
    };

    console.log('💾 Attempting to save visit to Upstash:', visitData);

    // 5. Save to Upstash KV (LPUSH expects an array of stringified elements)
    const saveRes = await fetch(`${url}/lpush/bx_visits`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify([JSON.stringify(visitData)])
    });
    
    if (!saveRes.ok) {
      throw new Error(`Upstash returned ${saveRes.status}: ${saveRes.statusText}`);
    }
    
    const saveData = await saveRes.json();
    console.log('✅ Upstash Response:', saveData);

    // 6. Return success to the frontend
    res.status(200).json({ 
      success: true, 
      message: 'Visit tracked successfully',
      whatWeSaved: visitData 
    });
    
  } catch (error) {
    console.error('❌ Track Error:', error);
    // Return 200 anyway so it doesn't break the user's browsing experience, 
    // but log the error for you to see in Vercel.
    res.status(200).json({ success: false, error: 'Failed to track visit silently' });
  }
}
