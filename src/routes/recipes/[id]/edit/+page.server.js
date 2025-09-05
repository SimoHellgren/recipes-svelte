import { superValidate } from "sveltekit-superforms";
import { recipeSchema } from "$lib/components/recipe-form/schema";
import { zod } from "sveltekit-superforms/adapters";
import { supabase } from "$lib/supabaseClient";
import { getOrCreateIngredients } from "$lib/db";

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

        const allSections = [...updatedSections, ...insertedSections]

        const ingredients = form.data.sections.map(s => s.ingredients).flat()

        // Get / Create ingredients
        const allIngredients = await getOrCreateIngredients(ingredients)

        // delete assembly rows
        const assemblyIds = ingredients.map(i => i.id).filter(i => i) // no nulls
        const { data: deletedAssemblies } = await supabase
            .from("assembly")
            .delete()
            .in("section_id", sectionIds)
            .not("id", "in", `(${assemblyIds.join(",")})`)
            .select()

        // update assembly rows
        const assembliesToUpdate = form.data.sections.map(section => section.ingredients.map((assembly, index) => ({
            id: assembly.id,
            // new sections' rows are always inserted, so no need to check section ids here
            section_id: section.id,
            position: index + 1,
            quantity: assembly.quantity,
            unit: assembly.unit,
            //comment
            //optional
            ingredient_id: allIngredients.find(i => i.name === assembly.name).id
        }))).flat().filter(x => x.id) // no nulls; they are new rows

        console.log(assembliesToUpdate)

        // offset trick for positions because unique index
        const BIG_NUMBER = 1000;
        // stupid, but works because realistically we'll never hit the offset number
        await supabase
            .from("assembly")
            .upsert(assembliesToUpdate.map(a => ({ ...a, position: a.position + BIG_NUMBER })))

        // fix the positions
        const { data: updatedAssemblies, error: assemblyError } = await supabase
            .from("assembly")
            .upsert(assembliesToUpdate)


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