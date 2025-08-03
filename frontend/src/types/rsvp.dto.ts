export interface RsvpDto {
  id: number;
  eventId: number;
  userEmail: string;
  userName: string;
  event?: {
    title: string;
  };
}
