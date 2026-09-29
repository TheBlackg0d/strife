import { z } from "zod";

export const addFriendValidationSchema = z.object({
  username: z.string().trim().min(1, "Le nom d'utilisateur est requis"),
});

export type AddFriendFormValues = z.infer<typeof addFriendValidationSchema>;
