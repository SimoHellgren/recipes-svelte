<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import UpIcon from '@lucide/svelte/icons/chevron-up';
	import DownIcon from '@lucide/svelte/icons/chevron-down';

	let { onUp, onDown, disabled } = $props();
</script>

<div class="flex">
	<Button {disabled} class="h-7 w-7" variant="ghost" onclick={onUp} tabindex="-1"><UpIcon /></Button
	>
	<Button {disabled} class="h-7 w-7" variant="ghost" onclick={onDown} tabindex="-1"
		><DownIcon /></Button
	>
</div>
