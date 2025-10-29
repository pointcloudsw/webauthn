import { fail, redirect } from "@sveltejs/kit";
import { verifyEmailInput } from "$lib/server/auth/email";
import { getUserFromEmail, getUserPasswordHash } from "$lib/server/auth/user";
import { RefillingTokenBucket, Throttler } from "$lib/server/auth/rate-limit";
import { verifyPasswordHash } from "$lib/server/auth/password";
import { createSession, deleteSessionTokenCookie, generateSessionToken, setSessionTokenCookie } from "$lib/server/auth/session";
import { get2FARedirect } from "$lib/server/auth/2fa";

import type { SessionFlags } from "$lib/server/auth/session";
import type { Actions, PageServerLoadEvent, RequestEvent } from "./$types";

import {logger} from '$lib/exports';

import { navMap, projectroot } from "$lib/constants";

export async function load(event: PageServerLoadEvent) {
		logger(`TOKEN: ${event.cookies?.get('session')}, SESSION: ${event.locals?.session?.userId}, USER: ${event.locals?.user?.username}, REFERRER: ${event?.request?.referrer}, URL: ${event?.request?.url}`);

	if ( event?.locals?.user || event?.locals?.session ){
		deleteSessionTokenCookie(event);
		event.locals.user = null;
		event.locals.session = null;
		logger(`TOKEN: ${event.cookies?.get('session')}, SESSION: ${event.locals?.session}, USER: ${event.locals?.user}, REFERRER: ${event?.request?.referrer}, URL: ${event?.request?.url}`);
	}

	logger(`LOGOUT is redirecting to home, USER: ${event.locals.user?.username}, SESSION: ${event.locals.session?.userId}, TOKEN: ${event.cookies.get('session')}, REFERER: ${event.request.referrer}, URL: ${event.request.url}, eURL: ${event.url}, ROUTEID: ${event.route.id}, LOCATIONHEADER: ${event.request.headers.get('location')}`);

	return await redirect( 303, navMap.get('home')?.path ?? projectroot );
	// return {};
}

export const actions: Actions = {
	default: action
};

async function action(event: RequestEvent) {
	logger(`LOGOUT is redirecting to home, USER: ${event.locals.user?.username}, SESSION: ${event.locals.session?.userId}, TOKEN: ${event.cookies.get('session')}, REFERER: ${event.request.referrer}, URL: ${event.request.url}, eURL: ${event.url}, ROUTEID: ${event.route.id}, LOCATIONHEADER: ${event.request.headers.get('location')}`);

	if ( event?.locals?.user || event?.locals?.session ){
		deleteSessionTokenCookie(event);
		event.locals.user = null;
		event.locals.session = null;
	}

	logger(`LOGOUT is redirecting to home, USER: ${event.locals.user?.username}, SESSION: ${event.locals.session?.userId}, TOKEN: ${event.cookies.get('session')}, REFERER: ${event.request.referrer}, URL: ${event.request.url}, eURL: ${event.url}, ROUTEID: ${event.route.id}, LOCATIONHEADER: ${event.request.headers.get('location')}`);

	return await redirect( 303, navMap.get('home')?.path ?? projectroot );
}

