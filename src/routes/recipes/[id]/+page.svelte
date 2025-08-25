<script>
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	let { data } = $props();

	const original_qty = data.yield_quantity;
	let scaled_quantity = $state(original_qty);

	let recipe = $derived.by(() => {
		let r = {
			...data,
			yield_quantity: scaled_quantity,
			section: data.section.map((s) => ({
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
	<h1 class="text-2xl font-bold">{recipe.name}</h1>
	{#each recipe.tags as tag}
		<Badge variant="secondary">
			{tag}
		</Badge>
	{/each}
</header>

<div class="flex flex-col gap-y-3 py-2">
	<p>
		<b>Alkuperä</b>:
		{#if recipe.source && recipe.source.startsWith('http')}
			<a href={recipe.source}>{recipe.source}</a>
		{:else}
			{recipe.source}
		{/if}
	</p>

	<div class="w-s flex gap-x-3">
		<span>
			<b>Riitto:</b>
			<input class="w-10" type="number" step="0.5" min="0" bind:value={scaled_quantity} />
			{recipe.yield_unit}
		</span>
	</div>
</div>
{#if recipe.notes}
	<section class="liirumlaarum">
		<h3 class="text-lg font-medium">Liirum laarum</h3>
		{#each recipe.notes as note}
			<p>{note}</p>
		{/each}
	</section>
{/if}

<main class="flex">
	<section class="m-3">
		<h2 class="text-xl font-bold">Ainehet</h2>
		<ul class="space-y-2.5">
			{#each recipe.section as section}
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
			{#each recipe.method as step}
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
