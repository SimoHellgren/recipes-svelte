<script>
	import RecipeForm from '$lib/components/recipe-form/recipe-form.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Uusi resepti - Keitot kirja</title>
</svelte:head>

<RecipeForm {data} />
