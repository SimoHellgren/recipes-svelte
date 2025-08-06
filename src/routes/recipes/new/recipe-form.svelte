<script>
	import MarkdownInput from '$lib/components/markdown-input.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import { formSchema } from './schema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
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
