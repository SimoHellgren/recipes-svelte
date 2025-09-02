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


        console.log(recipeError)

        // const { data, error } = await supabase.from("ingredient")
        //     .upsert([{ name: "Öljy", conversions: { "g": 90, "ml": 100 } }], { onConflict: "name" })
        //     .select()




        return {
            form,
        };
    },
};