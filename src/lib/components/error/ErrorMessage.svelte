<script lang="ts">
	type Props = {
		error: string;
		code_error?: string | null;
	};
	let { error, code_error = null }: Props = $props();
</script>

<div class="error-container">
	<span class="error">{error}</span>
	{#if code_error}
		<pre><code class="language-html">{code_error}</code></pre>
		<a href="/docs/ad-units">Learn more</a>
	{/if}
</div>

<style>
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
</style>
