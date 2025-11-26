<script>
	import Label from '$lib/components/ui/label/label.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';

	let { data } = $props();
	let { ingredients, recipes } = data;
</script>

<div class="grid grid-cols-2 gap-24">
	<div>
		<h1>Ainehet</h1>
		<ul>
			{#each ingredients as ingredient}
				<li>
					<Label class="m-1 rounded-md border-1 border-neutral-900 p-1">
						<Checkbox class="bg-neutral-50" />
						{ingredient.name}
					</Label>
				</li>
			{/each}
		</ul>
	</div>
	<div>
		<h1>Reseptit</h1>
		<ul>
			{#each recipes as recipe}
				<li>
					{recipe.name}
				</li>
			{/each}
		</ul>
	</div>
</div>
