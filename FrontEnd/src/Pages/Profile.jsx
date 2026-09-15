import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import DashboardLayout from "../Components/DashboardLayout";

// const API_URL = import.meta.env.VITE_SERVER || "http://localhost:5001";
  const API_URL = import.meta.env.VITE_SERVER || "https://event-x-backend.onrender.com";
const Profile = () => {
  const user = JSON.parse(localStorage.getItem("eventxUser") || "null");
  const savedPreferences = JSON.parse(
    localStorage.getItem("eventxPreferences") || "null"
  );

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [profile, setProfile] = useState({
    fullName: user?.fullName || "EventX Member",
    emailAddress: user?.emailAddress || "member@example.com",
    bio:
      user?.bio ||
      "Discover experiences and make memorable moments with EventX.",
  });

  const [account, setAccount] = useState({
    username: user?.username || "",
    phone: user?.phone || "",
    language: user?.language || "English",
    timezone: user?.timezone || "Asia/Kolkata",
  });

  const [preferences, setPreferences] = useState(
    savedPreferences || {
      newTicketBookings: true,
      eventReminders: true,
      orderUpdates: true,
      marketingOffers: false,
    }
  );

  const userId = user?._id || user?.id;

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (!userId) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/auth/profile/${userId}`);
        const profileUser = response.data.user;
        if (!isMounted) return;

        setProfile({
          fullName: profileUser.fullName || "",
          emailAddress: profileUser.emailAddress || "",
          bio: profileUser.bio || "",
        });
        setAccount({
          username: profileUser.username || "",
          phone: profileUser.number || "",
          language: profileUser.language || "English",
          timezone: profileUser.timezone || "Asia/Kolkata",
        });
        localStorage.setItem("eventxUser", JSON.stringify(profileUser));
      } catch (error) {
        console.error("Profile fetch error:", error);
        if (isMounted) setMessage("Unable to load profile from server");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const updateProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await axios.patch(`${API_URL}/api/auth/profile/${userId}`, {
        ...profile,
        number: account.phone,
        username: account.username,
        language: account.language,
        timezone: account.timezone,
      });
      localStorage.setItem("eventxUser", JSON.stringify(response.data.user));
      setMessage("Profile updated successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const updateAccount = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await axios.patch(`${API_URL}/api/auth/profile/${userId}`, {
        ...profile,
        number: account.phone,
        username: account.username,
        language: account.language,
        timezone: account.timezone,
      });
      localStorage.setItem("eventxUser", JSON.stringify(response.data.user));
      setMessage("Account settings updated successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to update account");
    } finally {
      setSaving(false);
    }
  };

  const updatePreferences = (key) => {
    const updatedPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };

    setPreferences(updatedPreferences);
    localStorage.setItem(
      "eventxPreferences",
      JSON.stringify(updatedPreferences)
    );
  };

  const deleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (confirmed) {
      try {
        await axios.delete(`${API_URL}/api/auth/profile/${userId}`);
        localStorage.removeItem("eventxUser");
        localStorage.removeItem("eventxPreferences");
        window.location.href = "/login";
      } catch (error) {
        setMessage(error.response?.data?.message || "Unable to delete account");
      }
    }
  };

  const tabs = ["profile", "account", "preferences"];

  return (
    <DashboardLayout title="Profile & Settings">
      <div className="mx-auto max-w-7xl space-y-5">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            Profile & Settings
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Manage your profile and account settings.
          </p>
        </div>

        {loading && <p className="text-sm text-gray-400">Loading profile...</p>}
        {message && <p className="text-sm text-violet-300" role="status">{message}</p>}

        <div className="flex gap-6 border-b border-white/10 text-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-2 py-3 capitalize ${
                activeTab === tab
                  ? "border-violet-500 text-violet-400"
                  : "border-transparent text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <form
            onSubmit={updateProfile}
            className="rounded-xl border border-white/10 bg-[#10131d] p-5"
          >
            <h3 className="font-semibold">Profile Information</h3>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-xs text-gray-400">
                Full Name
                <input
                  value={profile.fullName}
                  onChange={(e) =>
                    setProfile({ ...profile, fullName: e.target.value })
                  }
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[.03] px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
                />
              </label>

              <label className="text-xs text-gray-400">
                Email Address
                <input
                  type="email"
                  value={profile.emailAddress}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      emailAddress: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[.03] px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
                />
              </label>

              <label className="text-xs text-gray-400 sm:col-span-2">
                Bio
                <textarea
                  rows="4"
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[.03] px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
                />
              </label>
            </div>

            <button disabled={saving || loading} className="mt-6 rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}

        {activeTab === "account" && (
          <form
            onSubmit={updateAccount}
            className="rounded-xl border border-white/10 bg-[#10131d] p-5"
          >
            <h3 className="font-semibold">Account Settings</h3>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-xs text-gray-400">
                Username
                <input
                  value={account.username}
                  onChange={(e) =>
                    setAccount({ ...account, username: e.target.value })
                  }
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[.03] px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
                />
              </label>

              <label className="text-xs text-gray-400">
                Phone Number
                <input
                  value={account.phone}
                  onChange={(e) =>
                    setAccount({ ...account, phone: e.target.value })
                  }
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[.03] px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
                />
              </label>

              <label className="text-xs text-gray-400">
                Language
                <select
                  value={account.language}
                  onChange={(e) =>
                    setAccount({ ...account, language: e.target.value })
                  }
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#171b29] px-3 py-2 text-sm text-white outline-none"
                >
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </label>

              <label className="text-xs text-gray-400">
                Timezone
                <select
                  value={account.timezone}
                  onChange={(e) =>
                    setAccount({ ...account, timezone: e.target.value })
                  }
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#171b29] px-3 py-2 text-sm text-white outline-none"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">
                    America/New_York
                  </option>
                </select>
              </label>
            </div>

            <button disabled={saving || loading} className="mt-6 rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? "Saving..." : "Save Account Settings"}
            </button>
          </form>
        )}

        {activeTab === "preferences" && (
          <section className="rounded-xl border border-white/10 bg-[#10131d] p-5">
            <h3 className="font-semibold">Notification Preferences</h3>

            {[
              ["newTicketBookings", "New Ticket Bookings"],
              ["eventReminders", "Event Reminders"],
              ["orderUpdates", "Order Updates"],
              ["marketingOffers", "Marketing & Offers"],
            ].map(([key, label]) => (
              <div
                key={key}
                className="flex items-center justify-between border-b border-white/10 py-4 last:border-0"
              >
                <div>
                  <p className="text-sm">{label}</p>
                  <small className="text-xs text-gray-500">
                    Keep me updated about EventX
                  </small>
                </div>

                <button
                  type="button"
                  onClick={() => updatePreferences(key)}
                  className={`h-6 w-11 rounded-full p-1 transition ${
                    preferences[key] ? "bg-violet-600" : "bg-gray-700"
                  }`}
                >
                  <span
                    className={`block h-4 w-4 rounded-full bg-white transition ${
                      preferences[key] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </section>
        )}

        <section className="rounded-xl border border-red-500/30 bg-red-950/10 p-5">
          <h3 className="font-semibold text-red-400">Danger Zone</h3>
          <p className="mt-2 text-xs text-gray-500">
            Delete your account and all associated data.
          </p>
          <button
            onClick={deleteAccount}
            className="mt-4 rounded-lg border border-red-500/50 px-4 py-2 text-sm text-red-300"
          >
            Delete Account
          </button>
        </section>

        <NavLink to="/home" className="inline-block text-sm text-violet-400">
          Back to home
        </NavLink>
      </div>
    </DashboardLayout>
  );
};

export default Profile;