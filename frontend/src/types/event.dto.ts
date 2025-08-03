import { CreateEventDto } from "./create-event.dto";

export interface EventDto extends CreateEventDto {
  id: number;
  currentAttendees: number;
  createdBy: number;
}
