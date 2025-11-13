import { json, text, redirect, type RemoteQueryFunction, type RemoteForm } from '@sveltejs/kit';

import * as v from 'valibot';
import { List, type Item } from '$lib/types/list';
import { form, query } from "$app/server";
import { addList, delList,getListsByUser } from '$lib/server/database/db';

// import { getLocals } from '$lib/auth.remote';
import { refreshAll } from '$app/navigation';
import { logger } from '$lib/exports';



export const getLists = query( v.number(), async userId => {

	const lists = await getListsByUser(userId) as unknown as List[];
	return lists;
});


const list = v.object({
	created: v.optional(v.string()),
	dbid: v.optional(v.string()),
	editable: v.optional(v.boolean(), true),
	id: v.optional(v.number(), -1),
	items: v.optional(v.array(v.object({created: v.optional(v.string()),dbid: v.optional(v.string()),editable: v.optional(v.boolean(), true),flag: v.optional(v.number()),id: v.optional(v.number()),priority: v.optional(v.number()),sequence: v.optional(v.number()),status: v.optional(v.number()),text: v.optional(v.string())}))),
	owner: v.optional(v.number(), -1),
	title: v.optional(v.string(), '')
});
const listKey = v.object({ id: v.number(), owner: v.number()});


export const createList=form(list, async data => {
	let { created, dbid, editable, id, items, owner, title } = data;
	const result = await addList({created, dbid, editable, id, items, owner, title});

	logger(`Result: ${result.toString()}`);
	if ( result ){
		logger(`Refreshing...`);
		await getLists(owner).refresh();
		logger(`Done.`);

	}
	return result;
	}
);

// let listKey: ListKey;
export const updateList=form('unchecked', async data => {
	let result;

	if ( data.delete ){
	let [ id, owner ] = data.delete.toString().split(',').map(e => Number(e));
	// let i = data.get('id') as number;
	// console.log(data.id.split(','));
	logger(`DATA: ${data}, OWNER: ${owner}, LISTID: ${id}`);
	// if ( id && owner )
	try {
		result = await delList({id, owner});

	// logger(`Result: ${result.toString()}`);
	if ( result ){
		logger(`Refreshing...`);
		await getLists(owner).refresh();
		logger(`Done.`);

	}
} catch(err) { throw err}
	return result;
	}
else if (data.update) {
	// let [ info ] = data;
	let info = data.update.toString().split(','); 
	logger(...info);
} else {
		let info = data.action.toString().split(','); 
	logger(info);
	console.log(data.action);
}
}
);



// const modifyList = form( async ({}) => {});
// const removeList = command( async ({}) => {});
// const removeListItem = form( async ({}) => {});
// const modifyListItem = form( async ({}) => {});
/*
const createListItem = form(	v.object({
		due: v.string(),
		editable: v.boolean(),
		flag: v.number(),
		id: v.number(),
		listid: v.number(),
		owner: v.number(),
		priority: v.number(),
		sequence: v.number(),
		status: v.number(),
		text: v.string()
	}),
	async ({due, editable, flag, id, listid, owner, priority, sequence, status, text}) => {
		let user;
		if ( !( user = (await getUser()).id ) ){
			throw new Error("user not found");
			return [ 'user not found' ];
		}

		const result : string[] = await addListItem({due, editable, flag, id, listid, owner, priority, sequence, status, text});

		// if ( result ) refreshAll();

		return result;
	});
	*/