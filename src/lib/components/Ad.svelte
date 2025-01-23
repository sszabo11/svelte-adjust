<script lang="ts">
	import 'animate.css';
	import { getContext, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import { fade, slide } from 'svelte/transition';
	import { env } from '$env/dynamic/public';
	import { server_url } from '$lib/utils/server.js';
	import { display } from '$lib/utils/display.js';
	import Rabbit from './Rabbit.svelte';

	type Props = {
		name: string;
		region?: string;
		category?: string;
		tags?: string[];
		context?: string[];
		fill?: 'width' | 'height';
	};

	let site_id: any = getContext('site_id');

	let server_click = server_url({ prod: '/click', dev: '/click' });
	let { name, region, fill = 'width', category, context, tags }: Props = $props();

	let ad: HTMLAnchorElement;
	let container_element: HTMLDivElement;
	let size_id: number | undefined = $state(undefined);
	let ad_id: number | undefined = $state(undefined);
	let page_time: number | undefined = undefined;
	let ad_dimensions = $state({ width: 0, height: 0 });
	let ad_unit_id: number | undefined = $state(undefined);

	let loading = $state(true);

	let element: HTMLDivElement | null = $state(null);
	let error: string | null = $state(null);
	let warning: string | null = $state(null);
	let code_error: string | null = $state(null);

	onMount(async () => {
		console.log('Ad component');
		let api_key = env.PUBLIC_ADJUST_DEV_KEY;
		console.log(api_key);
		if (dev && $page.url.host.startsWith('localhost') && !api_key) {
			warning = 'No PUBLIC_ADJUST_DEV_KEY set.  This means you wont be able to update ad units';
		}

		if (!site_id || isNaN(Number(site_id))) {
			console.log('site_id', Number(site_id));
			error = 'No site_id found in context';
			return;
		}

		if (!name) {
			error = 'No name provided for ad unit';
			return;
		}

		let parent = container_element.parentElement;

		if (!parent) {
			error = 'No parent for ad unit';
			return;
		}

		if (!parent?.children || parent.children.length !== 1 || parent.children[0].id !== 'ad-unit') {
			console.log(parent, parent.children);

			let tag = parent.tagName;
			let className = parent.className;
			let children: string[] = [];
			children.push(`<${tag.toLowerCase()} class="${className}">`);

			for (let i = 0; i < parent.children.length; i++) {
				let id = parent.children.item(i)!.id;
				if (id === 'ad-unit') {
					children.push('   <Ad />  // There should only be one');
				} else {
					let tag = parent.children.item(i)!.tagName;
					let className = parent.children.item(i)!.className;
					children.push(
						`   <${tag.toLowerCase()} class="${className}" id="${id}"></${tag.toLowerCase()} />`
					);
				}
			}
			children.push(`</${tag.toLowerCase()} >`);
			code_error = children.join('\n');
			error = 'Please only provide one Ad per parent';
			return;
		}

		if (!element) return;
		let rect = element.getBoundingClientRect();
		console.log(rect, element);

		// Calculate ratio of ad
		let ratio = rect.width / rect.height;

		console.log(parent.parentElement);
		let index_of_element = parent.parentElement
			? Array.from(parent.parentElement.children).findIndex((e) => e === parent)
			: -1;

		console.log(index_of_element);
		let ad_unit_tag = `${parent.tagName}-${Array.from(parent.classList).join('')}-${parent.id}-${index_of_element}`;
		console.log('ad unit tag', ad_unit_tag);
		let body = {
			ad_unit_tag,
			ad_unit_name: name,
			site_id: Number(site_id),
			endpoint: $page.url.pathname,
			tags: tags ?? ['gym', 'equipment', 'fitness'],
			category: category ?? 'Educational Toys',
			region: region ?? 'JP',
			context,
			language: 'fr',
			gender: 'any',
			ratio,
			fill,
			width: rect.width,
			height: rect.height
		};
		console.log(ratio);

		let {
			error: err,
			html,
			response,
			new: dimensions,
			ad_id: adId,
			size_id: size
		} = await display(ratio, body, rect);

		console.log(response, err);
		ad_dimensions = dimensions;

		if (err && err.includes('duplicate key value violates unique constraint "uq_site_name_dev"')) {
			error = `Ad units do not have unique names: ${name}`;
			return;
		}

		console.log('element adunitid', container_element.dataset.adUnitId);
		//let prev_units = JSON.parse(localStorage.getItem('ad_units') ?? '{}');
		//localStorage.setItem('ad_units', JSON.stringify({ ...prev_units, [ad_unit_id]: name }));
		//console.log(prev_units);

		size_id = size;
		ad_id = adId;

		if (err) {
			console.log('erro', err);
			error = err;
		} else if (html) {
			ad = html;

			ad.href = dev ? '' : !error ? `${server_click}?id=${size_id}_${ad_id}` : '';

			element.appendChild(html);
		}
		ad_unit_id = response.ad_unit_id;

		let images = [...ad.querySelectorAll('img')];

		//for (let i = 0; i < images.length; i++){
		//  images[images.item(i).onlo]
		//}
		await Promise.all(images.map((im) => new Promise((resolve) => (im.onload = resolve)))).then(
			() => {
				console.log('The images have loaded at last!\nHere are their dimensions (width,height):');
				console.log(images.map((im) => [im.width, im.height]));
			}
		);

		//images.forEach((im, i) => (im.src = im.src));

		loading = false;

		//if (response && dimensions) {
		//	let response_ratio = response.width / response.height;

		//	let duration = performance.now() - now;
		//	if (response_ratio === ratio) {
		//		footer.textContent = `Exact Size ✅       in ${duration}ms`;
		//	} else {
		//		footer.textContent = `Close Size 😔 \n ${response_ratio} - ${ratio}       in ${duration}ms`;
		//	}
		//	footer.style.top = `${dimensions.height}px`;
		//}

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

	let hover = $state(false);
	function setHover(v: boolean) {
		hover = v;
	}
</script>

<div
	onclick={setTimer}
	onkeydown={() => {}}
	role="button"
	tabindex="-1"
	id="ad-unit"
	class="ad-unit"
	data-ad-unit-id={ad_unit_id}
	bind:this={container_element}
>
	{#if error}
		<div class="error-container">
			<span class="error">{error}</span>
			{#if code_error}
				<pre><code class="language-html">{code_error}</code></pre>
				<a href="/docs/ad-units">Learn more</a>
			{/if}
		</div>
	{:else if warning}
		<div class="warning-container">
			<span class="warning">Warning: {warning}</span>
		</div>
	{:else if loading}
		<div class="loading-container">
			<span>Loading advertisment</span>
			<Rabbit />
		</div>
	{:else if show_details}
		<h2>Requested</h2>
		<pre>{JSON.stringify({}, null, 4)}</pre>

		<h2>Results</h2>
		<pre>{JSON.stringify(details, null, 4)}</pre>
	{/if}
	<div class="ad-container">
		<div
			class="ad"
			aria-label="Ad"
			onfocus={() => {}}
			role="link"
			tabindex="-1"
			onmouseover={dev ? () => setHover(true) : null}
			onmouseleave={dev ? () => setHover(false) : null}
			class:hide={show_details}
			bind:this={element}
		>
			{#if dev && hover}
				<div
					in:slide={{ axis: 'x', duration: 300 }}
					style="right: calc(5px - {ad_dimensions.width - element.getBoundingClientRect().width}px)"
					class="name"
				>
					<span>{name}</span>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
	.ad-unit {
		width: 100%;
		height: 100%;
		position: relative;
		outline: none;
		overflow: hidden;
	}

	.name {
		position: absolute;
		z-index: 999;
		top: 5px;
		right: 5px;
		padding: 2px 6px;
		border-radius: 4px;
		border: 1px solid black;
		transition: display 0.2s ease-in;
		background-color: #333333;
	}

	.loading-container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border-radius: 16px;
		color-scheme: light;
		background-color: #e2b29f;
	}

	.loading-container span {
		position: absolute;
		top: 20px;
		color: white;
	}

	.name .ad-container {
		width: 100%;
		height: 100%;
	}

	.name span {
		color: white;
		text-wrap: nowrap;
		font-size: 14px;
	}

	.hide {
		display: none;
	}

	.ad-container {
		width: 100%;
		height: 100%;
	}

	pre {
		width: 100%;
		background-color: white;
		padding: 10px;
		box-sizing: border-box;
		border-radius: 12px;
		overflow: scroll;
	}

	.ad {
		display: block;
		width: 100%;
		height: 100%;
	}
	.error-container {
		background-color: #ff8c8c;
		border-radius: 12px;
		text-align: left;
		padding: 12px;
		box-sizing: border-box;
	}
	.error {
		font-weight: 500;
		font-size: 18px;
		color: #831414;
	}

	.warning-container {
		background-color: #ffcf8c;
		text-align: left;
		top: 50px;
		border-radius: 12px;
		position: absolute;
		z-index: 999;
		padding: 12px;
		box-sizing: border-box;
	}
	.warning {
		font-weight: 500;
		font-size: 18px;
		color: #dd5c00;
	}

	.error-container a {
		color: black;
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

	h2 {
		margin: 0;
	}
</style>

