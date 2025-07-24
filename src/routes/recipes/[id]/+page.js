import recipes from "$lib/recipes.json"

export function load({ params }) {
    let recipe = recipes.find(r => r.id === params.id)

    return recipe
}