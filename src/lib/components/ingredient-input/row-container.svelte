<script>
	import CrossIcon from '@lucide/svelte/icons/x';
	import Input from '$lib/components/ui/input/input.svelte';
	let { children } = $props();
</script>

<li>
	<div class="flex max-w-lg gap-0.5 p-1">
		<button type="button" class="draghandle cursor-grab active:cursor-grabbing" tabindex="-1"
			>⠿</button
		>
		{@render children?.()}
		<button tabindex="-1" type="button" onclick={removefunc}
			><CrossIcon class="size-4 hover:text-red-400" /></button
		>
	</div>
</li>
