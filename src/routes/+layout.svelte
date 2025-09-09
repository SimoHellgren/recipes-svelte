<script>
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { setCartState } from '$lib/state.svelte';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	// test global state
	setCartState();

	// users supabase.auth.getUser() behind the scenes, so should be safe.
	// also, this is just to display the email, not to verify sessions
	const user = data.user;

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<title>Keitot kirja</title>

<Sidebar.Provider open={false}>
	<AppSidebar {session} {supabase} {user} />
	<main>
		<Sidebar.Trigger />
		{@render children?.()}
	</main>
</Sidebar.Provider>
