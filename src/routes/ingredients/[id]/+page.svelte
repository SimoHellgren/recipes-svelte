<script>
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { Button, buttonVariants, Root } from '$lib/components/ui/button/index.js';
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
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { toast } from 'svelte-sonner';

	let { data } = $props();
	let { current, others } = data;

	// states for submitting the basic form
	let submitting = $state(false);
	let delayed = $state(false);

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

	// merge dialog stuff
	let mergeDialogOpen = $state(false);

	function closeMergeDialogAndReset() {
		mergeDialogOpen = false;
		value = '';
	}

	// delete dialog stuff
	let deleteDialogOpen = $state(false);
</script>

<div class="flex flex-col gap-y-3">
	<form
		method="POST"
		action="?/update_ingredient"
		use:enhance={() => {
			submitting = true;
			const timer = setTimeout(() => {
				delayed = true;
			}, 500);

			return async ({ result, update }) => {
				await update({ reset: false });
				clearTimeout(timer);
				submitting = false;
				delayed = false;

				if (result.type === 'success') {
					toast.success("Tallennettu'd");
				} else if (result.type === 'failure') {
					toast.error('Voi räkä! Jotain meni pieleen :<', { description: result.data.error });
				}
			};
		}}
	>
		<input hidden name="id" value={current.id} />
		<Label>
			Ainehen nimi:
			<Input name="name" bind:value={name} />
		</Label>

		<Label>
			Oletussuure:
			<Input name="default_unit" bind:value={default_unit} />
		</Label>

		<Button type="submit" disabled={submitting}>
			Tallenna
			{#if delayed}
				<Spinner />
			{/if}
		</Button>
		<Button
			onclick={() => {
				name = current.name;
				default_unit = current.default_unit;
			}}
			variant="outline"
		>
			Palauta
		</Button>
	</form>

	<Separator />

	<Accordion.Root type="single">
		<Accordion.Item>
			<Accordion.Trigger>Vaaravyöhyke</Accordion.Trigger>
			<Accordion.Content class="flex flex-col gap-y-2">
				<div>
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

					<Dialog.Root bind:open={mergeDialogOpen}>
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
									<Button variant="outline" onclick={closeMergeDialogAndReset}
										>ou shit gou bäk</Button
									>
									<Button type="submit">Joo let's go</Button>
								</form>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Root>
				</div>

				<Dialog.Root bind:open={deleteDialogOpen}>
					<Dialog.Trigger class={`${buttonVariants({ variant: 'destructive' })} w-fit`}
						>Poista</Dialog.Trigger
					>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Ookkonää varma?</Dialog.Title>
							<Dialog.Description>Meinaat poistaa ainehen <i>{current.name}</i></Dialog.Description>
						</Dialog.Header>

						<Dialog.Footer>
							<form method="POST" action="?/delete_ingredient">
								<Button
									variant="outline"
									onclick={() => {
										deleteDialogOpen = false;
									}}>ou shit gou bäk</Button
								>
								<Button variant="destructive" type="submit">Poista</Button>
							</form>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</div>
