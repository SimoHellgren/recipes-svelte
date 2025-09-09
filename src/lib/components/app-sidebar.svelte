<script>
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import CookingPotIcon from '@lucide/svelte/icons/cooking-pot';
	import PlusIcon from '@lucide/svelte/icons/file-plus-2';
	import ShoppingBasketIcon from '@lucide/svelte/icons/shopping-basket';
	import LoginIcon from '@lucide/svelte/icons/log-in';
	import LogoutIcon from '@lucide/svelte/icons/log-out';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { getCartState } from '$lib/state.svelte';
	import Badge from './ui/badge/badge.svelte';

	let { session, supabase, user } = $props();

	const cart = getCartState();
	const cartSize = $derived(cart.items.length);

	//function for closing the sidebar when link is clicked
	let actions = Sidebar.useSidebar();
	const closeBar = () => actions.setOpen(false);

	const logout = async () => {
		closeBar();

		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
	};

	const items = [
		{ title: 'Reseptit', url: '/', icon: CookingPotIcon },
		{ title: 'Uusi', url: '/recipes/new/', icon: PlusIcon },
		{ title: 'Suunnittelu', url: '#plan', icon: CalendarIcon },
		{ title: 'Ostoskori', url: '/cart', icon: ShoppingBasketIcon }
	];
</script>

<Sidebar.Root variant="inset" collapsible="icon">
	<Sidebar.Inset>
		<Sidebar.Content>
			<Sidebar.Menu>
				{#each items as item (item.title)}
					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							{#snippet child({ props })}
								<a href={item.url} {...props} onclick={closeBar} ontouch={closeBar}>
									{#if item.title == 'Ostoskori' && cartSize > 0}
										<Badge class="absolute h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
											>{cartSize}</Badge
										>
									{:else}
										<item.icon />
									{/if}
									<span>{item.title}</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				{/each}
			</Sidebar.Menu>
		</Sidebar.Content>
	</Sidebar.Inset>
	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton>
					{#snippet child({ props })}
						{#if session}
							<a {...props} onclick={logout} ontouch={logout}>
								<LogoutIcon />
								<span>Ulos ({user?.email})</span>
							</a>
						{:else}
							<a href="/auth" {...props} onclick={closeBar} ontouch={closeBar}>
								<LoginIcon />
								<span>Sisään</span>
							</a>
						{/if}
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
