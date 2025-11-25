<script>
	let { data } = $props();
	let { ingredients } = data;
</script>

<ul>
	{#each ingredients as ingredient}
		<li>
			{ingredient.name}
		</li>
	{/each}
</ul>
