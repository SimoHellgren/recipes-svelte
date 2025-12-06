// recipe stuff
export const getAllRecipes = async (supabase) => {
    const { data, error } = await supabase.from("recipe").select().order("name");

    return { data, error }
}

export const getRecipeById = async (supabase, id) => {
    const { data, error } = await supabase
        .from("recipe")
        .select(
            `*,
         section( *, assembly ( *, ingredient ( * )) ) )
        `
        )
        .eq("id", id)
        .order("position", { referencedTable: "section" })
        .order("position", { referencedTable: "section.assembly" })
        .single();

    // split what shall be split here
    data.method = data.method.split("\n")
    data.notes = data.notes?.split("\n")

    return { data, error }
}


// ingredient stuff

export const getOrCreateIngredients = async (supabase, ingredients) => {
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