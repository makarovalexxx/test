<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { toasts, dismissToast, type Toast } from '$lib/stores/toast';
	import { derived } from 'svelte/store';

	const items = derived(toasts, (v) => v);
</script>

<div class="pointer-events-none fixed right-3 top-3 z-50 flex w-full max-w-sm flex-col gap-2">
	{#each $items as t (t.id)}
		<div
			in:fly={{ x: 24, duration: 150 }}
			out:fade={{ duration: 150 }}
			class="pointer-events-auto rounded-md border border-gray-200 bg-white p-3 shadow"
		>
			<div class="flex items-start gap-2">
				<div class="{t.type === 'success' ? 'text-green-600' : t.type === 'error' ? 'text-red-600' : 'text-blue-600'}">
					{#if t.type === 'success'}✓{/if}
					{#if t.type === 'error'}⚠{/if}
					{#if t.type === 'info'}ℹ{/if}
				</div>
				<div class="flex-1 text-sm">{t.message}</div>
				<button
					class="rounded px-1 text-gray-400 hover:text-gray-600"
					on:click={() => dismissToast(t.id)}
					aria-label="Закрыть"
				>
					✕
				</button>
			</div>
		</div>
	{/each}
</div>


