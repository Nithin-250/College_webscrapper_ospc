import api from "./api";
import type { Event, EventStatus } from "./types";

export interface EventFilters {
  search?: string;
  category?: string;
  fee?: string;
  startDate?: string;
  endDate?: string;
  status?: EventStatus;
}

export const fetchEvents = async (filters: EventFilters = {}) => {
  const { data } = await api.get<Event[]>("/events", {
    params: filters,
  });

  return data;
};

export const fetchEventById = async (id: string) => {
  const { data } = await api.get<Event>(`/events/${id}`);
  return data;
};
