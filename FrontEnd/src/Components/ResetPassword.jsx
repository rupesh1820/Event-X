import { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

const API_URL = 
  import.meta.env.VITE_SERVER

const ResetPassword = () => {
  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const navigate = useNavigate();

  // Get reset details from sessionStorage
  const emailAddress =
    sessionStorage.getItem(
      "eventxResetEmail"
    ) || "";

  const otp =
    sessionStorage.getItem(
      "eventxResetOtp"
    ) || "";

  const isVerified =
    sessionStorage.getItem(
      "eventxResetVerified"
    ) === "true";


  // =========================
  // RESET PASSWORD
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    if (!emailAddress || !otp || !isVerified) {
      setMessage(
        "Your reset session is invalid. Please request a new OTP."
      );
      return;
    }

    if (!newPassword || !confirmPassword) {
      setMessage(
        "Please enter both passwords."
      );
      return;
    }

    if (newPassword.length < 6) {
      setMessage(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage(
        "Passwords do not match."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axios.post(
        `${API_URL}/api/auth/reset-password`,
        {
          emailAddress,
          otp,
          newPassword,
          confirmPassword,
        }
      );

      console.log(
        "Password reset response:",
        response.data
      );

      // Clear reset session
      sessionStorage.removeItem(
        "eventxResetEmail"
      );

      sessionStorage.removeItem(
        "eventxResetOtp"
      );

      sessionStorage.removeItem(
        "eventxResetVerified"
      );

      // Go to login
      navigate("/login", {
        state: {
          message:
            "Password changed successfully. Please login with your new password.",
        },
      });

    } catch (error) {
      console.error(
        "Reset password error:",
        error.response?.data || error
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to change password. Please try again."
      );

    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#080711] text-white">

      {/* =========================
          HEADER
      ========================= */}

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


      {/* =========================
          MAIN
      ========================= */}

      <main className="mx-auto flex min-h-[calc(100vh-81px)] max-w-6xl items-center justify-center px-5 py-12 sm:px-10">

        <div className="grid w-full max-w-5xl items-center gap-12 lg:grid-cols-2 lg:gap-20">


          {/* =========================
              LEFT SIDE
          ========================= */}

          <section className="hidden lg:block">

            <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950 via-[#17112b] to-[#0d0b18] p-10">

              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-600/20 blur-3xl" />

              <img
                src="/logo.jpeg"
                alt="EventX logo"
                className="relative h-20 w-20 rounded-2xl object-cover shadow-2xl shadow-violet-950"
              />

              <h1 className="relative mt-10 max-w-md text-5xl font-bold leading-tight">
                Create a new password.
              </h1>

              <p className="relative mt-5 max-w-md leading-7 text-gray-300">
                Choose a strong password to keep
                your EventX account secure.
              </p>

              <div className="relative mt-10 flex gap-2 text-violet-300">
                <span>●</span>
                <span>●</span>
                <span>●</span>
                <span>●</span>
              </div>

            </div>

          </section>


          {/* =========================
              RIGHT SIDE
          ========================= */}

          <section className="mx-auto w-full max-w-md">

            {/* Mobile Logo */}

            <div className="mb-8 lg:hidden">

              <img
                src="/logo.jpeg"
                alt="EventX logo"
                className="h-16 w-16 rounded-2xl object-cover"
              />

            </div>


            {/* Heading */}

            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
              Password Recovery
            </p>

            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              Reset Password
            </h2>

            <p className="mt-3 text-gray-400">
              Create a new password for your
              EventX account.
            </p>


            {/* Email */}

            {emailAddress && (
              <div className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3">

                <p className="text-xs text-gray-500">
                  Account
                </p>

                <p className="mt-1 break-all text-sm text-violet-300">
                  {emailAddress}
                </p>

              </div>
            )}


            {/* =========================
                FORM
            ========================= */}

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >

              {/* New Password */}

              <div>

                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-medium text-gray-200"
                >
                  New Password
                </label>

                <div className="relative">

                  <input
                    id="newPassword"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:text-violet-400"
                  >
                    <span className="text-lg">
                      {showPassword
                        ? "🙈"
                        : "👁"}
                    </span>
                  </button>

                </div>

              </div>


              {/* Confirm Password */}

              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-gray-200"
                >
                  Confirm Password
                </label>

                <div className="relative">

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:text-violet-400"
                  >
                    <span className="text-lg">
                      {showConfirmPassword
                        ? "🙈"
                        : "👁"}
                    </span>
                  </button>

                </div>

              </div>


              {/* Password requirements */}

              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">

                <p className="text-xs text-gray-400">
                  Password must contain at least
                  6 characters.
                </p>

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


              {/* Reset Button */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-[#080711]"
              >
                {isSubmitting
                  ? "Changing Password..."
                  : "Change Password"}
              </button>

            </form>


            {/* Back to Login */}

            <div className="mt-8 text-center">

              <NavLink
                to="/login"
                className="text-sm font-semibold text-violet-400 transition hover:text-violet-300"
              >
                ← Back to Login
              </NavLink>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
};

export default ResetPassword;