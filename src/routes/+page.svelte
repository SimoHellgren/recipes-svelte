<script>
	let { data } = $props();
	let { recipes } = data;

	let tags = [...new Set(recipes.map((r) => r.tags).flat())].toSorted();
</script>

<div>
	{#each tags as tag}
		<label>
			<input type="checkbox" checked />
			{tag}
		</label>
	{/each}

	<button type="button">Kaikki</button>
	<button type="button">Ei mitään</button>
</div>

<div>
	<input id="search" type="text" placeholder="Haku" />
</div>

{#each recipes as recipe}
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
