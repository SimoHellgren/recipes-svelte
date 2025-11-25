<script>
	let { data } = $props();
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import MergeIcon from '@lucide/svelte/icons/merge';
</script>

<ul>
	{#each data.ingredients as ingredient}
		<li>
			{ingredient.name}

			<Dialog.Root>
				<Dialog.Trigger>
					<MergeIcon size={12} />
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
						<Dialog.Description>
							Valitse aines
							<Input />
						</Dialog.Description>
					</Dialog.Header>
				</Dialog.Content>
			</Dialog.Root>
		</li>
	{/each}
</ul>
