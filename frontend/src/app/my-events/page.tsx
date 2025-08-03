"use client";

import { EventDto } from "@app/types";
import { useEffect, useState } from "react";
import { eventsService } from "@app/services/events";
import EventCard from "@app/components/event-card";
import { useRouter } from "next/navigation";

export default function MyEvents() {
  const [events, setEvents] = useState<EventDto[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const events = await eventsService.myEvents();
      setEvents(events);
    };
    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col px-5 gap-4 pt-5">
      <div className="text-2xl font-bold">My Events</div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onViewDetails={() => router.push(`/events/${event.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
