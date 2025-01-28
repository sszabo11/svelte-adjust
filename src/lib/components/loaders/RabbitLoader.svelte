<script>
	import Rabbit from '../Rabbit.svelte';
</script>

<div class="loading-container">
	<span>Loading advertisment</span>
	<Rabbit />
</div>

<style>
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
</style>
