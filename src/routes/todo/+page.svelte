<script lang="ts">
	import { logger } from "$lib/logger";
	import { createList, getLists, deleteList, listUpdate } from "./data.remote";
	import type { BL, DT, ID, TXT } from '$lib/list/types';
	import { page } from '$app/state';
	import type { List } from "$lib/types/list";
	let userId : number | string = $derived(page.data.userId);

	// logger(`\n--------- ↓ /todo/+page.svelte ↓ -----------\n`);
	// console.log(`Page:`);
	// console.log(page);
	// console.log(`UserId:`);
	// console.log(userId);
	// console.log(`PageDataUserId:`);
	// console.log(page.data.userId);
	// logger(`\n--------- ↑ /todo/+page.svelte ↑ -----------\n`);

	type formMapValue = boolean | number | string;
	
	type EventDataSetItem = {
		id: ID | number | undefined; // system generated
		created: DT | string | undefined; // system generated
		modified: DT | string | undefined; // system generated
		editable: BL | undefined; // client checkbox
		text: TXT | undefined; // client textarea
	};
	type EventDataSet = {
		id: ID | number | undefined; // system generated
		title: TXT | undefined; // client input
		owner: ID | number | undefined; // system generated
		created: DT | string | undefined; // system generated
		modified: DT | string | undefined; // system generated
		editable: BL | undefined; // client checkbox
		items: EventDataSetItem[] | undefined; // client may add, remove, change or rearrange items
	};

	let evtDataSetItem: EventDataSetItem = $state({
		id: undefined,
		created: undefined,
		modified: undefined,
		editable: undefined,
		text: undefined
	});

	let btnEvtData: EventDataSet = $state({
		id: undefined,
		created: undefined,
		modified: undefined,
		editable: undefined,
		owner: undefined,
		title: undefined,
		items: [ evtDataSetItem ]
	});

	const listMap = new Map();

	const { created, modified, dbid, editable, id, items, owner, title } = createList.fields;

	const createListModal = $state({ value: false });
	let createListDialog: HTMLDialogElement = $state() as HTMLDialogElement;
	$effect(() => {
		if (createListModal?.value) createListDialog.showModal();
	});
	const updateListModalState = $state({ value: false });
	let updateListDialog: HTMLDialogElement = $state() as HTMLDialogElement; // HTMLDialogElement
	let list: HTMLElement | null;
	let listItems: HTMLElement | null;
	let qS = "";
	let idx = '';
	// let selectedList : number | string = $state(-1);
	let selectedList : number | string = $state(-1);
	let localList:List = $state({ editable: true });

	$effect(() => {
		if (updateListModalState?.value === true) {
			updateListDialog?.showModal();
		} else {
			updateListDialog?.close();
		}
	});

// TODO: find a better solution to populating the list edit modal, that still adheres to the page as data source principle
async function populateListModal(listId:number){


	// TODO:  create keyed indexes for localList and btnEventData types to allow indexing by string
	localList = { editable: false };
	// const localList = await getLists({userId, listId});
	// const [ localList ] = await getLists({userId, listId});
	[ localList ] = await getLists({userId, listId});
	const newListMap = new Map(Object.entries(localList));
	console.log(localList);
	console.log(newListMap);

	/* TODO:
		Query local IndexedDB to populate list update form
		then push update to DB
		if no local db, then query DB directly, if no DB, then query page directly to populate form
		create / update local DB and queue changes for remote database when network is available, ensuring to version data for diff'ing

		first step is to simply query remote DB to populate form, then advanced features can come later

		also add logic to reconcile / create list id based on database rather than just on local page data
	*/


	if ( btnEvtData ) {
	// console.log(`\n\nClearing Button Event Data\n\n`);
		btnEvtData.id = undefined;
		btnEvtData.created = undefined;
		btnEvtData.modified = undefined;
		btnEvtData.editable = undefined;
		btnEvtData.owner = undefined;
		btnEvtData.title = undefined;
		if ( btnEvtData?.items ) {
	// console.log(`\n\nClearing Button Event Item Count:\n ${btnEvtData?.items.length} \n`);
			btnEvtData?.items.forEach( item => {
	// console.log(`\n\nClearing Button Event Item ID:\n ${item.id} \n`);
				item.id = undefined
				item.created = undefined
				item.modified = undefined
				item.editable = undefined
				item.text = undefined
			});
			delete btnEvtData.items;
		}
	}
	if ( evtDataSetItem?.id ) {
		evtDataSetItem.id = undefined;
		evtDataSetItem.created = undefined;
		evtDataSetItem.modified = undefined;
		evtDataSetItem.editable = undefined;
		evtDataSetItem.text = undefined;
	}

	if (listId > -1) {
		btnEvtData.id = Number((btnEvtData?.id && Number(btnEvtData?.id) > -1) ? btnEvtData?.id : listId);

		qS = `[data-list='${btnEvtData.id}']`;
		list = document?.querySelector(qS);

		if (list) {
			// btnEvtData.created = list?.querySelector(`[data-list_created]`)?.textContent;
			// btnEvtData.created = newListMap.get('created') as string;
			btnEvtData.created = localList.created;

			// btnEvtData.modified = list?.querySelector(`[data-list_modified]`)?.textContent;
			btnEvtData.modified = localList.modified;



			// [ 'created', 'modified' ].forEach( (f:string|undefined) => { if ( btnEvtData && f as keyof EventDataSet ) btnEvtData[f as keyof EventDataSet] = localList[f as keyof List] });
			// Object.entries(localList as List).forEach( ( [ k, v ] ) => { if (btnEvtData[ k as keyof EventDataSet] && v) btnEvtData[ k as keyof EventDataSet] = localList[ k as keyof List ] } );
			Object.keys(localList as List).forEach( k => { if (k && btnEvtData[ k as keyof EventDataSet ]) {console.log( k, typeof k, btnEvtData[ k as keyof EventDataSet ], typeof btnEvtData[ k as keyof EventDataSet ], Object.hasOwn(btnEvtData,k)); } });

			btnEvtData.owner = Number(list?.querySelector(`[data-list_owner]`)?.textContent);

			btnEvtData.title = list?.querySelector(`[data-list_title]`)?.textContent;

			btnEvtData.editable = list?.querySelector(`[data-list_editable]`)?.attributes.getNamedItem('data-value')?.nodeValue?.toLocaleLowerCase() === 'true' ? true : false;

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
					

					// TODO:  The renovation todo at the top of this construct also applies to the statements below
					btnEvtData.items = btnEvtData.items || [];
					if ( evtDataSetItem?.id && evtDataSetItem.id != -1 && btnEvtData.items[btnEvtData.items.length-1]?.id != evtDataSetItem.id)
						btnEvtData.items.push({ ...evtDataSetItem })
					// btnEvtData.items.push(evtDataSetItem);
					evtDataSetItem.id = undefined;
					evtDataSetItem.created = undefined;
					evtDataSetItem.modified = undefined;
					evtDataSetItem.editable = undefined;
					evtDataSetItem.text = undefined;

				})
		}
	}
}



function rmAndAppendReadonlyFormInputs(docForm:string,el:string,val: formMapValue){
	logger(`Updating: ${docForm} ${el} with value ${val}...`);
	let qSdel = `input[name='${el}']`;
	let qSadd = `[data-field='${el}']`;
	
	// Remove all (hopefully none, but just in case) arbitrary form input fields added by client
	document.forms[docForm as any].querySelectorAll(qSdel).forEach( e => e.remove() );

	// Add new form inputs to identify and match record to be updated
	let newTag = document.createElement('input');
	let newAttribute = document.createAttribute('name');
	let insAfter = document.forms[docForm as any].querySelector(qSadd);

	newAttribute.value = el;
	newTag.setAttributeNode(newAttribute)
	newAttribute = document.createAttribute('value')
	newAttribute.value = typeof val === 'string' ? val : val.toString();
	newTag.setAttributeNode(newAttribute);

	if ( insAfter )
		insAfter.insertAdjacentElement('afterend',newTag);
	else
		document.forms[docForm as any].appendChild(newTag);	

	logger(`Form update complete.`);
}

// function saveNewForm(docForm:string) : void {

// 	[ 'created', 'id', 'modified', 'owner' ].forEach( ( field:string ) => rmAndAppendReadonlyFormInputs( docForm,field,listMap.get(field) ) );

// }

function updateFormValues( srcMap:Map<string, formMapValue>, form: { name:string, fields:string[] } ) : void {

	form.fields.forEach( ( field:string ) => rmAndAppendReadonlyFormInputs( form.name, field, srcMap.get(field) ?? `Warning: '${field}' field not found` ) );

}

function setMapValues( destMap:Map<string, formMapValue>, kvPairs:{k:string,v:any}[] ) : void {
	kvPairs.forEach( (kv:any) => {
		destMap.set(kv.k, kv.v);
	} );
}

function createNewForm(docForm:string) : void {
	// TODO:  Since user may have multiple concurrent sessions, will need to create next ID not on local list of lists, but on max value from remote database as system of record

	logger(`Adding new docForm...`);

	let dt = new Date().toISOString();

	listMap.clear();

	setMapValues(listMap, [
		{ k: 'created', v: dt },
		{ k: 'modified', v: dt },
		{ k: 'id', v: Math.max( ...[ ...document.querySelectorAll("[data-name='list']") ].map( c => parseInt( c?.attributes?.getNamedItem('data-value')?.value as string ) ) ) + 1 },
		{ k: 'owner', v: userId }
	]);

	// listMap.set('created',dt);
	// listMap.set('modified',dt);
	// listMap.set('owner',userId);
	// listMap.set('id', Math.max( ...[ ...document.querySelectorAll("[data-name='list']") ].map( c => parseInt( c?.attributes?.getNamedItem('data-value')?.value as string ) ) ) + 1 );

}

function restoreUpdateFormStaticValues(docForm:string) : void {

	logger(`Updating docForm...`);

	// List Modified Date
	// TODO:  update modified date only when user actually changed something in the list or in list items, if user escaped out or hit cancel, then modified date should not be updated, but if 'Save' button was activated and pressed, then modified date should be updated

	// when written, remember to remove these input fields from the dialog input form as they'll be manually added to the form inside this method instead

	/*
		Lines:
			populateListModal: 74, 104
			restoreUpdateFormStaticValues: 237
	*/

	rmAndAppendReadonlyFormInputs(docForm,'modified',(new Date()).toISOString());
	rmAndAppendReadonlyFormInputs(docForm,'id',btnEvtData.id as string);
	rmAndAppendReadonlyFormInputs(docForm,'owner',btnEvtData.owner as string);
	rmAndAppendReadonlyFormInputs(docForm,'created',btnEvtData.created as string ?? '');

}

</script>

<header>
	<button id="newList" onclick={() => {createNewForm('createListForm'); createListModal.value = true}}>New List</button>
</header>

<main>
	{#if userId}
		<dialog id="updateListDialog"
			bind:this={updateListDialog}
			onclose={()=>{
				if ( updateListModalState.value === true )
					updateListModalState.value = false;
				console.log(`Closing dialog and completing submission for User ${userId}, List ${selectedList}`);
				selectedList = -1;
			}}
			onsubmit={() => {updateListModalState.value = false;}}
		>
			<p>{btnEvtData?.title ?? "No Title Found"}</p>

			<!-- TODO: move await getLists() inside the form element -->
			{#each await getLists({userId, listId: selectedList}) as srcList }
				
			<form {...listUpdate} id="updateListForm" name="updateListForm">
				<p>Would get lists for User: {userId}, List: {selectedList}</p>

				<label for="title">Title:</label>
				<input {...title.as('text')} id="title" name="title" type="text" value={btnEvtData?.title || '' } />				
				
				<!-- <p data-field="id">ID: {btnEvtData?.id || ""}</p> -->
				<p data-field="id">ID: {srcList?.id || ""}</p>

				<p data-field="owner">Owner: {btnEvtData.owner}</p>

				<p data-field="created">Created: {localList?.created || ""}</p>

				<p data-field="modified">Modified: {srcList?.modified || ""}</p>

				<label for="editable">Editable:
					{#if ( btnEvtData?.editable === true ) }
						<input {...editable.as('checkbox')} name="editable" id="editable" type="checkbox" value={true} defaultChecked={true} checked={true} />
					{:else}
						<input {...editable.as('checkbox')} name="editable" id="editable" type="checkbox" value={false} defaultChecked={false} checked={false} />
					{/if}
				</label>

				<section>

					<p data-field="items">{btnEvtData?.items || ""}</p>

					{#if btnEvtData?.items }						
						<h3>Items: {btnEvtData.items.length}</h3>
						{#each btnEvtData?.items as i, iidx}
								<label for="id_{i?.id}">ID: {i?.id}</label>

								<input {...items[iidx].id.as('number')} id="id_{i?.id}" name="id_{i?.id}" type="hidden" value={i?.id} />

								<label for="created_{i?.id}">Created: {i?.created}</label>

								<input {...items[iidx].created.as('text')} name="created_{i?.id}" id="created_{i?.id}"  type="hidden" value={i?.created || ''} />

								<label for="modified_{i?.id}">Modified: {i?.modified}</label>

								<label for="item_txt_{i?.id}">Todo:</label>
								<input {...items[iidx].text.as('text')} name="item_txt_{i?.id}" id="item_txt_{i?.id}" type="textarea" value={i.text || ''} />

								<label for="item_editable_{i?.id}">Editable:</label>
								<input {...items[iidx].editable?.as('checkbox')} name="item_editable_{i?.id}" id="item_editable_{i?.id}" type="text" />
							{/each}
						{:else}
							<p>No items found</p>
						{/if}
				</section>
				<!-- <button onclick={()=>updateListModalState.value = false && this.close()}>OK</button> -->
				<!--
					TODO: Relocate the onclick form value corrections to either client form validation or to the listUpdate remote function 
				-->

				<button type="button" onclick={()=>{updateListModalState.value = false;}}>Cancel</button>

				<!-- <button onclick={ () => { updateFormValues( { name: 'updateListForm', fields: [ 'created', 'id', 'modified', 'owner' ] } ) } } >Save</button> -->
				<button onclick={()=>{ restoreUpdateFormStaticValues('updateListForm')}}>Save</button>
			</form>
			{/each}

		</dialog>
		<form {...deleteList} name="deleteListForm" id="deleteListForm"></form>

		<section class="lists">
			<h1>Todo Lists</h1>

			<div class="todo-list">
				{#each await getLists({userId}) as list (list)}
					<div data-name="list" data-value={list.id} data-list={list.id}>
						<p data-name="title" data-value={list.title} data-list_title={list.title}>{list.title}</p>
						<p data-name="id" data-value={list.id} data-list_id={list.id}>{list.id}</p>
						<p data-name="created" data-value={list.created} data-list_created={list.created}>{list.created}</p>
						<p data-name="modified" data-value={list.modified} data-list_modified={list.modified}>{list.modified}</p>
						<p data-name="owner" data-value={list.owner} data-list_owner={list.owner}>{list.owner}</p>
						<label data-name="editable" data-value={list.editable} data-list_editable={list.editable}>Editable:
							{#if ( list?.editable ) }
								<input type='checkbox' defaultChecked={true} value={true} checked={true} />
							{:else}
								<input type='checkbox' defaultChecked={false} value={false} checked={false} />
							{/if}
						 </label>
						<button name="deleteListFormButton" form="deleteListForm" type="submit" value="{userId},{list.id}">DELETE</button>

						<!-- <button name="updateListFormButton" onclick={async () => { updateListModalState.value = true; selectedList = Number(list?.id); await populateListModal(selectedList) as undefined; }}>Edit List</button> -->
						<button name="updateListFormButton" onclick={async () => { let l = Number(list?.id);
							[ localList ] = await getLists({userId, listId: l});
							updateListModalState.value = true; selectedList = l; await populateListModal(selectedList) as undefined; }}>Edit List</button>

						<div class="todo-items" data-name="items" data-value={`data-list-items_${list.id}`} data-list-items={`list-items_${list.id}`}>
							<h3>Array?:{Array.isArray(list?.items)}</h3>
							<h5>Type?:{typeof list?.items}</h5>
							<h5>Values?:{JSON.stringify(list?.items)}</h5>
							{#each list?.items as item (item)}
								<div data-name="item" data-value={item.id} class="list-item" data-list-item={item.id}>
									<p data-name="id" data-value={item.id} data-list-item_id={item.id}>Item ID: {item.id}</p>
									<p data-name="text" data-value={item.text} data-list-item_text={item.text}>Item Text: {item.text}</p>
									<p data-name="created" data-value={item.created} data-list-item_created={item.created}>Item Created: {item.created}</p>
									<p data-name="modified" data-value={item.modified} data-list-item_modified={item.modified}>Item Modified: {item.modified}</p>
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
		<dialog id="createListModalDialog" bind:this={createListDialog} onclose={() => {(createListModal.value = false); console.log(createList)}}>

			<form {...createList} id="createListForm" name="createListForm" enctype="multipart/form-data">

				<h2>List Entry</h2>

				<label>
					<h2>Title</h2>
					<input {...title.as("text")} name="title" data-field="title" type="text" />
				</label>
				
				<label>
					Editable
					<input {...editable.as("checkbox")} name="editable" data-field="editable" type="checkbox" defaultChecked={listMap.get('editable')} checked={listMap.get('editable')} value={listMap.get('editable')} />
				</label>

				<input {...owner.as("number")} name="owner" data-field="owner" data-value={listMap.get('owner')} type="hidden" value={listMap.get('owner')} />

				<input {...createList.fields.id.as("number")} name="id" data-field="id" data-value={listMap.get('id')} type="hidden" value={listMap.get('id')} />

				<input {...created.as("text")} name="created" data-field="created" type="hidden" value={listMap.get('created')} />

				<input {...modified.as("text")} name="modified" data-field="modified" type="hidden" value={listMap.get('modified')} />

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
					type="button"
					onclick={() => {
						createListDialog?.close();
						createListModal.value = false;
					}}>Cancel</button
				>

				<button
					type="submit"
					onclick={() => {
						updateFormValues(listMap, { name: 'createListForm', fields: [ 'created', 'id', 'modified', 'owner' ] });
						createListDialog?.close();
						createListModal.value = false;
					}}>Save</button
				>
			</form>
		</dialog>
	{/if}
</main>

<style>
	/* form {
	display: grid;
	grid: auto / 1fr;
} */

	dialog {
		inline-size: 85%;
		block-size: 85%;
		
	}
	dialog::backdrop {
		background: linear-gradient(130deg, #ff7a18, #af002d 41.07%, #319197 76.05%);
		position: fixed;
		top: 0px;
	}


	main {
		display: grid;
		/* grid: 1fr 1fr / auto; */
		/* grid: auto; */
	}
	
	form {
		display: grid;
	}
	form > *:not(button){
		grid: auto / 1fr 1fr;
	}
	form > button {
		/* gap: 1rem 0rem 0rem 0rem; */
		margin: 1rem 0rem;
		padding: 0.51rem 0rem;
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
	/* :global body:has(dialog:focus-within) *:not(dialog *, dialog, form, form *) { */
	/* :global html:has(dialog:focus-within) * :not(dialog *, dialog, form, form *) {
		background: black;
		color: black;
	} */
	/* :global html:has(dialog:focus-within) body { */
	:global html:has(dialog[open]) body {
		overflow: hidden;
	}

</style>
