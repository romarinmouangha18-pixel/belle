import { createClient } from "@/lib/supabase/server";

export async function getCurrentUserAndProfile() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null };
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return { user, profile };
}

export async function requireAdmin() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) return { authorized: false, reason: "guest" as const, user: null, profile: null };
  if (profile?.role !== "admin")
    return { authorized: false, reason: "forbidden" as const, user, profile };
  return { authorized: true, reason: null, user, profile };
}
