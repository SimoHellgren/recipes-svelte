<script>
	import IngredientInput from '$lib/components/ingredient-input/ingredient-input.svelte';
	import MarkdownInput from '$lib/components/markdown-input.svelte';
	import TagsInput from '$lib/components/tags-input.svelte';
	import RemoveButton from '$lib/components/ingredient-input/remove-button.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Description } from 'formsnap';
	import { recipeSchema } from './schema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Button from '$lib/components/ui/button/button.svelte';
	import UpIcon from '@lucide/svelte/icons/chevron-up';
	import DownIcon from '@lucide/svelte/icons/chevron-down';
	import { arrayMove } from '@dnd-kit-svelte/sortable';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(recipeSchema),
		dataType: 'json'
	});

	const { form: formData, enhance } = form;

	const newIngredient = { id: null, name: null, quantity: null, unit: null };
	const newSection = { id: null, name: null, ingredients: [newIngredient] };

	const addSection = () => {
		$formData.sections = [...$formData.sections, newSection];
	};

	const removeSection = (index) => {
		$formData.sections = $formData.sections.filter((_, i) => i !== index);
	};

	const addIngredient = (sectionIndex) => {
		$formData.sections = $formData.sections.map((s, i) =>
			i == sectionIndex ? { ...s, ingredients: [...s.ingredients, newIngredient] } : s
		);
	};

	const removeIngredient = (sectionIndex, ingredientIndex) => {
		const section = $formData.sections[sectionIndex];

		$formData.sections[sectionIndex].ingredients = $formData.sections[
			sectionIndex
		].ingredients.filter((_, i) => i !== ingredientIndex);
	};

	const sectionUp = (index) => {
		$formData.sections = arrayMove($formData.sections, index, index - 1);
	};

	const sectionDown = (index) => {
		$formData.sections = arrayMove($formData.sections, index, index + 1);
	};

	const ingredientUp = (sectionIndex, ingredientIndex) => {
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

	//auto add empty section
	//would probably be better to conditionally render a placeholder which,
	//when focused, triggers adding an empty row. This way the actual formData
	//wouldn't contain empty elements, and can be validated better
	// $effect(() => {
	// 	const last = $formData.sections[$formData.sections.length - 1];
	// 	if (last) {
	// 		addSection();
	// 	}
	// });

	// $inspect($formData.sections).with((type, value) => {
	// 	console.table(value);
	// });
</script>

<form method="POST" use:enhance>
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
				<Form.Label>Tagit</Form.Label>
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

	<Form.Fieldset {form} name="yield">
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
		<Form.Legend>Recipe sections</Form.Legend>
		{#each $formData.sections as section, i}
			<Form.ElementField {form} name="sections[{i}].name">
				<Form.Control>
					{#snippet children({ props })}
						<div class="flex flex-row">
							<Button variant="ghost" onclick={() => sectionUp(i)} tabindex="-1"><UpIcon /></Button>
							<Button variant="ghost" onclick={() => sectionDown(i)} tabindex="-1"
								><DownIcon /></Button
							>
							<Label class="sr-only">Section {i + 1}</Label>
							<Input
								{...props}
								bind:value={$formData.sections[i].name}
								placeholder="(nimetön osio)"
							/>
							<RemoveButton removefunc={() => removeSection(i)} />
						</div>

						{#each section.ingredients as ingredient, j}
							<div class="flex flex-row">
								<Form.Fieldset {form} name="sections[{i}].ingredients[{j}]">
									<div class="flex flex-row">
										<Button variant="ghost" onclick={() => ingredientUp(i, j)} tabindex="-1"
											><UpIcon /></Button
										>
										<Button variant="ghost" onclick={() => ingredientDown(i, j)} tabindex="-1"
											><DownIcon /></Button
										>
										<Form.ElementField {form} name="sections[{i}].ingredients[{j}].name">
											<Form.Control>
												{#snippet children({ props })}
													<Input
														{...props}
														bind:value={$formData.sections[i].ingredients[j].name}
														placeholder="aines"
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
													/>
												{/snippet}
											</Form.Control>
										</Form.ElementField>
									</div>
								</Form.Fieldset>
								<RemoveButton removefunc={() => removeIngredient(i, j)} />
							</div>
						{/each}
						<Button onclick={() => addIngredient(i)}>Add Ingredient</Button>
					{/snippet}
				</Form.Control>
			</Form.ElementField>
		{/each}
		<Form.FieldErrors />
		<Button onclick={addSection}>Add section</Button>
	</Form.Fieldset>

	<Form.Field {form} name="method">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Askelet</Form.Label>
				<MarkdownInput {...props} bind:value={$formData.method} placholder="Kokeile *muotoiluja*" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="notes">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Notes</Form.Label>
				<MarkdownInput
					{...props}
					bind:value={$formData.notes}
					placeholder="Täälläking voi **muotoilla**"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
