"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
};

type Match = {
  offer_user_id: string;
  // other match fields...
};

export default function MatchSuggestions({ userId }: { userId: string }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMatchesAndProfiles = async () => {
      setLoading(true);

      // Fetch matches for user
      const { data: matchData, error: matchError } = await supabaseClient.rpc(
        "find_skill_matches_with_score",
        { current_user_id: userId }
      );

      if (matchError) {
        console.error("Error fetching matches:", matchError);
        setLoading(false);
        return;
      }

      const matches: Match[] = matchData || [];
      setMatches(matches);

      // Extract unique user IDs from matches to fetch their profiles
      const userIds = Array.from(new Set(matches.map((m) => m.offer_user_id)));

      if (userIds.length === 0) {
        setProfiles({});
        setLoading(false);
        return;
      }

      // Fetch profiles for the matching users
      const { data: profileData, error: profileError } = await supabaseClient
        .from("profiles")
        .select("id, display_name, avatar_url")
        .in("id", userIds);

      if (profileError) {
        console.error("Error fetching profiles:", profileError);
        setLoading(false);
        return;
      }

      // Map profiles by user id for fast access
      const profileMap: Record<string, Profile> = {};
      (profileData || []).forEach((profile) => {
        profileMap[profile.id] = profile;
      });
      setProfiles(profileMap);

      setLoading(false);
    };

    if (userId) {
      fetchMatchesAndProfiles();
    }
  }, [userId]);

  if (loading) return <p>Loading suggestions...</p>;
  if (matches.length === 0) return <p className="p-4 text-center text-gray-500">No match suggestions found.</p>;

  return (
    <div className="flex flex-col  rounded-lg shadow-sm bg-gray-50  gap-4 p-4 overflow-y-auto">
        <h2 className="md:text-[18px] text-[16px] md:leading-[1.8] leading-[1.6] tracking-tight font-HelveticaBold">
          Who you match with
        </h2>
      {matches.map((match, idx) => {
        const profile = profiles[match.offer_user_id];
        return (
          <div
            key={match.offer_user_id + idx}
            className="flex items-center gap-4 p-2 "
          >
            <Link href={`/dashboard/profile/${match.offer_user_id}`} className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile?.display_name || "User Avatar"}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    unoptimized={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">?</div>
                )}
              </div>
              <div>
                <p className="text-base font-HelveticaBold text-gray-900">
                  {profile?.display_name || "Anonymous"}
                </p>
              </div>
            </Link>
            <button
              type="button"
              className="px-3 py-1 bg-black text-white font-HelveticaMid rounded-full hover:bg-gray-800 text-sm"
              onClick={() => alert(`Connect feature not implemented yet for ${match.offer_user_id}`)}
            >
              Connect
            </button>
          </div>
        );
      })}
      <div>
        <Link href="/dashboard/matches">
            <p className="text-sm text-gray-500 hover:underline cursor-pointer font-HelveticaMid">Show more</p>
        </Link>
      </div>
    </div>
  );
}
