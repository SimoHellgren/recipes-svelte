import { superValidate } from "sveltekit-superforms";
import { formSchema } from "$lib/components/recipe-form/schema";
import { zod } from "sveltekit-superforms/adapters";
import { supabase } from "$lib/supabaseClient";

export async function load({ params }) {
    const { data } = await supabase.from("recipe").select(
        `*,
         section( *, assembly ( *, ingredient ( name )) ) )
        `
    ).eq("id", params.id).single();

    const recipe = {
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

    const form = await superValidate(recipe ?? {}, zod(formSchema))
    return {
        form
    };
};
