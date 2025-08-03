import {
  CreateEventDto,
  EventDto,
  EventsResponseDto,
  RsvpDto,
} from "@app/types";
import { apiClient } from "@app/lib/api-client";

export const eventsService = {
  async getEvents(page = 1, limit = 10): Promise<EventsResponseDto> {
    try {
      const response = await apiClient<EventsResponseDto>({
        url: `/events?page=${page}&limit=${limit}`,
        method: "GET",
      });
      return response;
    } catch (error) {
      throw new Error((error as Error)?.message || "Failed to get events.");
    }
  },

  async createEvent(event: CreateEventDto): Promise<EventDto> {
    try {
      const response = await apiClient<EventDto>({
        url: "/events",
        method: "POST",
        body: event,
        credentials: "include",
      });
      return response;
    } catch (error) {
      throw new Error((error as Error)?.message || "Failed to create event.");
    }
  },

  async getEventById(id: number): Promise<EventDto> {
    try {
      const response = await apiClient<EventDto>({
        url: `/events/${id}`,
        method: "GET",
      });
      return response;
    } catch (error) {
      throw new Error((error as Error)?.message || "Failed to get event.");
    }
  },

  async myEvents(): Promise<EventDto[]> {
    try {
      const response = await apiClient<EventDto[]>({
        url: "/events/my",
        method: "GET",
        credentials: "include",
      });
      return response;
    } catch (error) {
      throw new Error((error as Error)?.message || "Failed to get my events.");
    }
  },

  async createRSVP(eventId: number): Promise<void> {
    try {
      await apiClient({
        url: `/events/${eventId}/rsvp`,
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      throw new Error((error as Error)?.message || "Failed to create RSVP.");
    }
  },

  async deleteRSVP(eventId: number): Promise<void> {
    try {
      await apiClient({
        url: `/events/${eventId}/rsvp`,
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      throw new Error((error as Error)?.message || "Failed to delete RSVP.");
    }
  },

  async getMyRSVPs(): Promise<RsvpDto[]> {
    try {
      const response = await apiClient<RsvpDto[]>({
        url: "/events/rsvp/my",
        method: "GET",
        credentials: "include",
      });
      return response;
    } catch (error) {
      throw new Error((error as Error)?.message || "Failed to get my RSVPs.");
    }
  },

  async getRSVPs(eventId: number): Promise<RsvpDto[]> {
    try {
      const response = await apiClient<RsvpDto[]>({
        url: `/events/${eventId}/rsvp`,
        method: "GET",
        credentials: "include",
      });
      return response;
    } catch (error) {
      throw new Error((error as Error)?.message || "Failed to get RSVPs.");
    }
  },
};
