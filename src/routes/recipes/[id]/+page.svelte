<script>
	let { data } = $props();

	let steps = $state(data.method.map((step) => ({ text: step, done: false })));

	function toggleDone(element) {
		//not sure if this works in Svelte
		element.classList.toggle('done');
	}
</script>

<body>
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
			<!-- {%- for group, values in ingredients %}
            {%- if group %}<b>{{ group }}</b>{% endif %}
            <ul>
                {%- for ingredient in values %}
                <li onclick="toggleDone(this)">{{ ingredient }}</li>
                {%- endfor %}
            </ul>
            {%- endfor %} -->
		</section>
		<section>
			<h2>Tee näin</h2>
			<ol>
				{#each steps as step}
					<!-- TODO: implement strikethrough -->
					<li>{step.text}</li>
				{/each}
			</ol>
		</section>
	</main>
</body>

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
