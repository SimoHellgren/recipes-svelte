<script>
	// todos:
	// 1. navigation between rows & auto-extend
	//    - not sure if this would be nicer with focus or something
	// 2. sections (data structure could be same as before)
	// 4. comment & optionals (context menu or some other thing)

	import Input from './ui/input/input.svelte';
	import CrossIcon from '@lucide/svelte/icons/x';

	const newRow = { name: '', quantity: '', unit: '' };

	let rows = $state([{ ...newRow }]);

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
		onEnd: (evt) => {
			rows = reorder(rows, evt);
		}
	});
</script>

<div class="border-radius-10 border-2 p-3">
	<ul bind:this={sortable}>
		{#each rows as row, i (row)}
			<li>
				<div class="flex max-w-lg border-2 p-3">
					<div class="text-center">⠿</div>
					<Input bind:value={rows[i].name} placeholder="aines" />
					<Input bind:value={rows[i].quantity} placeholder="määrä" class="w-2xs" />
					<Input
						bind:value={rows[i].unit}
						placeholder="yksikkö"
						class="w-2xs"
						onkeydown={i == rows.length - 1 ? autoNewRow : null}
					/>
					<button tabindex="-1" type="button" onclick={() => removeRow(i)}
						><CrossIcon class="hover:text-red-400" /></button
					>
				</div>
			</li>
		{/each}
	</ul>
	<!-- for debugging -->
	<pre>
		{JSON.stringify(rows, null, 2)}
	</pre>
	<button type="button" onclick={appendRow}>Add</button>
</div>
