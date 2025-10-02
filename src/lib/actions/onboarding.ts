"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../supabaseServer";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { profileSchema, type ProfileSchema } from "../validations/onboarding/profile";

// 🚀 Update profile
export async function updateProfileAction(values: ProfileSchema) {
  try {
    const parsed = profileSchema.parse(values);
    const supabase =  createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) throw new Error("Not authenticated");

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      display_name: parsed.display_name,
      bio: parsed.bio,
      about: parsed.about,
      location: parsed.location,
      socials: parsed.socials,
      avatar_url: parsed.avatar_url,
    });

    if (error) throw error;

    // revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (err) {
    console.error("❌ updateProfileAction failed:", err);
    return { error: "Failed to update profile" };
  }
}

// 🚀 Save offer skills
export async function saveOfferSkills(skills: string[]) {
  try {
    const supabase =  createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Not authenticated");
    }

    // delete old
    await supabase
      .from("user_skills")
      .delete()
      .eq("user_id", user.id)
      .eq("type", "offer");

    // insert new
    if (skills.length > 0) {
      const { error: insertError } = await supabase.from("user_skills").insert(
        skills.map((skill) => ({
          user_id: user.id,
          skill,
          type: "offer",
        }))
      );
      if (insertError) throw insertError;
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("❌ saveOfferSkills failed:", err);
    return { error: "Failed to save offer skills" };
  }
}

// 🚀 Save want skills
export async function saveWantSkills(skills: string[]) {
  try {
    const supabase =  createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Not authenticated");
    }

    // delete old
    await supabase
      .from("user_skills")
      .delete()
      .eq("user_id", user.id)
      .eq("type", "want");

    // insert new
    if (skills.length > 0) {
      const { error: insertError } = await supabase.from("user_skills").insert(
        skills.map((skill) => ({
          user_id: user.id,
          skill,
          type: "want",
        }))
      );
      if (insertError) throw insertError;
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("❌ saveWantSkills failed:", err);
    return { error: "Failed to save want skills" };
  }
}
