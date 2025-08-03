import React from "react";
import { EventDto } from "@app/types";
import { formatDate } from "@app/lib/helpers";

interface EventCardProps {
  event: EventDto;
  onJoinEvent?: (eventId: number) => void;
  onViewDetails?: (eventId: number) => void;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onJoinEvent,
  onViewDetails,
  className = "",
}) => {
  const {
    title,
    description,
    date,
    location,
    maxAttendees,
    id,
    currentAttendees,
  } = event;

  const attendancePercentage = (currentAttendees / maxAttendees) * 100;
  const isFullyBooked = currentAttendees >= maxAttendees;

  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 ${className}`}
    >
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{formatDate(date)}</p>
          </div>

          <div className="flex-shrink-0">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isFullyBooked
                  ? "bg-red-100 text-red-800"
                  : attendancePercentage > 80
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {currentAttendees}/{maxAttendees} attendees
            </span>
          </div>
        </div>

        <p className="text-gray-700 text-sm mt-3 line-clamp-2 sm:line-clamp-3">
          {description}
        </p>

        <div className="flex items-center mt-3 text-sm text-gray-600">
          <svg
            className="w-4 h-4 mr-2 flex-shrink-0"
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
          <span className="truncate">{location}</span>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Attendance</span>
            <span>{Math.round(attendancePercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isFullyBooked
                  ? "bg-red-500"
                  : attendancePercentage > 80
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(id)}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              View Details
            </button>
          )}

          {onJoinEvent && (
            <button
              onClick={() => onJoinEvent(id)}
              disabled={isFullyBooked}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                isFullyBooked
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
              }`}
            >
              {isFullyBooked ? "Fully Booked" : "Join Event"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
