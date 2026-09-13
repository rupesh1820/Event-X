import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_SERVER || "http://localhost:5001";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [emailAdress, setEmailAdress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(() =>
    new URLSearchParams(window.location.search).get("role") === "creator"
      ? "creator"
      : "user",
  );
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axios.post(`${API_URL}/api/auth/register`, {
        fullName,
        emailAddress: emailAdress,
        password,
        confirmPassword,
        role,
      });

      const registeredUser = {
        fullName,
        emailAddress: emailAdress,
        role,
      };

      localStorage.setItem("eventxUser", JSON.stringify(registeredUser));

      localStorage.setItem(
        "eventxToken",
        response.data.token || "registered-session",
      );

      window.dispatchEvent(new Event("authChanged"));

      setMessage(response.data.message || "Account created successfully");
      setFullName("");
      setEmailAdress("");
      setPassword("");
      setConfirmPassword("");

      navigate("/home");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080711] text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-10">
        <NavLink to="/home" className="text-2xl font-bold sm:text-3xl">
          Event<span className="text-violet-500">X</span>
        </NavLink>
        <NavLink
          to="/home"
          className="text-sm text-gray-300 transition hover:text-violet-400 sm:text-base"
        >
          ← <span>Back to Home</span>
        </NavLink>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-81px)] max-w-6xl items-center gap-12 px-5 py-12 sm:px-10 lg:grid-cols-2 lg:gap-20">
        <section className="hidden lg:block">
          <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950 via-[#17112b] to-[#0d0b18] p-10">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-600/20 blur-3xl" />
            <img
              src="/logo.jpeg"
              alt="EventX logo"
              className="relative h-20 w-20 rounded-2xl object-cover shadow-2xl shadow-violet-950"
            />
            <h1 className="relative mt-10 max-w-md text-5xl font-bold leading-tight">
              Find your people. Create your moments.
            </h1>
            <p className="relative mt-5 max-w-md leading-7 text-gray-300">
              Create your EventX account and start discovering unforgettable
              experiences.
            </p>
            <div className="relative mt-10 flex gap-2 text-violet-300">
              <span>●</span>
              <span>●</span>
              <span>●</span>
              <span>●</span>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <img
              src="/logo.jpeg"
              alt="EventX logo"
              className="h-16 w-16 rounded-2xl object-cover"
            />
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            Join EventX
          </p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            Create your account
          </h2>
          <p className="mt-3 text-gray-400">
            Sign up and start exploring events near you.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-sm font-medium text-gray-200"
              >
                Account type
              </label>
              <select
                id="role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#17112b] px-4 py-3 text-white outline-none focus:border-violet-500"
              >
                <option value="user">Attendee</option>
                <option value="creator">Creator</option>
              </select>
            </div>
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
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Your full name"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
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
                value={emailAdress}
                onChange={(event) => setEmailAdress(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
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
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-lg text-gray-400 hover:text-violet-400"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>
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
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-lg text-gray-400 hover:text-violet-400"
                >
                  {showConfirmPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>
            <label className="flex items-start gap-3 pt-1 text-sm text-gray-400">
              <input
                type="checkbox"
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
            {message && (
              <p className="text-sm text-violet-300" role="alert">
                {message}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-[#080711]"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
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
