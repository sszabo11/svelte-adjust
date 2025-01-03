<script lang="ts">
	import Ad from '$lib/components/Ad.svelte';
	import { onMount } from 'svelte';

	let mounted = false;

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>The Art of Urban Gardening</title>
	<meta
		name="description"
		content="Discover the joys and challenges of creating green spaces in urban environments."
	/>
</svelte:head>

<div class="container">
	<main>
		<article>
			<h1>The Art of Urban Gardening</h1>

			{#if mounted}
				<img
					src="https://images.stockcake.com/public/4/0/0/400de0c1-ccc0-4a03-87ba-e060eca4b4f1_large/urban-rooftop-garden-stockcake.jpg"
					alt="Urban garden on a rooftop"
					class="featured-image"
				/>
			{/if}

			<p class="lead">
				In the concrete jungle of modern cities, a green revolution is taking root. Urban gardening,
				once a niche hobby, has blossomed into a movement that's transforming our urban landscapes
				and the way we think about food production.
			</p>

			<h2>The Rise of Urban Gardens</h2>
			<p>
				As cities expand and green spaces shrink, urbanites are finding innovative ways to bring
				nature back into their lives. From rooftop gardens to vertical plant walls, urban gardening
				is proving that you don't need acres of land to cultivate a thriving garden.
			</p>

			<h2>Benefits of Urban Gardening</h2>
			<ul>
				<li>Improved air quality</li>
				<li>Access to fresh, organic produce</li>
				<li>Reduced carbon footprint</li>
				<li>Enhanced mental health and well-being</li>
				<li>Community building and social interaction</li>
			</ul>

			<h2>Getting Started with Urban Gardening</h2>
			<p>
				Whether you have a spacious balcony or just a sunny windowsill, there's an urban gardening
				solution for you. Container gardening, vertical gardening, and even hydroponic systems are
				all viable options for the space-constrained gardener.
			</p>

			<blockquote>"To plant a garden is to believe in tomorrow." - Audrey Hepburn</blockquote>

			<div class="page-ad">
				<Ad region="FR" fill="width" />
			</div>

			<h2>Overcoming Challenges</h2>
			<p>
				Urban gardening comes with its own set of challenges, from limited sunlight to soil quality
				issues. However, with a bit of creativity and persistence, these obstacles can be overcome.
				Innovative solutions like self-watering planters and vertical gardening systems are making
				it easier than ever to maintain a thriving urban garden.
			</p>

			<h2>The Future of Urban Gardening</h2>
			<p>
				As technology advances and awareness grows, the future of urban gardening looks bright. From
				smart gardens that monitor plant health to community initiatives transforming vacant lots
				into productive green spaces, urban gardening is set to play a crucial role in creating more
				sustainable and livable cities.
			</p>

			<h2>Conclusion</h2>
			<p>
				Urban gardening is more than just a hobby; it's a way to reconnect with nature, improve our
				environment, and build stronger communities. Whether you're a seasoned gardener or a curious
				beginner, there's never been a better time to get your hands dirty and join the urban
				gardening movement.
			</p>
		</article>
	</main>
	<aside>
		<div class="ad-container">
			<div class="ad">
				<Ad region="DE" />
			</div>
			<div class="square-ad">
				<Ad region="DE" />
			</div>
			<div class="square-ad">
				<Ad region="US" />
			</div>
		</div>
		<div class="sq">
			<a href="http://127.0.0.1:9000/lambda-url/click/click?id=13" target="_blank">Server</a>
		</div>
	</aside>
</div>

<style>
	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu,
			Cantarell, 'Helvetica Neue', sans-serif;
		line-height: 1.6;
		color: #333;
		background-color: #f9fafb;
		margin: 0;
		padding: 0;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
		display: flex;
		gap: 2rem;
	}

	main {
		flex: 1;
		background-color: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	aside {
		width: 300px;
	}

	.ad-container {
	}

	h1 {
		font-size: 2.5rem;
		text-align: center;
		margin-bottom: 1.5rem;
		color: #2c3e50;
	}

	h2 {
		font-size: 1.8rem;
		margin-top: 2rem;
		margin-bottom: 1rem;
		color: #34495e;
	}

	p {
		margin-bottom: 1rem;
	}

	.lead {
		font-size: 1.2rem;
		font-weight: 300;
		color: #555;
	}

	.featured-image {
		width: 100%;
		height: auto;
		border-radius: 8px;
		margin-bottom: 1.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	ul {
		margin-bottom: 1rem;
		padding-left: 1.5rem;
	}

	li {
		margin-bottom: 0.5rem;
	}

	blockquote {
		font-style: italic;
		border-left: 4px solid #3498db;
		padding-left: 1rem;
		margin: 1.5rem 0;
		color: #555;
	}

	@media (max-width: 1024px) {
		.container {
			flex-direction: column;
		}

		aside {
			width: 100%;
		}
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}

		main {
			padding: 1.5rem;
		}

		h1 {
			font-size: 2rem;
		}

		h2 {
			font-size: 1.5rem;
		}
	}

	.small-ad {
		width: 200px;
		height: 500px;
	}

	.page-ad {
		width: 650px;
		height: 300px;
	}
	.ad {
		width: 100%;
		height: 500px;
	}

	.square-ad {
		width: 300px;
		height: 300px;
	}
</style>
