<script>
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import CookingPotIcon from '@lucide/svelte/icons/cooking-pot';
	import PlusIcon from '@lucide/svelte/icons/file-plus-2';
	import ShoppingBasketIcon from '@lucide/svelte/icons/shopping-basket';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	const items = [
		{ title: 'Reseptit', url: '/', icon: CookingPotIcon },
		{ title: 'Uusi', url: '/', icon: PlusIcon },
		{ title: 'Suunnittelu', url: '/', icon: CalendarIcon },
		{ title: 'Ostoskori', url: '/', icon: ShoppingBasketIcon }
	];
</script>

<Sidebar.Root>
	<Sidebar.Content>
		<Sidebar.Menu>
			{#each items as item (item.title)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						{#snippet child({ props })}
							<a href={item.url} {...props}>
								<item.icon />
								<span>{item.title}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.Content>
	<Sidebar.Footer />
</Sidebar.Root>
