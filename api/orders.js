export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Fetch all orders from Upstash using the new Vercel variable names
    const response = await fetch(`${process.env.STORAGE_URL}/lrange/bx_orders/0/-1`, {
      headers: { Authorization: `Bearer ${process.env.STORAGE_TOKEN}` }
    });
    const data = await response.json();
    
    const orders = (data.result || []).map(order => JSON.parse(order));
    
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch orders', orders: [] });
  }
}
