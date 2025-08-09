<script>
	import { DndContext, DragOverlay } from '@dnd-kit-svelte/core';

	import { SortableContext, arrayMove } from '@dnd-kit-svelte/sortable';

	import { dropAnimation, sensors } from './utils';
	import { crossfade } from 'svelte/transition';
	import Droppable from './droppable.svelte';

	import TasksContainer from './tasks-container.svelte';
	import TaskItem from './task-item.svelte';

	import { sections } from './data.json';

	// generate unique ids for the elements
	let nextId = 1;
	sections.forEach((section) => {
		section.id = `section-${nextId++}`;
		section.ingredients.forEach((ingredient) => {
			ingredient.id = `ingredient-${nextId++}`;
		});
	});

	let items = $state(sections);
	let activeItem = $state(null);
	let activeType = $state(null); // container or item

	const isContainerItem = (item) => item !== null && 'ingredients' in item;
	const isNestedItem = (item) => item !== null && !('ingredients' in item);

	const findContainer = (id) => {
		//given a container id OR an item id, returns corresponding container

		const containerIndex = items.findIndex(
			(section) => section.id === id || section.ingredients.some((i) => i.id === id)
		);

		return containerIndex !== -1 ? items[containerIndex] : null;
	};

	const getTypeAndAccepts = (active, over) => {
		const activeType = active.data?.type;
		const overType = over.data?.type;
		const acceptsItem = over?.data?.accepts?.includes('item') ?? false;
		const acceptsContainer = over?.data?.accepts?.includes('container') ?? false;

		return { activeType, overType, acceptsItem, acceptsContainer };
	};

	const handleDragStart = ({ active }) => {
		const container = findContainer(active.id);
		activeType = active.data?.type;

		//set activeItem
		active.data?.type === 'container'
			? (activeItem = container ?? null)
			: (activeItem = container.ingredients.find((i) => i.id === active.id) ?? null);
	};

	const handleDragEnd = ({ active, over }) => {
		if (!over) return;

		const { activeType, overType, acceptsItem, acceptsContainer } = getTypeAndAccepts(active, over);

		// if moving a container to a place where containers can be moved, do that
		if (activeType === 'container' && (overType === 'container' || acceptsContainer)) {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over.id);
			items = arrayMove(items, oldIndex, newIndex);
			return;
		}

		// move items
		if (activeType === 'item' && (overType === 'item' || acceptsItem)) {
			const activeContainer = findContainer(active.id);
			const overContainer = findContainer(over.id);

			if (!activeContainer || !overContainer) return;

			if (activeContainer === overContainer) {
				// Same container reorder
				const oldIndex = activeContainer.ingredients.findIndex((item) => item.id === active.id);
				const newIndex = activeContainer.ingredients.findIndex((item) => item.id === over.id);
				activeContainer.ingredients = arrayMove(activeContainer.ingredients, oldIndex, newIndex);
			} else {
				// Move between containers
				const item = activeContainer.ingredients.find((item) => item.id === active.id);
				activeContainer.ingredients = activeContainer.ingredients.filter(
					(nested) => nested.id !== active.id
				);

				const insertIndex = overContainer.ingredients.findIndex((nested) => nested.id === over.id);
				overContainer.ingredients.splice(insertIndex, 0, item);
			}
		}
	};

	const handleDragOver = ({ active, over }) => {
		if (!over) return;

		const { activeType: _activeType, overType, acceptsItem } = getTypeAndAccepts(active, over);
		activeType = _activeType;

		if (activeType !== 'item' || (!overType && !acceptsItem)) return;

		const activeContainer = findContainer(active.id);
		const overContainer = findContainer(over.id);

		if (!activeContainer || !overContainer || activeContainer === overContainer) return;

		const item = activeContainer.ingredients.find((item) => item.id === active.id);
		if (!item) return;

		activeContainer.ingredients = activeContainer.ingredients.filter(
			(nested) => nested.id !== active.id
		);
		overContainer.ingredients.push(item);
	};
</script>

<DndContext
	{sensors}
	onDragStart={handleDragStart}
	onDragEnd={handleDragEnd}
	onDragOver={handleDragOver}
>
	<SortableContext items={items.map((item) => item.id)}>
		<Droppable id="container" data={{ accepts: ['container'] }}>
			<div class="grid gap-3 md:grid-cols-2">
				{#each items as section (section.id)}
					{@render tasksContainer(section, section.ingredients)}
				{/each}
			</div>

			<p class="text-(sm center #9E9E9E) fw-medium pt-3">Drag and drop to reorder</p>
		</Droppable>
	</SortableContext>

	<DragOverlay>
		{#if isNestedItem(activeItem)}
			<TaskItem data={activeItem} type="item" />
		{:else if isContainerItem(activeItem)}
			{@render tasksContainer(activeItem, activeItem.ingredients, 'shadow-(gray-2 xl)')}
		{/if}
	</DragOverlay>
</DndContext>

{#snippet tasksContainer(data, nesteds, className)}
	<TasksContainer {data} type="container" accepts={['item']} class={className}>
		<SortableContext items={nesteds.map((item) => item.id)}>
			{#each nesteds as nested (nested.id)}
				<TaskItem data={nested} type="item" />
			{:else}
				<p class="text-(sm center #9E9E9E) fw-medium pt">No tasks</p>
			{/each}
		</SortableContext>
	</TasksContainer>
{/snippet}
