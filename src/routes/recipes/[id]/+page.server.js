import * as db from '$lib/db'

export async function load({ params, locals: { supabase } }) {
    const { data: recipe, error } = await db.getRecipeById(supabase, params.id)

    return {
        recipe,
        id: params.id,
    };
}
