export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Fetch orders
    const ordersRes = await fetch(`${process.env.STORAGE_URL}/lrange/bx_orders/0/-1`, {
      headers: { Authorization: `Bearer ${process.env.STORAGE_TOKEN}` }
    });
    const ordersData = await ordersRes.json();
    const orders = (ordersData.result || []).map(order => JSON.parse(order));

    // Fetch visits
    const visitsRes = await fetch(`${process.env.STORAGE_URL}/lrange/bx_visits/0/-1`, {
      headers: { Authorization: `Bearer ${process.env.STORAGE_TOKEN}` }
    });
    const visitsData = await visitsRes.json();
    const visits = (visitsData.result || []).map(visit => JSON.parse(visit));

    res.status(200).json({ orders, visits });
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch data', orders: [], visits: [] });
  }
}
