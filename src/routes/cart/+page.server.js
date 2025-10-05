import { getCartState } from "$lib/state.svelte"

import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { cartSchema } from "./cartSchema";

export async function load({ parent, locals: { supabase } }) {
    // TODO: filter these to avoid loading everything every time
    const { data, error } = await supabase
        .from("recipe")
        .select(`
            id, name, section (assembly(quantity, unit, ingredient(name)))    
        `)

    const ingredients = data.map(recipe =>
        recipe.section.map(section =>
            section.assembly.map(a => ({
                recipe_id: recipe.id,
                recipe_name: recipe.name,
                ingredient: a.ingredient.name,
                quantity: a.quantity,
                unit: a.unit
            }))
        ).flat()).flat()


    // TODO: populate with the actual data
    const form = await superValidate(zod(cartSchema));

    console.log(form)
    return { ingredients, form }
}