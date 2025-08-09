<script>
	import { CSS, styleObjectToString } from '@dnd-kit-svelte/utilities';
	import { useSortable } from '@dnd-kit-svelte/sortable';

	let { data, type } = $props();

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
			'rd-2xl flex-s-between bg-white p-3',
			{ invisible: isDragging.current, 'bg-orange/5!': isOver.current }
		]}
	>
		<div class="">
			<p class="text-lg font-bold">{data.name}</p>
			<p class="text-sm text-gray-500">{data.description}</p>
		</div>

		<div
			class="i-lucide-grip-vertical cursor-pointer text-gray-500"
			bind:this={activatorNode.current}
			{...attributes.current}
			{...listeners.current}
		>
			T
		</div>
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
