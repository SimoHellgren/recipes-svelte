import { supabase } from "$lib/supabaseClient";

export async function load({ params }) {
    const { data: recipe } = await supabase.from("recipe").select(
        `*,
         section ( *, assembly ( *, ingredient ( name )) ) )
        `
    ).eq("id", params.id).single();

    // split what shall be split here
    recipe.method = recipe.method.split("\n")
    recipe.notes = recipe.notes?.split("\n")

    return {
        recipe,
        id: params.id,
    };
}
