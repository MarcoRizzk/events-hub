"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { EventDto, RsvpDto } from "@app/types";
import { formatDate } from "@app/lib/helpers";
import { eventsService } from "@app/services/events";
import { useAuth } from "@app/lib/auth-context";
import Spinner from "@app/components/spinner";
import toastr from "react-hot-toast";
import RsvpCard from "@app/components/rsvp-card";
import { io, Socket } from "socket.io-client";

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const eventId = Number(params?.id);
  const [event, setEvent] = useState<EventDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvps, setRsvps] = useState<RsvpDto[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!eventId) return;
    eventsService
      .getEventById(eventId)
      .then((data) => setEvent(data))
      .catch(() => toastr.error("Failed to load event"))
      .finally(() => setLoading(false));
  }, [eventId]);

  useEffect(() => {
    if (isAuthenticated && user && event?.createdBy === user.id) {
      eventsService
        .getRSVPs(eventId)
        .then((data) => setRsvps(data))
        .catch(() => toastr.error("Failed to load RSVPs"))
        .finally(() => setLoading(false));
    }
  }, [eventId, isAuthenticated, user, event]);

  useEffect(() => {
    if (!eventId) return;

    const s = io("http://localhost:3000/events", {
      withCredentials: true,
      transports: ["websocket"],
    });

    s.emit("joinEvent", eventId);

    s.on(
      "attendeesUpdated",
      (data: { eventId: number; attendeesCount: number }) => {
        if (data.eventId === eventId) {
          setEvent((prev) =>
            prev ? { ...prev, currentAttendees: data.attendeesCount } : prev
          );
        }
      }
    );

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [eventId]);

  const handleRsvp = async () => {
    if (!isAuthenticated) {
      toastr.error("Please log in to RSVP");
      router.push(`/login?redirect=/events/${eventId}`);
      return;
    }

    if (event?.createdBy === user?.id) {
      toastr.error("You cannot RSVP for your own event");
      return;
    }

    if (event!.currentAttendees! >= event!.maxAttendees!) {
      toastr.error("Event is fully booked");
      return;
    }

    try {
      setRsvpLoading(true);
      await eventsService.createRSVP(eventId);
      toastr.success("You have successfully RSVP’d!");
      // No need to manually increment attendees here
      // WebSocket will handle real-time update
    } catch (error) {
      toastr.error(
        (error as Error)?.message || "Failed to RSVP. Try again later."
      );
    } finally {
      setRsvpLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Spinner /> <span className="ml-2">Loading event...</span>
      </div>
    );
  }

  if (!event)
    return (
      <div className="p-10 text-center text-gray-600">Event not found.</div>
    );

  const attendancePercentage =
    (event.currentAttendees / event.maxAttendees) * 100;
  const isFullyBooked = event.currentAttendees >= event.maxAttendees;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-10 sm:px-10">
          <h1 className="text-3xl sm:text-4xl font-bold">{event.title}</h1>
          <p className="text-gray-100 mt-2">{formatDate(event.date)}</p>
          <div className="flex items-center gap-2 mt-4 text-gray-100 text-sm">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{event.location}</span>
          </div>
        </div>

        <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                About this event
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {event.description}
              </p>
            </div>

            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Attendance</span>
                <span>{Math.round(attendancePercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    isFullyBooked
                      ? "bg-red-500"
                      : attendancePercentage > 80
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {event.currentAttendees} / {event.maxAttendees} attendees
              </p>
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col justify-between space-y-4">
            <div className="p-5 border rounded-lg shadow-sm bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                RSVP for this event
              </h3>
              <button
                onClick={handleRsvp}
                disabled={
                  isFullyBooked || rsvpLoading || event.createdBy === user?.id
                }
                className={`w-full px-5 py-3 rounded-lg text-white text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                  isFullyBooked || event.createdBy === user?.id
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                }`}
              >
                {isFullyBooked
                  ? "Fully Booked"
                  : event.createdBy === user?.id
                  ? "You created this event"
                  : rsvpLoading
                  ? "RSVP..."
                  : isAuthenticated
                  ? "RSVP Now"
                  : "Login to RSVP"}
              </button>
              {!isAuthenticated && (
                <p className="mt-3 text-xs text-gray-500 text-center">
                  You need to be logged in to RSVP.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* RSVPs Section for Event Creator */}
      {event.createdBy === user?.id && (
        <div className="max-w-5xl mx-auto mt-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">RSVPs</h2>
          {rsvps.length > 0 ? (
            rsvps.map((rsvp) => <RsvpCard key={rsvp.id} rsvp={rsvp} />)
          ) : (
            <p className="text-gray-600">No RSVPs yet for this event.</p>
          )}
        </div>
      )}
    </div>
  );
}
