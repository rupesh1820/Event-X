import { useState } from "react";
import DashboardLayout from "../Components/DashboardLayout";

const CreateEvent = () => {
  const [saved, setSaved] = useState(false);
  const [title, setTitle] = useState("");
  return (
    <DashboardLayout organizer title="Create Event">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold sm:text-3xl">Create Event</h2>
          <p className="mt-1 text-sm text-gray-400">
            Fill in the details below to create your event.
          </p>
        </div>
        <div className="mb-5 flex max-w-3xl items-center justify-between text-xs text-gray-500">
          {["Basic Info", "Date & Time", "Venue", "Tickets", "Preview"].map(
            (step, index) => (
              <div key={step} className="flex items-center gap-2">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full border ${index === 0 ? "border-violet-500 bg-violet-600 text-white" : "border-white/20"}`}
                >
                  {index + 1}
                </span>
                <span className="hidden sm:block">{step}</span>
              </div>
            ),
          )}
        </div>
        <div className="grid gap-5 xl:grid-cols-[1.4fr_.7fr]">
          <section className="rounded-xl border border-white/10 bg-[#10131d] p-5">
            <h3 className="mb-5 font-semibold">Event Basic Information</h3>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm text-gray-400">
                Event Title *
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Summer Music Festival"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[.03] px-3 py-3 text-white outline-none focus:border-violet-500"
                />
              </label>
              <label className="text-sm text-gray-400">
                Category *
                <select className="mt-2 w-full rounded-lg border border-white/10 bg-[#10131d] px-3 py-3 text-white outline-none">
                  <option>Music</option>
                  <option>Workshop</option>
                  <option>Sports</option>
                  <option>Cultural</option>
                </select>
              </label>
            </div>
            <label className="mt-5 block text-sm text-gray-400">
              Short Description *
              <textarea
                rows="4"
                placeholder="Get ready for the ultimate musical experience..."
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/[.03] px-3 py-3 text-white outline-none focus:border-violet-500"
              />
            </label>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="text-sm text-gray-400">
                Date
                <input
                  type="date"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[.03] px-3 py-3 text-white"
                />
              </label>
              <label className="text-sm text-gray-400">
                Time
                <input
                  type="time"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[.03] px-3 py-3 text-white"
                />
              </label>
            </div>
            <div className="mt-5 rounded-lg border border-dashed border-violet-500/40 p-8 text-center text-sm text-gray-500">
              ▧<br />
              <span className="text-violet-300">Upload event image</span>
              <br />
              Recommended size: 1200x600px
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="rounded-lg border border-white/10 px-5 py-2 text-sm">
                Cancel
              </button>
              <button
                onClick={() => setSaved(true)}
                className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold"
              >
                {saved ? "Saved" : "Save & Continue ?"}
              </button>
            </div>
          </section>
          <aside className="rounded-xl border border-white/10 bg-[#10131d] p-5">
            <h3 className="font-semibold">Event Preview</h3>
            <div className="mt-4 overflow-hidden rounded-lg border border-white/10">
              <img
                src="/Banner.jpeg"
                alt="Event preview"
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <span className="rounded bg-violet-600 px-2 py-1 text-xs">
                  Music
                </span>
                <h3 className="mt-3 text-lg font-semibold">
                  {title || "Summer Music Festival"}
                </h3>
                <p className="mt-2 text-xs text-gray-500">
                  ⌖ Worli Sea Face, Mumbai, India
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  ◷ 24 May 2026 · 6:00 PM
                </p>
              </div>
            </div>
            <h3 className="mt-6 font-semibold">Event Creation Checklist</h3>
            {[
              "Basic Information",
              "Date & Time",
              "Venue",
              "Tickets",
              "Preview",
            ].map((item, index) => (
              <div key={item} className="mt-4 flex gap-3 text-sm">
                <span
                  className={index === 0 ? "text-violet-400" : "text-gray-600"}
                >
                  ◉
                </span>
                <div>
                  <p>{item}</p>
                  <p className="text-xs text-gray-500">
                    {index === 0
                      ? "Event title, description, category and images"
                      : "Complete this step to continue"}
                  </p>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateEvent;
