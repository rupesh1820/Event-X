import { NavLink } from 'react-router-dom';
import DashboardLayout from '../Components/DashboardLayout';

const AdminDashboard = () => {
  const stats = [
    ['Total Users', '24.8K', '+12.5%', 'bg-violet-600'],
    ['Active Creators', '1,284', '+8.4%', 'bg-cyan-600'],
    ['Events Live', '342', '+19.1%', 'bg-emerald-600'],
    ['Revenue', '₹8.9L', '+23.7%', 'bg-pink-600'],
  ];

  const creators = [
    ['Ritika Sharma', 'Music Events', 'Approved'],
    ['Aman Verma', 'Tech Meetups', 'Pending'],
    ['Neha Singh', 'Workshops', 'Approved'],
  ];

  const users = [
    ['Neha', 'Premium User', 'Active'],
    ['Rohit', 'Frequent Bookings', 'Active'],
    ['Ishita', 'New User', 'Pending'],
  ];

  return (
    <DashboardLayout admin title="Admin Panel">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Admin Control Center</h2>
            <p className="mt-1 text-sm text-gray-400">Full control over users, creators, events, and platform growth.</p>
          </div>
          <button className="rounded-lg border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300">
            Export Report
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(([label, value, growth, color]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-[#10131d] p-4">
              <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>◇</div>
              <p className="text-sm text-gray-400">{label}</p>
              <p className="mt-1 text-3xl font-bold text-white">{value}</p>
              <p className="mt-1 text-xs text-emerald-400">{growth} this month</p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-2xl border border-white/10 bg-[#10131d] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Creator Applications</h3>
              <NavLink to="/creator" className="text-sm text-violet-400">Open creator panel</NavLink>
            </div>

            <div className="space-y-3">
              {creators.map(([name, field, status]) => (
                <div key={name} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/2 p-3">
                  <div>
                    <p className="font-medium text-white">{name}</p>
                    <p className="text-sm text-gray-400">{field}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${status === 'Approved' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#10131d] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">User Activity</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>

            <div className="space-y-3">
              {users.map(([name, role, status]) => (
                <div key={name} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/2 p-3">
                  <div>
                    <p className="font-medium text-white">{name}</p>
                    <p className="text-sm text-gray-400">{role}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${status === 'Active' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-violet-500/30 bg-linear-to-r from-violet-950 to-[#141022] p-5">
          <h3 className="text-lg font-semibold text-white">Platform Health</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-white/3 p-4">
              <p className="text-sm text-gray-400">Conversion</p>
              <p className="mt-2 text-3xl font-bold text-white">7.8%</p>
            </div>
            <div className="rounded-xl bg-white/3 p-4">
              <p className="text-sm text-gray-400">Retention</p>
              <p className="mt-2 text-3xl font-bold text-white">61%</p>
            </div>
            <div className="rounded-xl bg-white/3 p-4">
              <p className="text-sm text-gray-400">Refund Rate</p>
              <p className="mt-2 text-3xl font-bold text-white">1.4%</p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
