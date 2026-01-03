import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export type FoodItemRow = {
  id: string
  created_at: string
  user_id: string
  name: string
  quantity: number
  date_added: string
  storage: string
  shelf_life: number
}

export type FoodItemInsert = {
  id?: string
  created_at?: string
  user_id: string
  name: string
  quantity?: number
  date_added?: string
  storage: string
  shelf_life?: number
}

export type FoodItemUpdate = {
  id?: string
  created_at?: string
  user_id?: string
  name?: string
  quantity?: number
  date_added?: string
  storage?: string
  shelf_life?: number
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
