"use client";

import React from "react";
import { RsvpDto } from "@app/types";
import Link from "next/link";

interface MyRsvpCardProps {
  rsvp: RsvpDto;
  onDelete: (id: number) => void;
  deleting?: boolean;
}

export default function MyRsvpCard({
  rsvp,
  onDelete,
  deleting,
}: MyRsvpCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {rsvp.event?.title || "Untitled Event"}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          RSVP by: <span className="font-medium">{rsvp.userName}</span> (
          {rsvp.userEmail})
        </p>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/events/${rsvp.eventId}`}
          className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          View Event
        </Link>
        <button
          onClick={() => onDelete(rsvp.id)}
          disabled={deleting}
          className={`px-4 py-2 text-sm font-medium rounded-md transition 
            ${
              deleting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
        >
          {deleting ? "Removing..." : "Cancel RSVP"}
        </button>
      </div>
    </div>
  );
}
