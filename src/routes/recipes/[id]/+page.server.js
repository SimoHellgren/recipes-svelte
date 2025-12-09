import * as db from '$lib/db'

export async function load({ params, locals: { supabase } }) {
    const { data: recipe } = await db.getRecipeById(supabase, params.id)

    // split strings to arrays for display purposes
    recipe.method = recipe.method.split("\n")
    recipe.notes = recipe.notes?.split("\n")

    return {
        recipe,
        id: params.id,
    };
}
