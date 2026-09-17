import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const steps = [
  "Basic Info",
  "Details",
  "Schedule",
  "Tickets",
  "Publish",
];

const initialForm = {
  title: "",
  category: "Music",
  shortDescription: "",
  hostName: "",
  audience: "All",
  eventType: "In-person",
  venueName: "",
  city: "Mumbai",
  address: "",
  date: "",
  time: "",
  duration: 2,
  imageUrl:
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
  maxCapacity: 200,
  ticketType: "General",
  ticketPrice: 499,
  earlyBirdPrice: 399,
  featured: true,
  tags: "music, festival, nightlife",
  refundPolicy: "Refund available up to 48 hours before the event.",
  live: true,
};

const CreateEvent = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);

  const API_URL =
    import.meta.env.VITE_SERVER || "https://eventx-backend-pq2m.onrender.com/https://eventx-backend-pq2m.onrender.com";

  const progress = useMemo(
    () => ((currentStep + 1) / steps.length) * 100,
    [currentStep]
  );

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      updateField("imageUrl", reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const requiredFields = {
      title: "Event title",
      shortDescription: "Short description",
      hostName: "Host / organizer name",
      venueName: "Venue name",
      city: "City",
      address: "Full address",
      date: "Date",
      time: "Time",
    };

    const missingField = Object.entries(requiredFields).find(
      ([field]) => !String(form[field] ?? "").trim()
    );

    if (missingField) {
      setStatus({
        type: "error",
        message: `${missingField[1]} is required.`,
      });
      return;
    }

    const token = localStorage.getItem("eventxToken");

    if (!token || token === "registered-session") {
      localStorage.removeItem("eventxToken");

      setStatus({
        type: "error",
        message: "Please login before creating an event.",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);

      return;
    }

    setSubmitting(true);
    setUploadProgress(0);
    setStatus({
      type: "",
      message: "",
    });

    try {
      const payload = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "imageUrl" && imageFile) {
          return;
        }

        payload.append(key, value);
      });

      if (imageFile) {
        payload.append("image", imageFile);
      }

      console.log("Event token exists:", Boolean(token));
      console.log("Event API URL:", `${API_URL}/api/event-create`);

      const response = await axios.post(
        `${API_URL}/api/event-create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 60000,
          onUploadProgress: (event) => {
            if (event.total) {
              const percentage = Math.round(
                (event.loaded / event.total) * 100
              );

              setUploadProgress(percentage);
            }
          },
        }
      );

      console.log("Event publish response:", response.data);

      setUploadProgress(100);
      setSaved(true);

      setStatus({
        type: "success",
        message: "Event published successfully.",
      });
    } catch (error) {
      console.error(
        "Event publish failed:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("eventxToken");
        localStorage.removeItem("eventxUser");

        setStatus({
          type: "error",
          message: "Session expired. Please login again.",
        });

        setTimeout(() => {
          navigate("/login");
        }, 1000);

        return;
      }

      setStatus({
        type: "error",
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Event creation failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    setCurrentStep((step) =>
      Math.min(step + 1, steps.length - 1)
    );
  };

  const prevStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm text-gray-400">
                Event Title *
                <input
                  value={form.title}
                  onChange={(e) =>
                    updateField("title", e.target.value)
                  }
                  placeholder="Summer Music Festival"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-white outline-none focus:border-violet-500"
                />
              </label>

              <label className="text-sm text-gray-400">
                Category *
                <select
                  value={form.category}
                  onChange={(e) =>
                    updateField("category", e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#10131d] px-3 py-3 text-white outline-none focus:border-violet-500"
                >
                  <option>Music</option>
                  <option>Workshop</option>
                  <option>Sports</option>
                  <option>Cultural</option>
                  <option>Business</option>
                  <option>Technology</option>
                </select>
              </label>
            </div>

            <label className="block text-sm text-gray-400">
              Short Description *
              <textarea
                rows="4"
                value={form.shortDescription}
                onChange={(e) =>
                  updateField("shortDescription", e.target.value)
                }
                placeholder="Describe the vibe, purpose, and what attendees will experience..."
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-white outline-none focus:border-violet-500"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm text-gray-400">
                Host / Organizer Name *
                <input
                  value={form.hostName}
                  onChange={(e) =>
                    updateField("hostName", e.target.value)
                  }
                  placeholder="EventX Studio"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-white outline-none focus:border-violet-500"
                />
              </label>

              <label className="text-sm text-gray-400">
                Target Audience
                <select
                  value={form.audience}
                  onChange={(e) =>
                    updateField("audience", e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#10131d] px-3 py-3 text-white outline-none focus:border-violet-500"
                >
                  <option>All</option>
                  <option>Students</option>
                  <option>Professionals</option>
                  <option>Creators</option>
                  <option>Families</option>
                </select>
              </label>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm text-gray-400">
                Event Type
                <select
                  value={form.eventType}
                  onChange={(e) =>
                    updateField("eventType", e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#10131d] px-3 py-3 text-white outline-none focus:border-violet-500"
                >
                  <option>In-person</option>
                  <option>Virtual</option>
                  <option>Hybrid</option>
                </select>
              </label>

              <label className="text-sm text-gray-400">
                Max Capacity
                <input
                  type="number"
                  value={form.maxCapacity}
                  onChange={(e) =>
                    updateField(
                      "maxCapacity",
                      Number(e.target.value) || 0
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-white outline-none focus:border-violet-500"
                />
              </label>
            </div>

            <label className="block text-sm text-gray-400">
              Tags
              <input
                value={form.tags}
                onChange={(e) =>
                  updateField("tags", e.target.value)
                }
                placeholder="music, festival, night, networking"
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-white outline-none focus:border-violet-500"
              />
            </label>

            <label className="block text-sm text-gray-400">
              Refund / Cancellation Policy
              <textarea
                rows="3"
                value={form.refundPolicy}
                onChange={(e) =>
                  updateField("refundPolicy", e.target.value)
                }
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-white outline-none focus:border-violet-500"
              />
            </label>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm text-gray-400">
                Venue Name *
                <input
                  value={form.venueName}
                  onChange={(e) =>
                    updateField("venueName", e.target.value)
                  }
                  placeholder="Worli Sea Face"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-white outline-none focus:border-violet-500"
                />
              </label>

              <label className="text-sm text-gray-400">
                City *
                <input
                  value={form.city}
                  onChange={(e) =>
                    updateField("city", e.target.value)
                  }
                  placeholder="Mumbai"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-white outline-none focus:border-violet-500"
                />
              </label>
            </div>

            <label className="block text-sm text-gray-400">
              Full Address *
              <textarea
                rows="3"
                value={form.address}
                onChange={(e) =>
                  updateField("address", e.target.value)
                }
                placeholder="18, Marine Drive Road, Mumbai, India"
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-white outline-none focus:border-violet-500"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-3">
              <label className="text-sm text-gray-400">
                Date *
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    updateField("date", e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-white outline-none focus:border-violet-500"
                />
              </label>

              <label className="text-sm text-gray-400">
                Time *
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) =>
                    updateField("time", e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-white outline-none focus:border-violet-500"
                />
              </label>

              <label className="text-sm text-gray-400">
                Duration
                <input
                  type="number"
                  min="1"
                  value={form.duration}
                  onChange={(e) =>
                    updateField(
                      "duration",
                      Number(e.target.value) || 0
                    )
                  }
                  placeholder="2"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-white outline-none focus:border-violet-500"
                />
              </label>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm text-gray-400">
                Ticket Type
                <select
                  value={form.ticketType}
                  onChange={(e) =>
                    updateField("ticketType", e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#10131d] px-3 py-3 text-white outline-none focus:border-violet-500"
                >
                  <option>General</option>
                  <option>VIP</option>
                  <option>Premium</option>
                  <option>Early Bird</option>
                </select>
              </label>

              <label className="text-sm text-gray-400">
                General Price (₹)
                <input
                  type="number"
                  value={form.ticketPrice}
                  onChange={(e) =>
                    updateField(
                      "ticketPrice",
                      Number(e.target.value) || 0
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-white outline-none focus:border-violet-500"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm text-gray-400">
                Early Bird Price (₹)
                <input
                  type="number"
                  value={form.earlyBirdPrice}
                  onChange={(e) =>
                    updateField(
                      "earlyBirdPrice",
                      Number(e.target.value) || 0
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-white outline-none focus:border-violet-500"
                />
              </label>

              <label className="text-sm text-gray-400">
                Featured Event
                <div className="mt-2 flex h-[52px] items-center rounded-lg border border-white/10 bg-white/5 px-3">
                  <button
                    type="button"
                    onClick={() =>
                      updateField("featured", !form.featured)
                    }
                    className={`relative h-6 w-11 rounded-full transition ${
                      form.featured
                        ? "bg-violet-600"
                        : "bg-gray-700"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                        form.featured ? "left-6" : "left-1"
                      }`}
                    />
                  </button>

                  <span className="ml-3 text-sm text-gray-300">
                    {form.featured ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </label>
            </div>

            <div className="rounded-xl border border-dashed border-violet-500/40 bg-violet-500/5 p-4 text-sm text-gray-300">
              <p className="font-medium text-violet-300">
                Ticketing summary
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span>General entry</span>
                <span className="font-semibold text-white">
                  ₹{form.ticketPrice}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span>Early bird</span>
                <span className="font-semibold text-white">
                  ₹{form.earlyBirdPrice}
                </span>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4 text-sm text-violet-100">
              <p className="font-semibold text-white">
                Ready to publish
              </p>

              <p className="mt-1">
                Review your content and hit publish to make the event
                live.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-3 text-sm text-gray-400">
                <label className="block">
                  Event Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-2 block w-full rounded-lg border border-dashed border-violet-500/40 bg-[#10131d] px-3 py-3 text-sm text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-violet-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
                  />
                </label>

                <label className="block">
                  Or paste image URL
                  <input
                    value={form.imageUrl}
                    onChange={(e) =>
                      updateField("imageUrl", e.target.value)
                    }
                    placeholder="https://example.com/event-image.jpg"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-white outline-none focus:border-violet-500"
                  />
                </label>
              </div>

              <label className="text-sm text-gray-400">
                Event Status
                <div className="mt-2 flex h-[52px] items-center rounded-lg border border-white/10 bg-white/5 px-3">
                  <button
                    type="button"
                    onClick={() => updateField("live", !form.live)}
                    className={`relative h-6 w-11 rounded-full transition ${
                      form.live ? "bg-emerald-500" : "bg-gray-700"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                        form.live ? "left-6" : "left-1"
                      }`}
                    />
                  </button>

                  <span className="ml-3 text-sm text-gray-300">
                    {form.live ? "Live" : "Draft"}
                  </span>
                </div>
              </label>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#10131d] p-4">
              <h4 className="font-semibold text-white">
                Preview summary
              </h4>

              <div className="mt-3 flex flex-col gap-3 text-sm text-gray-300">
                <div className="flex justify-between gap-3">
                  <span>Title</span>
                  <span className="font-medium text-white">
                    {form.title || "Untitled Event"}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span>Category</span>
                  <span className="font-medium text-white">
                    {form.category}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span>Date</span>
                  <span className="font-medium text-white">
                    {form.date || "Not set"}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span>Venue</span>
                  <span className="font-medium text-white">
                    {form.venueName || "Location not set"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div title="Create Event">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Create Event
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Set up your event from start to finish.
            </p>

            {status.message && (
              <p
                className={`mt-3 text-sm ${
                  status.type === "success"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {status.message}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSaved(true)}
            className="rounded-lg border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200"
          >
            {saved ? "Saved" : "Save Draft"}
          </button>
        </div>

        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-violet-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
            {steps.map((step, index) => (
              <span
                key={step}
                className={`rounded-full border px-2.5 py-1 ${
                  index === currentStep
                    ? "border-violet-500 bg-violet-500/10 text-violet-200"
                    : "border-white/10"
                }`}
              >
                {index + 1}. {step}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.45fr_.75fr]">
          <section className="rounded-xl border border-white/10 bg-[#10131d] p-5 sm:p-6">
            <h3 className="mb-5 font-semibold text-white">
              {steps[currentStep]}
            </h3>

            {renderStep()}

            <div className="mt-8 flex justify-between gap-3">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="rounded-lg border border-white/10 px-5 py-2 text-sm text-gray-300 transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Back
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSaved(true)}
                  className="rounded-lg border border-white/10 px-5 py-2 text-sm text-white"
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={() =>
                    currentStep === steps.length - 1
                      ? handleSubmit()
                      : nextStep()
                  }
                  disabled={submitting}
                  className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-wait disabled:opacity-70"
                  aria-busy={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Publishing
                      {uploadProgress
                        ? ` ${uploadProgress}%`
                        : "..."}
                    </span>
                  ) : currentStep === steps.length - 1 ? (
                    "Publish Event"
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </div>
          </section>

          <aside className="rounded-xl border border-white/10 bg-[#10131d] p-5">
            <h3 className="font-semibold text-white">
              Event Preview
            </h3>

            <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
              <img
                src={form.imageUrl}
                alt={form.title || "Event preview"}
                className="h-40 w-full object-cover"
              />

              <div className="p-4">
                <span className="rounded bg-violet-600 px-2 py-1 text-xs font-medium text-white">
                  {form.category}
                </span>

                <h3 className="mt-3 text-lg font-semibold text-white">
                  {form.title || "Your event title"}
                </h3>

                <p className="mt-2 text-xs text-gray-500">
                  ⌖ {form.venueName || "Venue not set"},{" "}
                  {form.city || "City"}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  ◷ {form.date || "Date not set"} ·{" "}
                  {form.time || "Time not set"}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="text-xs text-gray-400">
                    Starting from
                  </span>

                  <span className="text-lg font-bold text-violet-400">
                    ₹{form.ticketPrice || 0}
                  </span>
                </div>
              </div>
            </div>

            <h3 className="mt-6 font-semibold text-white">
              Checklist
            </h3>

            {steps.map((item, index) => (
              <div key={item} className="mt-4 flex gap-3 text-sm">
                <span
                  className={
                    index <= currentStep
                      ? "text-violet-400"
                      : "text-gray-600"
                  }
                >
                  ◉
                </span>

                <div>
                  <p className="text-white">{item}</p>

                  <p className="text-xs text-gray-500">
                    {index === currentStep
                      ? "In progress"
                      : index < currentStep
                      ? "Completed"
                      : "Pending"}
                  </p>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;