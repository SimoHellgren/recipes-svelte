<script>
	import Button from '$lib/components/ui/button/button.svelte';
	let { data } = $props();
	let { recipes } = data;

	//filters
	let searchString = $state('');

	let tags = [...new Set(recipes.map((r) => r.tags).flat())].toSorted();
	let tagStates = $state(tags.map((t) => ({ name: t, checked: true })));
	let selectedTags = $derived(tagStates.filter((t) => t.checked).map((t) => t.name));

	let selectedRecipes = $derived(
		recipes
			.filter((recipe) => recipe.tags.some((tag) => selectedTags.includes(tag)))
			.filter((recipe) => recipe.name.toLowerCase().includes(searchString))
	);

	//function for jumping to the search box with ctrl+f
	function jumpToSearch(event) {
		if (event.ctrlKey && event.key === 'f') {
			event.preventDefault();
			document.getElementById('search').focus();
		}
	}
</script>

<svelte:window on:keydown={jumpToSearch} />

<div>
	{#each tagStates as tag}
		<label>
			<input type="checkbox" bind:checked={tag.checked} />
			{tag.name}
		</label>
	{/each}

	<Button
		variant="outline"
		onclick={() => (tagStates = tagStates.map((t) => ({ ...t, checked: true })))}>Kaikki</Button
	>
	<Button
		variant="outline"
		onclick={() => (tagStates = tagStates.map((t) => ({ ...t, checked: false })))}>Ei mitään</Button
	>
</div>

<div>
	<input id="search" type="text" placeholder="Haku" bind:value={searchString} />
</div>

<ul>
	{#each selectedRecipes as recipe}
		<li data-mvp={recipe.tags.includes('mvp') ? '' : undefined}>
			<a href="/recipes/{recipe.id}">{recipe.name}</a>
		</li>
	{/each}
</ul>

<style>
	label {
		border: 2px solid #ccc;
		border-radius: 4px;
		background-color: #f9f9f9;
		margin: 0.1em;
		display: inline-flex;
		align-items: center;
		gap: 0.1em;
		padding-left: 0.1em;
		padding-right: 0.1em;
	}

	input[type='checkbox'] {
		margin: 0;
		vertical-align: middle;
	}

	li {
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
		font-size: 1.5rem;
	}

	li > * {
		color: black;
	}

	li[data-mvp]::marker {
		content: '★ ';
		color: #ffc107;
		text-shadow:
			-1px 0 black,
			0 1px black,
			1px 0 black,
			0 -1px black;
	}
</style>
