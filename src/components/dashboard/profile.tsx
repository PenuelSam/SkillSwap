"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";

type Profile = {
  id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  socials: Record<string, string> | null;
  about?: string | null; // 👈 if you have "about" in your table
};

type SkillPost = {
  id: string;
  title: string;
  type: "want" | "offer";
  tags: string[] | null;
};

export default function ProfilePage({ userId }: { userId?: string }) {
  const loggedInUser = useUser();
  const effectiveUserId = userId || loggedInUser?.id;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<SkillPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!effectiveUserId) return;

    const fetchData = async () => {
      setLoading(true);

      const { data: profileData } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", effectiveUserId)
        .single();

      setProfile(profileData);

      const { data: skillsData } = await supabaseClient
        .from("skill_posts")
        .select("*")
        .eq("user_id", effectiveUserId);

      setSkills(skillsData || []);
      setLoading(false);
    };

    fetchData();
  }, [effectiveUserId]);

  if (!effectiveUserId) return <p>No user selected.</p>;
  if (loading) return <p className="text-center">Loading profile...</p>;
  if (!profile) return <p className="text-center">No profile found.</p>;

  const wants = skills.filter((s) => s.type === "want");
  const offers = skills.filter((s) => s.type === "offer");

  return (
    <div className="w-full md:bg-white bg-gray-50 p-4 ">
      {/* 🔹 White profile card */}
      <div className="w-full mx-auto bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row items-start gap-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.display_name || "User Avatar"}
               width={100}
               height={100}
              className="w-full h-full object-cover"
              unoptimized={true}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="md:text-[36px] text-[28px] tracking-tight font-HelveticaBold">
            {profile.display_name || "Anonymous"}
          </h1>
          <p className="md:text-[18px] text-[16px] font-HelveticaLight">
            @{profile.display_name}
          </p>
          <p className="md:text-[18px] text-[16px] font-HelveticaLight">
            {profile.bio}
          </p>
          <p className="md:text-[18px] text-[16px] font-HelveticaLight">
            {profile.location}
          </p>

          {/* Current Role Pill */}
          <span className="inline-block mt-3 px-3 py-1 rounded-full bg-gray-100 text-sm font-HelveticaLight">
            Software Engineer
          </span>
        </div>

        {/* Actions */}
        <Link href={`/dashboard/profile/edit`} className="flex gap-3 ml-auto">
          <button className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 cursor-pointer">
            Edit Profile
          </button>
        </Link>
      </div>

      {/* 🔹 Activity / Highlights */}
      <div className="w-full mx-auto mt-8 bg-white p-6 rounded-xl shadow flex justify-around text-center">
        <div>
          <p className="text-2xl font-HelveticaBold">{offers.length}</p>
          <p className="text-sm font-HelveticaLight text-gray-500">Skills Offered</p>
        </div>
        <div>
          <p className="text-2xl font-HelveticaBold">{wants.length}</p>
          <p className="text-sm font-HelveticaLight text-gray-500">Skills Wanted</p>
        </div>
        <div>
          <p className="text-2xl font-HelveticaBold">{skills.length}</p>
          <p className="text-sm font-HelveticaLight text-gray-500">Total Posts</p>
        </div>
      </div>

      {/* 🔹 Bio & About */}
      <div className="w-full mx-auto mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="md:text-[28px] text-[20px] tracking-tight font-HelveticaBold">
            About
          </h2>
          <p className="md:text-[18px] text-[16px] font-HelveticaLight">
            {profile.about || profile.bio || "No about info provided."}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="md:text-[28px] text-[20px] font-HelveticaBold">Socials</h2>
          <div className="flex gap-4 mt-2">
            {profile.socials?.linkedin && (
              <a href={profile.socials.linkedin} className="text-blue-600">
                LinkedIn
              </a>
            )}
            {profile.socials?.twitter && (
              <a href={profile.socials.twitter} className="text-blue-400">
                Twitter
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 🔹 Skills */}
      <div className="w-full mx-auto mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="md:text-[28px] text-[20px] font-HelveticaBold">Skills to Teach</h2>
          <div className="flex flex-wrap gap-2">
            {offers.flatMap((s) => s.tags || []).map((tag) => (
              <span
                key={tag}
                className="md:text-[14px] text-[12px] font-HelveticaLight px-3 py-1 rounded-full border text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="md:text-[28px] text-[20px] font-HelveticaBold">Skills to Learn</h2>
          <div className="flex flex-wrap gap-2">
            {wants.flatMap((s) => s.tags || []).map((tag) => (
              <span
                key={tag}
                className="md:text-[14px] text-[12px] font-HelveticaLight px-3 py-1 rounded-full border text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 Looking For */}
      <div className="w-full mx-auto mt-8 bg-white p-6 rounded-xl shadow">
        <h2 className="md:text-[28px] text-[20px] font-HelveticaBold mb-2">Looking For</h2>
        <p className="md:text-[16px] text-[14px] font-HelveticaLight text-gray-700">
          {wants.length > 0
            ? `Looking for people who can teach ${wants.flatMap((s) => s.tags || []).join(", ")}`
            : "Not specified yet."}
        </p>
      </div>
    </div>
  );
}
