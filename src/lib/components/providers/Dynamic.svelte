<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import ErrorMessage from '../error/ErrorMessage.svelte';

	type Props = {
		children: Snippet;
		group: string;
	};
	let { children, group }: Props = $props();

	let key = `dynamic-${group}`;
</script>

{#if group}
	<div class="dynamic-ads" data-group-name={key}>
		{@render children()}
	</div>
{:else}
	<ErrorMessage error="No group name" />
{/if}

<style>
	.dynamic-ads {
		all: inherit;
	}
</style>
