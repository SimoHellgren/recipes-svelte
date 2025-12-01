<script>
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import RecipeForm from '$lib/components/recipe-form/recipe-form.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import { enhance } from '$app/forms';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';

	let { data } = $props();
	let recipe = data.form.data;

	let confirmation = $state('');

	let dialogOpen = $state(false);

	// used for the spinner in the delete dialog
	// emulates superforms' behavior
	let submitting = $state(false);
	let delayed = $state(false);
</script>

<div class="flex flex-col gap-y-2">
	<RecipeForm {data} action="?/update_recipe" />

	<Separator />

	<Accordion.Root type="single">
		<Accordion.Item>
			<Accordion.Trigger>Vaaravyöhyke</Accordion.Trigger>
			<Accordion.Content>
				<Dialog.Root bind:open={dialogOpen}>
					<Dialog.Trigger class={buttonVariants({ variant: 'destructive' })}>Poista</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Ookkonää varma?</Dialog.Title>
							<Dialog.Description
								>Haluatko varmasti poistaa reseptin <i>{recipe.name}</i>? Vahvista kirjoittamalla
								alle reseptin nimi.
							</Dialog.Description>
						</Dialog.Header>

						<Input bind:value={confirmation} placeholder={recipe.name} />

						<Dialog.Footer>
							<form
								method="POST"
								action="?/delete_recipe"
								use:enhance={() => {
									// emulates superforms' system
									submitting = true;

									const timer = setTimeout(() => {
										delayed = true;
									}, 500);

									return async ({ update }) => {
										await update();

										clearTimeout(timer);
										submitting = false;
										delayed = false;
									};
								}}
							>
								<Button
									type="submit"
									variant="destructive"
									disabled={confirmation != recipe.name || submitting}
									>Joo let's go
									{#if delayed}
										<Spinner />
									{/if}
								</Button>
							</form>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</div>
