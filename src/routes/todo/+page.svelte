<script lang="ts">
	import { createList, getLists, deleteList, listUpdate, updateList } from "./data.remote";

	// import { DOMAttributes } from 'svelte/elements';

	// let dialogCmd = new EventTarget();
	// dialogCmd.addEventListener('oncommand', ()=>)
	let { data } = $props();
	let { userId, username } = data;
	// let btnEvtData = $state('');

	type EventDataSetItem = {
		id: Number | String | undefined,
		created: Number | String | Date | undefined,
		editable: Boolean | Number | String | undefined,
		text: String | undefined
	};

	type EventDataSet = {
		// dataset: DOMStringMap,
		id: Number | string | undefined;
		title: string | undefined;
		owner: Number | string | undefined;
		created: Number | string | Date | undefined;
		editable: Boolean | Number | string | undefined;
		items: EventDataSetItem[] | undefined;
	};
	let domEvtStrMap: DOMStringMap = $state() as DOMStringMap;
	// let evtDataSetItem: EventDataSetItem = { id: -1, created: '', editable: false, text: '' };// = $state({ id: -1}) as EventDataSetItem;

	// let btnEvtData: EventDataSet = { id: -1, created: '', editable: false, owner: -1, title: '', items: [] };//$state({ id: "" }) as EventDataSet;
	let evtDataSetItem: EventDataSetItem = $state({}) as EventDataSetItem;// = $state({ id: -1}) as EventDataSetItem;

	let btnEvtData: EventDataSet = $state({}) as EventDataSet;

	createList.fields.created.set(new Date().toString());
	createList.fields.editable.set(true);
	createList.fields.owner.set(userId);

	const { created, dbid, editable, id, items, owner, title } = createList.fields;

	const createListModal = $state({ value: false });
	let createListDialog: HTMLDialogElement = $state() as HTMLDialogElement; // HTMLDialogElement
	$effect(() => {
		if (createListModal?.value) createListDialog.showModal();
	});
	const updateListModalState = $state({ value: false });
	let updateListDialog: HTMLDialogElement = $state() as HTMLDialogElement; // HTMLDialogElement
	let list: HTMLElement | null;
	let listItems: HTMLElement | null;
	let qS = "";
	// let listId = -1;
	let listId: number = $state(-1);
	let listItem = "";
	let idx = '';

	$effect(() => {
		if (updateListModalState?.value === true) {


			updateListDialog?.showModal();
		} else {
			updateListDialog?.close();
		}
	});
	$effect(()=>{$inspect(btnEvtData);});

// TODO: find a better solution to populating the list edit modal, that still adheres to the page as data source principle
function populateListModal(listId:number){
	console.log(`\n\nPopulating List Modal\n\nButton Event Data:\n`);
	
	if ( btnEvtData.id ) {
	console.log(`\n\nClearing Button Event Data\n\n`);
		btnEvtData.id = undefined;
		btnEvtData.created = undefined;
		btnEvtData.editable = undefined;
		btnEvtData.owner = undefined;
		btnEvtData.title = undefined;
		if ( btnEvtData?.items ) {
	console.log(`\n\nClearing Button Event Item Count:\n ${btnEvtData?.items.length} \n`);
			btnEvtData?.items.forEach( item => {
	console.log(`\n\nClearing Button Event Item ID:\n ${item.id} \n`);
				item.id = undefined
				item.created = undefined
				item.editable = undefined
				item.text = undefined
			});
			delete btnEvtData.items;
		}
	}
	if ( evtDataSetItem?.id ) {
		evtDataSetItem.id = undefined;
		evtDataSetItem.created = undefined;
		evtDataSetItem.editable = undefined;
		evtDataSetItem.text = undefined;
	}

	if (listId > -1) {
		btnEvtData.id = Number((btnEvtData?.id && Number(btnEvtData?.id) > -1) ? btnEvtData?.id : listId);

		console.log(btnEvtData);
		qS = `[data-list='${btnEvtData.id}']`;
		list = document?.querySelector(qS);
		console.log(list);

		if (list) {
			btnEvtData.created = list?.querySelector(`[data-list_created]`)?.textContent;

			btnEvtData.owner = Number(list?.querySelector(`[data-list_owner]`)?.textContent);

			btnEvtData.title = list?.querySelector(`[data-list_title]`)?.textContent;

			listItems = list?.querySelector(`[data-list-items]`);

			// TODO: renovate this entire construct, starting with how we're instantiation evtDataSetItem (currently instantiated by setting invalid base values to the object; but also including how we're having to cycle through all elements regardless of if they contain valid dataset attribute types.  One idea would be to limit the list item query to search for those with a new data attribute such as data-type=list-item
			if ( listItems?.childElementCount )
				listItems
				.childNodes
				.forEach( ( listItem:any ) => { listItem
					.childNodes
					.forEach ( ( listItemElement:any ) => {
						if ( listItemElement.dataset ){ 
							// console.log('Node:');
							// console.log(listItemElement);
							// console.log('...has dataset:');
							// console.log(listItemElement.dataset);
							idx = listItemElement.dataset['name'] as string;
					// assign dynamically using bracket notation and an any-cast to satisfy TypeScript
							(evtDataSetItem as any)[idx] = listItemElement.dataset['value'];
						}
					})

					// evtDataSetItem.id = Number(n.dataset['list-item_id']);
					// evtDataSetItem.created = n.dataset['list-item_created'];
					// evtDataSetItem.editable = n.dataset['list-item_editable'];
					// evtDataSetItem.text = n.dataset['list-item_text'];
					
					// push a shallow copy so subsequent mutations don't overwrite previously pushed objects
					
					console.log('evtDataSetItem:');
					console.log({...evtDataSetItem});

					// TODO:  The renovation todo at the top of this construct also applies to the statements below
					btnEvtData.items = btnEvtData.items || [];
					if ( evtDataSetItem.id != -1 && btnEvtData.items[btnEvtData.items.length-1]?.id != evtDataSetItem.id)
						btnEvtData.items.push({ ...evtDataSetItem })
					// btnEvtData.items.push(evtDataSetItem);
					console.log('Event Data Items:');
					console.log(btnEvtData.items);

				})
		}
	}
}

</script>

<header>
	<button id="newList" onclick={() => createListDialog?.showModal()}>New List</button>
</header>

<main>
	{#if userId}
		<dialog id="updateListDialog"
			bind:this={updateListDialog}
			onbeforetoggle={(e:any)=>{
				if ( e.newState === 'open' ) populateListModal(listId) as undefined}}
			onclose={()=>{
				if ( updateListModalState.value === true )
					updateListModalState.value = false;
				console.log('Closing dialog and completing submission')
			}}
			onsubmit={() => {updateListModalState.value = false}}
		>
			<p>{btnEvtData.id}</p>
			<form {...listUpdate} id="updateListForm" name="updateListForm">
				<label for="id">ID: {btnEvtData?.id || ""}</label>
				<label for="owner">Owner: {btnEvtData.owner}</label>
				<label for="created">Created: {btnEvtData?.created || ""}</label>
				<label for="modified">Modified: {btnEvtData?.created || ""}</label>
				<label for="editable"
					>Editable:
					<input {...editable} name="editable" type="checkbox" value={btnEvtData?.editable || false} />
				</label>
				<section>
					<!-- <label for="items">Items:</label> -->
					<input name="items" type="readonly" value={btnEvtData?.items || ""} />
					<h3>Items:</h3>
						{console.log(btnEvtData.items)}
					{#if btnEvtData?.items }
						<h3>Item Type: {typeof btnEvtData.items}</h3>
						<h3>Item Count: {btnEvtData.items.length}</h3>
						{console.log(btnEvtData.items)}
						{#each btnEvtData?.items as i}
							{console.log(i)}
							<p>{console.log(i)}</p>
							<label for="item_id">ID:</label>
							<input name="item_id" type="readonly" value={i.id || ''} />
							<label for="item_created">Created:</label>
							<input name="item_created" type="readonly" value={i.created || ''} />
							<!-- <label for="item_txt">Todo:</label> -->
							<!-- <input {...i?.text} name="item_txt" type="textbox" value={i.text || ''} /> -->
							<label for="item_editable">Editable:</label>
							<!-- <input {...i?.editable} name="item_editable" type="checkbox" value={i.editable || ''} /> -->
							<input {...items[0].editable?.as('checkbox')} name="item_editable" type="text" />
						{/each}
					{/if}
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
					<div data-name="list" data-value={list.id} data-list={list.id}>
						<p data-name="id" data-value={list.id} data-list_id={list.id}>{list.id}</p>
						<p data-name="title" data-value={list.title} data-list_title={list.title}>{list.title}</p>
						<p data-name="created" data-value={list.created} data-list_created={list.created}>{list.created}</p>
						<p data-name="owner" data-value={list.owner} data-list_owner={list.owner}>{list.owner}</p>
						<p data-name="editable" data-value={list.editable} data-list_editable={list.editable}>{list.editable}</p>

						<button name="deleteListFormButton" form="deleteListForm" type="submit" value="{userId},{list.id}">DELETE</button>

						<button name="updateListFormButton" onclick={() => { updateListModalState.value = true;listId = Number(list.id);}}>Edit List</button>

						<div class="todo-items" data-name="items" data-value={`data-list-items_${list.id}`} data-list-items={`list-items_${list.id}`}>
							<h3>Array?:{Array.isArray(list?.items)}</h3>
							<h5>Type?:{typeof list?.items}</h5>
							<h5>Values?:{JSON.stringify(list?.items)}</h5>
							{#each list?.items as item (item)}
								<div data-name="item" data-value={item.id} class="list-item" data-list-item={item.id}>
									<p data-name="id" data-value={item.id} data-list-item_id={item.id}>Item ID: {item.id}</p>
									<p data-name="text" data-value={item.text} data-list-item_text={item.text}>Item Text: {item.text}</p>
									<p data-name="created" data-value={item.created} data-list-item_created={item.created}>Item Created: {item.created}</p>
									<p data-name="editable" data-value={item.editable} data-list-item_editable={item.editable}>Item is Editable: {item.editable}</p>
								</div>
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
		<dialog id="createListModalDialog" bind:this={createListDialog} onclose={() => (createListModal.value = false)}>
			<form {...createList} enctype="multipart/form-data">
				<h2>List Entry</h2>
				<label>
					<h2>Title</h2>
					<input {...title.as("text")} />
				</label>
				<label>
					Editable
					<input {...editable.as("checkbox")} />
				</label>
				<label>
					Owner
					<input {...owner.as("number")} />
				</label>
				<label>
					Created
					<input {...created.as("text")} />
				</label>
				<label>
					ID
					<input {...id.as("number")} />
				</label>
				<label>
					DBID
					<input {...dbid.as("text")} />
				</label>
				<p>
					Items
					<label>
						Created
						<input {...items[0].created.as("text")} />
					</label>
					<label>
						DBID
						<input {...items[0].dbid.as("text")} />
					</label>
					<label>
						Editable
						<input {...items[0].editable.as("checkbox")} />
					</label>
					<label>
						Flag
						<input {...items[0].flag.as("number")} />
					</label>
					<label>
						ID
						<input {...items[0].id.as("number")} />
					</label>
					<label>
						Priority
						<input {...items[0].priority.as("number")} />
					</label>
					<label>
						Sequence
						<input {...items[0].sequence.as("number")} />
					</label>
					<label>
						Status
						<input {...items[0].status.as("number")} />
					</label>
					<label>
						Description
						<input {...items[0].text.as("text")} />
					</label>
				</p>

				<button type="reset">Clear</button>
				<button
					type="reset"
					onclick={() => {
						createListDialog?.close();
						createListModal.value = false;
					}}>Cancel</button
				>
				<button
					type="submit"
					onclick={() => {
						createListDialog?.close();
						createListModal.value = false;
					}}>Save</button
				>
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
	.todo-list,
	.todo-items {
		display: grid;
		/* grid: auto; */
		/* grid-auto-flow: row; */
		border: 2px solid red;
	}
</style>
