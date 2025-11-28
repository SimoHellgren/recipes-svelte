<script>
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Body } from '$lib/components/ui/table/index.js';
	import * as Table from '$lib/components/ui/table';
	let { data } = $props();
	let { recipes } = data;

	//filters
	let searchString = $state('');

	let tags = [...new Set(recipes.map((r) => r.tags).flat())].toSorted();
	let tagStates = $state(tags.map((t) => ({ name: t, checked: false })));
	let selectedTags = $derived(tagStates.filter((t) => t.checked).map((t) => t.name));

	let selectedRecipes = $derived(
		(!selectedTags.length
			? recipes
			: recipes.filter((recipe) => recipe.tags.some((tag) => selectedTags.includes(tag)))
		).filter((recipe) => recipe.name.toLowerCase().includes(searchString))
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
		onclick={() => (tagStates = tagStates.map((t) => ({ ...t, checked: false })))}>Tyhjennä</Button
	>
</div>

<div>
	<Input id="search" type="text" placeholder="Haku" bind:value={searchString} class="w-sm" />
</div>

<Table.Root class="w-fit">
	<Table.Body>
		{#each selectedRecipes as recipe}
			<Table.Row>
				<Table.Cell class="w-1 text-2xl text-amber-400 text-shadow-black text-shadow-xs">
					{recipe.tags.includes('mvp') ? '★' : null}
				</Table.Cell>
				<Table.Cell>
					<a href="/recipes/{recipe.id}">{recipe.name}</a>
				</Table.Cell>
				<Table.Cell>
					{#each recipe.tags as tag}
						<Badge variant="secondary">{tag}</Badge>
					{/each}
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
