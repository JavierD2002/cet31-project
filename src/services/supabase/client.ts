
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Default to empty strings if environment variables are not available
// This will prevent runtime errors, but Supabase functions won't work until proper values are provided
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Check if Supabase is properly configured
export const isSupabaseConfigured = supabaseUrl !== 'https://placeholder-url.supabase.co' && supabaseKey !== 'placeholder-key'
