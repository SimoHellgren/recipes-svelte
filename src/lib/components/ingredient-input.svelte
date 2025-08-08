<script>
	// todos:
	// 1. navigation between rows & auto-extend
	//    - not sure if this would be nicer with focus or something
	// 2. sections (data structure could be same as before)
	// 4. comment & optionals (context menu or some other thing)

	import IngredientRow from './ingredient-row.svelte';
	import IngredientSectionHeader from './ingredient-section-header.svelte';

	const newRow = { name: '', quantity: '', unit: '' };

	let rows = $state([{ ...newRow }]);

	let testdata = $state([
		{
			section: 'Osio 1',
			ingredients: [
				{ ...newRow, name: 'Item 1' },
				{ ...newRow, name: 'Item 2' }
			]
		},
		{
			section: 'Osio 2',
			ingredients: [
				{ ...newRow, name: 'Item 3' },
				{ ...newRow, name: 'Item 4' }
			]
		}
	]);

	rows = testdata;
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
		{#each rows as { section, ingredients }, i}
			<IngredientSectionHeader bind:value={rows[i].section} />
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
