<script>
	import CrossIcon from '@lucide/svelte/icons/x';
	import Input from './ui/input/input.svelte';
	let { value = $bindable(), removefunc, autoadd = () => null } = $props();
</script>

<li>
	<div class="flex max-w-lg gap-0.5 p-1">
		<button type="button" class="draghandle cursor-grab active:cursor-grabbing" tabindex="-1"
			>⠿</button
		>
		<Input bind:value={value.name} placeholder="aines" />
		<Input bind:value={value.quantity} placeholder="määrä" class="w-2xs" />
		<Input bind:value={value.unit} placeholder="yksikkö" class="w-2xs" onkeydown={autoadd} />
		<button tabindex="-1" type="button" onclick={removefunc}
			><CrossIcon class="size-4 hover:text-red-400" /></button
		>
	</div>
</li>
