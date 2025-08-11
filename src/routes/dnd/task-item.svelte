<script>
	import { CSS, styleObjectToString } from '@dnd-kit-svelte/utilities';
	import { useSortable } from '@dnd-kit-svelte/sortable';
	import CrossIcon from '@lucide/svelte/icons/x';
	import Input from '$lib/components/ui/input/input.svelte';

	let { data = $bindable(), type } = $props();

	const {
		attributes,
		listeners,
		node,
		activatorNode,
		transform,
		transition,
		isDragging,
		isSorting,
		isOver
	} = useSortable({
		id: data.id,
		data: { type }
	});

	const style = $derived(
		styleObjectToString({
			transform: CSS.Transform.toString(transform.current),
			transition: isSorting.current ? transition.current : undefined,
			zIndex: isDragging.current ? 1 : undefined
		})
	);
</script>

<div class="relative select-none" bind:this={node.current} {style}>
	<!-- Original element - becomes invisible during drag but maintains dimensions -->
	<div
		class={[
			'flex max-w-lg gap-0.5 p-1',
			{ invisible: isDragging.current, 'bg-orange/5!': isOver.current }
		]}
	>
		<button
			class="i-lucide-grip-vertical cursor-grab active:cursor-grabbing"
			bind:this={activatorNode.current}
			{...attributes.current}
			{...listeners.current}
		>
			⠿
		</button>
		<Input bind:value={data.name} placeholder="aines" />
		<Input bind:value={data.quantity} placeholder="määrä" class="w-2xs" />
		<Input bind:value={data.unit} placeholder="yksikkö" class="w-2xs" />
		<button tabindex="-1" type="button" onclick={removefunc}
			><CrossIcon class="size-4 hover:text-red-400" /></button
		>
	</div>

	<!-- Drag placeholder -->
	{#if isDragging.current}
		<div class="abs inset-0 flex items-center justify-center">
			<!-- You can put any content here for the dragging state -->
			<div
				class="bg-orange/10 rd-2xl b-2 b-orange b-dashed flex h-full w-full items-center justify-center"
			>
				<span class="text-orange">Moving: {data.name}</span>
			</div>
		</div>
	{/if}
</div>
