<script>
	import Label from '$lib/components/ui/label/label.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';

	let { data } = $props();
	let { ingredients, recipes } = data;

	let allIngredients = $state(ingredients.map((ing) => ({ ...ing, checked: false })));
	let selectedIngredients = $derived(allIngredients.filter((i) => i.checked));

	let selectedRecipes = $derived(
		recipes.filter((recipe) =>
			selectedIngredients.every((selectedIng) =>
				recipe.ingredients.some((i) => i.id === selectedIng.id)
			)
		)
	);

	let availableIngredients = $derived(
		!selectedIngredients.length
			? allIngredients
			: allIngredients.filter((ing) =>
					selectedRecipes.some((recipe) => recipe.ingredients.some((i) => i.id === ing.id))
				)
	);
</script>

<div class="grid grid-cols-3 gap-18">
	<div>
		<h1>Ainehet</h1>
		<ul>
			{#each availableIngredients.filter((i) => !i.checked) as ingredient}
				<li>
					<Label class="m-1 rounded-md border-1 border-neutral-900 p-1">
						<Checkbox bind:checked={ingredient.checked} class="bg-neutral-50" />
						{ingredient.name}
					</Label>
				</li>
			{/each}
		</ul>
	</div>
	<div>
		<h1>Valitut</h1>
		<ul>
			{#each availableIngredients.filter((i) => i.checked) as ingredient}
				<li>
					<Label class="m-1 rounded-md border-1 border-neutral-900 p-1">
						<Checkbox bind:checked={ingredient.checked} class="bg-neutral-50" />
						{ingredient.name}
					</Label>
				</li>
			{/each}
		</ul>
	</div>
	<div>
		<h1>Reseptit</h1>
		<ul>
			{#each selectedRecipes as recipe}
				<li>
					{recipe.name}
				</li>
			{/each}
		</ul>
	</div>
</div>
