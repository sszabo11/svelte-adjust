<script lang="ts">
	import Ad from '$lib/components/Ad.svelte';
	import Dynamic from '$lib/components/providers/Dynamic.svelte';
	import Group from '$lib/components/providers/Group.svelte';
	import { initializeAds } from '$lib/index.js';
	import { onMount } from 'svelte';

	let mounted = $state(false);

	initializeAds('8');
	//<Dynamic group="for-you">
	//	<div class="content">
	//		<h2>Article: bananas</h2>
	//		<span>By John Doe</span>
	//	</div>
	//	<div class="ad">
	//		<Ad key="1" name="article-1" region="US" category="Travel" />
	//	</div>
	//	<div class="ad">
	//		<Ad key="2" name="article-1" region="US" category="Travel" />
	//	</div>
	//	<div class="ad">
	//		<Ad key="3" name="article-1" region="US" category="Travel" />
	//	</div>
	//</Dynamic>
</script>

<div class="page">
	<h1>some text</h1>
	<div class="ad-off">
		<Ad name="meow" region="US" category="Travel" />
	</div>
	<div class="articles">
		<div class="content">
			<h2>Article: bananas</h2>
			<span>By John Doe</span>
		</div>
		<Group name="for-you">
			<div class="ad">
				<Ad group="for-you" key="1" name="article-1" region="US" category="Travel" />
			</div>
			<div class="ad">
				<Ad group="for-you" key="2" name="article-1" region="US" category="Travel" />
			</div>
			<div class="ad">
				<Ad group="for-you" key="3" name="article-1" region="US" category="Travel" />
			</div>
		</Group>
	</div>
</div>

<style>
	.page {
		background-color: black;
		width: 100vw;
		padding: 50px;
		color: white;
		box-sizing: border-box;
		height: 100vh;
	}

	h1 {
		color: white;
		margin: 0;
	}

	.ad-off {
		position: absolute;
		left: 150vw;
		width: 300px;
		height: 250px;
		border: 1px solid #444444;
	}

	.ad {
		width: 300px;
		height: 250px;
		border: 1px solid #444444;
	}
	.articles {
		display: flex;
		align-items: center;
	}
</style>
