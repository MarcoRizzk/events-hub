"use client";

import React from "react";
import { CreateEventDto } from "@app/types";

interface EventFormProps {
  formData: CreateEventDto;
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
}

export default function EventForm({
  formData,
  onChange,
  onSubmit,
  loading = false,
}: EventFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white shadow rounded-lg p-6 w-full max-w-2xl mx-auto border border-gray-200"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Create a New Event
      </h2>

      <div className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => onChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter event title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onChange("description", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter event description"
            rows={4}
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => onChange("location", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="City, Venue, etc."
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date & Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={formData.date}
            onChange={(e) => onChange("date", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        {/* Max Attendees */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Attendees <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={1}
            value={formData.maxAttendees}
            onChange={(e) => onChange("maxAttendees", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter maximum attendees"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-200"
        >
          {loading ? "Creating Event..." : "Create Event"}
        </button>
      </div>
    </form>
  );
}
