<script>
	// todos:
	// 1. navigation between rows & auto-extend
	//    - not sure if this would be nicer with focus or something
	// 2. sections (data structure could be same as before)
	// 4. comment & optionals (context menu or some other thing)

	import IngredientRow from './ingredient-row.svelte';

	const newRow = { name: '', quantity: '', unit: '' };

	let rows = $state([{ ...newRow }]);

	//test data
	rows = [...Array(4).keys()].map((i) => ({ ...newRow, name: `Item ${i + 1}` }));

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

	import { reorder, useSortable } from '$lib/use-sortable.svelte';
	let sortable = null;

	useSortable(() => sortable, {
		animation: 150,
		handle: '.draghandle',
		onEnd: (evt) => {
			rows = reorder(rows, evt);
		}
	});
</script>

<div class="border-radius-10 border-2 p-3">
	<ul bind:this={sortable}>
		{#each rows as row, i (row)}
			<IngredientRow
				bind:value={rows[i]}
				removefunc={() => removeRow(i)}
				autoadd={i == rows.length - 1 ? autoNewRow : null}
			/>
		{/each}
	</ul>
	<!-- for debugging -->
	<pre>
		{JSON.stringify(rows, null, 2)}
	</pre>
	<button type="button" onclick={appendRow}>Add</button>
</div>
