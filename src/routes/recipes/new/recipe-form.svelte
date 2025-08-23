<script>
	import IngredientInput from '$lib/components/ingredient-input/ingredient-input.svelte';
	import MarkdownInput from '$lib/components/markdown-input.svelte';
	import TagsInput from '$lib/components/tags-input.svelte';
	import RemoveButton from '$lib/components/ingredient-input/remove-button.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Description } from 'formsnap';
	import { formSchema } from './schema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Button from '$lib/components/ui/button/button.svelte';
	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		dataType: 'json'
	});

	const { form: formData, enhance } = form;

	const addSection = () => {
		$formData.sections = [...$formData.sections, ''];
	};

	const removeSection = (index) => {
		$formData.sections = $formData.sections.filter((_, i) => i !== index);
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

	$inspect($formData);
</script>

<form method="POST" use:enhance>
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Recipe name</Form.Label>
				<Input {...props} bind:value={$formData.name} />
			{/snippet}
		</Form.Control>
		<Form.Description>Name of the recipe</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="tags">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Tags</Form.Label>
				<Form.Description>Tagges</Form.Description>
				<TagsInput {...props} bind:value={$formData.tags} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="source">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Source</Form.Label>
				<Input {...props} bind:value={$formData.source} />
			{/snippet}
		</Form.Control>
		<Form.Description>Source of the recipe</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="servings">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Servings</Form.Label>
				<Input {...props} bind:value={$formData.servings} />
			{/snippet}
		</Form.Control>
		<Form.Description>How plenty is the thing?</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Fieldset {form} name="sections">
		<Form.Legend>Recipe sections</Form.Legend>
		<Form.Description>Huhuehue heheheh</Form.Description>
		{#each $formData.sections as section, i}
			<Form.ElementField {form} name="sections[{i}]">
				<Form.Control>
					{#snippet children({ props })}
						<Label class="sr-only">Section {i + 1}</Label>
						<Input {...props} bind:value={$formData.sections[i]} placeholder="(nimetön osio)" />
						<RemoveButton removefunc={() => removeSection(i)} />
					{/snippet}
				</Form.Control>
			</Form.ElementField>
		{/each}
		<Form.FieldErrors />
		<Button onclick={addSection}>Add section</Button>
	</Form.Fieldset>

	<!-- <Form.Field {form} name="sections">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Ingredients</Form.Label>
				<Form.Description>Empty ingredients will be ignored</Form.Description>
				<IngredientInput {...props} bind:value={$formData.sections} />
			{/snippet}
		</Form.Control>
	</Form.Field> -->

	<Form.Field {form} name="method">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Method</Form.Label>
				<Form.Description>One step per row. Supports markdown!</Form.Description>
				<MarkdownInput {...props} bind:value={$formData.method} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="notes">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Notes</Form.Label>
				<Form.Description>One note per row. Supports markdown!</Form.Description>
				<MarkdownInput {...props} bind:value={$formData.notes} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
