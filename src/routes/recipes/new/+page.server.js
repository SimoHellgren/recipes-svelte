import { superValidate } from "sveltekit-superforms";
import { recipeSchema } from "$lib/components/recipe-form/schema";
import { zod } from "sveltekit-superforms/adapters";
import { fail, redirect } from "@sveltejs/kit";
import * as service from "$lib/service";

export const load = async ({ depends, locals: { supabase } }) => {
    return {
        form: await superValidate(zod(recipeSchema)),
    };
};


export const actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(recipeSchema));

        const { locals: { supabase } } = event;

        if (!form.valid) {
            return fail(400, {
                form,
            });
        }

        // should probably parse stuff from form.data here

        const { data: { recipe }, error } = await service.createRecipe(supabase, form.data)

        throw redirect(303, `/recipes/${recipe.id}`)
    },
};