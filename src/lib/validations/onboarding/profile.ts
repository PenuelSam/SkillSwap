import { z } from "zod";

export const profileSchema = z.object({
    display_name: z.string().min(2, "Too short").max(50, "Too long"),
    bio: z.string().max(200, "Too long").optional(),
   location: z.string().optional(),
  avatar_url: z.url().optional().or(z.literal("")),
  socials: z
    .object({
      linkedin: z.url().optional().or(z.literal("")),
      twitter: z.url().optional().or(z.literal("")),
      github: z.url().optional().or(z.literal("")),
    })
    .optional(),
  about: z.string().optional(),
})

export type ProfileSchema = z.infer<typeof profileSchema>

export const offerSkillsSchema = z.object({
    skills: z.array(z.string()).min(1, "Please select at least one skill"),
});

export type OfferSkillsData = z.infer<typeof offerSkillsSchema>;

export const wantSkillsSchema = z.object({
    skills: z.array(z.string()).min(1, "Please select at least one skill"),
});

export type WantSkillsData = z.infer<typeof wantSkillsSchema>;