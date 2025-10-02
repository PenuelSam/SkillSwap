import * as z from "zod";

export const skillPostSchema = z.object({
  type: z.enum(["offer", "want"]).refine((val) => !!val, {
    message: "Please select whether this is an offer or want",
  }),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  tags: z.string().optional(),
});

export type SkillPostSchema = z.infer<typeof skillPostSchema>;
