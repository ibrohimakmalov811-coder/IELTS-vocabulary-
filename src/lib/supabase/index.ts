import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pkyiagebdtsrgjbseukz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export * from './client';
export * from './server';
export * from './admin';
