export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    if (!url || !token) {
      console.error('❌ Missing KV Environment Variables');
      return res.status(500).json({ error: 'Database configuration missing', orders: [], visits: [] });
    }

    // 1. Fetch orders
    console.log('📥 Fetching orders from Upstash...');
    const ordersRes = await fetch(`${url}/lrange/bx_orders/0/-1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!ordersRes.ok) {
      throw new Error(`Failed to fetch orders: ${ordersRes.status} ${ordersRes.statusText}`);
    }
    
    const ordersData = await ordersRes.json();
    console.log('📦 Raw orders data received');
    
    const orders = (ordersData.result || []).map(orderStr => {
      try { 
        return JSON.parse(orderStr); 
      } catch (e) { 
        console.error('❌ Failed to parse order string:', orderStr, e);
        return null; 
      }
    }).filter(Boolean); // Removes any null/failed parses

    // 2. Fetch visits
    console.log('📥 Fetching visits from Upstash...');
    const visitsRes = await fetch(`${url}/lrange/bx_visits/0/-1`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!visitsRes.ok) {
      throw new Error(`Failed to fetch visits: ${visitsRes.status} ${visitsRes.statusText}`);
    }

    const visitsData = await visitsRes.json();
    console.log('📦 Raw visits data received');
    
    const visits = (visitsData.result || []).map(visitStr => {
      try { 
        return JSON.parse(visitStr); 
      } catch (e) { 
        console.error('❌ Failed to parse visit string:', visitStr, e);
        return null; 
      }
    }).filter(Boolean);

    console.log(`✅ Successfully fetched ${orders.length} orders and ${visits.length} visits`);
    
    // Return the clean data to the frontend
    res.status(200).json({ orders, visits });
    
  } catch (error) {
    console.error('❌ API Orders Fetch Error:', error);
    // Return 200 with empty arrays so the frontend doesn't crash, but logs the error
    res.status(200).json({ error: error.message, orders: [], visits: [] });
  }
}
