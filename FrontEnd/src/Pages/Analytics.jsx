import DashboardLayout from "../Components/DashboardLayout";

const Analytics = () => (
  <DashboardLayout organizer title="Event Analytics">
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Event Analytics</h2>
          <p className="mt-1 text-sm text-gray-400">
            Track performance and gain insights about your events.
          </p>
        </div>
        <button className="rounded-lg border border-violet-500/40 px-4 py-2 text-sm text-violet-300">
          ↓ Export Report
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["Total Revenue", "₹2,45,680"],
          ["Tickets Sold", "1,246"],
          ["Total Attendees", "1,062"],
          ["Event Views", "8,754"],
          ["Conversion Rate", "14.25%"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-white/10 bg-[#10131d] p-4"
          >
            <p className="text-xs text-gray-400">{label}</p>
            <p className="mt-2 text-xl font-bold">{value}</p>
            <p className="mt-1 text-xs text-green-400">↑ 18.6%</p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
        <section className="rounded-xl border border-white/10 bg-[#10131d] p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Revenue Overview</h3>
            <span className="text-xs text-gray-500">Last 7 Days⌄</span>
          </div>
          <div className="mt-8 flex h-64 items-end gap-3 border-b border-white/10 px-2">
            {[35, 62, 45, 72, 43, 56, 90].map((height, index) => (
              <div
                key={index}
                className="group flex flex-1 flex-col justify-end"
              >
                <div
                  className="h-2 rounded-t bg-violet-500"
                  style={{ height: `${height}%` }}
                />
                <span className="mt-2 text-center text-[10px] text-gray-600">
                  {20 + index} May
                </span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-xl border border-white/10 bg-[#10131d] p-5">
          <h3 className="font-semibold">Traffic Source</h3>
          <div
            className="mx-auto mt-8 grid h-44 w-44 place-items-center rounded-full"
            style={{
              background:
                "conic-gradient(#7c3aed 0 37%, #2563eb 37% 66%, #22c55e 66% 88%, #f59e0b 88% 100%)",
            }}
          >
            <div className="grid h-28 w-28 place-items-center rounded-full bg-[#10131d] text-center">
              <b className="text-xl">8,754</b>
              <span className="text-[10px] text-gray-500">Total Views</span>
            </div>
          </div>
          <div className="mt-5 space-y-2 text-xs text-gray-400">
            {[
              ["Direct", "3,248"],
              ["Social Media", "2,541"],
              ["Search Engines", "1,862"],
              ["Email Campaigns", "658"],
            ].map(([source, count]) => (
              <div key={source} className="flex justify-between">
                <span>● {source}</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <section className="rounded-xl border border-white/10 bg-[#10131d] p-5 lg:col-span-2">
          <h3 className="mb-4 font-semibold">Top Performing Events</h3>
          {[
            "Summer Music Festival",
            "UI/UX Design Workshop",
            "Inter College Football Cup",
          ].map((event, index) => (
            <div
              key={event}
              className="flex items-center justify-between border-b border-white/10 py-3 text-sm last:border-0"
            >
              <span>{event}</span>
              <span className="text-violet-400">
                {["₹1,72,400", "₹20,332", "₹18,560"][index]}
              </span>
            </div>
          ))}
        </section>
        <section className="rounded-xl border border-white/10 bg-[#10131d] p-5">
          <h3 className="font-semibold">Audience Demographics</h3>
          <div className="mt-6 space-y-4 text-xs text-gray-400">
            {[
              ["18 - 24", "28%"],
              ["25 - 34", "42%"],
              ["35 - 44", "18%"],
              ["45 - 54", "8%"],
            ].map(([age, value]) => (
              <div key={age}>
                <div className="mb-1 flex justify-between">
                  <span>{age}</span>
                  <span>{value}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-violet-500"
                    style={{ width: value }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </DashboardLayout>
);

export default Analytics;
