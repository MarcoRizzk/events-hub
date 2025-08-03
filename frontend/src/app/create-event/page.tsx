"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toastr from "react-hot-toast";
import EventForm from "@app/components/event-form";
import { eventsService } from "@app/services/events";
import { CreateEventDto } from "@app/types";
import { CreateEventSchema } from "@app/schemas";
import z from "zod";
import Spinner from "@app/components/spinner";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateEventDto>({
    title: "",
    description: "",
    location: "",
    date: "",
    maxAttendees: 0,
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validatedEvent = CreateEventSchema.parse(formData);

      const createdEvent = await eventsService.createEvent(validatedEvent);
      toastr.success("Event created successfully");
      router.push(`/events/${createdEvent.id}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toastr.error(error.issues[0].message);
      } else {
        toastr.error((error as Error)?.message || "Failed to create event");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <Spinner /> Creating event...
        </div>
      ) : (
        <div className="max-w-4xl w-full">
          <EventForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}
