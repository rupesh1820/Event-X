import { useState } from 'react'

const Contact = () => {
  const [sent, setSent] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSent(true)
    event.currentTarget.reset()
  }

  return (
    <main className="min-h-screen bg-[#080711] text-white">
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-8 pt-8 sm:px-6 lg:grid-cols-2 lg:px-10 lg:pt-12">
        <div><p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Contact Us</p><h1 className="mt-4 max-w-lg text-4xl font-bold leading-tight sm:text-5xl">We&apos;d Love to <span className="text-violet-500">Hear From You!</span></h1><p className="mt-5 max-w-md text-sm leading-6 text-gray-300">Have a question, suggestion or need help? We&apos;re here for you. Reach out to us and we&apos;ll get back as soon as possible.</p></div>
        <div className="flex h-56 items-center justify-center"><div className="relative flex h-36 w-48 items-center justify-center rounded-[45%] bg-violet-700 text-4xl shadow-2xl shadow-violet-900/60 after:absolute after:-bottom-7 after:right-5 after:border-[24px] after:border-transparent after:border-t-violet-700 after:rotate-[-20deg]">•••</div></div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-10 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-10">
        <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-[#0d0e18] p-5 sm:p-7"><h2 className="text-xl font-semibold">Get in Touch</h2><p className="mt-2 text-xs text-gray-400">Fill out the form and our team will respond to you shortly.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-xs text-gray-300">Full Name<input required name="name" placeholder="Enter your full name" className="mt-2 w-full rounded-lg border border-white/10 bg-transparent px-3 py-3 text-sm text-white outline-none focus:border-violet-500" /></label><label className="text-xs text-gray-300">Email Address<input required type="email" name="email" placeholder="Enter your email" className="mt-2 w-full rounded-lg border border-white/10 bg-transparent px-3 py-3 text-sm text-white outline-none focus:border-violet-500" /></label></div><label className="mt-4 block text-xs text-gray-300">Subject<select name="subject" className="mt-2 w-full rounded-lg border border-white/10 bg-[#12111d] px-3 py-3 text-sm text-white outline-none"><option>Select a subject</option><option>General question</option><option>Event support</option><option>Partnership</option></select></label><label className="mt-4 block text-xs text-gray-300">Message<textarea required name="message" rows="5" placeholder="Type your message here..." className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-transparent px-3 py-3 text-sm text-white outline-none focus:border-violet-500" /></label><button type="submit" className="mt-5 w-full rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold hover:bg-violet-500">Send Message →</button>{sent && <p className="mt-3 text-center text-sm text-emerald-400">Thanks! Your message has been sent.</p>}</form>
        <div className="rounded-xl border border-white/10 bg-[#0d0e18] p-5 sm:p-7"><h2 className="text-xl font-semibold">Other Ways to Reach Us</h2><div className="mt-5 grid gap-3">{[['✉', 'Email Us', 'hello@eventx.com', 'We usually reply within 24 hours'], ['♧', 'Call Us', '+91 98765 43210', 'Mon - Fri, 9:00 AM - 6:00 PM'], ['⌖', 'Visit Us', 'EventX Headquarters', '123 Event Street, Andheri West, Mumbai, Maharashtra - 400059'], ['◷', 'Support Hours', 'Mon - Sat: 9:00 AM - 6:00 PM', 'Sunday: Closed']].map(([icon, title, value, detail]) => <div key={title} className="flex gap-4 rounded-lg border border-white/10 bg-[#12111d] p-4"><span className="text-xl text-violet-400">{icon}</span><div><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 text-xs text-gray-300">{value}</p><p className="mt-1 text-[11px] text-gray-500">{detail}</p></div></div>)}</div></div>
      </section>
    </main>
  )
}

export default Contact
