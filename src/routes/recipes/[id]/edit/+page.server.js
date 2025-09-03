import { superValidate } from "sveltekit-superforms";
import { recipeSchema } from "$lib/components/recipe-form/schema";
import { zod } from "sveltekit-superforms/adapters";
import { supabase } from "$lib/supabaseClient";

export async function load({ params }) {
    const { data, error } = await supabase
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


    const recipe = {
        id: data.id,
        name: data.name,
        tags: data.tags,
        source: data.source,
        yield: {
            quantity: data.yield_quantity,
            unit: data.yield_unit ?? "",

        },
        sections: data.section.map(s => ({
            ...s,
            ingredients: s.assembly.map(i => ({ ...i, name: i.ingredient.name }))
        })),
        method: data.method,
        notes: data.notes,

    }

    const form = await superValidate(recipe ?? {}, zod(recipeSchema))
    return {
        form
    };
};


export const actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(recipeSchema));

        if (!form.valid) {
            return fail(400, {
                form,
            });
        }

        // update basic stuff 
        const { data: recipeData, error: recipeError } = await supabase
            .from("recipe")
            .update({
                name: form.data.name,
                tags: form.data.tags,
                source: form.data.source,
                method: form.data.method,
                notes: form.data.notes || null,
                yield_quantity: form.data.yield.quantity,
                yield_unit: form.data.yield.unit,
            })
            .eq("id", form.data.id)

        // TODO: create missing ingredients
        // easiest is probably to just "get or create" all

        // the order of operation is significant:
        // 1. delete first: makes sure that no conflicts on position when updating rest
        // 2. (update existing ones)
        // 3. add new ones - because rest have been updated, there cannot be conflicts with position (I think) 

        // need to work on how to identify which records were deleted, though. Naive approach is
        // to query the db, but there's probably something nicer available. Might be a separate ticket, though. 


        // sections
        // ignore ingredients for now
        const sections = form.data.sections
            .map((s, i) => ({
                id: s.id,
                name: s.name,
                position: i + 1,
                recipe_id: form.data.id,
            }))

        const sectionIds = sections.map(s => s.id).filter(s => s) // no nulls

        // delete sections (cascades to assembly rows)
        const { data: deletedSections } = await supabase
            .from("section")
            .delete()
            .eq("recipe_id", form.data.id)
            .not("id", "in", `(${sectionIds.join(",")})`)

        // update sections. Upsert since it allows a list as input
        const { data: updatedSections, error: updateSectionError } = await supabase
            .from("section")
            .upsert(sections.filter(s => s.id)) // no nulls, i.e. only existing sections
            .select()

        console.log(updateSectionError)

        // add sections
        const { data: insertedSections, error: insertError } = await supabase
            .from("section")
            .insert(sections.filter(s => s.id === null).map(s => ({
                name: s.name,
                position: s.position,
                recipe_id: s.recipe_id,
            }))) // only new sections, and ignore ids
            .select()

        console.log(insertError)

        // TODO: delete assembly rows (cascade)
        // TODO: update assembly rows
        // TODO: add new assembly rows

        // const { data, error } = await supabase.from("ingredient")
        //     .upsert([{ name: "Öljy", conversions: { "g": 90, "ml": 100 } }], { onConflict: "name" })
        //     .select()



        // TODO: submmitting should probably redirect back to the recipe
        // and display a success message
        return {
            form,
        };
    },
};