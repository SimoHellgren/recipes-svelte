<script>
	import Label from '$lib/components/ui/label/label.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { flip } from 'svelte/animate';
	import { crossfade } from 'svelte/transition';
	import { fade, slide } from 'svelte/transition';
	import { tick } from 'svelte';

	const [send, receive] = crossfade({
		// duration: (d) => Math.sqrt(d) * 150
		duration: 300,
		fallback(node) {
			return fade(node, { duration: 100 });
		}
	});

	async function handleCheckboxChange(ing) {
		const uncheckingLast =
			!ing.checked && // just unchecked
			!selectedIngredients.length; // now empty

		if (uncheckingLast) {
			// Let crossfade finish its "send" *first*
			await tick();
		}
	}

	let { data } = $props();
	let { ingredients, recipes } = data;

	let allIngredients = $state(ingredients.map((ing) => ({ ...ing, checked: false })));
	let selectedIngredients = $derived(allIngredients.filter((i) => i.checked));

	let selectedRecipes = $derived(
		recipes.filter((recipe) =>
			selectedIngredients.every((selectedIng) =>
				recipe.ingredients.some((i) => i.id === selectedIng.id)
			)
		)
	);

	let search = $state('');
	let searchRef = $state(null);

	let availableIngredients = $derived(
		(!selectedIngredients.length
			? allIngredients
			: allIngredients.filter((ing) =>
					selectedRecipes.some((recipe) => recipe.ingredients.some((i) => i.id === ing.id))
				)
		)
			.filter((ing) => !ing.checked)
			.filter((ing) => ing.name.toLowerCase().includes(search))
	);

	//function for jumping to the search box with ctrl+f
	function jumpToSearch(event) {
		if (event.ctrlKey && event.key === 'f') {
			event.preventDefault();
			searchRef.focus();
		}
	}
</script>

<svelte:window on:keydown={jumpToSearch} />

<div class="grid grid-cols-3 gap-18">
	<div>
		<h1>Ainehet</h1>
		<Input bind:ref={searchRef} bind:value={search} placeholder="Haku" />
		<ul>
			{#each availableIngredients as ingredient (ingredient.id)}
				<li
					in:receive={{ key: ingredient.id }}
					out:send={{ key: ingredient.id }}
					animate:flip={{ duration: 400 }}
				>
					<Label class="m-1 rounded-md border-1 border-neutral-900 p-1">
						<Checkbox bind:checked={ingredient.checked} class="bg-neutral-50" />
						{ingredient.name}
					</Label>
				</li>
			{/each}
		</ul>
	</div>
	<div>
		<h1>Valitut</h1>
		<ul>
			{#each selectedIngredients as ingredient (ingredient.id)}
				<li
					in:receive={{ key: ingredient.id }}
					out:send={{ key: ingredient.id }}
					animate:flip={{ duration: 400 }}
				>
					<Label class="m-1 rounded-md border-1 border-neutral-900 p-1">
						<Checkbox
							bind:checked={ingredient.checked}
							class="bg-neutral-50"
							onCheckedChange={() => handleCheckboxChange(ingredient)}
						/>
						{ingredient.name}
					</Label>
				</li>
			{/each}
		</ul>
	</div>
	<div>
		<h1>Reseptit</h1>
		<ul>
			{#each selectedRecipes as recipe (recipe.id)}
				<li in:slide={{ duration: 200 }} out:fade={{ duration: 120 }}>
					{recipe.name}
				</li>
			{/each}
		</ul>
	</div>
</div>
