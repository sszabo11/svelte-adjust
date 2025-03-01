<script lang="ts">
	import 'animate.css';
	import { getContext, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { browser, dev } from '$app/environment';
	import { fade, slide } from 'svelte/transition';
	import { env } from '$env/dynamic/public';
	import { server_url } from '$lib/utils/server.js';
	import { display } from '$lib/utils/display.js';
	import Rabbit from './Rabbit.svelte';
	import ErrorMessage from './error/ErrorMessage.svelte';
	import Spinner from './loaders/Spinner.svelte';
	import RabbitLoader from './loaders/RabbitLoader.svelte';
	import type { EditorElement, ImageElement } from '$lib/types.js';

	type Props = {
		name: string;
		group?: string;
		region?: string;
		category?: string;
		tags?: string[];
		borderRadius?: number;
		key?: string;
		context?: string[];
		priority?: number;
		fill?: 'width' | 'height';
	};

	type AdData = {
		ad_unit_tag: string;
		ad_unit_name: string;
		ad_unit_group: string | null | undefined;
		ad_unit_type: string;
		key: string | undefined;
		in_viewport: boolean;
		endpoint: string;
		tags: string[];
		category: string;
		region: string;
		context: string | string[] | undefined;
		language: string;
		gender: string;
		ratio: number;
		fill: string;
		width: number;
		height: number;
	};

	let server_click = server_url({ prod: '/click/click', dev: '/click/click/click/click' });
	let { name, key, group, region, fill, priority, category, context, tags, borderRadius }: Props =
		$props();

	let ad: HTMLAnchorElement;
	let container_element: HTMLDivElement;
	let element: HTMLDivElement | null = $state(null);

	let size_id: number | undefined = $state(undefined);
	let ad_id: number | undefined = $state(undefined);
	let ad_unit_id: number | undefined = $state(undefined);
	let ad_unit_tag = $state('');
	let ad_name = $state('');

	let data: AdData = $state(null);

	let page_time: number | undefined = undefined;
	let ad_dimensions = $state({ width: 0, height: 0 });

	let error: string | null = $state(null);
	let code_error: string | null = $state(null);
	let warning: string | null = $state(null);

	let is_group: boolean = $state(group && key ? true : false);

	let in_viewport = $state(false);
	let loader: string = getContext('ad_loader');
	let loading = $state(true);

	onMount(async () => {
		console.log('start mount');
		let intersectionObserverManager = (await import('$lib/utils/intersection.js'))
			.intersectionObserverManager;

		requestAnimationFrame(async () => {
			console.log('Ad component');

			let api_key = env.PUBLIC_ADJUST_KEY;

			console.log(api_key);

			if (dev && $page.url.host.startsWith('localhost') && !api_key) {
				warning = 'Development PUBLIC_ADJUST_KEY not set. Please use your development key';
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

			if (
				!parent?.children ||
				parent.children.length !== 1 ||
				parent.children[0].id !== 'ad-unit'
			) {
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
			console.log(rect, window.getComputedStyle(element), element, element.clientHeight);

			let computedStyle = window.getComputedStyle(element);

			console.log('height str', computedStyle.height);
			let width = Number(computedStyle.width.split('px')[0]);
			let height = Number(computedStyle.height.split('px')[0]);

			console.log('width: ', width);
			console.log('height: ', height);

			// Calculate ratio of ad
			let ratio = width / height;

			console.log(parent.parentElement, parent);
			let index_of_element = parent.parentElement
				? Array.from(parent.parentElement.children).findIndex((e) => e === parent)
				: -1;

			console.log(index_of_element);

			let curr_element: HTMLElement | null = element;
			let dynamic: string | null = null;
			//let ad_unit_tag = `${parent.tagName}-${Array.from(parent.classList).join('')}-${parent.id}-${index_of_element}`;
			while (curr_element && curr_element.tagName !== 'BODY') {
				//if (group) {
				//  let count= 0;
				//  [...curr_element.children].forEach((child) => {
				//    if (child.)
				//  })
				//}
				let index_of_element = curr_element.parentElement
					? Array.from(curr_element.parentElement.children).findIndex((e) => e === curr_element)
					: -1;
				ad_unit_tag += `${curr_element.tagName}-${Array.from(curr_element.classList).join('')}-${curr_element.id}-${index_of_element}`;
				let groupName = curr_element.parentElement?.dataset.groupName;
				if (groupName) {
					dynamic = groupName;
				}

				if (curr_element.parentElement) {
					curr_element = curr_element.parentElement;
				} else {
					break;
				}
			}

			console.log(dynamic);
			if (group && !key) {
				error = 'Please provide key with a dynamic ad';
				code_error = '<Ad key="your_key"/>';
				return;
			}

			let container_rect = container_element.getBoundingClientRect();

			if (
				container_rect.top >= 0 &&
				container_rect.left >= 0 &&
				container_rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
				container_rect.right <= (window.innerWidth || document.documentElement.clientWidth)
			) {
				console.log('!Element is in viewport');
				in_viewport = true;
			} else {
				in_viewport = false;
			}

			console.log(in_viewport);

			let group_element: HTMLElement | null = container_element;
			let group_tag = '';

			if (group && key) {
				while (group_element && group_element.tagName !== 'BODY') {
					group_element = group_element.parentElement;
					if (!group_element) return;

					let index_of_element = group_element
						? Array.from(group_element.children).findIndex((e) => e === group_element)
						: -1;
					group_tag += `${group_element.tagName}-${Array.from(group_element.classList).join('')}-${group_element.id}-${index_of_element}`;

					console.log('group', group_element);
					if (group_element && group_element.dataset.groupName) {
						break;
					}
				}
			}

			if (!group_element.dataset.groupName) {
				is_group = false;
			}

			if (!group || !key) {
				is_group = false;
			}

			let group_name = dynamic && dynamic + '-' + key;

			ad_name = is_group && group_name ? group_name : name;

			console.log('group element', group_element);
			console.log('group tag', group_tag);
			console.log('ad unit tag', ad_unit_tag);

			let pageParams = $page.params;
			let pattern = $page.route.id && convertBracketsToColons($page.route.id);

			data = {
				ad_unit_tag: is_group ? group_tag : ad_unit_tag,
				ad_unit_name: ad_name,
				ad_unit_group: is_group ? group : null,
				ad_unit_type: is_group && group ? 'group' : 'page',
				key,
				in_viewport,
				endpoint: pageParams && pattern ? pattern : $page.url.pathname,
				tags: tags ?? ['gym', 'equipment', 'fitness'],
				category: category ?? 'Educational Toys',
				region: region ?? 'JP',
				context,
				language: 'fr',
				gender: 'any',
				ratio,
				fill: fill ?? '',
				width: rect.width,
				height: rect.height
			};

			console.log(ratio);

			if (!priority) {
				priority = in_viewport ? 3 : 0;
			}

			console.log('fwr', element, in_viewport);

			await load({ element, priority, in_viewport });
			console.log('fwre', element, in_viewport);

			//let {
			//	error: err,
			//	html,
			//	response,
			//	new: dimensions,
			//	ad_id: adId,
			//	size_id: size
			//} = await display(ratio, data, { width, height }, borderRadius || 0, priority);

			//console.log(response, err);
			//ad_dimensions = dimensions;

			//if (err && err.includes('duplicate key value violates unique constraint "uq_ad_unit"')) {
			//	error = `Ad units do not have unique names: ${name}`;
			//	return;
			//}

			//size_id = size;
			//ad_id = adId;

			//if (err) {
			//	console.error('query error', err);
			//	error = err;
			//} else if (html) {
			//	ad = html;

			//	ad_unit_id = response.ad_unit_id;
			//	ad.href = dev ? '' : !error ? `${server_click}?id=${size_id}_${ad_id}_${ad_unit_id}` : '';

			//	element.appendChild(html);
			//}
			console.log(ad_unit_id);

			if (in_viewport) {
				loading = false;
			}
			//if (in_viewport) {
			//	let images = [...ad.querySelectorAll('img')];
			//	await waitForImages(images);
			//	console.log('The images done');
			//	//console.log('gev');
			//	//let now = performance.now();
			//	//console.log('Loading images...', now);
			//	//await Promise.all(images.map((im) => new Promise((resolve) => (im.onload = resolve)))).then(
			//	//	() => {
			//	//		console.log('The images have loaded in: ', performance.now() - now, 'ms');
			//	//	}
			//	//);
			//	loading = false;
			//}
			console.log('njo');
			observe(ad_unit_tag);
			//loading = false;
		});
		console.log('finish frame');
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
		console.log('end mount');
	});

	async function waitForImages(images: HTMLImageElement[]) {
		await Promise.all(images.map((im) => new Promise((resolve) => (im.onload = resolve)))).then(
			() => {
				console.log('The images have loaded for: ', name);
				return true;
			}
		);
	}

	let details = $state(null);
	let show_details = $state(false);

	function setTimer() {
		page_time = performance.now();
	}
	function convertBracketsToColons(path: string) {
		return path.replace(/\[([^\]]+)\]/g, ':$1');
	}

	async function load({
		element,
		priority,
		in_viewport
	}: {
		in_viewport: boolean;
		element: HTMLDivElement;
		priority: number;
	}) {
		console.log('Loading ad...', in_viewport, element);
		if (!in_viewport) return;
		let {
			error: err,
			html,
			response,
			new: dimensions,
			ad_id: adId,
			elements,
			size_id: size
		} = await display(data, borderRadius || 0, priority);

		console.log(response, err);
		ad_dimensions = dimensions;

		if (err && err.includes('api key does not exist')) {
			error = `API key does not exist. View your API keys at https://adjustv4.vercel.app/site/dashboard/keys`;
			return;
		}

		if (err && err.includes('duplicate key value violates unique constraint "uq_ad_unit"')) {
			error = `Ad units do not have unique names: ${name}`;
			return;
		}
		size_id = size;
		ad_id = adId;

		if (err) {
			console.error('query error', err);
			error = err;
		} else if (html) {
			ad = html;

			ad_unit_id = response.ad_unit_id;
			ad.href = dev ? '' : !error ? `${server_click}?id=${size_id}_${ad_id}_${ad_unit_id}` : '';

			element.appendChild(html);
		}
		let images = [...ad.querySelectorAll('img')];
		let fonts = findFonts(elements!);
		loadFonts(fonts);
		await waitForImages(images);
	}

	function findFonts(elements: EditorElement[]) {
		return elements
			.map((e) => {
				if (e.type === 'text' && e.font) {
					return e.font.family;
				}
			})
			.filter((f) => f !== undefined);
	}

	function loadFonts(fonts: string[]) {
		WebFont.load({
			google: {
				families: fonts
			}
		});
	}

	function observe(tag: string) {
		console.log(container_element);
		//observer.observe(
		//	container_element,
		//	(entry: IntersectionObserverEntry) => (in_viewport = entry.isIntersecting)
		//);
		//console.log(in_viewport, container_element);
		//let is_observer = sessionStorage.getItem('view-observer');

		//console.log('dfe', is_observer, tag, in_viewport);
		//if ((tag && !is_observer) || is_observer === tag) {
		//	console.log('observing', tag);
		//	sessionStorage.setItem('view-observer', tag);
		const intersectionObserver = new IntersectionObserver((entries) => {
			entries.forEach(async (entry) => {
				if (entry.isIntersecting) {
					console.log('Element is in the viewport!', entry, in_viewport, container_element);

					if (!in_viewport) {
						console.log('GEr', element, priority);
						in_viewport = true;
						await load({ element, priority, in_viewport });
						loading = false;
					}
					//in_viewport = true;
					// Add logic for when the element is visible
				} else {
					console.log('Element is out of the viewport!', entry, in_viewport, tag);
					// Add logic for when the element is not visible
				}
			});
		});
		intersectionObserver.observe(container_element);
		//}
	}

	let hover = $state(false);
	function setHover(v: boolean) {
		hover = v;
	}

	//$effect(() => {
	//	console.log('grb', in_viewport, container_element);
	//	if (in_viewport && container_element && browser) {
	//		console.log('grb');
	//		load({ element, priority, in_viewport });
	//	}
	//});

	$inspect(in_viewport).with((type, value) => console.log('fvwr', value, container_element));
</script>

<svelte:head>
	<script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
</svelte:head>
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
		<ErrorMessage {error} {code_error} />
	{:else if warning}
		<div class="warning-container">
			<span class="warning">Warning: {warning}</span>
		</div>
	{:else if loading}
		{#if loader === 'rabbit'}
			<RabbitLoader />
		{:else if loader === 'spinner'}
			<Spinner />
		{:else}
			<Spinner />
		{/if}
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
			class:hide={loading}
			role="link"
			tabindex="-1"
			onmouseover={dev ? () => setHover(true) : null}
			onmouseleave={dev ? () => setHover(false) : null}
			bind:this={element}
		>
			{#if dev && hover}
				<div
					in:slide={{ axis: 'x', duration: 300 }}
					style="right: calc(5px - {ad_dimensions.width - element.getBoundingClientRect().width}px)"
					class="name"
				>
					<span>{ad_name}</span>
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

	.hide {
		opacity: 0;
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
		transition: opacity 0.2s ease-in;
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
