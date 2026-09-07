import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('eventxUser'))
    } catch {
      return null
    }
  })

  const navLinkClass = ({ isActive }) =>
    `no-underline transition-colors ${isActive ? 'text-violet-400 underline underline-offset-8 decoration-2' : 'text-white hover:text-violet-400'}`

  const closeMenu = () => setIsMenuOpen(false)

  const handleLogout = () => {
    localStorage.removeItem('eventxUser')
    localStorage.removeItem('eventxToken')
    setUser(null)
    closeMenu()
  }

  const displayName = user?.fullName || user?.name || user?.emailAddress || 'User'
  const initials = displayName
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'U'

  return (
    <header className="relative bg-black text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
        <NavLink to="/home" onClick={closeMenu} className="text-2xl font-bold sm:text-3xl">
          Event<span className="text-violet-600">X</span>
        </NavLink>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-md border border-gray-700 px-3 py-2 text-xl lg:hidden"
        >
          {isMenuOpen ? '×' : '☰'}
        </button>

        <nav className={`${isMenuOpen ? 'flex' : 'hidden'} absolute left-0 top-full z-20 w-full flex-col gap-5 border-t border-gray-800 bg-black px-5 py-6 lg:static lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-8 lg:border-0 lg:bg-transparent lg:p-0`}>
          <NavLink to="/home" onClick={closeMenu} className={navLinkClass}>Home</NavLink>
          <NavLink to="/events" onClick={closeMenu} className={navLinkClass}>Events</NavLink>
          <NavLink to="/categories" onClick={closeMenu} className={navLinkClass}>Categories</NavLink>
          <NavLink to="/about" onClick={closeMenu} className={navLinkClass}>About Us</NavLink>
          <NavLink to="/contact" onClick={closeMenu} className={navLinkClass}>Contact</NavLink>
        </nav>

        {user ? (
          <div className="relative flex items-center gap-3">
            <span className="hidden max-w-32 truncate text-sm text-gray-300 sm:block">{displayName}</span>
            <NavLink
              to="/profile"
              onClick={closeMenu}
              title="Open profile"
              aria-label={`Open ${displayName}'s profile`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white ring-2 ring-violet-300/30 transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-300"
            >
              {initials}
            </NavLink>
            <button type="button" onClick={handleLogout} className="hidden rounded-xl border border-gray-700 px-3 py-2 text-sm text-gray-300 transition hover:border-violet-500 hover:text-white sm:block">
              Logout
            </button>
          </div>
        ) : (
          <div className="hidden gap-3 sm:flex">
            <button className="rounded-2xl border border-white bg-black px-4 py-2 text-sm sm:text-base"><NavLink to="/login">Login</NavLink></button>
            <button className="rounded-2xl bg-violet-600 px-4 py-2 text-sm sm:text-base"><NavLink to="/signup">Sign Up</NavLink></button>
          </div>
        )}
      </div>

      {isMenuOpen && (
        <div className="flex gap-3 border-t border-gray-800 px-5 pb-5 pt-2 sm:hidden">
          {user ? (
            <>
              <NavLink to="/profile" onClick={closeMenu} className="flex-1 rounded-2xl border border-white px-4 py-2 text-center text-sm">Profile</NavLink>
              <button type="button" onClick={handleLogout} className="flex-1 rounded-2xl bg-violet-600 px-4 py-2 text-sm font-medium">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMenu} className="flex-1 rounded-2xl border border-white bg-black px-4 py-2 text-center text-sm">Login</NavLink>
              <NavLink to="/signup" onClick={closeMenu} className="flex-1 rounded-2xl bg-violet-600 px-4 py-2 text-center text-sm">Sign Up</NavLink>
            </>
          )}
        </div>
      )}
    </header>
  )
}

export default Navbar;
