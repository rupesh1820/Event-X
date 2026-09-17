import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    number: "",
    bio: "",
    language: "English",
    timezone: "Asia/Kolkata",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL =
    import.meta.env.VITE_SERVER || "http://localhost:5001"

  useEffect(() => {
    const storedUser = localStorage.getItem("eventxUser");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    setFormData({
      fullName: user.fullName || "",
      username: user.username || "",
      number: user.number || "",
      bio: user.bio || "",
      language: user.language || "English",
      timezone: user.timezone || "Asia/Kolkata",
    });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const token =
        localStorage.getItem("eventxToken") ||
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/profile/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile update nahi ho paya.");
      }

      const updatedUser =
        data.user ||
        data.updatedUser ||
        data.data ||
        data;

      const oldUser = JSON.parse(
        localStorage.getItem("eventxUser") || "{}"
      );

      const finalUser = {
        ...oldUser,
        ...updatedUser,
        ...formData,
      };

      localStorage.setItem("eventxUser", JSON.stringify(finalUser));

      window.dispatchEvent(new Event("authChanged"));

      setMessage("Profile successfully update ho gaya.");

      setTimeout(() => {
        navigate("/profile");
      }, 800);
    } catch (err) {
      console.error("Update profile error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080812] px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <button
            onClick={() => navigate("/profile")}
            className="mb-4 text-sm text-violet-300 hover:text-violet-200"
          >
            ← Back to Profile
          </button>

          <h1 className="text-3xl font-bold">Edit Profile</h1>

          <p className="mt-2 text-gray-400">
            Update your personal information and account details.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-violet-500"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Username
              </label>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-violet-500"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Phone Number
              </label>

              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-violet-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Language
              </label>

              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#171622] px-4 py-3 text-white outline-none focus:border-violet-500"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Gujarati">Gujarati</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Timezone
              </label>

              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#171622] px-4 py-3 text-white outline-none focus:border-violet-500"
              >
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="Asia/Dubai">Asia/Dubai</option>
                <option value="Asia/Singapore">Asia/Singapore</option>
                <option value="Europe/London">Europe/London</option>
                <option value="America/New_York">
                  America/New_York
                </option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Bio
              </label>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                maxLength="300"
                className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-violet-500"
                placeholder="Write something about yourself..."
              />
            </div>
          </div>

          {message && (
            <div className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-gray-300 transition hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditProfile;