import { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_SERVER ;

const Signup = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [role, setRole] = useState("user");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [otpStep, setOtpStep] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      setOtpStep(true);

      setMessage(
        response.data.message || "OTP sent to your email"
      );
    } catch (error) {
      console.error(
        "Register error:",
        error.response?.data || error.message
      );

      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setMessage("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axios.post(
        `${API_URL}/api/auth/verify-register-otp`,
        {
          fullName: fullName.trim(),
          emailAddress: emailAddress.trim().toLowerCase(),
          password,
          confirmPassword,
          role,
          otp,
        }
      );

      const registeredUser = response.data.user;

      if (registeredUser) {
        localStorage.setItem(
          "eventxUser",
          JSON.stringify(registeredUser)
        );
      }

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "eventxToken",
          response.data.token
        );
      }

      window.dispatchEvent(new Event("authChanged"));

      setMessage(
        response.data.message ||
          "Account created successfully"
      );

      navigate("/home");
    }  catch (error) {
  console.error(
    "Register error:",
    error.response?.data || error.message
  );

  setMessage(
    error.response?.data?.error ||
      error.response?.data?.message ||
      "Registration failed"
  );
} finally {
  setIsSubmitting(false);
}
  };

  return (
    <div className="min-h-screen bg-[#080711] text-white">
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
          ← Back to Home
        </NavLink>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-81px)] max-w-7xl items-center justify-center px-5 py-12 sm:px-10">
        <section className="w-full max-w-md">
          <div className="mb-8">
            <img
              src="/logo.jpeg"
              alt="EventX logo"
              className="h-16 w-16 rounded-2xl object-cover"
            />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Join EventX
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            {otpStep
              ? "Verify your email"
              : "Create your account"}
          </h1>

          <p className="mt-3 text-gray-400">
            {otpStep
              ? `We sent a 6-digit OTP to ${emailAddress}`
              : "Choose how you want to use EventX and get started."}
          </p>

          <form
            onSubmit={otpStep ? handleVerifyOtp : handleSubmit}
            className="mt-8 space-y-5"
          >
            {!otpStep && (
              <>
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-200">
                    Choose account type
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("user")}
                      className={`rounded-2xl border p-4 text-left transition ${
                        role === "user"
                          ? "border-violet-500 bg-violet-500/15 ring-2 ring-violet-500/20"
                          : "border-white/15 bg-white/5 hover:border-violet-400/50"
                      }`}
                    >
                      <div className="mb-2 text-2xl">🎟️</div>
                      <h3 className="font-semibold">User</h3>
                      <p className="mt-1 text-xs text-gray-400">
                        Discover events and book tickets.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("creator")}
                      className={`rounded-2xl border p-4 text-left transition ${
                        role === "creator"
                          ? "border-violet-500 bg-violet-500/15 ring-2 ring-violet-500/20"
                          : "border-white/15 bg-white/5 hover:border-violet-400/50"
                      }`}
                    >
                      <div className="mb-2 text-2xl">🎤</div>
                      <h3 className="font-semibold">Creator</h3>
                      <p className="mt-1 text-xs text-gray-400">
                        Create and manage your own events.
                      </p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Full name
                  </label>

                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) =>
                      setFullName(event.target.value)
                    }
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email address
                  </label>

                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(event) =>
                      setEmailAddress(event.target.value)
                    }
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Create a password"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 pr-12 text-white outline-none placeholder:text-gray-500 focus:border-violet-500"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-lg"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Confirm password
                  </label>

                  <div className="relative">
                    <input
                      type={
                        showConfirmPassword ? "text" : "password"
                      }
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Repeat your password"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 pr-12 text-white outline-none placeholder:text-gray-500 focus:border-violet-500"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-lg"
                    >
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

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
                    I agree to the Terms & Conditions
                  </span>
                </label>
              </>
            )}

            {otpStep && (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Enter 6-digit OTP
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  autoFocus
                  value={otp}
                  onChange={(event) =>
                    setOtp(
                      event.target.value.replace(/\D/g, "")
                    )
                  }
                  placeholder="Enter OTP"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-4 text-center text-2xl tracking-[0.5em] text-white outline-none placeholder:text-gray-500 focus:border-violet-500"
                />
              </div>
            )}

            {message && (
              <p className="rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-3 text-sm text-violet-300">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Please wait..."
                : otpStep
                ? "Verify OTP & Create Account"
                : role === "creator"
                ? "Create Creator Account"
                : "Create User Account"}
            </button>

            {otpStep && (
              <button
                type="button"
                onClick={() => {
                  setOtpStep(false);
                  setOtp("");
                  setMessage("");
                }}
                className="w-full text-sm text-gray-400 hover:text-violet-400"
              >
                Change email or details
              </button>
            )}
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