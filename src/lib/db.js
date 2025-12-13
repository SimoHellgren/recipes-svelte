// recipe stuff
export const getAllRecipes = async (supabase) => {
    const { data, error } = await supabase.from("recipe").select().order("name");

    return { data, error }
}

export const getAllRecipeDetails = async (supabase) => {
    const { data, error } = await supabase
        .from("recipe")
        .select(
            `*,
         section( *, assembly ( *, ingredient ( * )) ) )
        `
        )
        .order("name")
        .order("position", { referencedTable: "section" })
        .order("position", { referencedTable: "section.assembly" })

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

export const updateRecipe = async (supabase, data) => {
    const { id, ...dataIn } = data;

    // this function probably should be fed with already-sanitized data,
    // i.e. a valid "recipe" object
    const { data: dbData, error } = await supabase
        .from("recipe")
        .update({
            name: dataIn.name,
            tags: dataIn.tags,
            source: dataIn.source,
            method: dataIn.method,
            notes: dataIn.notes || null,
            yield_quantity: dataIn.yield.quantity,
            yield_unit: dataIn.yield.unit,
        })
        .eq("id", id)

    return { data: dbData, error }
}

export const deleteRecipe = async (supabase, id) => {
    const { data, error } = await supabase
        .from("recipe")
        .delete()
        .eq("id", id)
        .select()

    return { data, error }
}

// ingredient stuff
export const getAllIngredients = async (supabase) => {
    const { data, error } = await supabase
        .from("ingredient")
        .select()
        .order("name")

    return { data, error }
}

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


export const updateIngredient = async (supabase, data) => {
    const { id: ingredient_id, ...updateData } = data

    const { data: dbData, error } = await supabase
        .from("ingredient")
        .update(updateData)
        .eq("id", ingredient_id)
        .select()
        .single()

    return { data: dbData, error }
}

export const deleteIngredient = async (supabase, id) => {
    const { data: dbData, error } = await supabase
        .from("ingredient")
        .delete()
        .eq("id", id)
        .select()
    return { data: dbData, error }
}


export const mergeIngredients = async (supabase, newId, oldId) => {
    // this probably belongs in the (yet to be built) service layer.
    // replaces all instances of oldId with newId and deletes the old ingredient
    const { data: dbData, error: updateError } = await supabase
        .from("assembly")
        .update({ ingredient_id: newId })
        .eq("ingredient_id", oldId)


    const { data: deletedIngredient, error: deleteError } = await deleteIngredient(supabase, oldId)

    return {
        data: dbData,
        error: {
            updateError,
            deleteError
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

export const upsertSections = async (supabase, data) => {
    // upsert over update because that allows updating a list of records 
    const { data: dbData, error } = await supabase
        .from("section")
        .upsert(data)
        .select()

    return { data: dbData, error }
}

export const deleteSections = async (supabase, recipeId, retainIds) => {
    // deletes sections from a given recipe, as long as they are not
    // present in the array `retainIds`.
    // This might be more suitable for the service layer, as this is not
    // quite a "primitive"
    const { data, error } = await supabase
        .from("section")
        .delete()
        .eq("recipe_id", recipeId)
        .not("id", "in", `(${retainIds.join(",")})`)
        .select()

    return { data, error }

}

// assembly stuff
export const createAssemblies = async (supabase, data) => {
    const { data: dbData, error } = await supabase
        .from("assembly")
        .insert(data)
        .select()

    return { data: dbData, error }
}

export const upsertAssemblies = async (supabase, data) => {
    const { data: dbData, error } = await supabase
        .from("assembly")
        .upsert(data)
        .select()

    return { data: dbData, error }
}

export const deleteAssemblies = async (supabase, sectionIds, assemblyIds) => {
    // I'm pretty sure sectionIds is here just for extra safety, but no clue really.
    const { data: dbData, error } = await supabase
        .from("assembly")
        .delete()
        .in("section_id", sectionIds)
        .not("id", "in", `(${assemblyIds.join(",")})`)
        .select()

    return { data: dbData, error }
}
