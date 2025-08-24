<script>
	let { data } = $props();
</script>

<ul>
	{#each data.recipes as recipe}
		<li>{recipe.name}</li>
	{/each}
</ul>
