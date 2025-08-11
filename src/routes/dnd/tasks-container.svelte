<script>
	import { CSS, styleObjectToString } from '@dnd-kit-svelte/utilities';
	import { useSortable } from '@dnd-kit-svelte/sortable';
	import CrossIcon from '@lucide/svelte/icons/x';
	import Input from '$lib/components/ui/input/input.svelte';

	let { data = $bindable(), children, type, accepts = [], class: className } = $props();

	const {
		attributes,
		listeners,
		node,
		activatorNode,
		transform,
		transition,
		isDragging,
		isSorting
	} = useSortable({
		id: data.id,
		data: { type, accepts }
	});

	const style = $derived(
		styleObjectToString({
			transform: CSS.Transform.toString(transform.current),
			transition: isSorting.current ? transition.current : undefined,
			zIndex: isDragging.current ? 1 : undefined
		})
	);
</script>

<div class="relative" bind:this={node.current} {style}>
	<!-- Original element - becomes invisible during drag but maintains dimensions -->

	<div class={['flex max-w-lg gap-0.5 p-1', className, { invisible: isDragging.current }]}>
		<button
			class="i-lucide-grip-vertical cursor-grab active:cursor-grabbing"
			bind:this={activatorNode.current}
			{...attributes.current}
			{...listeners.current}
		>
			⠿
		</button>
		<Input
			bind:value={data.name}
			class="border-transparent bg-transparent p-3 font-bold shadow-none"
			placeholder="(nimetön osio)"
		/>
		<button tabindex="-1" type="button" onclick={removefunc}
			><CrossIcon class="size-4 hover:text-red-400" /></button
		>
	</div>

	<div class="mt-3 grid gap-2">
		{@render children(isDragging.current)}
	</div>

	{#if isDragging.current}
		<div class="bg-orange/10 b b-dashed b-orange rd-3xl absolute inset-0 max-md:hidden"></div>
	{/if}
</div>
