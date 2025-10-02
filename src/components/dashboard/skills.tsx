"use client";

import { supabaseClient } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { FiEdit3 } from "react-icons/fi";
import SkillPostModal from "./skillPostModal";
import EditSkillModal from "./editSkillModal";
import ViewDetailsModal from "./viewDetailsModal";
import { Database } from "@/lib/database.types";

type SkillPost = Database["public"]["Tables"]["skill_posts"]["Row"];

export const SkillsPage = () => {
  const [skills, setSkills] = useState<SkillPost[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ one selected skill for edit/view
  const [selectedSkill, setSelectedSkill] = useState<SkillPost | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);

    const {
  data: { user },
} = await supabaseClient.auth.getUser();

if(user) {
const { data, error } = await supabaseClient
      .from("skill_posts")
      .select("*")
      .eq("user_id", user.id) 
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching skills:", error);
    } else {
      setSkills(data || []);
    }
    
  };

  setLoading(false);
}

    

  const modalSuccess = async () => {
    await fetchSkills();
  };

  return (
    <main className="flex-1 overflow-auto  bg-gray-50">
      <div className="w-full mx-auto   lg:px-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="md:text-[36px] text-[28px] md:leading-[1.8] leading-[1.6] tracking-tight font-HelveticaBold">My Skills</h1>
            <p className="md:text-[18px] text-[16px] md:leading-[1.8] leading-[1.6] font-HelveticaLight">
              Manage the skills you offer and want to learn
            </p>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="hidden md:flex items-center px-4 py-2   bg-black text-white text-[12px] md:text-[14px]  font-HelveticaMid rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <BiPlus size={16} className="mr-2" />
           Add New Skill
          </button>
           <button
            onClick={() => setAddModalOpen(true)}
            className="fixed bottom-5 right-5 flex items-center px-4 py-4 md:hidden text-white bg-black  rounded-lg cursor-pointer"
          >
            <BiPlus size={20} />
          </button>
        </div>

        {/* Skills Grid */}
        {loading ? (
          <p className="text-md md:text-lg tracking-tight font-HelveticaLight">Loading...</p>
        ) : skills.length === 0 ? (
          <p className="text-md md:text-lg tracking-tight font-HelveticaLight">
            No skills added yet. Click &apos;Add New Skill&apos; to get started!
          </p>
        ) : (
          <div className="grid grid-cols-1  gap-6">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="bg-white rounded-2xl shadow-sm flex flex-col gap-4  border-gray-200 p-6"
              >
                <div className="flex justify-between items-start ">
                  <div className="flex-1">
                    <h2 className="md:text-[25px] text-[20px] tracking-tight font-HelveticaMid">
                      {skill.title}
                    </h2>
                    <p className="md:text-[18px] text-[16px] md:leading-[1.8] leading-[1.6] tracking-tight font-HelveticaLight">
                      {skill.description}
                    </p>
                  </div>
                  <button
                    className="p-1 hover:bg-gray-100 rounded cursor-pointer "
                    onClick={() => {
                      setSelectedSkill(skill);
                      setEditModalOpen(true);
                    }}
                  >
                    <FiEdit3 size={16} className="text-gray-400" />
                  </button>
                </div>

                <div className="flex items-center justify-between ">
                  <span className="text-[12px] md:text-[14px] rounded-lg text-[#007AFF]  bg-[#007bff2a] px-2 py-1  font-HelveticaMid">
                    {skill.type === "offer" ? "Offer" : "Want"}
                  </span>
                  <span className="md:text-[14px] text-[12px] rounded-lg capitalize font-HelveticaMid">
                    {skill.tags?.join(", ")}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-5">
                  <span className="md:text-[14px] text-[12px] font-HelveticaLight">
                    {skill.created_at
                      ? new Date(skill.created_at).toLocaleDateString()
                      : "Unknown date"}
                  </span>
                  <button
                    className="border border-[#111] px-4 py-1 rounded-lg font-HelveticaLight  cursor-pointer hover:bg-black hover:text-white hover:border-none md:text-[14px] text-[12px] transition"
                    onClick={() => {
                      setSelectedSkill(skill);
                      setViewModalOpen(true);
                    }}
                  >
                    View Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Add Modal */}
      <SkillPostModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={modalSuccess}
      />

      {/* ✅ Edit Modal */}
      {selectedSkill && (
        <EditSkillModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          skill={selectedSkill}
          onSuccess={modalSuccess}
        />
      )}

      {/* ✅ View Modal */}
      {selectedSkill && (
        <ViewDetailsModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          skill={selectedSkill}
        />
      )}
    </main>
  );
};
