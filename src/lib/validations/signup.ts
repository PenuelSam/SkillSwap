import { z } from "zod"

export const signupSchema = z.object({
    email: z.email("Invalid email address"),
    password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
})

export type SignupSchema = z.infer<typeof signupSchema>