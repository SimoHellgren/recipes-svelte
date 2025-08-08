<script>
	import CrossIcon from '@lucide/svelte/icons/x';
	import Input from './ui/input/input.svelte';
	let { value = $bindable(), removefunc, autoadd = () => null } = $props();
</script>

<li class="flex gap-0">
	<button type="button" class="draghandle cursor-grab active:cursor-grabbing" tabindex="-1"
		>⠿</button
	>
	<div class="flex max-w-lg gap-0.5 p-1">
		<Input bind:value={value.name} placeholder="aines" />
		<Input bind:value={value.quantity} placeholder="määrä" class="w-2xs" />
		<Input bind:value={value.unit} placeholder="yksikkö" class="w-2xs" onkeydown={autoadd} />
		<button tabindex="-1" type="button" onclick={removefunc}
			><CrossIcon class="hover:text-red-400" /></button
		>
	</div>
</li>
