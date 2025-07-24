<script>
	let { data } = $props();
</script>

<header>
	<h1>{data.name}</h1>
	<a href="/">🏠↩️</a>
</header>

<p>
	<b>Alkuperä</b>:
	{#if data.source && data.source.startsWith('http')}
		<a href={data.source}>{data.source}</a>
	{:else}
		{data.source}
	{/if}
</p>

<p><b>Riitto:</b> {data.servings}</p>

{#if data.notes}
	<section class="liirumlaarum">
		<h3>Liirum laarum</h3>
		{#each data.notes as note}
			<p>{note}</p>
		{/each}
	</section>
{/if}

<main>
	<section>
		<h2>Ainehet</h2>
		<p>TODO: parsing sections etc.</p>
	</section>
	<section>
		<h2>Tee näin</h2>
		<ol>
			{#each data.method as step}
				<!-- TODO: implement strikethrough -->
				<li>{step}</li>
			{/each}
		</ol>
	</section>
</main>

<style>
	header {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	header > a {
		text-decoration: None;
	}

	main {
		width: 70%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.done {
		color: #aaaaaa;
		text-decoration: line-through;
	}

	.liirumlaarum {
		border: 1px dashed #555555;
		background-color: #f5f5f5;
		padding: 0.5rem 1rem 0.5rem 1rem;
		border-radius: 0.5rem;
		width: fit-content;
	}

	.liirumlaarum > h3 {
		margin: 0;
	}
</style>
