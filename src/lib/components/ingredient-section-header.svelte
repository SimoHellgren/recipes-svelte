<script>
	import Separator from './ui/separator/separator.svelte';
	import CrossIcon from '@lucide/svelte/icons/x';
	import Input from './ui/input/input.svelte';
	let { value = $bindable(), removefunc = () => null } = $props();
</script>

<li>
	<div class="flex max-w-lg gap-0.5 p-1">
		<button type="button" class="draghandle cursor-grab active:cursor-grabbing" tabindex="-1"
			>⠿</button
		>
		<Input bind:value class="border-transparent bg-transparent p-3 font-bold shadow-none" />
		<button tabindex="-1" type="button" onclick={removefunc}
			><CrossIcon class="size-4 hover:text-red-400" /></button
		>
	</div>
	<Separator />
</li>
