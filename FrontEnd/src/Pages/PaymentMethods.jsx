import DashboardLayout from '../Components/DashboardLayout';

const cards = [
  { name: 'Visa', number: '•••• 4832', expiry: '09/28', accent: 'from-violet-600 to-violet-800' },
  { name: 'Mastercard', number: '•••• 8104', expiry: '11/29', accent: 'from-cyan-600 to-blue-800' },
];

const PaymentMethods = () => (
  <DashboardLayout title="Payment Methods">
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold sm:text-3xl">Payment Methods</h2>
        <p className="mt-1 text-sm text-gray-400">Manage cards and payment preferences.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {cards.map((card) => (
          <div key={card.number} className={`rounded-2xl bg-linear-to-br ${card.accent} p-5 text-white shadow-lg`}>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">{card.name}</span>
              <span className="text-xs uppercase tracking-[0.2em] text-violet-100">Card</span>
            </div>
            <div className="mt-12 text-2xl tracking-[0.28em]">{card.number}</div>
            <div className="mt-6 flex items-center justify-between text-sm text-violet-100">
              <span>Valid thru</span>
              <span>{card.expiry}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#10131d] p-5">
        <h3 className="text-lg font-semibold text-white">Add New Payment Method</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <input placeholder="Cardholder name" className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-violet-500" />
          <input placeholder="Card number" className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-violet-500" />
          <input placeholder="MM/YY" className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-violet-500" />
          <input placeholder="CVV" className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-violet-500" />
        </div>
        <button className="mt-5 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-500">
          Save Card
        </button>
      </div>
    </div>
  </DashboardLayout>
);

export default PaymentMethods;
