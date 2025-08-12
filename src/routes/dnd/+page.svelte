<script>
	import Comp from './comp.svelte';

	let { data } = $props();
</script>

<Comp bind:data />
