import { Calendar, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Calendar className="h-4 w-4" />
            </div>
            <span className="font-heading font-semibold">VIT Chennai Event Hub</span>
          </div>
          
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made by students of the Open Source Programming Club
            <Heart className="h-3 w-3 text-accent fill-accent" />
          </p>
          
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              Events
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
