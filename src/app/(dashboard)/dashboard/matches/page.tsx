"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import MatchesPage from "@/components/dashboard/matches";

export default function MatchesDashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      setUserId(user?.id ?? null);
      setLoading(false);
    };

    getUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!userId) return <p>Please log in</p>;

  return <MatchesPage userId={userId} />;
}
