import { json, text, redirect, type RemoteQueryFunction } from '@sveltejs/kit';
import { type List } from '$lib/schema';

import * as v from 'valibot';
import { command, form, query } from "$app/server";
import { addList, getListsByUser } from '$lib/server/database/db';

import { getLocals } from '$lib/auth.remote';
import { refreshAll } from '$app/navigation';
import { logger } from '$lib/exports';



const getLists : RemoteQueryFunction<void, List[]> = query(async () => {

	const { session, user, headers } = await getLocals();

	
	logger(`SESSION: ${session?.userId}, USER: ${user?.id}, HEADERS: ${headers}`);
	
	const id = session?.userId ?? '';

	const lists : List[] = await getListsByUser(id) as unknown as List[];
	return lists;
});

const createList = form(
	v.object({
		title: v.string(),
		items: v.array(v.string())
	}),
	async ({ title, items }) => {
		let id;
		if ( !( id = (await getLocals()).user?.id ) ){
			throw new Error("user not found");
			return [ 'user not found' ];
		}

		const result : string[] = await addList({owner: id, title, items});

		// if ( result ) refreshAll();

		return result;
	}
);

// const modifyList = form( async ({}) => {});
// const removeList = command( async ({}) => {});
// const removeListItem = form( async ({}) => {});
// const modifyListItem = form( async ({}) => {});
/*
const createListItem = form(	v.object({
		// listid
		// itemid
		description: v.string(),
		due: v.date(),
		status: v.string()

	}),
	async ({ title, items }) => {
		let user;
		if ( !( user = (await getUser()).id ) ){
			throw new Error("user not found");
			return [ 'user not found' ];
		}

		const result : string[] = await addList({owner: user, title, items});

		// if ( result ) refreshAll();

		return result;
	});
	*/
	export { getLists, createList };