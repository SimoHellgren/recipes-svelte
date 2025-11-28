import { supabase } from "$lib/supabaseClient";

export async function load({ params }) {
    const { data: ingredients, error } = await supabase
        .from("ingredient")
        .select()
        .order("name")

    const { data, tError } = await supabase
        .from("recipe")
        .select(
            `id, name, section(assembly (ingredient ( id, name )) ) )`
        )
        .order("name")

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
