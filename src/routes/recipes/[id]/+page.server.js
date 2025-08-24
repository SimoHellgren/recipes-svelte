import { supabase } from "$lib/supabaseClient";

export async function load({ params }) {
    const { data } = await supabase.from("recipe").select(
        `*,
         section ( *, assembly ( *, ingredient ( name )) ) )
        `
    ).eq("id", params.id).single();

    // split what shall be split here
    data.method = data.method.split("\n")
    data.notes = data.notes.split("\n")

    return data ?? {};
}
