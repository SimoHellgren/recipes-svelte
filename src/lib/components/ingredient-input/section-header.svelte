<script>
	import Row from './row-container.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	let { value = $bindable(), removefunc = () => null } = $props();
</script>

<Row>
	<Input
		bind:value
		class="border-transparent bg-transparent p-3 font-bold shadow-none"
		placeholder="(nimetön osio)"
	/>
</Row>
<Separator />
