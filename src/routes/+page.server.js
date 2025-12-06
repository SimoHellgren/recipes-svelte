import * as db from '$lib/db'

export async function load({ locals: { supabase } }) {
    const { data } = await db.getAllRecipes(supabase);

    return {
        recipes: data ?? [],
    };
}

