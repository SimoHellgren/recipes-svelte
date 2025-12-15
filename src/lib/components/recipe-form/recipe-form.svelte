<script>
	import MarkdownInput from '$lib/components/markdown-input.svelte';
	import TagsInput from '$lib/components/tags-input.svelte';
	import RemoveButton from '$lib/components/ingredient-input/remove-button.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Description } from 'formsnap';
	import { recipeSchema, defaultIngredient, defaultSection } from './schema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Button from '$lib/components/ui/button/button.svelte';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import { arrayMove } from '@dnd-kit-svelte/sortable';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import Checkbox from '../ui/checkbox/checkbox.svelte';
	import Textarea from '../ui/textarea/textarea.svelte';
	import Separator from '../ui/separator/separator.svelte';
	import Spinner from '../ui/spinner/spinner.svelte';
	import { toast } from 'svelte-sonner';
	import MoveButtons from './move-buttons.svelte';
	import { tick } from 'svelte';

	let { data, action } = $props();

	const form = superForm(data.form, {
		validators: zodClient(recipeSchema),
		dataType: 'json',
		onResult: ({ result }) => {
			// this probably has several corner cases / issues lol
			if (result.type === 'redirect') {
				toast.success("Tallennettu'd!");
			}
		}
	});

	const { form: formData, enhance, submitting, delayed, errors } = form;

	const addSection = async () => {
		$formData.sections = [...$formData.sections, defaultSection];
		templateRefs = [...templateRefs, null];
		templates = [...templates, defaultIngredient];

		// focus on newest template row
		await tick();
		templateRefs[templateRefs.length - 1].focus();
	};

	const removeSection = (index) => {
		$formData.sections = $formData.sections.filter((_, i) => i !== index);
	};

	const addIngredient = (sectionIndex) => {
		$formData.sections = $formData.sections.map((s, i) =>
			i == sectionIndex
				? { ...s, ingredients: [...s.ingredients, { ...templates[sectionIndex] }] }
				: s
		);
	};

	const removeIngredient = (sectionIndex, ingredientIndex) => {
		const section = $formData.sections[sectionIndex];

		$formData.sections[sectionIndex].ingredients = $formData.sections[
			sectionIndex
		].ingredients.filter((_, i) => i !== ingredientIndex);
	};

	const ingredientUp = (sectionIndex, ingredientIndex) => {
		if (ingredientIndex <= 0) return; // prevent cycling the list

		$formData.sections[sectionIndex].ingredients = arrayMove(
			$formData.sections[sectionIndex].ingredients,
			ingredientIndex,
			ingredientIndex - 1
		);
	};

	const ingredientDown = (sectionIndex, ingredientIndex) => {
		$formData.sections[sectionIndex].ingredients = arrayMove(
			$formData.sections[sectionIndex].ingredients,
			ingredientIndex,
			ingredientIndex + 1
		);
	};

	// "automatic" row addition
	let templateRefs = $state($formData.sections.map((s) => null));
	let templates = $state($formData.sections.map((s) => defaultIngredient));

	let templateIsValid = (sectionIndex) =>
		Boolean(
			templates[sectionIndex].name &&
				templates[sectionIndex].quantity &&
				templates[sectionIndex].unit
		);

	function handleCommit(event, sectionIndex) {
		// don't submit on Enter (but Tab behaves normally)
		if (event.key == 'Enter') event?.preventDefault();

		if (!templateIsValid(sectionIndex)) return;

		// add ingredient to actual data
		addIngredient(sectionIndex);

		// reset template and focus
		templates = templates.map((t, i) => (i == sectionIndex ? defaultIngredient : t));

		event.preventDefault(); // stops tabbing
		templateRefs[sectionIndex].focus();
	}

	// $inspect($formData.sections).with((type, value) => {
	// 	console.table(value);
	// });

	// $inspect($formData.sections.map((s) => s.ingredients).flat()).with((type, value) => {
	// 	console.table(value);
	// });
</script>

<form method="POST" use:enhance {action}>
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Nimi</Form.Label>
				<Input {...props} bind:value={$formData.name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="tags">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Hipat</Form.Label>
				<TagsInput {...props} bind:value={$formData.tags} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="source">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Alkuperä</Form.Label>
				<Input {...props} bind:value={$formData.source} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Fieldset {form} name="yield" class="grid auto-cols-max grid-flow-col gap-2">
		<Form.Legend>Riitto</Form.Legend>
		<Form.Field {form} name="yield.quantity">
			<Form.Control>
				{#snippet children({ props })}
					<Input type="number" {...props} bind:value={$formData.yield.quantity} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="yield.unit">
			<Form.Control>
				{#snippet children({ props })}
					<Input {...props} bind:value={$formData.yield.unit} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</Form.Fieldset>

	<Form.Fieldset {form} name="sections">
		<Form.Legend>Osiot & ainehet</Form.Legend>
		{#each $formData.sections as section, i}
			<input type="hidden" bind:value={$formData.sections[i].id} />
			<Form.ElementField {form} name="sections[{i}].name">
				<Form.Control>
					{#snippet children({ props })}
						<div class="flex">
							<MoveButtons onUp={() => sectionUp(i)} onDown={() => sectionDown(i)} />

							<Label class="sr-only">Section {i + 1}</Label>
							<Input
								{...props}
								bind:value={$formData.sections[i].name}
								placeholder="(nimetön osio)"
								class="w-md"
							/>
							<RemoveButton removefunc={() => removeSection(i)} />
						</div>

						{#each section.ingredients as ingredient, j}
							<input type="hidden" bind:value={$formData.sections[i].ingredients[j].id} />
							<div class="flex gap-1">
								<MoveButtons onUp={() => ingredientUp(i, j)} onDown={() => ingredientDown(i, j)} />

								<Form.Fieldset {form} name="sections[{i}].ingredients[{j}]">
									<div class="flex gap-1">
										<Form.ElementField {form} name="sections[{i}].ingredients[{j}].name">
											<Form.Control>
												{#snippet children({ props })}
													<Input
														{...props}
														bind:value={$formData.sections[i].ingredients[j].name}
														placeholder="aines"
														class="w-48"
													/>
												{/snippet}
											</Form.Control>
										</Form.ElementField>
										<Form.ElementField {form} name="sections[{i}].ingredients[{j}].quantity">
											<Form.Control>
												{#snippet children({ props })}
													<Input
														type="number"
														{...props}
														bind:value={$formData.sections[i].ingredients[j].quantity}
														placeholder="1"
														step="any"
														class="w-20"
													/>
												{/snippet}
											</Form.Control>
										</Form.ElementField>
										<Form.ElementField {form} name="sections[{i}].ingredients[{j}].unit">
											<Form.Control>
												{#snippet children({ props })}
													<Input
														{...props}
														bind:value={$formData.sections[i].ingredients[j].unit}
														placeholder="kpl"
														class="w-32"
													/>
												{/snippet}
											</Form.Control>
										</Form.ElementField>
										<Popover.Root>
											<Popover.Trigger class="ml-2 hover:bg-accent">
												{@const extras = ingredient.optional || ingredient.comment}
												<Ellipsis class={`${extras ? '' : 'text-gray-400'} `} />
											</Popover.Trigger>
											<Popover.Content class="flex flex-col gap-y-2">
												<Form.ElementField {form} name="sections[{i}].ingredients[{j}].optional">
													<Label>
														Valinnainen
														<Form.Control>
															{#snippet children({ props })}
																<Checkbox
																	{...props}
																	bind:checked={$formData.sections[i].ingredients[j].optional}
																/>
															{/snippet}
														</Form.Control>
													</Label>
												</Form.ElementField>
												<Separator />
												<Form.ElementField {form} name="sections[{i}].ingredients[{j}].comment">
													<Label class="flex flex-col items-start text-left">
														Nuotit
														<Form.Control>
															{#snippet children({ props })}
																<Textarea
																	placeholder="kommentti"
																	{...props}
																	bind:value={$formData.sections[i].ingredients[j].comment}
																	class="font-normal"
																/>
															{/snippet}
														</Form.Control>
													</Label>
												</Form.ElementField>
											</Popover.Content>
										</Popover.Root>
									</div>
								</Form.Fieldset>
								<RemoveButton class="ml-auto" removefunc={() => removeIngredient(i, j)} />
							</div>
						{/each}

						<!-- template stuff -->
						<form
							class="flex items-center gap-1 opacity-50 focus-within:opacity-100"
							onsubmit={(e) => handleCommit(e, i)}
						>
							<MoveButtons disabled />
							<Input
								bind:ref={templateRefs[i]}
								bind:value={templates[i].name}
								onkeydown={(e) => {
									if (e.key == 'Enter') handleCommit(e, i);
								}}
								placeholder="aines"
								class="w-48"
							/>

							<Input
								bind:value={templates[i].quantity}
								onkeydown={(e) => {
									if (e.key == 'Enter') handleCommit(e, i);
								}}
								type="number"
								step="any"
								placeholder="1"
								class="w-20"
							/>

							<Input
								bind:value={templates[i].unit}
								onkeydown={(e) => {
									if (e.key == 'Enter' || (e.key == 'Tab' && !e.shiftKey)) handleCommit(e, i);
								}}
								placeholder="kpl"
								class="w-32"
								enterkeyhint="testink"
							/>
							<Popover.Root>
								<Popover.Trigger class="ml-2 hover:bg-accent">
									{@const extras = templates[i].optional || templates[i].comment}
									<Ellipsis class={`${extras ? '' : 'text-gray-400'} `} />
								</Popover.Trigger>
								<Popover.Content class="flex flex-col gap-y-2">
									<Label>
										Valinnainen
										<Checkbox {...props} bind:checked={templates[i].optional} />
									</Label>
									<Separator />
									<Label class="flex flex-col items-start text-left">
										Nuotit
										<Textarea
											placeholder="kommentti"
											class="font-normal"
											bind:value={templates[i].comment}
										/>
									</Label>
								</Popover.Content>
							</Popover.Root>
							<Button size="sm" disabled={!templateIsValid(i)} type="submit">Lisää</Button>
						</form>
					{/snippet}
				</Form.Control>
			</Form.ElementField>
		{/each}
		<Form.FieldErrors />
		<Button onclick={addSection}>Uusi osio</Button>
	</Form.Fieldset>

	<Form.Field {form} name="method">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Askelet</Form.Label>
				<MarkdownInput
					{...props}
					bind:value={$formData.method}
					placeholder="Kokeile *muotoiluja*"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="notes">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Liirum laarum</Form.Label>
				<MarkdownInput
					{...props}
					bind:value={$formData.notes}
					placeholder="Täälläkin voi **muotoilla**"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button disabled={$submitting}
		>Submit

		{#if $delayed}
			<Spinner />
		{/if}
	</Form.Button>
</form>
