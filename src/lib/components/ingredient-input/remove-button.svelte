<script>
	import CrossIcon from '@lucide/svelte/icons/x';
	let { removefunc } = $props();
</script>

<button tabindex="-1" type="button" onclick={removefunc}
	><CrossIcon class="size-4 hover:text-red-400" />
</button>
