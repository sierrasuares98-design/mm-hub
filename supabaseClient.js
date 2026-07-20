import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://momgienonbheowhlkkoe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vbWdpZW5vbmJoZW93aGxra29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0MDM2MDQsImV4cCI6MjA5OTk3OTYwNH0.V5x8MAYS8vWjWOoc8hbQjYO56bkeBwOY0OxoDns0VcY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
