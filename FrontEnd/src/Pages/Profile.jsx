import { NavLink } from "react-router-dom";
import DashboardLayout from "../Components/DashboardLayout";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("eventxUser") || "null");

  return (
    <DashboardLayout title="Profile & Settings">
      <div className="mx-auto max-w-7xl space-y-5">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Profile & Settings</h2>
          <p className="mt-1 text-sm text-gray-400">
            Manage your profile and account settings.
          </p>
        </div>
        <div className="flex gap-6 border-b border-white/10 text-sm">
          <button className="border-b-2 border-violet-500 px-2 py-3 text-violet-400">
            Profile
          </button>
          <button className="px-2 py-3 text-gray-500">Account</button>
          <button className="px-2 py-3 text-gray-500">Preferences</button>
        </div>
        <div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
          <section className="rounded-xl border border-white/10 bg-[#10131d] p-5">
            <h3 className="font-semibold">Profile Information</h3>
            <div className="mt-6 flex flex-col gap-6 md:flex-row">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-violet-500 bg-violet-600/20 text-2xl font-bold text-violet-300">
                {(user?.fullName || "EU").slice(0, 2).toUpperCase()}
              </div>
              <div className="grid flex-1 gap-4 sm:grid-cols-2">
                <label className="text-xs text-gray-400">
                  Full Name
                  <input
                    defaultValue={user?.fullName || "EventX Member"}
                    className="mt-2 w-full rounded-lg border border-white/10 bg-white/[.03] px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
                  />
                </label>
                <label className="text-xs text-gray-400">
                  Email Address
                  <input
                    defaultValue={user?.emailAddress || "member@example.com"}
                    className="mt-2 w-full rounded-lg border border-white/10 bg-white/[.03] px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
                  />
                </label>
                <label className="text-xs text-gray-400 sm:col-span-2">
                  Bio
                  <textarea
                    defaultValue="Discover experiences and make memorable moments with EventX."
                    rows="4"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-white/[.03] px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
                  />
                </label>
              </div>
            </div>
            <button className="mt-6 rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold">
              Save Changes
            </button>
          </section>
          <div className="space-y-5">
            <section className="rounded-xl border border-white/10 bg-[#10131d] p-5">
              <h3 className="font-semibold">Notification Preferences</h3>
              {[
                "New Ticket Bookings",
                "Event Reminders",
                "Order Updates",
                "Marketing & Offers",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center justify-between border-b border-white/10 py-3 text-sm last:border-0"
                >
                  <span>
                    {item}
                    <small className="block text-xs text-gray-500">
                      Keep me updated about EventX
                    </small>
                  </span>
                  <span
                    className={`h-5 w-9 rounded-full p-1 ${index === 3 ? "bg-gray-700" : "bg-violet-600"}`}
                  >
                    <span className="block h-3 w-3 rounded-full bg-white" />
                  </span>
                </div>
              ))}
            </section>
            <section className="rounded-xl border border-red-500/30 bg-red-950/10 p-5">
              <h3 className="font-semibold text-red-400">Danger Zone</h3>
              <p className="mt-2 text-xs text-gray-500">
                Delete your account and all associated data.
              </p>
              <button className="mt-4 rounded-lg border border-red-500/50 px-4 py-2 text-sm text-red-300">
                Delete Account
              </button>
            </section>
          </div>
        </div>
        <NavLink to="/home" className="inline-block text-sm text-violet-400">
          Back to home ?
        </NavLink>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
