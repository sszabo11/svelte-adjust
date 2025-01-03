<script lang="ts">
	import { onMount } from 'svelte';
	import { display } from '$lib/utils/display.js';
	import { derived } from 'svelte/store';

	type Props = {
		region?: string;
		fill?: 'width' | 'height';
	};

	const SERVER_CLICK = 'http://127.0.0.1:9000/lambda-url/click/';
	//const SERVER_CLICK = 'https://t5619t8v72.execute-api.us-east-1.amazonaws.com/Prod/click/click';

	let { region, fill = 'width' }: Props = $props();

	let ad: HTMLDivElement;
	let size_id: number | undefined = $state(undefined);
	let ad_id: number | undefined = $state(undefined);
	let page_time: number | undefined = undefined;
	let footer: HTMLSpanElement;

	//let url = $derived(`${http://127.0.0.1:9000/lambda-url/click/click}`)

	let loading = $state(true);

	let element: HTMLDivElement | null = $state(null);
	let error: string | null = $state(null);

	onMount(async () => {
		let now = performance.now();
		if (!element) return;
		let rect = element.getBoundingClientRect();

		// Calculate ratio of ad
		let ratio = rect.width / rect.height;

		let body = {
			tags: ['gym', 'equipment', 'fitness'],
			category: 'Travel',
			region: region ?? 'JP',
			language: 'fr',
			gender: 'any',
			ratio,
			fill
		};

		let {
			error: err,
			html,
			response,
			new: dimensions,
			ad_id: adId,
			size_id: size
		} = await display(ratio, body, rect);

		size_id = size;
		ad_id = adId;

		if (err) {
			error = err;
		} else if (html) {
			ad = html;
			element.appendChild(html);
		}

		if (response && dimensions) {
			let response_ratio = response.width / response.height;

			let duration = performance.now() - now;
			if (response_ratio === ratio) {
				footer.textContent = `Exact Size ✅       in ${duration}ms`;
			} else {
				footer.textContent = `Close Size 😔 \n ${response_ratio} - ${ratio}       in ${duration}ms`;
			}
			footer.style.top = `${dimensions.height}px`;
		}

		loading = false;

		//	document.addEventListener('visibilitychange', function () {
		//		if (document.hidden) {
		//			console.log('Browser tab is hidden');
		//		} else {
		//			console.log('Browser tab is visible');
		//		}
		//  });
		document.addEventListener('visibilitychange', (event) => {
			if (!page_time) return;
			if (document.visibilityState == 'visible') {
				console.log('tab is active');
				let duration = performance.now() - page_time;
				console.log('Bounce time: ', duration.toFixed(2), 'ms');
			} else {
				console.log('tab is inactive');
			}
		});
		console.info(performance.navigation.type);
		if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
			console.info('This page is reloaded');
		} else {
			console.info('This page is not reloaded');
		}
	});

	let details = $state(null);
	let show_details = $state(false);

	function setTimer() {
		page_time = performance.now();
	}
</script>

<a onclick={setTimer} class="ad-unit" href={`${SERVER_CLICK}?id=${size_id}`} target="_blank">
	{#if error}
		<h1>{error}</h1>
	{:else if loading}
		<h2>Loading</h2>
	{:else if show_details}
		<h2>Requested</h2>
		<pre>{JSON.stringify({}, null, 4)}</pre>

		<h2>Results</h2>
		<pre>{JSON.stringify(details, null, 4)}</pre>
	{/if}
	<div class="ad" class:hide={show_details} bind:this={element}></div>
	<div class="footer" bind:this={footer}></div>
</a>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
	.ad-unit {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.hide {
		display: none;
	}

	.ad {
		width: 100%;
		height: 100%;
	}
	h1 {
		color: red;
	}

	.ad-unit {
		text-decoration: none;
		color: black;
	}
	pre {
		width: 100%;
		height: 100%;
	}
	.footer {
		position: absolute;
		text-align: center;
		width: 100%;
	}
</style>
