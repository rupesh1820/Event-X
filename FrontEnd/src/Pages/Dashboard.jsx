import { NavLink } from "react-router-dom"
import DashboardLayout from "../Components/DashboardLayout"
import { events } from "../Data/Data"

const Card = ({ children, className = "" }) => <section className={`rounded-xl border border-white/10 bg-[#10131d] p-4 sm:p-5 ${className}`}>{children}</section>

const Dashboard = () => (
  <DashboardLayout title="Dashboard">
    <div className="mx-auto max-w-7xl space-y-5">
      <div><h2 className="text-2xl font-bold sm:text-3xl">Welcome back, Rupesh! <span>👋</span></h2><p className="mt-1 text-sm text-gray-400">Here&apos;s what&apos;s happening with your events.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Tickets", "12", "Total Tickets", "bg-violet-600"], ["Registrations", "8", "Upcoming Events", "bg-pink-600"], ["Completed Events", "15", "Events Attended", "bg-green-600"], ["Wishlist", "6", "Saved Events", "bg-blue-600"]].map(([label, value, sub, color]) => <Card key={label}><div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>◇</div><p className="text-sm text-gray-400">{label}</p><p className="mt-1 text-3xl font-bold">{value}</p><p className="mt-1 text-xs text-gray-500">{sub}</p><NavLink to={label === "Tickets" ? "/tickets" : "/events"} className="mt-4 block text-xs text-violet-400">View all ?</NavLink></Card>)}</div>
      <div className="grid gap-5 xl:grid-cols-[1.4fr_.9fr]">
        <Card><div className="mb-4 flex items-center justify-between"><div><h3 className="font-semibold">Upcoming Events</h3><p className="text-xs text-gray-500">Your next experiences</p></div><NavLink to="/events" className="text-sm text-violet-400">View all ?</NavLink></div><div className="divide-y divide-white/10">{events.slice(0, 4).map((event) => <div key={event.id} className="flex items-center gap-3 py-3"><img src={event.image} alt="" className="h-14 w-20 rounded-lg object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{event.name}</p><p className="mt-1 text-xs text-gray-500">⌖ {event.location}</p><p className="text-xs text-gray-500">◷ {event.day} {event.month} 2026 · {event.time}</p></div><NavLink to="/tickets" className="hidden rounded-lg bg-violet-600/20 px-3 py-2 text-xs text-violet-300 sm:block">View Ticket</NavLink></div>)}</div></Card>
        <Card><div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">Your Tickets</h3><NavLink to="/tickets" className="text-sm text-violet-400">View all ?</NavLink></div><div className="rounded-xl bg-linear-to-br from-violet-700 to-violet-950 p-4"><p className="text-sm font-semibold">Summer Music Festival</p><p className="mt-2 text-xs text-violet-200">Worli Sea Face, Mumbai</p><div className="mt-6 flex items-end justify-between"><div><p className="text-xs text-violet-200">24 MAY 2026</p><p className="mt-2 text-xs">Ticket ID #EVX24M56789</p></div><div className="grid h-20 w-20 place-items-center bg-white text-3xl text-black">▦</div></div></div></Card>
      </div>
      <Card className="bg-linear-to-r from-violet-950 to-[#151024]"><div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"><div><h3 className="text-lg font-semibold">Never Miss an Event!</h3><p className="mt-1 text-sm text-violet-200">Enable notifications and get updates about your favourite events.</p></div><button className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold">Enable Notifications</button></div></Card>
    </div>
  </DashboardLayout>
)

export default Dashboard
