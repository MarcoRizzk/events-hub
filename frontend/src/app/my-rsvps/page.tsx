"use client";

import React, { useEffect, useState } from "react";
import { RsvpDto } from "@app/types";
import { eventsService } from "@app/services/events";
import MyRsvpCard from "@app/components/my-rsvp-card";
import Spinner from "@app/components/spinner";
import toastr from "react-hot-toast";

export default function MyRsvpsPage() {
  const [rsvps, setRsvps] = useState<RsvpDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMyRsvps = async () => {
      try {
        const data = await eventsService.getMyRSVPs();
        setRsvps(data);
      } catch (error) {
        toastr.error("Failed to load your RSVPs");
      } finally {
        setLoading(false);
      }
    };

    fetchMyRsvps();
  }, []);

  const handleDeleteRsvp = async (id: number) => {
    setDeletingId(id);
    try {
      await eventsService.deleteRSVP(id);
      setRsvps((prev) => prev.filter((rsvp) => rsvp.id !== id));
      toastr.success("RSVP canceled successfully");
    } catch (error) {
      toastr.error((error as Error)?.message || "Failed to cancel RSVP");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner /> <span className="ml-2">Loading your RSVPs...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My RSVPs</h1>

        {rsvps.length === 0 ? (
          <p className="text-gray-600">You haven’t RSVP’d to any events yet.</p>
        ) : (
          <div className="space-y-4">
            {rsvps.map((rsvp) => (
              <MyRsvpCard
                key={rsvp.id}
                rsvp={rsvp}
                deleting={deletingId === rsvp.id}
                onDelete={handleDeleteRsvp}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
