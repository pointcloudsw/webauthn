<script lang="ts">
import { createList, getLists } from './data.remote.js';
// import { type Item, type List } from '$lib/types/list';

let { data } = $props();
let { userId, username } = data;

createList.fields.created.set((new Date()).toString());
createList.fields.editable.set(true);
createList.fields.owner.set(userId);

const { created, dbid, editable, id, items, owner, title } = createList.fields;
// let listItem: Item, listItems: Item[];
// let list: List, lists: List[];
</script>

<header>
	<a href="/">Home</a>
	<a href="/settings">Settings</a>
	{#if username}
		<a href="/auth/logout">Logout</a>
	{:else}
		<a href="/auth/login">Login</a>
	{/if}
	<p>{username ?? "Please login"}</p>
</header>

<main>
	{#if userId}
		<section class="lists">
			<h1>Todo Lists</h1>
			<div class="todo-list">
				{#each await getLists(userId) as list}
					<div>
						<p>{list.title}</p>
						<p>{list.owner}</p>
						<div class="todo-items">
						{#each list?.items as i}
							<p>{i.text}
							{i.created}
							 {i.editable}</p>
						{/each}
						</div>
					</div>
				{:else}
					<p>no records found</p>
				{/each}
			</div>
		</section>
		<section class="list new">
		<!-- see https://svelte.dev/tutorial/kit/other-handlers -->

			<h1>New List</h1>
			<form {...createList} enctype="multipart/form-data">
				<label>
					<h2>Title</h2>
					<input {...title.as('text')} />
				</label>
				<label>
					Editable
					<input {...editable.as('checkbox')} />
				</label>
				<label>
					Owner
					<input {...owner.as('number')} />
				</label>
				<label>
					Created
					<input {...created.as('text')} />
				</label>
				<label>
					ID
					<input {...id.as('number')} />
				</label>
				<label>
					DBID
					<input {...dbid.as('text')} />
				</label>
				<p>Items
					<label>
						Created
						<input {...items[0].created.as('text')} />
					</label>
					<label>
						DBID
						<input {...items[0].dbid.as('text')} />
					</label>
					<label>
						Editable
						<input {...items[0].editable.as('checkbox')} />
					</label>
					<label>
						Flag
						<input {...items[0].flag.as('number')} />
					</label>
					<label>
						ID
						<input {...items[0].id.as('number')} />
					</label>
					<label>
						Priority
						<input {...items[0].priority.as('number')} />
					</label>
					<label>
						Sequence
						<input {...items[0].sequence.as('number')} />
					</label>
					<label>
						Status
						<input {...items[0].status.as('number')} />
					</label>
					<label>
						Description
						<input {...items[0].text.as('text')} />
					</label>
				</p>
				<!-- <input {...items.as('hidden', [])} /> -->


				<!-- <label>
					<h2>Add item</h2>
					<input
						type="text"
						autocomplete="off"
						onkeydown={e => {
							if (e.key !== 'Enter') return;

							const input = e.currentTarget;
							// listItem.text = input?.value ?? '';
						}}
					/>
				</label> -->
				<button>Save</button>
			</form>
			
		</section>
	{/if}

</main>

<style>
form {
	display: grid;
	grid: auto / 1fr;
}
main {
	display: grid;
	grid: 1fr 1fr / auto;
}
main .list.new {
	background: slategrey;
}
main .lists {
	background: lightslategray;
}
.todo-list, .todo-items {
	display: grid;
	grid: auto;
	/* grid-auto-flow: row; */
	border: 2px solid red;
}

</style>

