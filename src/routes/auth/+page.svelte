<script>
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<form method="POST" action="?/login">
	<Label>
		Email
		<Input name="email" type="email" />
	</Label>
	<Label>
		Password
		<Input name="password" type="password" />
	</Label>
	<Button type="submit">Login</Button>
	<Button formaction="?/signup" type="submit" disabled>Sign up</Button>
</form>
