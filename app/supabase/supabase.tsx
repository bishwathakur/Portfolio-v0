import {createClient} from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
