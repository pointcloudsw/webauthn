import { fail, redirect, type RequestEvent } from "@sveltejs/kit";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/auth/session";
import { get2FARedirect } from "$lib/server/auth/2fa";

import type { Actions } from "./$types";
import { logger } from '$lib/exports';
import { navMap, projectauth } from "$lib/constants";

export function load(event) {
	
	if ( event.locals?.user ){
		
		if (!event.locals.user.emailVerified)
			return redirect(302, `${projectauth}/verify-email`);
		
		if (!event.locals.user.registered2FA)
			return redirect(302, `${projectauth}/2fa/setup`);
	}

	if ( event.locals?.session && event.locals?.user ) {
		if (!event.locals?.session?.twoFactorVerified)
			return redirect(302, get2FARedirect(event.locals?.user));
	}

	// const username = event.locals?.user?.username ?? '';
	// const userId = event.locals.session?.userId ?? -1;
	const { user, session } = event.locals;
	const action = user?.username && session?.userId ? `Logout` : `Login`;
	const path = navMap.get(action.toLocaleLowerCase())?.path;
	return {
		username: user?.username,
		userid: session?.userId,
		action: action,
		path: path
	};
}

export const actions: Actions = {
	// default: action,
	login: async () => { return await redirect( 307, navMap.get('login')?.path ?? '/' ) },
	logout: async () => { return await redirect( 307, navMap.get('logout')?.path ?? '/' ) }
};

async function action(event: RequestEvent) {

	logger(`SESSION: ${event.locals.session}, USER: ${event.locals.user}, REFERER: ${event.request.referrer}, REDIRECT: ${event.request.redirect}, DESTINATION: ${event.request.destination}`);

	return await redirect( 307, navMap.get('home')?.path ?? '/' );

}
