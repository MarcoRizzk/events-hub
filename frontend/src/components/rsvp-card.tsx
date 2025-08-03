"use client";

import React from "react";
import { RsvpDto } from "@app/types";

interface RsvpCardProps {
  rsvp: RsvpDto;
  onCancel?: (rsvpId: number) => void;
  className?: string;
}

const RsvpCard: React.FC<RsvpCardProps> = ({
  rsvp,
  onCancel,
  className = "",
}) => {
  return (
    <div
      className={`w-full bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 gap-4">
        <div className="flex items-center gap-4 w-full">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
            {rsvp.userName.charAt(0).toUpperCase()}
          </div>

          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-gray-900 truncate">
              {rsvp.userName}
            </span>
            <span className="text-gray-500 text-sm truncate">
              {rsvp.userEmail}
            </span>
            <span className="text-gray-400 text-xs mt-1">
              RSVP for Event #{rsvp.eventId}
            </span>
          </div>
        </div>

        {onCancel && (
          <button
            onClick={() => onCancel(rsvp.id)}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400 transition"
          >
            Cancel RSVP
          </button>
        )}
      </div>
    </div>
  );
};

export default RsvpCard;
