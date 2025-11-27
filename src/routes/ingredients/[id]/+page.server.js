import { supabase } from "$lib/supabaseClient";
import { redirect } from "@sveltejs/kit";

export async function load({ params }) {
    const { data, error } = await supabase
        .from("ingredient")
        .select()
        .order("name")



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
        const data = await event.request.formData();

        const newData = {
            name: data.get("name"),
            default_unit: data.get("default_unit")
        }

        const { locals: { supabase } } = event;

        const { data: dbData } = await supabase
            .from("ingredient")
            .update(newData)
            .eq("id", event.params.id)
            .select()


        throw redirect(303, `/ingredients/${event.params.id}`)

    },

    delete_ingredient: async (event) => {
        const { locals: { supabase } } = event;
        const { data: deletedIngredient, error } = await supabase
            .from("ingredient")
            .delete()
            .eq("id", event.params.id)

        console.log(error)

        throw redirect(303, `/ingredients`)
    },

    merge: async (event) => {
        const data = await event.request.formData();

        const new_id = data.get("target_id")
        const old_id = event.params.id

        const { locals: { supabase } } = event;

        const { data: dbData } = await supabase
            .from("assembly")
            .update({ ingredient_id: new_id })
            .eq("ingredient_id", old_id)


        const { data: deletedIngredient } = await supabase
            .from("ingredient")
            .delete()
            .eq("id", old_id)


        throw redirect(303, `/ingredients/${data.get("target_id")}`)
    }
}