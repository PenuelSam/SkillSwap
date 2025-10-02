// lib/supabaseDirect.ts
import { createClient } from "@supabase/supabase-js";

export const supabaseDirect = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
