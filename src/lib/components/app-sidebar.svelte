<script>
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import CookingPotIcon from '@lucide/svelte/icons/cooking-pot';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	const items = [
		{ title: 'Recipes', url: '/', icon: CookingPotIcon },
		{ title: 'Meal planning', url: '/recipes/ankkaragu', icon: CalendarIcon }
	];
</script>

<Sidebar.Root>
	<Sidebar.Content>
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
	</Sidebar.Content>
	<Sidebar.Footer />
</Sidebar.Root>
