import { supabase } from "$lib/supabaseClient";

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
