<script>
	// todos:
	// 1. navigation between rows & auto-extend
	//    - not sure if this would be nicer with focus or something
	// 2. sections (data structure could be same as before)
	// 4. comment & optionals (context menu or some other thing)
	import recipe from './data.json';
	console.log(recipe);

	import IngredientRow from './ingredient.svelte';
	import IngredientSectionHeader from './section-header.svelte';

	const newRow = { name: '', quantity: '', unit: '' };

	let rows = $state([{ ...newRow }]);

	rows = recipe.sections;

	$inspect(rows);

	const appendRow = () => {
		rows = [...rows, { ...newRow }];
	};

	const removeRow = (index) => {
		rows = rows.filter((_, i) => i != index);
	};

	const autoNewRow = (event) => {
		if (!event.shiftKey && event.key == 'Tab') {
			appendRow();
		}
	};
</script>

<div class="border-radius-10 border-2 p-3">
	<ul>
		{#each rows as { ingredients }, i}
			<IngredientSectionHeader bind:value={rows[i].name} />
			{#each ingredients as row, j}
				<IngredientRow bind:value={ingredients[j]} removefunc={() => removeRow(j)} />
			{/each}
		{/each}
	</ul>
	<!-- for debugging -->
	<pre>
		{JSON.stringify(rows, null, 2)}
	</pre>
	<button type="button" onclick={appendRow}>Add</button>
</div>
