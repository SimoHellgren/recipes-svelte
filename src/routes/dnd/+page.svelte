<script>
	import { DndContext, DragOverlay } from '@dnd-kit-svelte/core';

	import { SortableContext, arrayMove } from '@dnd-kit-svelte/sortable';

	import { dropAnimation, sensors } from './utils';
	import { crossfade } from 'svelte/transition';
	import Droppable from './droppable.svelte';

	import TasksContainer from './tasks-container.svelte';
	import TaskItem from './task-item.svelte';

	import { sections as recipeSections } from './data.json';
	import Button from '$lib/components/ui/button/button.svelte';

	// TODO:
	// 1. make positions update when stuff moves
	// 2. make drag overlays and/or ghost elements nicer
	// 3. implement autoadding rows for each section
	// 4. refactor, rename, cleanup

	// generate unique ids for the elements
	let nextId = 1;
	recipeSections.forEach((section) => {
		section.id = `section-${nextId++}`;
		section.ingredients.forEach((ingredient) => {
			ingredient.id = `ingredient-${nextId++}`;
		});
	});

	const newIngredient = (position = null) => {
		return {
			position: position,
			name: null,
			quantity: null,
			unit: null,
			id: `ingredient-${nextId++}`
		};
	};

	const newSection = () => {
		return {
			position: null,
			name: null,
			ingredients: [newIngredient(1)],
			id: `section-${nextId++}`
		};
	};

	let items = $state(recipeSections);
	let activeItem = $state(null);
	let activeType = $state(null); // container or item

	$inspect(items);

	const updatePositions = (arr) => {
		return arr.map((x, i) => ({ ...x, position: i + 1 }));
	};

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
			items = updatePositions(arrayMove(items, oldIndex, newIndex));
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
				activeContainer.ingredients = updatePositions(
					arrayMove(activeContainer.ingredients, oldIndex, newIndex)
				);
			} else {
				// Move between containers
				const item = activeContainer.ingredients.find((item) => item.id === active.id);
				activeContainer.ingredients = updatePositions(
					activeContainer.ingredients.filter((nested) => nested.id !== active.id)
				);

				const insertIndex = overContainer.ingredients.findIndex((nested) => nested.id === over.id);
				overContainer.ingredients.splice(insertIndex, 0, item);
				overContainer.ingredients = updatePositions(overContainer.ingredients);
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

	const removeItem = (item) => {
		if (isContainerItem(item)) {
			items = updatePositions(items.filter((it) => it.id !== item.id));
		} else {
			const container = findContainer(item.id);
			container.ingredients = updatePositions(
				container.ingredients.filter((ing) => ing.id !== item.id)
			);
		}
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
			<div class="flex-col space-y-2">
				{#each items as section, i (section.id)}
					<TasksContainer
						bind:data={items[i]}
						type="container"
						accepts={['item']}
						removefunc={() => removeItem(section)}
					>
						<SortableContext items={section.ingredients.map((item) => item.id)}>
							{#each section.ingredients as ingredient, j (ingredient.id)}
								<TaskItem
									bind:data={section.ingredients[j]}
									type="item"
									removefunc={() => removeItem(ingredient)}
								/>
							{:else}
								<p class="text-(sm center #9E9E9E) fw-medium pt">No ingredients</p>
							{/each}
						</SortableContext>
					</TasksContainer>
				{/each}
			</div>
		</Droppable>
	</SortableContext>

	<DragOverlay>
		{#if isNestedItem(activeItem)}
			<TaskItem data={activeItem} type="item" />
		{:else if isContainerItem(activeItem)}
			<TasksContainer data={activeItem}>
				<!-- TODO: could "fold" the ingredients here for a nicer visual -->
				{#each activeItem.ingredients as ingredient}
					<TaskItem data={ingredient} />
				{/each}
			</TasksContainer>
		{/if}
	</DragOverlay>
</DndContext>
<Button
	onclick={() => {
		items = updatePositions([...items, newSection()]);
	}}>New section</Button
>
