"use client";

import { Database } from "@/lib/database.types";

type SkillPost = Database["public"]["Tables"]["skill_posts"]["Row"];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  skill: SkillPost | null;
};

export default function ViewDetailsModal({ isOpen, onClose, skill }: Props) {
  if (!isOpen || !skill) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 font-HelveticaLight">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6">
        {/* Header */}
        <h2 className="text-xl font-semibold mb-4 font-HelveticaBold">
          Skill Details
        </h2>

        {/* Body */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="text-base font-medium text-gray-900">
              {skill.type === "offer" ? "Offering" : "Wanting"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Title</p>
            <p className="text-base font-medium text-gray-900">{skill.title}</p>
          </div>

          {skill.description && (
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-base text-gray-700">{skill.description}</p>
            </div>
          )}

          {skill.tags && skill.tags.length > 0 && (
            <div>
              <p className="text-sm text-gray-500">Tags</p>
              <p className="text-base text-gray-700">
                {skill.tags.join(", ")}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="text-base text-gray-700">
              {skill.created_at
                ? new Date(skill.created_at).toLocaleDateString()
                : "Unknown date"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
