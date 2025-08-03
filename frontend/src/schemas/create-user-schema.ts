import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z
    .string()
    .transform((val) => (val.trim() === "" ? undefined : val))
    .optional()
    .refine((val) => !val || /^\+?[0-9\-()\s]+$/.test(val), {
      message: "Phone number must start with + or digits",
    }),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
