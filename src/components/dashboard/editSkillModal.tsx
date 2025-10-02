"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabaseClient } from "@/lib/supabaseClient";
import { skillPostSchema, SkillPostSchema } from "@/lib/validations/skillPost";
import { useState, useEffect } from "react";
import { Database } from "@/lib/database.types";

type SkillPost = Database["public"]["Tables"]["skill_posts"]["Row"];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  skill: SkillPost | null; // ✅ Use Supabase row type
};

export default function EditSkillModal({ isOpen, onClose, onSuccess, skill }: Props) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillPostSchema>({
    resolver: zodResolver(skillPostSchema),
  });

  // Reset form when skill changes
  useEffect(() => {
    if (skill) {
      reset({
        type: skill.type as "offer" | "want", // ✅ cast
        title: skill.title,
        description: skill.description || "",
        tags: skill.tags ? skill.tags.join(", ") : "", // ✅ convert array → string
      });
    }
  }, [skill, reset]);

  const onSubmit = async (values: SkillPostSchema) => {
    if (!skill) return;

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error("Not logged in");
      setLoading(false);
      return;
    }

    const { error } = await supabaseClient
      .from("skill_posts")
      .update({
        type: values.type,
        title: values.title,
        description: values.description,
        tags: values.tags ? values.tags.split(",").map((t) => t.trim()) : null,
      })
      .eq("id", skill.id)
      .eq("user_id", user.id); // ✅ only allow user’s own skills

    setLoading(false);

    if (error) {
      console.error("Error updating skill post:", error.message);
      return;
    }

    reset();
    onSuccess();
    onClose();
  };

  if (!isOpen || !skill) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 font-HelveticaLight">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 font-HelveticaBold">Edit Skill</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              {...register("type")}
              className="w-full border rounded-lg p-2 outline-none cursor-pointer"
            >
              <option value="">Select type</option>
              <option value="offer">Offer</option>
              <option value="want">Want</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type.message}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              {...register("title")}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              {...register("description")}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
              rows={3}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              {...register("tags")}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
