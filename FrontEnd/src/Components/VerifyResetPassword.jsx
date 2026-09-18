import { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

const API_URL = 
  import.meta.env.VITE_SERVER 

const VerifyResetOtp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const emailAddress =
    sessionStorage.getItem("eventxResetEmail") || "";

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    if (!emailAddress) {
      setMessage(
        "Reset session expired. Please request OTP again."
      );
      return;
    }

    if (otp.length !== 6) {
      setMessage("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axios.post(
        `${API_URL}/api/auth/verify-reset-otp`,
        {
          emailAddress,
          otp,
        }
      );

      // Save verified status
      sessionStorage.setItem(
        "eventxResetOtp",
        otp
      );

      sessionStorage.setItem(
        "eventxResetVerified",
        "true"
      );

      // Go to reset password
      navigate("/reset-password");

    } catch (error) {
  console.error(
    "Verify reset OTP error:",
    error.response?.data
  );

  setMessage(
    error.response?.data?.message ||
      "Invalid OTP. Please try again."
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
          className="text-2xl font-bold sm:text-3xl"
        >
          Event
          <span className="text-violet-500">
            X
          </span>
        </NavLink>

        <NavLink
          to="/login"
          className="text-sm text-gray-300 transition hover:text-violet-400 sm:text-base"
        >
          ← Back to Login
        </NavLink>

      </header>


      {/* Main */}

      <main className="mx-auto flex min-h-[calc(100vh-81px)] max-w-6xl items-center justify-center px-5 py-12 sm:px-10">

        <div className="grid w-full max-w-5xl items-center gap-12 lg:grid-cols-2 lg:gap-20">


          {/* Left */}

          <section className="hidden lg:block">

            <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950 via-[#17112b] to-[#0d0b18] p-10">

              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-600/20 blur-3xl" />

              <img
                src="/logo.jpeg"
                alt="EventX logo"
                className="relative h-20 w-20 rounded-2xl object-cover shadow-2xl shadow-violet-950"
              />

              <h1 className="relative mt-10 max-w-md text-5xl font-bold leading-tight">
                Verify your identity.
              </h1>

              <p className="relative mt-5 max-w-md leading-7 text-gray-300">
                Enter the 6-digit OTP we sent to
                your registered email address.
              </p>

              <div className="relative mt-10 flex gap-2 text-violet-300">
                <span>●</span>
                <span>●</span>
                <span>●</span>
                <span>●</span>
              </div>

            </div>

          </section>


          {/* Right */}

          <section className="mx-auto w-full max-w-md">

            {/* Mobile logo */}

            <div className="mb-8 lg:hidden">
              <img
                src="/logo.jpeg"
                alt="EventX logo"
                className="h-16 w-16 rounded-2xl object-cover"
              />
            </div>


            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
              Verification
            </p>

            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              Enter OTP
            </h2>

            <p className="mt-3 text-gray-400">
              We sent a 6-digit verification code
              to:
            </p>

            <p className="mt-2 break-all font-medium text-violet-400">
              {emailAddress || "Your email"}
            </p>


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              <div>

                <label
                  htmlFor="otp"
                  className="mb-2 block text-sm font-medium text-gray-200"
                >
                  Verification OTP
                </label>

                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="one-time-code"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(event) => {
                    const value =
                      event.target.value.replace(
                        /\D/g,
                        ""
                      );

                    setOtp(value);
                  }}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-white outline-none transition placeholder:text-gray-500 placeholder:tracking-normal focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />

              </div>


              {/* Message */}

              {message && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                  <p
                    className="text-sm text-red-300"
                    role="alert"
                  >
                    {message}
                  </p>
                </div>
              )}


              {/* Verify */}

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  otp.length !== 6
                }
                className="w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-[#080711]"
              >
                {isSubmitting
                  ? "Verifying..."
                  : "Verify OTP"}
              </button>

            </form>


            {/* Back */}

            <div className="mt-8 text-center">

              <NavLink
                to="/forgot-password"
                className="text-sm font-semibold text-violet-400 transition hover:text-violet-300"
              >
                ← Request new OTP
              </NavLink>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
};

export default VerifyResetOtp;