import { redirect, fail } from "@sveltejs/kit";
import * as db from '$lib/db'

export async function load({ params, locals: { supabase } }) {
    const { data, error } = await db.getAllIngredients(supabase);

    const currentId = parseInt(params.id)

    let current = data.find(x => x.id === currentId)
    let others = data.filter(x => x.id !== currentId)

    return {
        current,
        others
    };
}


export const actions = {
    update_ingredient: async (event) => {
        const data = Object.fromEntries(await event.request.formData());

        const { locals: { supabase } } = event;

        const { data: dbData, error } = await db.updateIngredient(supabase, data)


        if (error) return fail(400, { error: error.message })

        return dbData

    },

    delete_ingredient: async (event) => {
        const { locals: { supabase }, params: { id } } = event;
        const { data: deletedIngredient, error } = await db.deleteIngredient(supabase, id)

        throw redirect(303, `/ingredients`)
    },

    merge: async (event) => {
        const data = await event.request.formData();

        const newId = data.get("target_id")
        const oldId = event.params.id

        const { locals: { supabase } } = event;

        const { data: dbData, error } = await db.mergeIngredients(supabase, newId, oldId)

        throw redirect(303, `/ingredients/${newId}`)
    }
}