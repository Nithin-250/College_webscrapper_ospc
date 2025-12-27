import { Link } from "react-router-dom";
import {
  CalendarRange,
  Sparkle,
  Orbit,
  ArrowUpRight,
} from "lucide-react";
import {
  VIBRANCE_DAYS,
  VIBRANCE_HIGHLIGHTS,
  VIBRANCE_INFO_CARDS,
} from "@/data/vibrance";
import { cn } from "@/lib/utils";

const pulseBadges = [
  "Hackathons",
  "Cultural Nights",
  "Workshops",
  "Industry Talks",
  "Sports Fests",
];

export function HeroSection() {
  const handleBrowseClick = () => {
    if (typeof window === "undefined") return;
    const target = document.getElementById("events");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", "/#events");
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(225_84%_16%/_0.65),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,_hsl(228_67%_16%)_0%,_hsl(225_84%_18%)_48%,_hsl(222_88%_10%)_100%)]" />
      <div className="absolute inset-0 opacity-60 mix-blend-screen pointer-events-none">
        <div className="absolute -top-28 -left-16 h-72 w-72 rounded-full bg-[hsl(225_84%_61%/0.45)] blur-[140px]" />
        <div className="absolute bottom-[-6rem] right-[-4rem] h-96 w-96 rounded-full bg-[hsl(16_92%_66%/0.35)] blur-[160px]" />
      </div>

      <div className="relative container py-20 md:py-28">

        <div className="grid items-start gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-7">
            <div className="flex flex-wrap items-center gap-3">
              <div className="aurora-chip inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground/75">
                <Sparkle className="h-3.5 w-3.5 text-accent" />
                Open Source Programming Club
              </div>
              <span className="rounded-full border border-[hsl(225_84%_61%/0.35)] bg-[hsl(226_46%_12%/0.55)] px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-muted-foreground/70">
                Campus Edition 2026
              </span>
            </div>

            <h1 className="text-balance font-heading text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] text-foreground drop-shadow-[0_12px_55px_hsl(225_84%_25%/0.55)]">
              Discover the pulse shaping VIT Chennai
            </h1>

            <p className="max-w-2xl text-lg md:text-xl text-muted-foreground/95">
              From founder meetups to midnight flash mobs, Event Atlas captures the experiences igniting campus life. Every story is curated live by the Open Source Programming Club community.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleBrowseClick}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[hsl(225_84%_61%)] to-[hsl(216_100%_66%)] px-7 py-3 text-sm font-semibold text-white shadow-[0_25px_60px_-25px_hsl(225_84%_61%/0.85)] transition-transform hover:-translate-y-0.5"
              >
                Browse live experiences
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <Link
                to="/event/featured"
                className="inline-flex items-center gap-2 rounded-full border border-[hsl(225_84%_55%/0.45)] bg-[hsl(225_40%_12%/0.65)] px-7 py-3 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
              >
                See feature spotlight
              </Link>
              <a
                href="#calendar"
                className="inline-flex items-center gap-2 rounded-full border border-[hsl(225_44%_26%/0.5)] bg-[hsl(226_46%_10%/0.55)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground/80 hover:text-foreground"
              >
                Plan with calendar
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              {pulseBadges.map((label) => (
                <div
                  key={label}
                  className="aurora-chip inline-flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/80"
                >
                  <Orbit className="h-3.5 w-3.5 text-primary" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aurora-card relative p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_transparent,_hsl(228_45%_12%/_0.55))]" />
              <div className="relative space-y-7">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground/80">Next Up</span>
                  <span className="rounded-full border border-[hsl(16_92%_66%/0.4)] bg-[hsl(16_92%_66%/0.1)] px-3 py-1 text-[11px] font-semibold text-accent">
                    Vibrance 2026
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="font-heading text-2xl font-semibold text-foreground">
                    VIT Chennai announces Vibrance 2026
                  </p>
                  <p className="text-sm text-muted-foreground/90">
                    February 18 – 21 · Four days of performances, competitions, and celebrations honouring 15 years of VIT Chennai.
                  </p>
                </div>

                <div className="grid gap-4 pt-2">
                  <div className="grid gap-3 md:grid-cols-3">
                    {VIBRANCE_INFO_CARDS.map(({ label, value, caption, accent }) => (
                      <div
                        key={label}
                        className={cn(
                          "rounded-2xl border border-[hsl(225_84%_61%/0.35)] bg-[hsl(228_45%_18%/0.35)] px-4 py-3 backdrop-blur",
                          accent && "border-[hsl(16_92%_66%/0.55)] bg-[hsl(16_92%_22%/0.25)]"
                        )}
                      >
                        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground/70">{label}</p>
                        <p className={cn("font-heading text-lg", accent ? "text-accent" : "text-foreground")}>{value}</p>
                        {caption && <p className="text-xs text-muted-foreground/80">{caption}</p>}
                      </div>
                    ))}
                  </div>

                  <div className="rounded-3xl border border-[hsl(225_84%_61%/0.35)] bg-[hsl(228_45%_18%/0.3)] p-4">
                    <p className="mb-3 text-xs uppercase tracking-[0.35em] text-muted-foreground/70">Virtual calendar</p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {VIBRANCE_DAYS.map((day) => (
                        <div
                          key={day.date}
                          className="relative overflow-hidden rounded-2xl border border-[hsl(225_84%_61%/0.35)] bg-[hsl(226_46%_12%/0.75)] px-4 py-5"
                        >
                          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100 bg-[radial-gradient(circle_at_top,_hsl(225_84%_45%/0.35),_transparent_65%)]" />
                          <div className="relative space-y-2">
                            <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground/70">{day.label}</p>
                            <p className="font-heading text-3xl text-foreground">{day.date}</p>
                            <p className="text-xs text-muted-foreground/80">{day.focus}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {VIBRANCE_HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-[hsl(225_84%_61%/0.25)] bg-[hsl(225_40%_12%/0.6)] p-4 backdrop-blur"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-accent" />
                        <p className="text-sm font-semibold text-foreground">{title}</p>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground/85">{description}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-[hsl(225_84%_61%/0.25)] bg-[hsl(225_40%_12%/0.6)] px-5 py-4 text-sm">
                  <div className="flex flex-col gap-1 text-muted-foreground/80">
                    <span className="flex items-center gap-2">
                      <CalendarRange className="h-4 w-4 text-primary" />
                      Built by students for the VIT community.
                    </span>
                    <span className="text-xs text-muted-foreground/70">
                      All experiences surface automatically from the live Event Hub spreadsheet curated by OSPC volunteers.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
