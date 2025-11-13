<script lang="ts">
import { createList, deleteList, getLists } from './data.remote.js';
// import type { PageData } from '../$types';


// import EditListModal from './EditListModal.svelte';
// import ListForm from './ListForm.svelte';
import { supportsPopover } from '$lib/lib.js';
// import {type int64} from '@mysql/xdevapi/types/lib/Protocol/ScalarValues';
	import { logger } from '$lib/logger.js';
	// import { form } from '$app/server';


	// import { List, ListKey } from '$lib/types/list.js';
// import { showModal } from './modalState.svelte';
// let listKey: ListKey;
// let r: int64;
let { data } = $props();
let { userId, username } = data;

createList.fields.created.set((new Date()).toString());
createList.fields.editable.set(true);
createList.fields.owner.set(userId);

const { created, dbid, editable, id, items, owner, title } = createList.fields;

// const fd = new FormData();
// const { id:lkId, owner:lkOwner } = deleteList.fields;
// const targetList = { id: -1, owner: -1 };
// const buttonClick = (e:any) => {
// const buttonClick = ({form,data,e}) => {
// 	console.log(e);
// 	// deleteList.fields.id.set(e.target.attributes['data-id'].value);
// 	// deleteList.fields.owner.set(userId);
// 	targetList.id = e.target.attributes['data-id'].value;
// 	targetList.owner = userId;

// 	// deleteList.fields.set({
// 	// 	id: e.target.attributes['data-id'].value,
// 	// 	owner: userId
// 	// });
// 	console.log(deleteList.fields.value());
// 	console.log('USERID:', userId);
// 	console.log('e.target:', e.target);
// 	console.log('e.currentTarget:', e.currentTarget);
// 	console.log('DELETELIST:');
// 	// console.log(deleteList);
// 	// return deleteList.fields.value()
// 	// deleteList(targetList);
// };
// const getListId = (e:any) => {
// 	return e.target.attributes['list-id'].value;
// }

// const dialog : HTMLDialogElement = document.querySelector('#editModal')!;
const showModal = $state({value: false});
	let dialog: HTMLDialogElement = $state() as HTMLDialogElement; // HTMLDialogElement

	$effect(() => {
		if (showModal?.value) dialog.showModal();
	});

</script>

<header>
	<!-- <a href="/">Home</a>
	<a href="/settings">Settings</a>
	{#if username}
		<a href="/auth/logout">Logout</a>
	{:else}
		<a href="/auth/login">Login</a>
	{/if}
	<p>{username ?? "Please login"}</p> -->

		<button id="newList" onclick={()=>dialog?.showModal()}>New List</button>


</header>

<main>
	{#if userId}
		<section class="lists">
			<h1>Todo Lists</h1>
			<!-- <form {...deleteList} class="todo-list" id="todo-list" onclickcapture={(e:any)=>{  console.log(e.target, e.target.value, e.target.parentElement.attributes['data-id'].value, userId); {...deleteList.id}  set( deleteList(e.target.value,userId); }}> -->
			<!-- <form {...deleteList} class="todo-list" onclickcapture={(e:any)=>{ deleteList.fields.id.set(e.target.value); console.log(deleteList)}}> -->
			<!-- <form {...deleteList} class="todo-list"> -->
			<!-- <form {...deleteList} class="todo-list" onclickcapture={buttonClick}> -->
			<!-- <form {...deleteList} class="todo-list" onclickcapture={(e:any)=>{ deleteList.fields.id.set(Number(e.target.attributes['data-id'].value)); deleteList.fields.owner.set(Number(userId))}}> -->

				<!-- <form {...deleteList} class="todo-list" onclickcapture={(e:any)=>{ deleteList.fields.id.set(e.target.attributes['data-id'].value); deleteList.fields.owner.set(userId);}}> -->
				<!-- <form {...deleteList} class="todo-list" > -->


			<!-- <form method="POST" action="?/deleteList" class="todo-list" onclickcapture={(e:any)=>{ /*fd.set('id',e.target.attributes['data-id'].value); fd.set('owner',userId.toString()); console.log(fd.get('id')); */ buttonClick(e); console.log(targetList.id);}}> -->
				<!-- <input {deleteList.fields.owner.set(userId)} type="hidden" name="owner" value={userId} /> -->

				<!-- <form {...deleteList} class="todo-list" onclickcapture={buttonClick}> -->
				<form {...deleteList} class="todo-list">
					{#each await getLists(userId) as list (list)}
					<div data-id={list.id} data-item={`list-${list.id}`}>
						<p data-item={`list-${list.id}-id`}>{list.id}</p>
						<p data-item={`list-${list.id}-title`}>{list.title}</p>
						<p data-item={`list-${list.id}-owner`}>{list.owner}</p>
						<!-- <button data-item={`list-${list.id}-button`} value={list.id}>DELETE<input hidden {...deleteList.fields.id.as('number')}/></button> -->
						<!-- <button data-item={`list-${list.id}-button`} value={deleteList.fields.id.as('number', name:'id', type: 'number', value: list.id )}>DELETE</button> -->
						<!-- <input {...deleteList.for(list.id)} type="hidden" name="listId" value={list.id} /> -->
						<button {...deleteList.fields.id.as('submit',[list.id, userId])} data-item={`list-${list.id}-button`} data-id={list.id}>DELETE</button>


						<div data-item={`list-${list.id}-items`} class="todo-items">
						{#each list?.items as i}
							<p data-item={`list-${list.id}-items-${i}`}>{i.text}
							{i.created}
							 {i.editable}</p>
						{/each}
						</div>
					</div>
				{:else}
					<p>no records found</p>
				{/each}

					</form>
		</section>

		
		<!-- see https://svelte.dev/tutorial/kit/other-handlers -->
		<section class="list new">

			<h1>New List</h1>
			<!-- <form {...createList} enctype="multipart/form-data">
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
				<button type="button">Save</button>
			</form> -->
{#if supportsPopover()}
<!-- <button popovertarget="editModal"> -->
		<!-- <button popovertarget="editModal" popovertargetaction="show">New List</button> -->
	<!-- <dialog id="editModal" popover> -->

	<!-- <dialog id="editModal" bind:this={dialog} onclose={async ()=> (showModal.value=false && await getLists(userId).refresh())}> -->
	<dialog id="editModal" bind:this={dialog} onclose={()=> (showModal.value=false)}>
		<!-- <h2>Popover List Entry</h2> -->
		<!-- <ListForm data={{listId:1, userId}} bind:showModal={showModal.value}/> -->
		<!-- <form {...createList} enctype="multipart/form-data" id="editModal" popover> -->
		<form {...createList} enctype="multipart/form-data">
		<h2>Popover List Entry</h2>
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
				<!-- <button type="button" popovertarget="editModal" popovertargetaction="hide">Save</button> -->
				<!-- <button type="button" popovertarget="editModal" onclick={()=>(console.log(createList.fields))}>Save</button> -->
				<!-- <button popovertarget="editModal" popovertargetaction="show">Save</button> -->
				<button type="reset">Clear</button>
				<button type="reset" onclick={()=>{dialog?.close(); showModal.value=false}}>Cancel</button>
				<button type="submit" onclick={()=>{dialog?.close(); showModal.value=false}}>Save</button>
			</form>
		<!-- <button popovertarget="editModal" popovertargetaction="hide"> -->
			<!-- Save & Close -->
		<!-- </button> -->
		</dialog>

{:else}
	<!--
<button onclick={() => (showModal.value = true)}> New List (Modal)</button>


	<EditListModal bind:showModal={showModal.value}>
		{#snippet header()}
			<h2>Modal List Entry</h2>
			{/snippet}
			<ListForm data={{listId:1, userId}} />
	</EditListModal>
-->

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
				<!-- <button type="button" popovertarget="editModal" popovertargetaction="dide">Save</button> -->
				<!-- <button type="button" popovertarget="editModal" onclick={()=>(console.log(createList.fields))}>Save</button> -->
				<!-- <button type="button">Save</button> -->
				<button>Save</button>
			</form>
	{/if}			
		</section>
	{/if}

</main>

<style>
/* form {
	display: grid;
	grid: auto / 1fr;
} */

main {
	display: grid;
	/* grid: 1fr 1fr / auto; */
	/* grid: auto; */
}
main .list.new {
	background: slategrey;
}
main .lists {
	background: lightslategray;
}
main > section {
	padding: 0.5rem;
	block-size: min-content;
}
main > section > * {
	padding: 0.25rem;
}
.todo-list, .todo-items {
	display: grid;
	/* grid: auto; */
	/* grid-auto-flow: row; */
	border: 2px solid red;
}

</style>

