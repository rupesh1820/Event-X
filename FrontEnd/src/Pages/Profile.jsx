import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("eventxUser");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080812] text-white">
        Loading profile...
      </div>
    );
  }

  const isAdmin = user.role === "admin";
  const isCreator = user.role === "creator";

  const logout = () => {
    localStorage.removeItem("eventxUser");
    localStorage.removeItem("eventxToken");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#080812] px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Profile Header */}
        <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
          <div className="h-40 bg-gradient-to-r from-violet-700 via-fuchsia-600 to-indigo-700" />

          <div className="relative px-6 pb-6">
            <div className="-mt-14 mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-28 w-28 items-center justify-center rounded-3xl border-4 border-[#080812] bg-violet-600 text-4xl font-bold">
                  {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div>
                  <h1 className="text-2xl font-bold">
                    {user.fullName}
                  </h1>

                  <p className="text-sm text-gray-400">
                    {user.emailAddress}
                  </p>

                  <span className="mt-2 inline-block rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold capitalize text-violet-300">
                    {user.role || "user"} account
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  to="/profile/edit"
                  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
                >
                  Edit Profile
                </Link>

                <button
                  onClick={logout}
                  className="rounded-xl border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Role Based Heading */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            {isAdmin
              ? "Admin Dashboard"
              : isCreator
                ? "Creator Workspace"
                : "Your EventX Profile"}
          </h2>

          <p className="mt-1 text-gray-400">
            {isAdmin
              ? "Manage users, events and bookings."
              : isCreator
                ? "Create and manage your own events."
                : "Explore events and manage your bookings."}
          </p>
        </div>

        {/* Role Based Cards */}
        {/* Role Based Cards */}
{isAdmin ? (
  <div className="grid gap-5 md:grid-cols-3">
    {/* Audience Options */}
    <ProfileCard
      title="Explore Events"
      description="Find upcoming events near you."
      link='/events'
      icon="🔎"
    />

    <ProfileCard
      title="My Tickets"
      description="View your purchased tickets."
      link="/profile/my-tickets"
      icon="🎟️"
    />

    <ProfileCard
      title="My Bookings"
      description="Manage all your event bookings."
      link="/profile/my-bookings"
      icon="📅"
    />

    {/* Creator Options */}
    <ProfileCard
      title="Create Event"
      description="Create and publish a new event."
      link="/profile/create-event"
      icon="➕"
    />

    <ProfileCard
      title="My Events"
      description="View and manage creator events."
      link="/profile/my-events"
      icon="🎤"
    />

    <ProfileCard
      title="Event Bookings"
      description="Check bookings for your events."
      link="/profile/my-bookings"
      icon="📈"
    />

    {/* Admin Options */}
    <ProfileCard
      title="Manage Users"
      description="View and manage all registered users."
      link="/admin/users"
      icon="👥"
    />

    <ProfileCard
      title="Manage Events"
      description="Approve, edit or remove events."
      link="/admin/events"
      icon="🎫"
    />

    <ProfileCard
      title="Manage Bookings"
      description="Check all ticket bookings."
      link="/profile/admin/bookings"
      icon="📊"
    />
<ProfileCard
  title="Notifications"
  description="View event approval requests and all user inquiries."
  link="/admin/notifications"
  icon="🔔"
/>

    <ProfileCard
      title="Manage Accounts"
      description="View or delete user and creator accounts."
      link="/admin/accounts"
      icon="🛡️"
    />
  </div>
) : isCreator ? (
  <div className="grid gap-5 md:grid-cols-3">
    {/* Creator Options */}
    <ProfileCard
      title="Create Event"
      description="Publish a new event on EventX."
      link="/profile/create-event"
      icon="➕"
    />

    <ProfileCard
      title="My Events"
      description="View and manage your own events."
      link="/profile/my-events"
      icon="🎤"
    />

    <ProfileCard
      title="Event Bookings"
      description="Check bookings for your events."
      link="/profile/event-bookings"
      icon="📈"
    />

    {/* Audience Options */}
    <ProfileCard
      title="Explore Events"
      description="Find and enjoy upcoming events."
      link="/events"
      icon="🔎"
    />

    <ProfileCard
      title="My Tickets"
      description="View your purchased event tickets."
      link="/profile/my-tickets"
      icon="🎟️"
    />

    <ProfileCard
      title="My Bookings"
      description="Manage your audience bookings."
      link="/profile/my-bookings"
      icon="📅"
    />
  </div>
) : (
  <div className="grid gap-5 md:grid-cols-3">
    <ProfileCard
      title="Explore Events"
      description="Find upcoming events near you."
      link="/events"
      icon="🔎"
    />

    <ProfileCard
      title="My Tickets"
      description="View your purchased tickets."
      link="/profile/my-tickets"
      icon="🎟️"
    />

    <ProfileCard
      title="My Bookings"
      description="Manage your event bookings."
      link="/profile/my-bookings"
      icon="📅"
    />
  </div>
)}

        {/* Account Details */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="mb-5 text-xl font-bold">Account Details</h3>

          <div className="grid gap-5 sm:grid-cols-2">
            <Detail label="Full Name" value={user.fullName} />
            <Detail label="Email Address" value={user.emailAddress} />
            <Detail label="Username" value={user.username || "Not added"} />
            <Detail label="Phone Number" value={user.number || "Not added"} />
            <Detail label="Language" value={user.language || "English"} />
            <Detail label="Timezone" value={user.timezone || "Asia/Kolkata"} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileCard = ({ title, description, link, icon }) => {
  return (
    <Link
      to={link}
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-violet-500/50 hover:bg-violet-500/10"
    >
      <div className="mb-5 text-3xl">{icon}</div>

      <h3 className="text-lg font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-gray-400">
        {description}
      </p>

      <div className="mt-5 text-sm font-semibold text-violet-300">
        Open →
      </div>
    </Link>
  );
};

const Detail = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-wider text-gray-500">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-medium text-gray-200">
        {value}
      </p>
    </div>
  );
};

export default Profile;