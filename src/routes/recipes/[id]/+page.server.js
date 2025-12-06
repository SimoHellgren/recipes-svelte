export async function load({ params, locals: { supabase } }) {
    const { data: recipe, error } = await supabase
        .from("recipe")
        .select(
            `*,
         section( *, assembly ( *, ingredient ( * )) ) )
        `
        )
        .eq("id", params.id)
        .order("position", { referencedTable: "section" })
        .order("position", { referencedTable: "section.assembly" })
        .single();

    // split what shall be split here
    recipe.method = recipe.method.split("\n")
    recipe.notes = recipe.notes?.split("\n")

    return {
        recipe,
        id: params.id,
    };
}
