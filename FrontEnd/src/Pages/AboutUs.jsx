import { NavLink } from 'react-router-dom'
//about us
const AboutUs = () => {
  return (
    <main className="min-h-screen bg-[#080711] text-white">
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-8 pt-8 sm:px-6 lg:grid-cols-2 lg:px-10 lg:pt-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">About Us</p>
          <h1 className="mt-4 max-w-xl text-4xl font-bold leading-tight sm:text-5xl">Creating Moments.<br />Building <span className="text-violet-500">Connections.</span></h1>
          <p className="mt-5 max-w-lg text-sm leading-6 text-gray-300">EventX is your go-to platform for discovering, creating and imagining amazing events. Whether it&apos;s a music concert, workshop, sports match or a cultural fest, we bring people together through unforgettable experiences.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-lg border border-violet-500/30 bg-[#11111d] px-5 py-3"><strong className="block text-xl text-violet-400">1,200+</strong><span className="text-xs text-gray-400">Events Hosted</span></div>
            <div className="rounded-lg border border-violet-500/30 bg-[#11111d] px-5 py-3"><strong className="block text-xl text-violet-400">50K+</strong><span className="text-xs text-gray-400">Happy Users</span></div>
          </div>
        </div>
        <div className="relative h-64 overflow-hidden rounded-xl border border-violet-500/20 sm:h-80 lg:h-96">
          <img src="/Banner.jpeg" alt="EventX audience at a live event" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-r from-[#080711] via-transparent to-transparent" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-10">
        <div className="grid gap-4 rounded-xl border border-white/10 bg-[#0d0e18] p-5 sm:grid-cols-2 sm:p-7">
          <div><span className="text-2xl text-violet-400">◎</span><h2 className="mt-3 font-semibold">Our Mission</h2><p className="mt-2 text-sm leading-6 text-gray-400">Our mission is to empower creators and organizations to host successful events while helping people discover experiences that inspire, educate and entertain.</p></div>
          <div><span className="text-2xl text-violet-400">◉</span><h2 className="mt-3 font-semibold">Our Vision</h2><p className="mt-2 text-sm leading-6 text-gray-400">To be the world&apos;s most trusted event platform that connects people, communities and cultures through the power of live experiences.</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-10"><h2 className="mb-5 text-xl font-bold">What We Offer</h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[
        ['♧', 'Discover Events', 'Find events that match your interests from around the world.'],
        ['▣', 'Create & Manage', 'Easily create, organize and manage your events in one place.'],
        ['♧', 'Connect & Grow', 'Connect with like-minded people and grow your network.'],
        ['◇', 'Secure & Reliable', 'Your data and payments are safe with our secure platform.'],
      ].map(([icon, title, text]) => <article key={title} className="rounded-lg border border-white/10 bg-[#0d0e18] p-5"><span className="text-xl text-violet-400">{icon}</span><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-2 text-xs leading-5 text-gray-400">{text}</p></article>)}</div></section>

      <section className="mx-auto mb-12 flex max-w-7xl flex-col items-start justify-between gap-4 rounded-xl bg-linear-to-r from-violet-700 to-purple-600 px-6 py-6 sm:flex-row sm:items-center sm:px-10"><div><h2 className="font-bold">Ready to be a part of something amazing?</h2><p className="mt-1 text-sm text-violet-100">Join EventX today and experience events that create memories.</p></div><NavLink to="/events" className="rounded-lg bg-black/70 px-5 py-3 text-sm font-semibold hover:bg-black">Explore Events →</NavLink></section>
    </main>
  )
}

export default AboutUs
