<script>
	import Row from './row-container.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	let { value = $bindable(), autoadd = () => {} } = $props();
</script>

<Row>
	<Input bind:value={value.name} placeholder="aines" />
	<Input bind:value={value.quantity} placeholder="määrä" class="w-2xs" />
	<Input bind:value={value.unit} placeholder="yksikkö" class="w-2xs" onkeydown={autoadd} />
</Row>
