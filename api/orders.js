export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    if (!url || !token) {
      console.error('Missing KV Environment Variables');
      return res.status(500).json({ error: 'Database configuration missing', orders: [], visits: [] });
    }

    // Fetch orders
    const ordersRes = await fetch(`${url}/lrange/bx_orders/0/-1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const ordersData = await ordersRes.json();
    const orders = (ordersData.result || []).map(order => {
      try { return JSON.parse(order); } catch (e) { return null; }
    }).filter(Boolean);

    // Fetch visits
    const visitsRes = await fetch(`${url}/lrange/bx_visits/0/-1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const visitsData = await visitsRes.json();
    const visits = (visitsData.result || []).map(visit => {
      try { return JSON.parse(visit); } catch (e) { return null; }
    }).filter(Boolean);

    res.status(200).json({ orders, visits });
  } catch (error) {
    console.error('API Orders Fetch Error:', error);
    res.status(500).json({ error: error.message, orders: [], visits: [] });
  }
}
