<script>
	import CrossIcon from '@lucide/svelte/icons/x';
	import PlusIcon from '@lucide/svelte/icons/circle-plus';
	import Badge from './ui/badge/badge.svelte';
	import Input from './ui/input/input.svelte';

	let { ref = $bindable(null), value = $bindable([]), class: className, ...restProps } = $props();

	let inputValue = $state('');

	function addTag() {
		const tag = inputValue.trim();

		//no empties
		if (!tag) return undefined;

		//no dupes
		if (value.includes(tag)) return undefined;

		value = [...value, tag];
		inputValue = '';
	}

	function handleKeydown(event) {
		//intercept enter to add tags
		if (event.key === 'Enter') {
			event.preventDefault();

			addTag(inputValue);
		}
	}

	function removeTag(tag) {
		value = value.filter((v) => v != tag);
	}
</script>

<div class="flex gap-1">
	<Input
		bind:this={ref}
		bind:value={inputValue}
		placeholder="Type & hit enter to add tag"
		onkeydown={handleKeydown}
		{...restProps}
	/>

	<button type="button">
		<PlusIcon onclick={addTag} />
	</button>
</div>

{#each value as tag}
	<Badge class="group" variant="secondary">
		<span>
			{tag}
		</span>
		<button type="button" class="flex place-items-center">
			<CrossIcon class="size-4 group-hover:text-red-400" onclick={() => removeTag(tag)} />
		</button>
	</Badge>
{/each}
