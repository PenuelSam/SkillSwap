"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { skillPostSchema, SkillPostSchema } from "@/lib/validations/skillPost";
import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // refresh skills after success
};

export default function SkillPostModal({ isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillPostSchema>({
    resolver: zodResolver(skillPostSchema),
  });

  const onSubmit = async (values: SkillPostSchema) => {
    setLoading(true);

    // ✅ Get logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error("User not logged in");
      setLoading(false);
      return;
    }

    // ✅ Insert skill post with user_id
    const { error } = await supabaseClient.from("skill_posts").insert([
      {
        type: values.type,
        title: values.title,
        description: values.description,
        tags: values.tags ? values.tags.split(",").map((t) => t.trim()) : null,
        user_id: user.id, // 👈 matches your RLS policy
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Error creating skill post:", error.message);
      return;
    }

    reset();
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 md:px-0  bg-black/50 font-HelveticaLight">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 font-HelveticaBold">Add New Skill</h2>

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
              placeholder="e.g. I can teach JavaScript"
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
              placeholder="Add details (optional)"
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
              placeholder="e.g. javascript, coding, frontend"
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
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
