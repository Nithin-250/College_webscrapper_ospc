import { PartyPopper, Palette, Trophy, type LucideIcon } from "lucide-react";

export interface VibranceDay {
  label: string;
  date: string;
  focus: string;
}

export interface VibranceHighlight {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface VibranceInfoCard {
  label: string;
  value: string;
  caption?: string;
  accent?: boolean;
}

export const VIBRANCE_DAYS: VibranceDay[] = [
  { label: "Wed", date: "18", focus: "Opening Parade" },
  { label: "Thu", date: "19", focus: "Creative Labs" },
  { label: "Fri", date: "20", focus: "Marathon Performances" },
  { label: "Sat", date: "21", focus: "Grand Finale" },
];

export const VIBRANCE_HIGHLIGHTS: VibranceHighlight[] = [
  {
    icon: PartyPopper,
    title: "Live performances",
    description: "Headliners, indie talent, and collaborative jam sessions across four stages.",
  },
  {
    icon: Palette,
    title: "Cultural showcases",
    description: "Departments and clubs reimagining traditions with immersive exhibits.",
  },
  {
    icon: Trophy,
    title: "15-year celebration",
    description: "Competitions, championships, and an alumni homecoming to mark the milestone.",
  },
];

export const VIBRANCE_INFO_CARDS: VibranceInfoCard[] = [
  {
    label: "Event",
    value: "Vibrance 2026",
    caption: "VIT Chennai Cultural Fest",
  },
  {
    label: "Venue",
    value: "VIT Chennai Campus",
    caption: "Main lawns & amphitheatre",
  },
  {
    label: "Dates",
    value: "Feb 18 - 21, 2026",
    caption: "Four luminous days",
    accent: true,
  },
];
