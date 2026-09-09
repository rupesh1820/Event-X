import DashboardLayout from '../Components/DashboardLayout';

const notifications = [
  { title: 'Your ticket is confirmed', text: 'Summer Music Festival ticket has been confirmed and is ready to download.', time: '2 hours ago', accent: 'bg-violet-600' },
  { title: 'New event match for you', text: 'A Startup Growth Summit matched your saved interests.', time: '1 day ago', accent: 'bg-emerald-600' },
  { title: 'Payment reminder', text: 'Your registration for Dance Showcase is due tomorrow.', time: '3 days ago', accent: 'bg-amber-600' },
];

const Notifications = () => (
  <DashboardLayout title="Notifications">
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold sm:text-3xl">Notifications</h2>
        <p className="mt-1 text-sm text-gray-400">Stay informed about tickets, updates, and reminders.</p>
      </div>

      <div className="space-y-4">
        {notifications.map((item) => (
          <div key={item.title} className="flex gap-4 rounded-2xl border border-white/10 bg-[#10131d] p-4">
            <div className={`mt-1 h-3 w-3 rounded-full ${item.accent}`} />
            <div className="flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-semibold text-white">{item.title}</h3>
                <span className="text-xs text-gray-500">{item.time}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-300">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default Notifications;
