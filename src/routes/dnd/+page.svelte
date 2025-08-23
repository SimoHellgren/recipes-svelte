<script>
	import Comp from '../../lib/components/ingredient-input/ingredient-input.svelte';

	let { data } = $props();
</script>

<Comp bind:data />
