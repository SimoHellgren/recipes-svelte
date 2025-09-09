<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import DatePicker from '$lib/components/date-picker.svelte';
	import { getCartState } from '$lib/state.svelte';

	const { data } = $props();
	const cart = getCartState();

	const { ingredients } = data;

	const recipesInCart = $derived(cart.items.map((x) => x.id));
	const chosen = $derived(ingredients.filter((i) => recipesInCart.includes(i.recipe_id)));
	const grouped = $derived(Object.groupBy(chosen, ({ ingredient, unit }) => [ingredient, unit]));

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

<h1>Ostoslista</h1>
{#each Object.entries(grouped) as [group, items]}
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
