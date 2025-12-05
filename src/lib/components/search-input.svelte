<script>
	import Input from './ui/input/input.svelte';
	let { value = $bindable(), shortcut = true, ...restProps } = $props();
	let ref = $state(null); // $state here to silence warning, though it is technically silly

	// If there are multiple instances of this component on a page, the shortcut
	// ctrl+f probably chooses one at random (unless shortcut=false). If this becomes
	// a problem, should probably implement some way to cycle the inputs.

	function focusInput(event) {
		if (event.ctrlKey && event.key === 'f') {
			event.preventDefault();
			ref.focus();
		}
	}

	if (shortcut) {
		$effect(() => {
			window.addEventListener('keydown', focusInput);

			return () => {
				window.removeEventListener('keydown', focusInput);
			};
		});
	}
</script>

<Input bind:ref bind:value {...restProps} />
