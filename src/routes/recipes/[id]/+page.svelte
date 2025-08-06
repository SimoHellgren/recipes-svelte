<script>
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	let { data } = $props();
</script>

<header>
	<h1 class="text-2xl font-bold">{data.name}</h1>
	<a href="/">🏠↩️</a>
</header>

<p>
	<b>Alkuperä</b>:
	{#if data.source && data.source.startsWith('http')}
		<a href={data.source}>{data.source}</a>
	{:else}
		{data.source}
	{/if}
</p>

<p><b>Riitto:</b> {data.servings}</p>

{#if data.notes}
	<section class="liirumlaarum">
		<h3 class="text-lg font-medium">Liirum laarum</h3>
		{#each data.notes as note}
			<p>{note}</p>
		{/each}
	</section>
{/if}

<main class="flex">
	<section class="m-3">
		<h2 class="text-xl font-bold">Ainehet</h2>
		<ul class="space-y-2.5">
			{#each data.sections as section}
				{#if section.name}
					<div class="font-bold">{section.name}</div>
				{/if}
				{#each section.ingredients as ingredient}
					<li>
						<Label
							class="font-normal has-[[aria-checked=true]]:text-gray-400 has-[[aria-checked=true]]:line-through"
						>
							<Checkbox />
							{ingredient.name}
							{ingredient.quantity}
						</Label>
					</li>
				{/each}
			{/each}
		</ul>
	</section>
	<section class="m-3">
		<h2 class="text-xl font-bold">Tee näin</h2>
		<ol class="space-y-2.5">
			{#each data.method as step}
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
	.done {
		color: #aaaaaa;
		text-decoration: line-through;
	}

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
