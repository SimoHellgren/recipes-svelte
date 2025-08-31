<script>
	import RecipeForm from '$lib/components/recipe-form/recipe-form.svelte';

	let { data } = $props();
</script>

<RecipeForm {data} />
