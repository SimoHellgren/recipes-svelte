<script>
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import CookingPotIcon from '@lucide/svelte/icons/cooking-pot';
	import PlusIcon from '@lucide/svelte/icons/file-plus-2';
	import ShoppingBasketIcon from '@lucide/svelte/icons/shopping-basket';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	//function for closing the sidebar when link is clicked
	let actions = Sidebar.useSidebar();
	const closeBar = () => actions.setOpen(false);

	const items = [
		{ title: 'Reseptit', url: '/', icon: CookingPotIcon },
		{ title: 'Uusi', url: '/recipes/new/', icon: PlusIcon },
		{ title: 'Suunnittelu', url: '#plan', icon: CalendarIcon },
		{ title: 'Ostoskori', url: '#basket', icon: ShoppingBasketIcon }
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
									<item.icon />
									<span>{item.title}</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				{/each}
			</Sidebar.Menu>
		</Sidebar.Content>
	</Sidebar.Inset>
	<Sidebar.Footer />
</Sidebar.Root>
