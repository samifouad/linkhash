import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://api.linkha.sh'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNld2ZneG90aXpoZ3Bzd2pva21lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzNTUyMDEsImV4cCI6MjAyODkzMTIwMX0.aP2tliq9lIclBY_oZ71hTSurfFp8nqrcEnRjj4pJYY8'

// that's not a private key. it's an anonymous key used to identify client and upgrade user to their actual authenticated jwt

export const supabase = createClient(supabaseUrl, supabaseKey);