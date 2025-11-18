<script lang="ts">
import { createList, getLists, deleteList, listUpdate, updateList } from './data.remote';


// import { DOMAttributes } from 'svelte/elements';

// let dialogCmd = new EventTarget();
// dialogCmd.addEventListener('oncommand', ()=>)
let { data } = $props();
let { userId, username } = data;
// let btnEvtData = $state('');
const btnEvtData = $state({
	dataset: {},
	owner: '',
	id: '',
	editable: false,
	created: '',
	items: []
});

createList.fields.created.set((new Date()).toString());
createList.fields.editable.set(true);
createList.fields.owner.set(userId);

const { created, dbid, editable, id, items, owner, title } = createList.fields;

const createListModal = $state({value: false});
let createListDialog: HTMLDialogElement = $state() as HTMLDialogElement; // HTMLDialogElement
$effect(() => {
	if (createListModal?.value) createListDialog.showModal();
});
const updateListModalState = $state({value: false});
let updateListDialog: HTMLDialogElement = $state() as HTMLDialogElement; // HTMLDialogElement
$effect(() => {
	if ( updateListModalState?.value === true )
		updateListDialog?.showModal();
	else
		updateListDialog?.close();
	}
);



/*
const editList = (e:any) => {
	
	let listId = e.target.attributes['data-list_id']?.value;
	let list = document.querySelector("div[data-list_id='"+listId+"']");
	let dialogForm = document.querySelector("dialog > #updateListForm");
	let dfInputs = dialogForm?.querySelectorAll("input");

	list?.childNodes.forEach(n => { if ( n?.attributes?.length > 0 ) {
		
		if ( n.attributes.getNamedItem('data-list_id')?.value === listId ) {
			console.log(listId);
		}
		console.log(dialogForm);
	}
	});

	let targetTitle = updateListDialog.querySelector("#updateListTitle");
	targetTitle = e.target.parentElement.querySelector("#listTitle");
	updateListDialog?.showModal();
}
*/

</script>

<header>
		<button id="newList" onclick={()=>createListDialog?.showModal()}>New List</button>


</header>

<main>
	{#if userId}


					<!-- <dialog id="updateListDialog" onclick={(e:any)=>{ alert('clicked'); btnEvtData=e.source.dataset}} onclose={()=>updateListModal.value=false}> -->
					<!-- <dialog id="updateListDialog" onsubmit={(e:any)=>{ btnEvtData=e.source.dataset;console.log(e); }}> -->
					<!-- <dialog id="updateListDialog" bind:this={updateListDialog} onsubmit={(e:any)=>{ btnEvtData = e.submitter.dataset; updateListModal.value = true;}}> -->
					<!-- <dialog id="updateListDialog" bind:this={updateListDialog} onclose={()=> (updateListModal.value=false)} onsubmit={(e:any)=>{ console.log(e); btnEvtData = e.submitter.dataset.owner;updateListModal.value = true;  console.log(e.submitter.dataset); console.log(btnEvtData); console.log(updateListModal.value); console.log(updateListDialog)}}> -->
					<!-- <dialog id="updateListDialog" onclose={()=> (updateListModalState.value=false)} onsubmit={(e:any)=>{ console.log(e); btnEvtData = e.submitter.dataset.owner;updateListModalState.value = true;  console.log(e.submitter.dataset); console.log(btnEvtData);}}> -->
					<dialog id="updateListDialog" bind:this={updateListDialog} onsubmit={(e:any)=>{updateListModalState.value=false}}>

						<form {...listUpdate} id="updateListForm" name="updateListForm">
							<label for="owner">Owner: {btnEvtData.owner || ''}</label>
							<label for="id">ID: {btnEvtData.id || ''}</label>
							<label for="created">Created: {btnEvtData?.created || ''}</label>
							<label for="modified">Modified: {btnEvtData?.created || ''}</label>
							<label for="editable">Editable:
							<input name="editable" type="checkbox" value={btnEvtData?.editable || false } />
							</label>
							<section>
							<!-- <label for="items">Items:</label> -->
							<h3>Items:</h3>
							<input name="items" type="readonly" value={btnEvtData?.items || ''} />

							<!-- {#each btnEvtData.items as i}
							<label for="item_id">Item ID:</label>
							<input name="item_id" type="readonly" value={i.id || ''} />
							<label for="item_txt">Item:</label>
							<input name="item_txt" type="textbox" value={i.text || ''} />
							<label for="item_editable">Editable:</label>
							<input name="item_editable" type="checkbox" value={i.editable || ''} />
							{/each} -->
							</section>
							<!-- <button onclick={()=>updateListModalState.value = false && this.close()}>OK</button> -->
							<button>OK</button>
						</form>
					</dialog>
					<form {...deleteList} name="deleteListForm" id="deleteListForm"></form>

		<section class="lists">
			<h1>Todo Lists</h1>

				<div class="todo-list">

					{#each await getLists(userId) as list (list)}
					<div data-list_id={list.id}>
						<p data-list_id={list.id}>{list.id}</p>
						<p data-list_title={list.title}>{list.title}</p>
						<p data-list_created={list.created}>{list.created}</p>
						<p data-list_owner={list.owner}>{list.owner}</p>

						
						<button name="deleteListFormButton" form="deleteListForm" type="submit" value="{userId},{list.id}">DELETE</button>
						

						<!-- <button type="button" name="updateListFormButton" command="show-modal" commandfor="updateListDialog" data-list_id={list.id}  data-owner={userId} data-items={list.items}  data-editable={list.editable} data-created={list.created}>Edit List</button> -->
						<!-- <button name="updateListFormButton" form="updateListForm" data-list_id={list.id}  data-owner={userId} data-items={list.items}  data-editable={list.editable} data-created={list.created}>Edit List</button> -->
						<button name="updateListFormButton" onclick={(e:any)=>{updateListModalState.value = true; btnEvtData.dataset = e.target.dataset; btnEvtData.id = e.target.dataset['list_id']; btnEvtData.owner = e.target.dataset['owner']; btnEvtData.created = e.target.dataset['created']; btnEvtData.editable = e.target.dataset['editable']; btnEvtData.items = e.target.dataset['items'];}} data-list_id={list.id}  data-owner={userId} data-items={JSON.stringify(list?.items)}  data-editable={list.editable} data-created={list.created}>Edit List</button>


						<div data-list_items={`list-${list.id}-items`} class="todo-items">
							<h3>Array?:{Array.isArray(list?.items)}</h3>
							<h5>Type?:{typeof list?.items}</h5>
							<h5>Values?:{JSON.stringify(list?.items)}</h5>
						{#each list?.items as i}
							<p data-list_item_id={i.id}>Item ID: {i.id}</p>
							<p data-list_item_text={i.text}>Item Text: {i.text}</p>
							<p data-list_item_created={i.created}>Item Created: {i.created}</p>
							<p data-list_item_editable={i.editable}>Item is Editable: {i.editable}</p>
						{/each}
						</div>
					</div>
				{:else}
					<p>no records found</p>
				{/each}

					<!-- </form> -->
				</div>
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
		 <!--
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
			</form>
			<button commandfor="updateListModalDialog" command="request-close">Close</button>
		</dialog>
	-->
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
form {
	display: grid;
	grid: auto / 1fr 1fr;
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

