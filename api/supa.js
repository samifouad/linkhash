import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github'
      })
    
    
    return new Response(
        JSON.stringify(data), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
        }
    );
}