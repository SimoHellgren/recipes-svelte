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
    default: async (event) => {
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

    }
}