import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all orders from Vercel KV
    const orders = await kv.lrange('bx_orders', 0, -1) || [];
    
    // Parse each order (they're stored as JSON strings)
    const parsedOrders = orders.map(order => {
      try {
        return typeof order === 'string' ? JSON.parse(order) : order;
      } catch (e) {
        return null;
      }
    }).filter(Boolean);

    res.status(200).json({ orders: parsedOrders });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', orders: [] });
  }
}
