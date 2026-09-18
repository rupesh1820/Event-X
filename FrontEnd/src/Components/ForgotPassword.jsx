import { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_SERVER 
  

const ForgotPassword = () => {
  const [emailAddress, setEmailAddress] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const navigate = useNavigate();

  // =========================
  // SEND OTP
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    const email = emailAddress.trim().toLowerCase();

    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axios.post(
        `${API_URL}/api/auth/forgot-password`,
        {
          emailAddress: email,
        }
      );

      // Save email temporarily
      // OTP page me isi email ka use hoga
      sessionStorage.setItem(
        "eventxResetEmail",
        email
      );

      setMessage(
        response.data?.message ||
          "OTP sent successfully"
      );

      // OTP page par bhejo
      navigate("/verify-reset-otp");

    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to send OTP. Please try again."
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
                Forgot your password?
              </h1>

              <p className="relative mt-5 max-w-md leading-7 text-gray-300">
                No worries. Enter your registered
                email address and we'll send you
                a verification OTP to reset your
                password.
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
              Forgot Password?
            </h2>

            <p className="mt-3 leading-6 text-gray-400">
              Enter the email address associated
              with your EventX account.
            </p>


            {/* =========================
                FORM
            ========================= */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* Email */}

              <div>

                <label
                  htmlFor="emailAddress"
                  className="mb-2 block text-sm font-medium text-gray-200"
                >
                  Email Address
                </label>

                <input
                  id="emailAddress"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={emailAddress}
                  onChange={(event) =>
                    setEmailAddress(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />

              </div>


              {/* Message */}

              {message && (
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-3">

                  <p
                    className="text-sm text-violet-300"
                    role="alert"
                  >
                    {message}
                  </p>

                </div>
              )}


              {/* Button */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-[#080711]"
              >
                {isSubmitting
                  ? "Sending OTP..."
                  : "Send OTP"}
              </button>

            </form>


            {/* Back Login */}

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

export default ForgotPassword;