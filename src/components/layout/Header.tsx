import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { CalendarDays, Menu, X, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Discover", path: "/" },
  { label: "Highlights", path: "/#highlights" },
  { label: "Calendar", path: "/#calendar" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    if (path.includes("#")) {
      const hash = `#${path.split("#")[1]}`;
      return location.hash === hash;
    }

    return location.pathname === path;
  };

  const handleNavClick = (path: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (path.includes("#")) {
      event.preventDefault();
      const hash = path.split("#")[1];
      const target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `/#${hash}`);
      }
      setMobileMenuOpen(false);
    } else {
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-[hsl(230_60%_8%/0.9)] via-[hsl(230_60%_8%/0.6)] to-transparent backdrop-blur-lg border-b border-[hsl(228_36%_22%/0.35)]">
      <div className="container flex h-20 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="glow-ring flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(225_85%_60%/0.25)] to-[hsl(216_100%_60%/0.25)]">
            <CalendarDays className="h-6 w-6 text-accent" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm uppercase tracking-[0.35em] text-muted-foreground">VIT CHENNAI</span>
            <span className="text-2xl font-bold font-heading gradient-text leading-tight">Event Atlas</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={handleNavClick(path)}
              className={cn(
                "text-sm font-medium tracking-wide transition-all duration-200",
                "text-muted-foreground/80 hover:text-foreground",
                isActive(path) && "text-foreground drop-shadow-[0_0_12px_hsl(var(--primary)/0.45)]"
              )}
            >
              {label}
            </Link>
          ))}
          <div className="hidden xl:flex items-center gap-2 border-l border-[hsl(228_36%_22%/0.6)] pl-6 text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
            <img src="/ospc-logo.png" alt="OSPC Logo" className="h-5 w-5" />
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Open Source Programming Club
          </div>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-muted-foreground"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-t border-[hsl(228_36%_22%/0.35)]">
          <nav className="container py-6 space-y-4">
            {NAV_LINKS.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                onClick={handleNavClick(path)}
                className={cn(
                  "block rounded-xl px-4 py-3 text-base font-medium transition-all",
                  "bg-gradient-to-r from-transparent to-transparent hover:from-[hsl(225_84%_20%/0.55)] hover:to-[hsl(225_84%_25%/0.55)]",
                  isActive(path) && "text-foreground"
                )}
              >
                {label}
              </Link>
            ))}

            <div className="pt-4 border-t border-[hsl(228_36%_22%/0.35)] text-xs uppercase tracking-[0.35em] text-muted-foreground/60">
              Made by students of OSPC
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
