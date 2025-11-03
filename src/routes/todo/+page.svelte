<script lang="ts">
// import { onMount, onDestroy } from 'svelte';
import * as rf from './data.remote';
// import { getLocals } from "$lib/auth.remote";
// import { type Item, type List } from "$lib/schema";

// const { session, user } = await getLocals();
let { data } = $props();
let { plm, userId, username } = data;
let { getAllLists } = plm;

const { title, items } = rf.createList.fields;
// const lists = getAllLists(userId);

// let list : List;
// let lists : List[];
// let listItem : Item;
// let listItems : Item[];
// listItem.text = '';
// const { text } = listItem;


</script>

<header>
	<a href="/">Home</a>
	<a href="/settings">Settings</a>
	{#if data.username}
		<a href="/auth/logout">Logout</a>
	{:else}
		<a href="/auth/login">Login</a>
	{/if}
	<!-- <p>{user?.username ?? "Please login"}</p>
	<a href="/auth/login">{user?.id ? "Logout" : "Login" }</a> -->
	<p>{data?.username ?? "Please login"}</p>
</header>

<main>
	{#if data?.userId}
		<h1>Todo Lists</h1>
		<div class="todo-list">
			{#each await getAllLists(data.userId) as list}
				<div>
					<p>{list.title}</p>
					<p>{list.owner}</p>
					<div class="todo-items">
					{#each list?.items as item}
						<p>{item}</p>
					{/each}
					</div>
				</div>
			{:else}
				<p>no records found</p>
			{/each}
		</div>

	<!-- see https://svelte.dev/tutorial/kit/other-handlers -->

		<h1>New List</h1>
		<form {...rf.createList} enctype="multipart/form-data">
			<label>
				<h2>Title</h2>
				<input {...title.as('text')} />
			</label>

			<label>
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
			</label>
			<button onclick={async () => await rf.getLists().refresh()}>Save</button>
		</form>
		
	{/if}

</main>

<style>
.todo-list, .todo-items {
	display: grid;
	grid: auto;
	/* grid-auto-flow: row; */
	border: 2px solid red;

}
</style>

