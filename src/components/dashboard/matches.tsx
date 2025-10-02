"use client";

import { useEffect, useState, useMemo } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { VscArrowSwap } from "react-icons/vsc";
import { CgSortAz } from "react-icons/cg";
import Link from "next/link";

type Match = {
  want_id: string;
  want_title: string;
  want_tags: string[] | null;
  offer_id: string;
  offer_title: string;
  offer_tags: string[] | null;
  offer_user_id: string;
  offer_display_name: string | null; // 👈 added
  score: number;
};


export default function MatchesPage({ userId }: { userId: string }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"score" | "tags">("score");

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      const { data, error } = await supabaseClient.rpc(
        "find_skill_matches_with_score",
        { current_user_id: userId }
      );

      if (error) {
        console.log("Error fetching matches:", error);
      } else {
        setMatches(data || []);
      }
      setLoading(false);
    };

    fetchMatches();
  }, [userId]);

  // Sort / Filter logic
  const sortedMatches = useMemo(() => {
    if (sortBy === "tags") {
      return [...matches].sort((a, b) => {
        const overlapA =
          a.want_tags?.filter((tag) => b.offer_tags?.includes(tag)) ?? [];
        const overlapB =
          b.want_tags?.filter((tag) => a.offer_tags?.includes(tag)) ?? [];
        return overlapB.length - overlapA.length;
      });
    }
    return [...matches].sort((a, b) => b.score - a.score);
  }, [matches, sortBy]);

  if (loading) return <p>Loading matches...</p>;

  return (
    <div className="w-full mx-auto lg:px-6 ">
      <h1 className="md:text-[36px] text-[28px] md:leading-[1.8] leading-[1.6] tracking-tight font-HelveticaBold">
        Skill Matches
      </h1>
      <p className="md:text-[18px] text-[16px] md:leading-[1.8] leading-[1.6] font-HelveticaLight mb-8">
        People looking for skills you offer
      </p>

      {/* Sorting dropdown */}
      {matches.length > 0 && (
        <div className="mb-6 flex items-center">
          <label className="md:text-[18px] text-[16px] font-HelveticaLight flex items-center mr-4">
            <CgSortAz fontSize={30}/>
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "score" | "tags")}
            className="cursor-pointer border border-[#111] rounded-lg px-3 py-1 md:text-[18px] text-[16px] font-HelveticaLight"
          >
            <option value="score">Score</option>
            <option value="tags">Tags</option>
          </select>
        </div>
      )}

      {matches.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg border">
          <p className="text-gray-600 mb-4">
            No matches found yet. Add more skills to improve your chances!
          </p>
          <Link
            href="/dashboard/skills"
            className="inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Add Skills
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedMatches.map((match) => {
            const initials = match.offer_user_id.substring(0, 2).toUpperCase();
            const scorePercent = Math.min(
              100,
              Math.round((match.score / 6) * 100)
            );

            // Find overlapping tags
            const overlappingTags =
              match.want_tags?.filter((tag) =>
                match.offer_tags?.includes(tag)
              ) ?? [];

            return (
              <div
                key={`${match.want_id}-${match.offer_id}`}
                className="flex md:flex-row flex-col md:items-center md:justify-between p-4 bg-white shadow rounded-lg gap-4 md:gap-0"
              >
                {/* Left: Avatar + Info */}
                <div className="flex md:items-center md:space-x-4 space-x-2">
                  <div className="w-[2.5rem] h-[2.5rem] md:w-[3rem] md:h-[3rem] flex items-center justify-center rounded-full bg-[#007bff50] text-white font-bold">
                    {initials}
                  </div>
                  <div>
                    <Link
      href={`/u/${match.offer_display_name || "user"}-${match.offer_user_id}`}
      className="md:text-[25px] text-[18px] tracking-tight font-HelveticaMid hover:underline"
    >
      {match.offer_display_name || `User ${match.offer_user_id.slice(0, 6)}...`}
    </Link>
                    <p className="md:text-[14px] text-[12px] font-HelveticaLight">
                      Active recently
                    </p>
                    <p className="text-green-600 font-semibold mb-1 md:text-[14px] text-[12px] hidden md:flex md:mt-2">
                      {scorePercent}% match
                    </p>
                  </div>
                </div>

                {/* Middle: Wants ↔ Offers */}
                <div className="">
                  <div className="flex items-center md:justify-center md:gap-4 gap-2">
                    <div className="flex flex-col items-center">
                      {/* <p className="text-[12px] md:text-[14px] text-[#007AFF] md:w-20 md:flex items-center justify-center md:bg-[#007bff50] rounded-lg hidden px-2 py-1 font-HelveticaMid">
                        Wants
                      </p> */}
                      <h2 className="font-HelveticaMid text-[14px] md:text-[18px]">
                        {match.want_title}
                      </h2>
                    </div>
                    <VscArrowSwap
                      fontSize={20}
                      className="hidden md:flex text-gray-400"
                    />
                    <VscArrowSwap
                      fontSize={15}
                      className="flex md:hidden text-gray-400"
                    />
                    <div className="flex flex-col items-center">
                      {/* <p className="text-[12px] md:text-[14px] rounded-lg text-[#007AFF] w-20 md:flex items-center justify-center bg-[#007bff50] px-2 py-1 hidden font-HelveticaMid">
                        Offers
                      </p> */}
                      <h2 className="font-HelveticaMid text-[14px] md:text-[18px]">
                        {match.offer_title}
                      </h2>
                    </div>
                  </div>

                  {/* Tag highlighting */}
                  {overlappingTags.length > 0 && (
                    <p className="md:text-[14px] text-[12px]  font-HelveticaBold mt-2">
                      Matched on tags:{" "}
                      <span className="md:text-[14px] text-[12px] rounded-lg capitalize font-HelveticaMid">
                        {overlappingTags.join(", ")}
                      </span>
                    </p>
                  )}
                </div>

                {/* Right: Connect button */}
                <div className="flex items-end justify-between">
                  <p className="text-green-600 font-semibold mb-1 md:text-[14px] text-[12px] flex md:hidden">
                    {scorePercent}% match
                  </p>
                  <button className="border border-[#111] px-4 py-1 rounded-lg font-HelveticaLight cursor-pointer hover:bg-black hover:text-white hover:border-none md:text-[18px] text-[16px] transition">
                    Connect
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
