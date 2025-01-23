import { setContext } from 'svelte';

export function initializeAds(id: string) {
	setContext('site_id', id);
}
