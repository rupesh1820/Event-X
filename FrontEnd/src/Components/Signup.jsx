import { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_SERVER || "https://eventx-backend-pq2m.onrender.com/";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState("user");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!fullName.trim()) {
      setMessage("Please enter your full name");
      return;
    }

    if (!emailAddress.trim()) {
      setMessage("Please enter your email address");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      setMessage("Please agree to the Terms & Conditions");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        {
          fullName: fullName.trim(),
          emailAddress: emailAddress.trim().toLowerCase(),
          password,
          confirmPassword,
          role,
        }
      );

      const registeredUser = {
        ...(response.data.user || {}),
        fullName: fullName.trim(),
        emailAddress: emailAddress.trim().toLowerCase(),
        role,
      };

      localStorage.setItem(
        "eventxUser",
        JSON.stringify(registeredUser)
      );

      

      window.dispatchEvent(new Event("authChanged"));

      setMessage(
        response.data.message || "Account created successfully"
      );

      setFullName("");
      setEmailAddress("");
      setPassword("");
      setConfirmPassword("");
      setAgreeTerms(false);

      navigate("/home");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080711] text-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-10">
        <NavLink
          to="/home"
          className="text-2xl font-bold tracking-tight sm:text-3xl"
        >
          Event<span className="text-violet-500">X</span>
        </NavLink>

        <NavLink
          to="/home"
          className="text-sm text-gray-300 transition hover:text-violet-400 sm:text-base"
        >
          ← <span>Back to Home</span>
        </NavLink>
      </header>

      {/* Main */}
      <main className="mx-auto grid min-h-[calc(100vh-81px)] max-w-7xl items-center gap-12 px-5 py-12 sm:px-10 lg:grid-cols-2 lg:gap-20">
        {/* Left Side */}
        <section className="hidden lg:block">
          <div className="relative overflow-hidden rounded-[2rem] border border-violet-500/20 bg-gradient-to-br from-violet-950 via-[#17112b] to-[#0d0b18] p-10">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />

            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-3xl" />

            <img
              src="/logo.jpeg"
              alt="EventX logo"
              className="relative h-20 w-20 rounded-2xl object-cover shadow-2xl shadow-violet-950"
            />

            <p className="relative mt-10 text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">
              Welcome to EventX
            </p>

            <h1 className="relative mt-5 max-w-lg text-5xl font-bold leading-tight">
              Find your people.
              <br />
              Create your moments.
            </h1>

            <p className="relative mt-6 max-w-md text-base leading-7 text-gray-300">
              Join a growing community of event lovers and creators.
              Discover unforgettable experiences or create your own
              events with EventX.
            </p>

            <div className="relative mt-10 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl">🎟️</p>
                <h3 className="mt-3 font-semibold">Join Events</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Book tickets for amazing experiences.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl">🎤</p>
                <h3 className="mt-3 font-semibold">Create Events</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Share your own events with people.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Signup Form */}
        <section className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <img
              src="/logo.jpeg"
              alt="EventX logo"
              className="h-16 w-16 rounded-2xl object-cover"
            />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Join EventX
          </p>

          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            Create your account
          </h2>

          <p className="mt-3 text-gray-400">
            Choose how you want to use EventX and get started.
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={handleSubmit}
          >
            {/* Account Type */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-200">
                Choose account type
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* User */}
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`rounded-2xl border p-4 text-left transition ${
                    role === "user"
                      ? "border-violet-500 bg-violet-500/15 ring-2 ring-violet-500/20"
                      : "border-white/15 bg-white/5 hover:border-violet-400/50"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-2xl">🎟️</span>

                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                        role === "user"
                          ? "border-violet-400 bg-violet-500 text-white"
                          : "border-gray-600 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                  </div>

                  <h3 className="font-semibold text-white">
                    User
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-400">
                    Discover events and book tickets.
                  </p>
                </button>

                {/* Creator */}
                <button
                  type="button"
                  onClick={() => setRole("creator")}
                  className={`rounded-2xl border p-4 text-left transition ${
                    role === "creator"
                      ? "border-violet-500 bg-violet-500/15 ring-2 ring-violet-500/20"
                      : "border-white/15 bg-white/5 hover:border-violet-400/50"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-2xl">🎤</span>

                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                        role === "creator"
                          ? "border-violet-400 bg-violet-500 text-white"
                          : "border-gray-600 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                  </div>

                  <h3 className="font-semibold text-white">
                    Creator
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-400">
                    Create and manage your own events.
                  </p>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-200"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                placeholder="Your full name"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-200"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={emailAddress}
                onChange={(event) =>
                  setEmailAddress(event.target.value)
                }
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-200"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Create a password"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-lg text-gray-400 hover:text-violet-400"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium text-gray-200"
              >
                Confirm password
              </label>

              <div className="relative">
                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword ? "text" : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Repeat your password"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />

                <button
                  type="button"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-lg text-gray-400 hover:text-violet-400"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(event) =>
                  setAgreeTerms(event.target.checked)
                }
                className="mt-1 h-4 w-4 accent-violet-600"
              />

              <span>
                I agree to the{" "}
                <a
                  href="#terms"
                  className="text-violet-400 hover:text-violet-300"
                >
                  Terms & Conditions
                </a>
              </span>
            </label>

            {/* Message */}
            {message && (
              <p
                className="rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-3 text-sm text-violet-300"
                role="alert"
              >
                {message}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-[#080711]"
            >
              {isSubmitting
                ? "Creating account..."
                : role === "creator"
                ? "Create Creator Account"
                : "Create User Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="font-semibold text-violet-400 hover:text-violet-300"
            >
              Sign in
            </NavLink>
          </p>
        </section>
      </main>
    </div>
  );
};

export default Signup;