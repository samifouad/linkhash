---
import { supabase } from '../db/supabase'

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