import { ArrowUpRight, Sparkles } from "lucide-react";
import EventsExplorer from "@/components/event/events-explorer";

const stats = [
  { label: "Events approved", value: "240+" },
  { label: "Active organizers", value: "80" },
  { label: "Student reach", value: "15k" },
];

const partners = [
  { name: "VIT Student Council", role: "Campus Strategy" },
  { name: "National Innovation Cell", role: "Innovation Partner" },
  { name: "Startup TN", role: "Ecosystem Ally" },
  { name: "IEEE VIT", role: "Tech Collective" },
];

const pillars = [
  {
    title: "Curated by student leaders",
    description: "Hand-picked highlights direct from clubs, councils, and certified organizers.",
  },
  {
    title: "Powered by real-time data",
    description: "See registration status, deadlines, and insights update the moment organizers post.",
  },
  {
    title: "Designed for momentum",
    description: "Control your calendar, discover emerging talents, and fuel campus culture effortlessly.",
  },
];

const timeline = [
  {
    title: "Discover",
    description:
      "Surf spotlighted fests, niche workshops, and hidden gems curated with cinematic previews.",
    accent: "from-indigo-400/80 via-sky-400/50 to-cyan-300/60",
  },
  {
    title: "Decide",
    description:
      "Compare fees, deadlines, and venue vibes instantly. Pin what resonates and share with your crew.",
    accent: "from-emerald-400/80 via-lime-400/50 to-amber-300/60",
  },
  {
    title: "Dive in",
    description:
      "Register, sync reminders, and capture moments that define your semester without missing a beat.",
    accent: "from-fuchsia-400/80 via-rose-400/50 to-orange-300/60",
  },
];

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(35,95,236,0.18),_rgba(10,13,35,0.95))]" />
      <div className="pointer-events-none absolute inset-x-0 top-[-22rem] -z-10 h-[48rem] bg-[conic-gradient(at_top,_rgba(56,151,240,0.35),_transparent_55%,rgba(255,115,179,0.3))] blur-3xl" />
      <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-2/5 bg-[radial-gradient(circle_at_20%_40%,_rgba(253,226,94,0.18),_transparent_65%)]" />

      <header className="mx-auto w-full max-w-6xl px-4 pt-8">
        <div className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-white/[0.06] px-6 py-4 shadow-[0_18px_70px_-45px_rgba(56,189,248,0.7)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 shadow-inner ring-1 ring-white/20">
              <Sparkles className="h-5 w-5 text-sky-200" />
            </span>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.38em] text-white/50">VIT Chennai</p>
              <p className="font-display text-lg text-white">Event Hub Pro</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-white/70 lg:flex">
            <a href="#experience" className="transition hover:text-white/90">
              Experience
            </a>
            <a href="#pillars" className="transition hover:text-white/90">
              Why it works
            </a>
            <a href="#journey" className="transition hover:text-white/90">
              Journey
            </a>
            <a href="#events" className="transition hover:text-white/90">
              Explore events
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/admin/login"
              className="hidden rounded-full border border-white/20 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-white/70 transition hover:border-sky-400/60 hover:text-white lg:inline-flex"
            >
              Admin access
            </a>
            <a
              href="#events"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500/70 via-indigo-500/60 to-fuchsia-500/60 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5 hover:shadow-fuchsia-500/30"
            >
              Browse live
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      <section
        id="experience"
        className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-28 pt-16 sm:pt-24 lg:flex-row lg:items-center"
      >
        <div className="relative flex-1 space-y-9">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
            Ignite campus energy
          </span>
          <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            The creative HQ for every VIT Chennai event — orchestrated for discovery.
          </h1>
          <p className="max-w-2xl text-lg text-white/70 sm:text-xl">
            A luminous dashboard built for busy students and ambitious organizers. Navigate the semester, uncover
            unexpected collabs, and keep your calendar in flow with a single immersive platform.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#events"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 px-7 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-fuchsia-500/30"
            >
              Explore now
            </a>
            <a
              href="/admin/login"
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-7 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-white/80 transition hover:border-sky-400/60 hover:text-white"
            >
              Launch admin suite
            </a>
          </div>

          <dl className="grid gap-6 pt-8 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.07] p-6 text-center shadow-xl ring-1 ring-white/15 backdrop-blur-lg transition hover:border-sky-400/40 hover:bg-white/10"
              >
                <span className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(circle at top, rgba(56,189,248,0.25), transparent 65%)" }} />
                <dt className="text-xs uppercase tracking-[0.35em] text-white/60">{stat.label}</dt>
                <dd className="mt-4 font-display text-3xl text-white sm:text-4xl">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <div className="rounded-[2.2rem] border border-white/5 bg-white/[0.04] p-6 shadow-[0_20px_80px_-50px_rgba(94,234,212,0.55)] backdrop-blur">
            <p className="text-[0.68rem] uppercase tracking-[0.35em] text-white/50">Trusted collaborators</p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {partners.map((partner) => (
                <div key={partner.name} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <span className="text-sm font-medium text-white/85">{partner.name}</span>
                  <span className="text-[0.6rem] uppercase tracking-[0.38em] text-white/45">{partner.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex-1">
          <div className="pointer-events-none absolute -top-10 left-10 -z-10 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.15),_transparent_65%)] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 right-5 -z-10 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.2),_transparent_68%)] blur-3xl" />

          <div className="relative overflow-hidden rounded-[2.8rem] border border-white/10 bg-white/5 p-6 shadow-[0_45px_150px_-60px_rgba(79,70,229,0.75)] backdrop-blur">
            <div className="pointer-events-none absolute -right-12 top-6 h-48 w-48 rounded-full bg-[radial-gradient(circle,_rgba(147,197,253,0.2),_transparent_65%)] blur-2xl" />
            <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.3em] text-white/60">
              <span>Spotlight</span>
              <span>Live this week</span>
            </div>

            <div className="mt-6 space-y-5">
              <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-sky-400/50">
                <div className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(79,70,229,0.2),_transparent_70%)] blur-2xl" />
                <p className="text-xs uppercase tracking-[0.35em] text-sky-200">New drop</p>
                <h2 className="mt-3 font-display text-2xl text-white">Quantum Creators Hackathon</h2>
                <p className="mt-2 text-sm text-white/70">
                  Build the future of AI + IoT with hybrid teams. Mentors from industry-leading labs, midnight jam
                  sessions, and a finale under the lights.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-white/60">
                  <span className="rounded-full bg-sky-500/20 px-3 py-1 text-sky-100">Mar 14–16</span>
                  <span className="rounded-full bg-white/10 px-3 py-1">12 team slots left</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/5 bg-white/5 p-4 transition hover:-translate-y-1 hover:border-emerald-300/50">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Masterclass</p>
                  <h3 className="mt-2 font-display text-lg text-white">Designing for campus impact</h3>
                  <p className="mt-1 text-xs text-white/60">Future-ready UX principles with alumni mentors.</p>
                </div>
                <div className="rounded-3xl border border-white/5 bg-white/5 p-4 transition hover:-translate-y-1 hover:border-amber-300/50">
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Festival</p>
                  <h3 className="mt-2 font-display text-lg text-white">Eunoia Cultural Week</h3>
                  <p className="mt-1 text-xs text-white/60">Sonic nights, film pop-ups, and creator showcases.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pillars" className="mx-auto w-full max-w-6xl px-4 pb-24">
        <div className="flex flex-col gap-10 rounded-[3rem] border border-white/5 bg-white/[0.03] p-10 shadow-[0_40px_120px_-50px_rgba(14,165,233,0.55)] backdrop-blur-lg lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <span className="text-xs uppercase tracking-[0.35em] text-sky-200">Designed with intent</span>
            <h2 className="font-display text-3xl text-white sm:text-4xl">
              Why Event Hub Pro outshines every campus bulletin board you have ever seen.
            </h2>
            <p className="text-white/70">
              From immersive discovery to admin-grade workflows, every pixel is crafted to empower VIT’s creative
              ecosystem.
            </p>
          </div>

          <div className="flex-1 space-y-5">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="group rounded-3xl border border-white/5 bg-white/5 p-5 transition hover:border-sky-400/40 hover:bg-white/10"
              >
                <h3 className="font-display text-xl text-white">{pillar.title}</h3>
                <p className="mt-2 text-sm text-white/70">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="journey" className="mx-auto w-full max-w-6xl px-4 pb-28">
        <div className="rounded-[3rem] border border-white/5 bg-white/[0.04] p-10 backdrop-blur">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-[0.35em] text-white/60">How it unfolds</span>
              <h2 className="font-display text-3xl text-white sm:text-4xl">
                A cinematic journey from the moment an event is dreamt to the second you walk in.
              </h2>
              <p className="text-white/70">
                We choreographed the entire event lifecycle — students experience clarity, organizers get velocity, and
                administrators gain the transparency they trust.
              </p>
            </div>

            <div className="grid gap-6">
              {timeline.map((phase, index) => {
                const stageNumber = String(index + 1).padStart(2, "0");

                return (
                  <div
                    key={phase.title}
                    className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg transition hover:-translate-y-1 hover:border-sky-400/40`}
                  >
                    <div className={`absolute inset-y-0 right-[-30%] w-2/3 bg-gradient-to-br ${phase.accent} blur-3xl opacity-60`} />
                    <div className="relative space-y-3">
                      <p className="text-xs uppercase tracking-[0.35em] text-white/50">Stage {stageNumber}</p>
                      <h3 className="font-display text-xl text-white">{phase.title}</h3>
                      <p className="text-sm text-white/70">{phase.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-12">
        <div className="rounded-[3rem] border border-white/5 bg-white/5 p-10 text-center shadow-[0_30px_120px_-50px_rgba(168,85,247,0.6)] backdrop-blur">
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">for organizers</p>
          <h2 className="mt-4 font-display text-3xl text-white sm:text-4xl">
            Ready to headline the next big experience?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70">
            Submit rich media, manage approvals, and analyze performance in a single place that feels as creative as your
            event. Event Hub Pro is the cinematic stage your ideas deserve.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/admin/login"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400 px-6 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:-translate-y-0.5"
            >
              Launch admin suite
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="#events"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/80 transition hover:border-sky-400/60 hover:text-white"
            >
              Preview live events
            </a>
          </div>
        </div>
      </section>

      <div id="events" className="pb-20">
        <EventsExplorer />
      </div>
    </main>
  );
}
