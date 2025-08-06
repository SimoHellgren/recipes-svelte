<script>
	import RecipeForm from './recipe-form.svelte';

	let { data } = $props();
</script>

<RecipeForm {data} />
