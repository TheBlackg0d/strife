import { z } from "zod";

export const BIO_MAX_LENGTH = 190;

export const profileValidationSchema = z.object({
  username: z.string().trim().min(1, "Le nom d'utilisateur est requis"),
  email: z.email("Adresse e-mail invalide"),
  bio: z
    .string()
    .max(BIO_MAX_LENGTH, `${BIO_MAX_LENGTH} caractères maximum`),
});
