import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {

    const { data, error } = await supabase
                                    .from("todos")
                                    .select('*')
    
    
    return new Response(
        JSON.stringify(data), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
        }
    );
}