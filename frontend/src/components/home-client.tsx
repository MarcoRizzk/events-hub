"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EventDto } from "@app/types";
import EventCard from "@app/components/event-card";
import Spinner from "@app/components/spinner";
import { eventsService } from "@app/services/events";

interface HomeClientProps {
  initialEvents: EventDto[];
  totalPages: number;
  initialPage: number;
  limit: number;
}

export default function HomeClient({
  initialEvents,
  totalPages: initialTotalPages,
  initialPage,
  limit,
}: HomeClientProps) {
  const [events, setEvents] = useState<EventDto[]>(initialEvents);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync page state with URL when navigating
  useEffect(() => {
    const urlPage = Number(searchParams.get("page") ?? 1);
    if (urlPage !== page) {
      setPage(urlPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Fetch new page of events client-side (CSR)
  useEffect(() => {
    // Skip fetch for first render (SSR data already loaded)
    if (page === initialPage) return;

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsResponse = await eventsService.getEvents(page, limit);
        setEvents(eventsResponse.data);
        setTotalPages(eventsResponse.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page, limit, initialPage]);

  // Change page & push to URL for SEO/shareable links
  const changePage = (newPage: number) => {
    router.push(`/?page=${newPage}`);
  };

  return (
    <div className="flex flex-col px-5 gap-6 pt-5 mx-auto">
      <div className="text-2xl font-bold">All Events</div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner /> Loading events...
        </div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-600 py-10">No events found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onViewDetails={() => router.push(`/events/${event.id}`)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              onClick={() => changePage(Math.max(1, page - 1))}
              disabled={page === 1 || loading}
              className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-100"
            >
              Previous
            </button>

            <span className="text-gray-700 text-sm">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => changePage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages || loading}
              className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
