<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { Todo, TodoStatus } from '$lib/types';
	import {
		createTodo,
		deleteTodo,
		getAllTodos,
		searchTodosByTitle,
		updateTodo
	} from '$lib/todos';
	import { notify } from '$lib/stores/toast';
	import Select from '$lib/components/Select.svelte';

	let todos: Todo[] = [];
	let searchQuery = '';

	// Form state
	let title = '';
	let description = '';
	let status: TodoStatus = 'active';

	// Editing state
	let editingId: number | null = null;
	let editTitle = '';
	let editDescription = '';
	let editStatus: TodoStatus = 'active';

	const statusOptions = [
		{ value: 'active', label: 'активная' },
		{ value: 'completed', label: 'завершена' }
	];
	onMount(async () => {
		todos = await getAllTodos();
	});

	async function refreshList() {
		todos = searchQuery ? await searchTodosByTitle(searchQuery) : await getAllTodos();
	}

	async function handleAdd(e: SubmitEvent) {
		e.preventDefault();
		if (!title.trim()) return;
		try {
			await createTodo({ title, description, status });
			title = '';
			description = '';
			status = 'active';
			await refreshList();
			notify.success('Задача добавлена');
		} catch (err) {
			notify.error('Не удалось добавить задачу');
		}
	}

	function startEdit(todo: Todo) {
		editingId = todo.id ?? null;
		editTitle = todo.title;
		editDescription = todo.description ?? '';
		editStatus = todo.status;
	}

	async function saveEdit() {
		if (editingId == null) return;
		try {
			await updateTodo(editingId, {
				title: editTitle.trim(),
				description: editDescription.trim(),
				status: editStatus
			});
			editingId = null;
			await refreshList();
			notify.success('Изменения сохранены');
		} catch (err) {
			notify.error('Не удалось сохранить изменения');
		}
	}

	function cancelEdit() {
		editingId = null;
	}

	async function remove(id: number | undefined) {
		if (id == null) return;
		try {
			await deleteTodo(id);
			await refreshList();
			notify.success('Задача удалена');
		} catch (err) {
			notify.error('Не удалось удалить задачу');
		}
	}

	// Обновляем список при изменении поисковой строки
	$: (async () => {
		const q = searchQuery.trim();
		todos = q ? await searchTodosByTitle(q) : await getAllTodos();
	})();
</script>

<div class="min-h-screen bg-gray-50 text-gray-900">
	<div class="mx-auto max-w-screen-sm md:max-w-3xl lg:max-w-4xl px-3 sm:px-4 md:px-8 py-4 md:py-8">
		<h1 class="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 md:mb-6">Список задач</h1>

		<!-- Add form -->
		<form class="bg-white rounded-lg shadow p-3 sm:p-4 mb-6 space-y-4" on:submit|preventDefault={handleAdd}>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
				<div>
					<label class="block text-sm font-medium mb-1">Название</label>
					<input
						class="w-full rounded border border-gray-300 px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
						placeholder="Например: Купить молоко"
						bind:value={title}
						required
					/>
				</div>
				<div>
					<label class="block text-sm font-medium mb-1">Статус</label>
					<Select bind:value={status} options={statusOptions} placeholder="Статус" className="w-full" />
				</div>
				<div class="md:col-span-2">
					<label class="block text-sm font-medium mb-1">Описание</label>
					<textarea
						class="w-full rounded border border-gray-300 px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
						rows="3"
						placeholder="Дополнительные детали (опционально)"
						bind:value={description}
					/>
				</div>
			</div>
			<div class="flex items-center justify-end">
				<button
					type="submit"
					class="inline-flex items-center rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto justify-center"
				>
					Добавить
				</button>
			</div>
		</form>

		<!-- Search -->
		<div class="mb-4">
			<input
				class="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
				type="search"
				placeholder="Поиск по названию..."
				bind:value={searchQuery}
			/>
		</div>

		<!-- List -->
		<div class="space-y-3">
			{#if todos.length === 0}
				<p class="text-gray-500">Нет задач</p>
			{:else}
				{#each todos as t (t.id)}
					<div in:fade={{ duration: 150 }} out:fade={{ duration: 150 }}>
						<div class="bg-white rounded-lg shadow p-3 sm:p-4">
							{#if editingId === t.id}
								<div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
									<div>
										<label class="block text-sm font-medium mb-1">Название</label>
										<input
											class="w-full rounded border border-gray-300 px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
											bind:value={editTitle}
										/>
									</div>
									<div>
										<label class="block text-sm font-medium mb-1">Статус</label>
										<Select bind:value={editStatus} options={statusOptions} placeholder="Статус" className="w-full" />
									</div>
									<div class="md:col-span-2">
										<label class="block text-sm font-medium mb-1">Описание</label>
										<textarea
											class="w-full rounded border border-gray-300 px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
											rows="3"
											bind:value={editDescription}
										/>
									</div>
								</div>
								<div class="mt-4 flex gap-2 justify-end">
									<button
										class="rounded bg-gray-100 px-4 py-2 hover:bg-gray-200"
										type="button"
										on:click={cancelEdit}
									>
										Отмена
									</button>
									<button
										class="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
										type="button"
										on:click={saveEdit}
									>
										Сохранить
									</button>
								</div>
							{:else}
								<div class="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
									<div>
										<div class="flex items-center gap-2">
											<span
												class="inline-block h-2.5 w-2.5 rounded-full {t.status === 'completed'
													? 'bg-green-500'
													: 'bg-yellow-500'}"
											/>
											<h3 class="text-lg font-medium">{t.title}</h3>
										</div>
										{#if t.description}
											<p class="mt-1 text-sm text-gray-600">{t.description}</p>
										{/if}
										<p class="mt-1 text-xs text-gray-400">
											Создано: {new Date(t.createdAt).toLocaleString()}
											• Обновлено: {new Date(t.updatedAt).toLocaleString()}
										</p>
									</div>
									<div class="flex gap-2">
										<button
											class="rounded bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200 w-full md:w-auto"
											type="button"
											on:click={() => startEdit(t)}
										>
											Редактировать
										</button>
										<button
											class="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 w-full md:w-auto"
											type="button"
											on:click={() => remove(t.id)}
										>
											Удалить
										</button>
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>


