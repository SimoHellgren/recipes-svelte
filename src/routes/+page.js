import recipes from "$lib/recipes.json"

export function load({ params }) {
    return { recipes: recipes }
}