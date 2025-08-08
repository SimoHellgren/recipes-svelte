//copied from https://github.com/jdgamble555/svelte-5-drag-and-drop/tree/master
//blog post: https://dev.to/jdgamble555/svelte-5-and-sortablejs-5h6j 

import Sortable from 'sortablejs';

export const useSortable = (
    getter,
    options
) => {
    $effect(() => {
        const sortableEl = getter();
        const sortable = sortableEl ?
            Sortable.create(sortableEl, options)
            : null;
        return () => sortable?.destroy();
    });
}


export function reorder(
    array,
    evt
) {

    // should have no effect on stores or regular array
    const workArray = $state.snapshot(array);

    // get changes
    const { oldIndex, newIndex } = evt;

    if (oldIndex === undefined || newIndex === undefined) {
        return workArray;
    }
    if (newIndex === oldIndex) {
        return workArray;
    }

    // move elements
    const target = workArray[oldIndex];
    const increment = newIndex < oldIndex ? -1 : 1;

    for (let k = oldIndex; k !== newIndex; k += increment) {
        workArray[k] = workArray[k + increment];
    }
    workArray[newIndex] = target;
    return workArray;
}