// src/lib/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Ensure the environment variables are not undefined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key');
}

// Create and export the Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
