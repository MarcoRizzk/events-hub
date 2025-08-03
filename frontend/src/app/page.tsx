import HomeClient from "@app/components/home-client";
import type { EventsResponseDto } from "@app/types";

export const revalidate = 60; // ISR 60s // if we want SSR remove revalidate so data will be fetched on every request

interface PageProps {
  params: Promise<{ page: string }>;
}

// Pre-render first 5 pages
export async function generateStaticParams() {
  return Array.from({ length: 5 }, (_, i) => ({ page: String(i + 1) }));
}

export default async function Home({ params }: PageProps) {
  const { page: pageParam } = await params;
  const page = Number(pageParam ?? 1);
  const limit = 10;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_Server_BASE_URL}/events?page=${page}&limit=${limit}`,
    {
      next: { revalidate }, // ISR caching
    }
  );

  const eventsResponse: EventsResponseDto = await res.json();

  return (
    <HomeClient
      initialEvents={eventsResponse.data}
      totalPages={eventsResponse.totalPages || 1}
      initialPage={page}
      limit={limit}
    />
  );
}
