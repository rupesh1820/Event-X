import { NavLink } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="border-t border-violet-500/20 bg-[#080711] text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="text-3xl font-bold text-white">
            Event<span className="text-violet-500">X</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
            Discover experiences, connect with people and make every event memorable.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 text-sm text-gray-300 transition hover:border-violet-500 hover:text-violet-400">◎</a>
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 text-sm text-gray-300 transition hover:border-violet-500 hover:text-violet-400">𝕏</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 text-sm text-gray-300 transition hover:border-violet-500 hover:text-violet-400">in</a>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-white">Explore</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <NavLink to="/events" className="transition hover:text-violet-400">Find Events</NavLink>
            <NavLink to="/categories" className="transition hover:text-violet-400">Browse Categories</NavLink>
            <NavLink to="/profile" className="transition hover:text-violet-400">Become an Organizer</NavLink>
            <NavLink to="/about" className="transition hover:text-violet-400">About EventX</NavLink>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-white">Support</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <NavLink to="/contact" className="transition hover:text-violet-400">Help Center</NavLink>
            <NavLink to="/contact" className="transition hover:text-violet-400">Contact Us</NavLink>
            <a href="#terms" className="transition hover:text-violet-400">Terms & Conditions</a>
            <a href="#privacy" className="transition hover:text-violet-400">Privacy Policy</a>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-white">Stay Updated</h2>
          <p className="mt-4 text-sm leading-6 text-gray-400">Get event inspiration and updates in your inbox.</p>
          <div className="mt-4 flex rounded-lg border border-gray-700 bg-[#12111d] p-1 focus-within:border-violet-500">
            <input type="email" placeholder="Your email" aria-label="Email address" className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-gray-500" />
            <button type="button" className="rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-500">Join</button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>© 2026 EventX. All rights reserved.</p>
          <p>Made for unforgettable experiences.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
