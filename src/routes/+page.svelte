<script>
	let { data } = $props();
	let { recipes } = data;

	let searchString = $state('');

	let tags = [...new Set(recipes.map((r) => r.tags).flat())].toSorted();
	let tagStates = $state(tags.map((t) => ({ name: t, checked: true })));
	let selectedTags = $derived(tagStates.filter((t) => t.checked).map((t) => t.name));

	let selectedRecipes = $derived(
		recipes
			.filter((recipe) => recipe.tags.some((tag) => selectedTags.includes(tag)))
			.filter((recipe) => recipe.name.toLowerCase().includes(searchString))
	);
</script>

<div>
	{#each tagStates as tag}
		<label>
			<input type="checkbox" bind:checked={tag.checked} />
			{tag.name}
		</label>
	{/each}

	<button
		type="button"
		onclick={() => (tagStates = tagStates.map((t) => ({ ...t, checked: true })))}>Kaikki</button
	>
	<button
		type="button"
		onclick={() => (tagStates = tagStates.map((t) => ({ ...t, checked: false })))}>Ei mitään</button
	>
</div>

<div>
	<input id="search" type="text" placeholder="Haku" bind:value={searchString} />
</div>

{#each selectedRecipes as recipe}
	<p>{recipe.name}</p>
{/each}

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
</style>
