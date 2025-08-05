<script>
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
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

<div class="flex flex-wrap">
	{#each tagStates as tag}
		<Label class="m-1 rounded-md border-1 border-neutral-900 p-1">
			<Checkbox bind:checked={tag.checked} class="bg-neutral-50" />
			{tag.name}
		</Label>
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
	<Input id="search" type="text" placeholder="Haku" bind:value={searchString} class="w-sm" />
</div>

<ul>
	{#each selectedRecipes as recipe}
		<li>
			<a href="/recipes/{recipe.id}">{recipe.name}</a>

			{#each recipe.tags as tag}
				<Badge variant="secondary">{tag}</Badge>
			{/each}
		</li>
	{/each}
</ul>
