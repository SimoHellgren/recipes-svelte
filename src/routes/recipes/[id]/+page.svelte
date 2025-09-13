<script>
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { getCartState } from '$lib/state.svelte.js';
	import EditIcon from '@lucide/svelte/icons/pencil';

	let { data } = $props();
	let { recipe } = data;

	let cart = getCartState();

	let inCart = $derived(cart.includes(recipe));

	const toggleCart = () => {
		if (!cart.includes(recipe)) {
			cart.add(recipe);
		} else {
			cart.remove(recipe);
		}
	};

	const original_qty = data.recipe.yield_quantity;
	let scaled_quantity = $state(original_qty);

	let scaledRecipe = $derived.by(() => {
		let r = {
			...data.recipe,
			yield_quantity: scaled_quantity,
			section: data.recipe.section.map((s) => ({
				...s,
				assembly: s.assembly.map((i) => ({
					...i,
					quantity: (i.quantity * scaled_quantity) / original_qty
				}))
			}))
		};

		return r;
	});
</script>

<header class="flex gap-x-2 text-center align-middle">
	<h1 class="text-2xl font-bold">{scaledRecipe.name}</h1>
	{#each scaledRecipe.tags as tag}
		<Badge variant="secondary">
			{tag}
		</Badge>
	{/each}
	<a href="/recipes/{data.id}/edit">
		<EditIcon />
	</a>

	<Button onclick={toggleCart}>{inCart ? 'Poista korista' : 'Lisää koriin'}</Button>
</header>

<div class="flex flex-col gap-y-3 py-2">
	<p>
		<b>Alkuperä</b>:
		{#if scaledRecipe.source && scaledRecipe.source.startsWith('http')}
			<a href={scaledRecipe.source}>{scaledRecipe.source}</a>
		{:else}
			{scaledRecipe.source}
		{/if}
	</p>

	<div class="w-s flex gap-x-3">
		<span>
			<b>Riitto:</b>
			<input class="w-10" type="number" step="0.5" min="0" bind:value={scaled_quantity} />
			{scaledRecipe.yield_unit}
		</span>
	</div>
</div>
{#if scaledRecipe.notes}
	<section class="liirumlaarum">
		<h3 class="text-lg font-medium">Liirum laarum</h3>
		{#each scaledRecipe.notes as note}
			<p>{note}</p>
		{/each}
	</section>
{/if}

<main class="flex">
	<section class="m-3">
		<h2 class="text-xl font-bold">Ainehet</h2>
		<ul class="space-y-2.5">
			{#each scaledRecipe.section as section}
				{#if section.name}
					<div class="font-bold">{section.name}</div>
				{/if}
				{#each section.assembly as item}
					<li>
						<Label
							class="font-normal has-[[aria-checked=true]]:text-gray-400 has-[[aria-checked=true]]:line-through"
						>
							<Checkbox />
							{item.ingredient.name}
							{item.quantity}
							{item.unit}
						</Label>
					</li>
				{/each}
			{/each}
		</ul>
	</section>
	<section class="m-3">
		<h2 class="text-xl font-bold">Tee näin</h2>
		<ol class="space-y-2.5">
			{#each scaledRecipe.method as step}
				<li>
					<Label
						class="font-normal has-[[aria-checked=true]]:text-gray-400 has-[[aria-checked=true]]:line-through"
					>
						<Checkbox />
						{step}
					</Label>
				</li>
			{/each}
		</ol>
	</section>
</main>

<style>
	.liirumlaarum {
		border: 1px dashed #555555;
		background-color: #f5f5f5;
		padding: 0.5rem 1rem 0.5rem 1rem;
		border-radius: 0.5rem;
		width: fit-content;
	}

	.liirumlaarum > h3 {
		margin: 0;
	}
</style>
