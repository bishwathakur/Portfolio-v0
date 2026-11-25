import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  return (client ??= createClient(url, key));
}

// Types for our blog data
export interface Blog {
	id: string;
	slug: string;
	title: string;
	content: string;
	date: string;
	read_time?: string;
	tags: string[];
	created_at: string;
	updated_at: string;
}
