import { z } from "zod";

// Zod schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  username: z.string().nullable(),
  avatar_url: z.string().url().nullable(),
  role: z.enum(["student", "admin", "instructor"]), // You can extend roles here
  bio: z.string().nullable(),
  social_links: z.record(z.string(), z.string()).nullable(), // JSONB with key-value pairs
  last_active_at: z.coerce.date().nullable(),
  preferences: z.record(z.string(), z.any()).nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
});

// TypeScript type inferred from Zod schema
export type UserType = z.infer<typeof UserSchema>;
