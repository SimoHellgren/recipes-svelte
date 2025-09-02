import { superValidate } from "sveltekit-superforms";
import { formSchema, editSchema } from "$lib/components/recipe-form/schema";
import { zod } from "sveltekit-superforms/adapters";
import { supabase } from "$lib/supabaseClient";

export async function load({ params }) {
    const { data } = await supabase.from("recipe").select(
        `*,
         section( *, assembly ( *, ingredient ( name )) ) )
        `
    ).eq("id", params.id).single();

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

    const form = await superValidate(recipe ?? {}, zod(editSchema))
    return {
        form
    };
};


export const actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(editSchema));

        console.log(form)

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

        // TODO: delete sections (cascade)
        // TODO: update sections
        // TODO: add sections

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