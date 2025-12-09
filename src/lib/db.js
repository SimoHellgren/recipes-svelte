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

    return { data, error }
}

export const createRecipe = async (supabase, data) => {
    const { data: dbData, error } = await supabase.from("recipe").insert(data).select().single()

    return { data: dbData, error }
}


// ingredient stuff
export const getIngredientsByName = async (supabase, names) => {
    // names is an array of strings. Should perhaps use typescript
    const { data, error } = await supabase
        .from("ingredient")
        .select()
        .in("name", names)

    return { data, error }
}

export const createIngredients = async (supabase, data) => {
    // data shall be array of ingredients

    const { data: dbData, error } = await supabase
        .from("ingredient")
        .insert(data)
        .select()

    return { data: dbData, error }
}

export const getOrCreateIngredients = async (supabase, ingredients) => {
    // ingredients shall have names, i.e. be "whole" objects like {id: null, name: "foo", ...} 

    // check which rows exist
    const { data: dbIngredients, getError } = await getIngredientsByName(supabase, ingredients.map(i => i.name))

    // create missing ingredients
    const ingredientsToCreate = ingredients.filter(i => !dbIngredients.some(x => x.name === i.name))

    const { data: createdIngredients, error: createError } = await createIngredients(
        supabase,
        ingredientsToCreate.map(i => ({ name: i.name }))
    )

    return {
        data: [...dbIngredients, ...createdIngredients],
        error: {
            getError,
            createError
        }
    }
}

// section stuff
export const createSections = async (supabase, data) => {
    const { data: dbData, error } = await supabase
        .from("section")
        .insert(data)
        .select()

    return { data: dbData, error }
}

// assembly stuff
export const createAssemblies = async (supabase, data) => {
    const { data: dbData, error } = await supabase
        .from("assembly")
        .insert(data)
        .select()

    return { data: dbData, error }
}
