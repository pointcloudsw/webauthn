import { fail, redirect, type RequestEvent } from "@sveltejs/kit";

import type { Actions } from "./$types";
import { logger } from '$lib/exports';
import type { MySqlDoc } from "$lib/schema";
import { getListsByUser } from "$lib/server/database/db";


export async function load(event) {
	
	const username : string = event.locals?.user?.username ?? '';
	const userId : number = event.locals.session?.userId ?? -1;
	const lists : MySqlDoc[] = await getListsByUser(userId);

	return { username, userId, lists };
}

export const actions: Actions = {
	default: action
};

async function action(event: RequestEvent) {
	logger(`SESSION: ${event.locals.session}, USER: ${event.locals.user}, REFERER: ${event.request.referrer}, REDIRECT: ${event.request.redirect}, DESTINATION: ${event.request.destination}`);

	
	// if (event.locals.session === null) {
	// 	return fail(401, {
	// 		message: "Not authenticated"
	// 	});
	// }

	// Logout
	// if ( event.url.pathname === '/auth/logout' )
	// 	return redirect(302, event.url.href);
	
	// Login
	// if ( !( event.locals.session && event.locals.user && event.url.pathname !== '/' ) )
	// 	return redirect(302, "/auth/login");
	
	return redirect(302, event.url.href);
	
	// invalidateSession(event.locals.session.id);
	// deleteSessionTokenCookie(event);
}
