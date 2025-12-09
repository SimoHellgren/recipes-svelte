import * as db from '$lib/db'

export async function load({ params, locals: { supabase } }) {
    const { data: ingredients } = await db.getAllIngredients(supabase);

    const { data } = await db.getAllRecipeDetails(supabase); // technically overfetches but oh well

    const recipes = data.map(r => ({
        id: r.id,
        name: r.name,
        ingredients: r.section.map(s => s.assembly).flat().map(a => a.ingredient)
    }));

    return {
        ingredients,
        recipes
    };
}
