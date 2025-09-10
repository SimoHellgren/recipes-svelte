<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import DatePicker from '$lib/components/date-picker.svelte';
	import XIcon from '@lucide/svelte/icons/x';
	import { getCartState } from '$lib/state.svelte';

	const { data } = $props();
	let cart = getCartState();

	const { ingredients } = data;

	const recipes = $derived(
		cart.items.map((recipe) => ({
			...recipe,
			ingredients: ingredients.filter((i) => i.recipe_id === recipe.id)
		}))
	);

	/**
	 * Might need to use $effect to keep states in sync later.
	 */
	const scales = $state(Object.fromEntries(cart.items.map((r) => [r.id, r.yield_quantity])));

	const scaledIngredients = $derived(
		recipes
			.map((r) =>
				r.ingredients
					.map((i) => ({
						...i,
						quantity: (i.quantity * scales[r.id]) / r.yield_quantity
					}))
					.flat()
			)
			.flat()
	);

	const grouped = $derived(
		Object.groupBy(scaledIngredients, ({ ingredient, unit }) => `${ingredient} (${unit})`)
	);

	function removeFromCart(recipe_id) {
		cart.items = cart.items.filter((item) => item.id !== recipe_id);
	}

	const emptyCart = () => {
		cart.name = null;
		cart.date = null;
		cart.items = [];
	};
</script>

<div class="grid-col grid gap-2">
	<Input bind:value={cart.name} placeholder="(nimetön ostoskori)" />
	<DatePicker bind:value={cart.date} />
	<Button onclick={emptyCart}>Tyhjennä kori</Button>
</div>

<div class="grid grid-rows-1">
	{#each recipes as recipe, i}
		<Label>
			{recipe.name}
			<Input type="number" step="any" bind:value={scales[recipe.id]} />
			{recipe.yield_unit}
		</Label>
		<Button
			variant="outline"
			class="border-destructive/10 text-destructive hover:text-destructive"
			onclick={() => removeFromCart(recipe.id)}
		>
			<XIcon />
		</Button>
	{/each}
</div>

<h1>Ostoslista</h1>
{#each Object.entries(grouped).toSorted() as [group, items]}
	<details>
		<summary>
			{group}:
			{items.map((i) => i.quantity).reduce((a, b) => a + b)}
		</summary>
		<ul>
			{#each items as item}
				<li>
					{item.recipe_name}
					{item.quantity}
					{item.unit}
				</li>
			{/each}
		</ul>
	</details>
{/each}
