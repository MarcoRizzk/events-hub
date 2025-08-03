import { EventDto } from "./event.dto";

export interface EventsResponseDto {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
  data: EventDto[];
}
