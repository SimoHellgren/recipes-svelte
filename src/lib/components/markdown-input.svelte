<script>
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	let { ref = $bindable(null), value = $bindable(''), class: className, ...restProps } = $props();
</script>

<Tabs.Root value="input">
	<Tabs.List>
		<Tabs.Trigger value="input">Edit</Tabs.Trigger>
		<Tabs.Trigger value="preview">Preview</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="input">
		<Textarea bind:this={ref} bind:value class {...restProps} />
	</Tabs.Content>
	<Tabs.Content value="preview">Kontsa tulee tähän</Tabs.Content>
</Tabs.Root>
