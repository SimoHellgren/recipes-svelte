<script>
	let { data } = $props();
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { MergeIcon } from '@lucide/svelte/icons/merge';
</script>

<ul>
	{#each data.ingredients as ingredient}
		<li>
			{ingredient.name}

			<Dialog.Root>
				<Dialog.Trigger><MergeIcon /></Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
						<Dialog.Description>
							This action cannot be undone. This will permanently delete your account and remove
							your data from our servers.
						</Dialog.Description>
					</Dialog.Header>
				</Dialog.Content>
			</Dialog.Root>
		</li>
	{/each}
</ul>
