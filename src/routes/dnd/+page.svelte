<script>
	import { DndContext, DragOverlay } from '@dnd-kit-svelte/core';
	import { SortableContext, arrayMove } from '@dnd-kit-svelte/sortable';
	import { dropAnimation, sensors } from './utils';
	import Droppable from './droppable.svelte';

	import Section from './section.svelte';
	import Ingredient from './ingredient.svelte';

	import Button from '$lib/components/ui/button/button.svelte';

	import { sections as recipeSections } from './data.json';

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

	let sections = $state(recipeSections);

	// autoadd ingredient rows
	// using $effect for manipulating state is a bit against Svelte's
	// best practices, but oh well
	$effect(() => {
		sections.forEach((section) => {
			const last = section.ingredients[section.ingredients.length - 1];
			if (last.name && last.quantity && last.unit) {
				section.ingredients = [...section.ingredients, newIngredient(last.position + 1)];
			}
		});
	});

	let activeItem = $state(null);
	let activeType = $state(null); // section or ingredient

	const updatePositions = (arr) => {
		return arr.map((x, i) => ({ ...x, position: i + 1 }));
	};

	const isContainerItem = (item) => item !== null && 'ingredients' in item;
	const isNestedItem = (item) => item !== null && !('ingredients' in item);

	const findSection = (id) => {
		//given a section id OR an ingredient id, returns corresponding section

		const sectionIndex = sections.findIndex(
			(section) => section.id === id || section.ingredients.some((i) => i.id === id)
		);

		return sectionIndex !== -1 ? sections[sectionIndex] : null;
	};

	const getTypeAndAccepts = (active, over) => {
		const activeType = active.data?.type;
		const overType = over.data?.type;
		const acceptsIngredient = over?.data?.accepts?.includes('ingdredient') ?? false;
		const acceptsSection = over?.data?.accepts?.includes('section') ?? false;

		return { activeType, overType, acceptsIngredient, acceptsSection };
	};

	const handleDragStart = ({ active }) => {
		const section = findSection(active.id);
		activeType = active.data?.type;

		//set activeItem
		active.data?.type === 'section'
			? (activeItem = section ?? null)
			: (activeItem = section.ingredients.find((i) => i.id === active.id) ?? null);
	};

	const handleDragEnd = ({ active, over }) => {
		if (!over) return;

		const { activeType, overType, acceptsIngredient, acceptsSection } = getTypeAndAccepts(
			active,
			over
		);

		// if moving a container to a place where containers can be moved, do that
		if (activeType === 'section' && (overType === 'section' || acceptsSection)) {
			const oldIndex = sections.findIndex((item) => item.id === active.id);
			const newIndex = sections.findIndex((item) => item.id === over.id);
			sections = updatePositions(arrayMove(sections, oldIndex, newIndex));
			return;
		}

		// move items
		if (activeType === 'ingredient' && (overType === 'ingredient' || acceptsIngredient)) {
			const activeSection = findSection(active.id);
			const overSection = findSection(over.id);

			if (!activeSection || !overSection) return;

			if (activeSection === overSection) {
				// Same container reorder
				const oldIndex = activeSection.ingredients.findIndex((item) => item.id === active.id);
				const newIndex = activeSection.ingredients.findIndex((item) => item.id === over.id);
				activeSection.ingredients = updatePositions(
					arrayMove(activeSection.ingredients, oldIndex, newIndex)
				);
			} else {
				// Move between containers
				const ingredient = activeSection.ingredients.find((item) => item.id === active.id);
				activeSection.ingredients = updatePositions(
					activeSection.ingredients.filter((nested) => nested.id !== active.id)
				);

				const insertIndex = overSection.ingredients.findIndex((nested) => nested.id === over.id);
				overSection.ingredients.splice(insertIndex, 0, ingredient);
				overSection.ingredients = updatePositions(overSection.ingredients);
			}
		}
	};

	const handleDragOver = ({ active, over }) => {
		if (!over) return;

		const {
			activeType: _activeType,
			overType,
			acceptsIngredient
		} = getTypeAndAccepts(active, over);
		activeType = _activeType;

		if (activeType !== 'ingredient' || (!overType && !acceptsIngredient)) return;

		const activeSection = findSection(active.id);
		const overSection = findSection(over.id);

		if (!activeSection || !overSection || activeSection === overSection) return;

		const ingredient = activeSection.ingredients.find((ing) => ing.id === active.id);
		if (!ingredient) return;

		activeSection.ingredients = activeSection.ingredients.filter((ing) => ing.id !== active.id);
		//using .unshift instead of .push to avoid adding empty ingredient rows when
		// ingredient is dragged to another section (.push places the element to the
		// end of the array, triggering the $effect)
		overSection.ingredients.unshift(ingredient);
	};

	const removeItem = (item) => {
		if (isContainerItem(item)) {
			sections = updatePositions(sections.filter((it) => it.id !== item.id));
		} else {
			const container = findSection(item.id);
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
	<SortableContext items={sections.map((item) => item.id)}>
		<Droppable id="section" data={{ accepts: ['section'] }}>
			<div class="flex-col space-y-2">
				{#each sections as section, i (section.id)}
					<Section
						bind:data={sections[i]}
						type="section"
						accepts={['ingredient']}
						removefunc={() => removeItem(section)}
					>
						<SortableContext items={section.ingredients.map((item) => item.id)}>
							{#each section.ingredients as ingredient, j (ingredient.id)}
								<Ingredient
									bind:data={section.ingredients[j]}
									type="ingredient"
									removefunc={() => removeItem(ingredient)}
								/>
							{:else}
								<p class="text-(sm center #9E9E9E) fw-medium pt">No ingredients</p>
							{/each}
						</SortableContext>
					</Section>
				{/each}
			</div>
		</Droppable>
	</SortableContext>

	<DragOverlay>
		{#if isNestedItem(activeItem)}
			<Ingredient data={activeItem} type="ingredient" />
		{:else if isContainerItem(activeItem)}
			<Section data={activeItem}>
				<!-- TODO: could "fold" the ingredients here for a nicer visual -->
				{#each activeItem.ingredients as ingredient}
					<Ingredient data={ingredient} />
				{/each}
			</Section>
		{/if}
	</DragOverlay>
</DndContext>
<Button
	onclick={() => {
		sections = updatePositions([...sections, newSection()]);
	}}>New section</Button
>
