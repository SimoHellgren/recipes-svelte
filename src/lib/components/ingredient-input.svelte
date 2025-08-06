<script>
	// todos:
	// 1. navigation between rows & auto-extend
	//    - not sure if this would be nicer with focus or something
	// 2. sections (data structure could be same as before)
	// 3. draggability (check example from shadcn-svelte source)
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

	// $inspect(rows);
</script>

<div class="border-radius-10 border-2 p-3">
	{#each rows as row, i}
		<div class="flex max-w-lg border-2 p-3">
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
	{/each}
	<button type="button" onclick={appendRow}>Add</button>
</div>
