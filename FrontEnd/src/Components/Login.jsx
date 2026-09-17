import { useState } from "react"
import axios from "axios"
import { NavLink } from "react-router-dom"
import { useNavigate } from "react-router-dom"

const API_URL = import.meta.env.VITE_SERVER || "http://localhost:5001"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage("")

    try {
      setIsSubmitting(true)
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        emailAddress,
        password,
      })

      localStorage.setItem("eventxToken", response.data.token)
      localStorage.setItem("eventxUser", JSON.stringify(response.data.user))
       const destination = "/" 
      // response.data.user?.role === "admin"
      //   ? "/admin"
      //   : response.data.user?.role === "creator"
      //     ? "/creator"
      //     : "/profile/dashboard"
      navigate(destination)
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to sign in")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080711] text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-10">
        <NavLink to="/home" className="text-2xl font-bold sm:text-3xl">
          Event<span className="text-violet-500">X</span>
        </NavLink>
        <NavLink to="/home" className="text-sm text-gray-300 transition hover:text-violet-400 sm:text-base">
          ← <span>Back to Home</span>
        </NavLink>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-81px)] max-w-6xl items-center gap-12 px-5 py-12 sm:px-10 lg:grid-cols-2 lg:gap-20">
        <section className="hidden lg:block">
          <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950 via-[#17112b] to-[#0d0b18] p-10">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-600/20 blur-3xl" />
            <img src="/logo.jpeg" alt="EventX logo" className="relative h-20 w-20 rounded-2xl object-cover shadow-2xl shadow-violet-950" />
            <h1 className="relative mt-10 max-w-md text-5xl font-bold leading-tight">Your next great experience starts here.</h1>
            <p className="relative mt-5 max-w-md leading-7 text-gray-300">Join a community of event lovers and discover moments worth remembering.</p>
            <div className="relative mt-10 flex gap-2 text-violet-300"><span>●</span><span>●</span><span>●</span><span>●</span></div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <img src="/logo.jpeg" alt="EventX logo" className="h-16 w-16 rounded-2xl object-cover" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Welcome back</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Sign in to EventX</h2>
          <p className="mt-3 text-gray-400">Continue discovering experiences made for you.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-200">Email or admin username</label>
              <input id="email" type="text" autoComplete="username" placeholder="you@example.com or admin1820" value={emailAddress} onChange={(event) => setEmailAddress(event.target.value)} className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500  focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-200">Password</label>
                <a href="#forgot-password" className="text-sm text-violet-400 hover:text-violet-300">Forgot password?</a>
              </div>
              <div className="relative">
                <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20" />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:text-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <span aria-hidden="true" className="text-lg">{showPassword ? "🙈" : "👁"}</span>
                </button>
              </div>
            </div>
            <label className="flex items-center gap-3 text-sm text-gray-400">
              <input type="checkbox" className="h-4 w-4 accent-violet-600" />
              Remember me
            </label>
            {message && <p className="text-sm text-violet-300" role="alert">{message}</p>}
            <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-[#080711]">{isSubmitting ? "Signing in..." : "Sign In"}</button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">Don't have an account? <a href="/signup" className="font-semibold text-violet-400 hover:text-violet-300">Create one</a></p>
        </section>
      </main>
    </div>
  )
}

export default Login
