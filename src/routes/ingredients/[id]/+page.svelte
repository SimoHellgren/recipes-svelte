<script>
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import MergeIcon from '@lucide/svelte/icons/merge';
	import { cn } from '$lib/utils.js';
	import { tick } from 'svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { enhance } from '$app/forms';

	let { data } = $props();
	let { current, others } = data;

	// ingredient stuff
	let name = $state(current.name);
	let default_unit = $state(current.default_unit);

	// combobox stuff
	let comboOpen = $state(false);
	let value = $state('');
	let triggerRef = $state(null);
	let selectedValue = $derived(others.find((i) => i.name === value));

	function closeAndFocusTrigger() {
		comboOpen = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}

	// dialog stuff
	let dialogOpen = $state(false);

	function closeDialogAndReset() {
		dialogOpen = false;
		value = '';
	}
</script>

<form method="POST" use:enhance action="?/update_ingredient">
	<input hidden name="id" value={current.id} />
	<Label>
		Ainehen nimi:
		<Input name="name" bind:value={name} />
	</Label>

	<Label>
		Oletussuure:
		<Input name="default_unit" bind:value={default_unit} />
	</Label>

	<Button type="submit">Tallenna</Button>
</form>

<Separator />

<h1>Vaaravyöhyke</h1>
<Popover.Root bind:open={comboOpen}>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				variant="outline"
				class="w-[200px] justify-between"
				{...props}
				role="combobox"
				aria-expanded={comboOpen}
			>
				{selectedValue?.name || 'Etsi aines'}
				<ChevronsUpDownIcon class="ms-2 size-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<Command.Root>
			<Command.Input placeholder="Etsi" />
			<Command.List>
				<Command.Empty>Ei löydy!</Command.Empty>
				<Command.Group>
					{#each others as ingredient}
						<Command.Item
							value={ingredient.name}
							onSelect={() => {
								value = ingredient.name;
								closeAndFocusTrigger();
							}}
						>
							<CheckIcon
								class={cn('me-2 size-4', value !== ingredient.name && 'text-transparent')}
							/>
							{ingredient.name}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })} disabled={!selectedValue}
		>Yhdistä <MergeIcon /></Dialog.Trigger
	>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Ookkonää varma?</Dialog.Title>
			<Dialog.Description
				><i>{current.name}</i> paikalle tulee <i>{selectedValue.name}</i> kaikissa resepteissä.
			</Dialog.Description>
		</Dialog.Header>

		<Dialog.Footer>
			<form method="POST" action="?/merge">
				<input name="target_id" hidden value={selectedValue.id} />
				<Button variant="outline" onclick={closeDialogAndReset}>ou shit gou bäk</Button>
				<Button type="submit">Joo let's go</Button>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
