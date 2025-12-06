export async function load({ locals: { supabase } }) {
    const { data } = await supabase.from("recipe").select().order("name");
    return {
        recipes: data ?? [],
    };
}

