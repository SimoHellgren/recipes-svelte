import { supabase } from "$lib/supabaseClient";


export const getOrCreateIngredients = async (ingredients) => {
    //ingredients shall have names

    // check which rows exist
    const { data: dbIngredients } = await supabase
        .from("ingredient")
        .select()
        .in("name", ingredients.map(i => i.name))

    // create missing ingredients
    const ingredientsToCreate = ingredients.filter(i => !dbIngredients.some(x => x.name === i.name))

    const { data: createdIngredients, error: ingredientError } = await supabase
        .from("ingredient")
        .insert(
            ingredientsToCreate.map(i => ({ name: i.name }))
        ).select()

    const allIngredients = [...dbIngredients, ...createdIngredients]

    return allIngredients
}