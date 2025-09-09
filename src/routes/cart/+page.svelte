<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
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

<Input bind:value={cart.name} placeholder="(nimetön ostoskori)" />

<Input bind:value={cart.date} placeholder="vvvv-kk-pp" />
<Button onclick={emptyCart}>Tyhjennä</Button>

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
