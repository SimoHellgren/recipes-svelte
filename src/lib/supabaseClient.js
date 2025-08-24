import { createClient } from '@supabase/supabase-js';
// import { VITE_PUBLIC_SUPABASE_URL, VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';

// using VITE_* didn't work for some reason - should probably look into that
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY)
