import { supabase } from "$lib/supabaseClient";

export async function load({ params }) {
    const { data, error } = await supabase
        .from("ingredient")
        .select()
        .order("name")

    return {
        ingredients: data
    };
}
