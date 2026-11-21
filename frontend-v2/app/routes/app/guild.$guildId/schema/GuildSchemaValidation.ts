import * as z from "zod";

export const GuildSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Le nom du serveur est requis")
    .max(100, "Le nom du serveur ne peut pas dépasser 100 caractères"),
  icon: z.instanceof(File).optional(),
  owner: z.object({
    id: z.string(),
    username: z.string(),
  }),
  members: z
    .array(
      z.object({
        id: z.string(),
        username: z.string(),
      }),
    )
    .optional(),
});

export type GuildSchemaType = z.infer<typeof GuildSchema>;
