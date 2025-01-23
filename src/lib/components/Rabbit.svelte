<div class="rabbit"></div>

<style>
	* {
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}

	:root {
		--color: light-dark(white, black);
		--shadow: light-dark(#b78e81, #222222);
		--eye: light-dark(#3f3334, #f9f9f9);
		--outline: light-dark(#f7f5f4, #444444);
	}

	.rabbit {
		color-scheme: inherit;
		width: 5em;
		height: 3em;
		background: var(--color);
		border-radius: 70% 90% 60% 50%;
		position: relative;
		box-shadow: -0.2em 1em 0 -0.75em var(--shadow);
		-moz-transform: rotate(0deg) translate(-2em, 0);
		-ms-transform: rotate(0deg) translate(-2em, 0);
		-webkit-transform: rotate(0deg) translate(-2em, 0);
		transform: rotate(0deg) translate(-2em, 0);
		animation: hop 1s infinite linear;
		z-index: 1;
	}

	.rabbit:before {
		content: '';
		position: absolute;
		width: 1em;
		height: 1em;
		background: var(--color);
		border-radius: 100%;
		top: 0.5em;
		left: -0.3em;
		box-shadow:
			4em 0.4em 0 -0.35em var(--eye),
			0.5em 1em 0 var(--color),
			4em 1em 0 -0.3em var(--color),
			4em 1em 0 -0.3em var(--color),
			4em 1em 0 -0.4em var(--color);
		animation: kick 1s infinite linear;
	}
	.rabbit:after {
		content: '';
		position: absolute;
		width: 0.75em;
		height: 2em;
		background: var(--color);
		border-radius: 50% 100% 0 0;
		-moz-transform: rotate(-30deg);
		-ms-transform: rotate(-30deg);
		-webkit-transform: rotate(-30deg);
		transform: rotate(-30deg);
		right: 1em;
		top: -1em;
		border-top: 1px solid var(--outline);
		border-left: 1px solid var(--outline);
		box-shadow: -0.5em 0em 0 -0.1em var(--color);
	}

	@keyframes hop {
		20% {
			-moz-transform: rotate(-10deg) translate(1em, -2em);
			-ms-transform: rotate(-10deg) translate(1em, -2em);
			-webkit-transform: rotate(-10deg) translate(1em, -2em);
			transform: rotate(-10deg) translate(1em, -2em);
			box-shadow: -0.2em 3em 0 -1em var(--shadow);
		}
		40% {
			-moz-transform: rotate(10deg) translate(3em, -4em);
			-ms-transform: rotate(10deg) translate(3em, -4em);
			-webkit-transform: rotate(10deg) translate(3em, -4em);
			transform: rotate(10deg) translate(3em, -4em);
			box-shadow: -0.2em 3.25em 0 -1.1em var(--shadow);
		}
		60%,
		75% {
			-moz-transform: rotate(0) translate(4em, 0);
			-ms-transform: rotate(0) translate(4em, 0);
			-webkit-transform: rotate(0) translate(4em, 0);
			transform: rotate(0) translate(4em, 0);
			box-shadow: -0.2em 1em 0 -0.75em var(--shadow);
		}
	}
	@keyframes kick {
		20%,
		50% {
			box-shadow:
				4em 0.4em 0 -0.35em var(--eye),
				0.5em 1.5em 0 var(--color),
				4em 1.75em 0 -0.3em var(--color),
				4em 1.75em 0 -0.3em var(--color),
				4em 1.9em 0 -0.4em var(--color);
		}
		40% {
			box-shadow:
				4em 0.4em 0 -0.35em var(--eye),
				0.5em 2em 0 var(--color),
				4em 1.75em 0 -0.3em var(--color),
				4.2em 1.75em 0 -0.2em var(--color),
				4.4em 1.9em 0 -0.2em var(--color);
		}
	}
</style>
