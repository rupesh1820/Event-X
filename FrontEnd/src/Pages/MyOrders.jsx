import DashboardLayout from '../Components/DashboardLayout';

const orders = [
  { id: '#EVX1024', item: 'Summer Music Festival', amount: '₹499', status: 'Paid', date: '24 May 2026' },
  { id: '#EVX1025', item: 'Startup Growth Summit', amount: '₹799', status: 'Processing', date: '18 Jun 2026' },
  { id: '#EVX1026', item: 'Gala Night', amount: '₹1,299', status: 'Paid', date: '09 Jul 2026' },
];

const MyOrders = () => (
  <DashboardLayout title="My Orders">
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold sm:text-3xl">My Orders</h2>
        <p className="mt-1 text-sm text-gray-400">Track your purchases and payments.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#10131d] overflow-hidden">
        <div className="grid grid-cols-[1.3fr_1fr_1fr_0.8fr] gap-3 border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-gray-500">
          <span>Order</span>
          <span>Item</span>
          <span>Date</span>
          <span>Status</span>
        </div>

        {orders.map((order) => (
          <div key={order.id} className="grid grid-cols-[1.3fr_1fr_1fr_0.8fr] gap-3 border-b border-white/10 px-4 py-4 text-sm text-gray-300 last:border-0">
            <span className="font-semibold text-white">{order.id}</span>
            <span>{order.item}</span>
            <span>{order.date}</span>
            <span>
              <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${order.status === 'Paid' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
                {order.status}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default MyOrders;
