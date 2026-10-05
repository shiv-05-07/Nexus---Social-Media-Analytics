import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getEnvVar = (nodeKey: string, viteKey: string): string => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      if (process.env[nodeKey]) return process.env[nodeKey] as string;
      if (process.env[viteKey]) return process.env[viteKey] as string;
    }
  } catch {
    // Ignore error
  }
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any)?.env) {
      if ((import.meta as any).env[viteKey]) return (import.meta as any).env[viteKey];
      if ((import.meta as any).env[nodeKey]) return (import.meta as any).env[nodeKey];
    }
  } catch {
    // Ignore error
  }
  return '';
};

const supabaseUrl = getEnvVar('SUPABASE_URL', 'VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY');

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return supabaseClient;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
}

