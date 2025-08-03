import { z } from "zod";

export const CreateEventSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(2, "Location is required"),
  date: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
    message: "Please select a valid date",
  }),
  maxAttendees: z.coerce
    .number()
    .positive("Max attendees must be a positive number")
    .min(1, "Max attendees must be at least 1"),
});
