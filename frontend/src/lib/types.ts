export type EventSourceType = "scraper" | "manual" | "sheet";
export type EventStatus = "pending" | "approved" | "rejected";

export interface Event {
  _id: string;
  name: string;
  organizer: string;
  category: string;
  venue: string;
  startDate: string;
  endDate: string;
  deadline: string;
  time: string;
  fee: string;
  description: string;
  sourceLink: string;
  sourceType: EventSourceType;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: "superadmin" | "editor";
}

export interface LoginResponse {
  token: string;
  admin: AdminUser;
}
