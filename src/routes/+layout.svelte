<script>
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<title>Keitot kirja</title>

<Sidebar.Provider open={false}>
	<AppSidebar />
	<main>
		<Sidebar.Trigger />
		{@render children?.()}
	</main>
</Sidebar.Provider>
