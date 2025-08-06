<script>
	import CrossIcon from '@lucide/svelte/icons/x';
	import Badge from './ui/badge/badge.svelte';
	import Input from './ui/input/input.svelte';

	let { ref = $bindable(null), value = $bindable([]), class: className, ...restProps } = $props();

	let inputValue = $state('');

	function handleKeydown(event) {
		//intercept enter to add tags
		if (event.key === 'Enter') {
			event.preventDefault();
			if (inputValue && !value.includes(inputValue.trim())) {
				value = [...value, inputValue.trim()];
				inputValue = '';
			}
		}
	}

	function removeTag(tag) {
		value = value.filter((v) => v != tag);
	}
</script>

<Input
	bind:this={ref}
	bind:value={inputValue}
	placeholder="Type & hit enter to add tag"
	onkeydown={handleKeydown}
	{...restProps}
/>

{#each value as tag}
	<Badge variant="secondary">
		<span>
			{tag}
		</span>
		<button type="button" class="flex place-items-center">
			<CrossIcon class="size-4" onclick={() => removeTag(tag)} />
		</button>
	</Badge>
{/each}
