<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { onDestroy } from 'svelte';

	export interface Option<T extends string = string> {
		value: T;
		label: string;
	}

	export let options: Option[] = [];
	export let value: string;
	export let placeholder = '';
	export let disabled = false;
	export let className = '';

	const dispatch = createEventDispatcher<{ value: string }>();

	let open = false;
	let rootEl: HTMLDivElement | null = null;
	let buttonEl: HTMLButtonElement | null = null;
	let highlighted = -1;

	function setValue(v: string) {
		value = v;
		dispatch('value', value);
		open = false;
	}

	function toggle() {
		if (disabled) return;
		open = !open;
		if (open) highlighted = options.findIndex((o) => o.value === value);
	}

	function onKeydown(e: KeyboardEvent) {
		if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === ' ')) {
			e.preventDefault();
			open = true;
			highlighted = options.findIndex((o) => o.value === value);
			return;
		}
		if (!open) return;
		if (e.key === 'Escape') {
			open = false;
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			highlighted = Math.min(options.length - 1, highlighted + 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			highlighted = Math.max(0, highlighted - 1);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (highlighted >= 0) setValue(options[highlighted].value);
		}
	}

	function handleClickOutside(e: MouseEvent) {
		if (!rootEl) return;
		if (!rootEl.contains(e.target as Node)) {
			open = false;
		}
	}

	onMount(() => {
		document.addEventListener('mousedown', handleClickOutside);
	});
	onDestroy(() => {
		document.removeEventListener('mousedown', handleClickOutside);
	});

	$: selected = options.find((o) => o.value === value);
</script>

<div bind:this={rootEl} class={"relative " + className}>
	<button
		bind:this={buttonEl}
		type="button"
		aria-haspopup="listbox"
		aria-expanded={open}
		class="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
		on:click={toggle}
		on:keydown={onKeydown}
		disabled={disabled}
	>
		<span class="truncate">{selected ? selected.label : placeholder}</span>
		<svg class="ml-2 h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<path d="M6 9l6 6 6-6" />
		</svg>
	</button>

	{#if open}
		<ul
			role="listbox"
			tabindex="-1"
			class="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 text-sm shadow-lg"
		>
			{#each options as opt, i (opt.value)}
				<li
					role="option"
					aria-selected={opt.value === value}
					class="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-50"
					class:hover={i !== highlighted}
					class:bg-gray-100={i === highlighted}
					on:mouseenter={() => (highlighted = i)}
					on:mousedown|preventDefault={() => setValue(opt.value)}
				>
					{#if opt.value === value}
						<span class="text-indigo-600">✓</span>
					{:else}
						<span class="opacity-0">✓</span>
					{/if}
					<span class="truncate">{opt.label}</span>
				</li>
			{/each}
		</ul>
	{/if}
</div>


