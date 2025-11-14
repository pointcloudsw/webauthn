<script lang="ts">
import { createList, updateList, getList, getLists, deleteList, listAction } from './data.remote';
import EditListModal from './EditListModal.svelte';

let { data } = $props();
let { userId, username } = data;

createList.fields.created.set((new Date()).toString());
createList.fields.editable.set(true);
createList.fields.owner.set(userId);

const { created, dbid, editable, id, items, owner, title } = createList.fields;

const createListModal = $state({value: false});
let createListDialog: HTMLDialogElement = $state() as HTMLDialogElement; // HTMLDialogElement
$effect(() => {
	if (createListModal?.value) createListDialog.showModal();
});

let updateListModal = $state({value: false});
let updateListDialog: HTMLDialogElement = $state() as HTMLDialogElement; // HTMLDialogElement
$effect(() => {
	if (updateListModal?.value) updateListDialog.showModal();
});

const editList = (e:any) => {
	// e.target.parentElement.attributes.forEach( (a:any) => console.log(a));
	
	// let button = document.querySelector("button");
	let listId = e.target.attributes['data-list_id']?.value;
	let list = document.querySelector("div[data-list_id='"+listId+"']");
	let dialogForm = document.querySelector("dialog > #updateListForm");
	let dfInputs = dialogForm?.querySelectorAll("input");

	list?.childNodes.forEach(n => { if ( n?.attributes?.length > 0 ) {
		// n.attributes.entries().forEach( a => console.log(a) )
		// n.attributes.item().forEach(i => console.log(i));
		
		if ( n.attributes.getNamedItem('data-list_id')?.value === listId ) {
			console.log(listId);
		}
		console.log(dialogForm);
	}
	});

	// 		if (n?.attributes.toString().startsWith('data-') && n?.attributes['data-list_id'] === listId )
	// 	console.log(n?.tagName, n?.attributes);
	// });
	let targetTitle = updateListDialog.querySelector("#updateListTitle");
	targetTitle = e.target.parentElement.querySelector("#listTitle");
	updateListDialog?.showModal();
	// e.target.attributes.forEach((a:any) => console.log(a.value));
}


</script>

<header>
		<button id="newList" onclick={()=>createListDialog?.showModal()}>New List</button>


</header>

<main>
	{#if userId}
		<section class="lists">
			<h1>Todo Lists</h1>

				<form {...deleteList} class="todo-list">
					{#each await getLists(userId) as list (list)}
					<div data-list_id={list.id}>
						<p data-list_id={list.id}>{list.id}</p>
						<p data-list_title={list.title}>{list.title}</p>
						<p data-list_owner={list.owner}>{list.owner}</p>
						<!-- <button {...updateList.fields.action.as('submit',['update', [ list.id, list.title, list.owner, list?.items ]])}>Update</button>
						<button {...updateList.fields.update.as('submit',[list.id,list.title,list.owner,list?.items])}>Save</button> -->
						<button {...deleteList.fields.delete.as('submit',[list.id, userId])}>DELETE</button>
						<!-- <button id="updateList" onclick={(e:any)=> {  /* updateListDialog?.showModal(); */ editList(e);}}>Edit List</button> -->
						<!-- <button data-list_id={list.id} command="show-modal" commandfor="updateListModalDialog" value={list.id} type="button">Edit List</button> -->
						<button data-list_id={list.id} onclick={()=>updateListModal.value = true}>Edit List</button>
						{#if (updateListModal?.value === true) }
						<EditListModal {list}/>
						{/if}
						<div data-list_items={`list-${list.id}-items`} class="todo-items">
						{#each list?.items as i}
							<p data-list_item_id={i.id}>{i.id}</p>
							<p data-list_item_text={i.text}>{i.text}</p>
							<p data-list_item_created={i.created}>{i.created}</p>
							<p data-list_item_editable={i.editable}>{i.editable}</p>
						{/each}
						</div>
					</div>
				{:else}
					<p>no records found</p>
				{/each}

					</form>
		</section>

		
		<!-- see https://svelte.dev/tutorial/kit/other-handlers -->
		<dialog id="createListModalDialog" bind:this={createListDialog} onclose={()=> (createListModal.value=false)}>
			<form {...createList} enctype="multipart/form-data">
			<h2>List Entry</h2>
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

					<button type="reset">Clear</button>
					<button type="reset" onclick={()=>{createListDialog?.close(); createListModal.value=false}}>Cancel</button>
					<button type="submit" onclick={()=>{createListDialog?.close(); createListModal.value=false}}>Save</button>
			</form>
		</dialog>


		<!-- <dialog id="updateListModalDialog"> -->
		<dialog bind:this={updateListDialog} onclose={()=> (updateListModal.value=false)}>
			<form {...updateList} id="updateListForm" enctype="multipart/form-data">

				<label>
					<h2>Title</h2>
					<p>{updateList.fields.title.value()}</p>
					<input id="updateListTitle" {...title.as('text')}/>
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
				<button>Save</button>
				<!-- {/each} -->
			</form>
			<button commandfor="updateListModalDialog" command="request-close">Close</button>
		</dialog>
		
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

