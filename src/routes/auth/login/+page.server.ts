import { fail, redirect } from "@sveltejs/kit";
import { verifyEmailInput } from "$lib/server/auth/email";
import { getUserFromEmail, getUserPasswordHash } from "$lib/server/auth/user";
import { RefillingTokenBucket, Throttler } from "$lib/server/auth/rate-limit";
import { verifyPasswordHash } from "$lib/server/auth/password";
import { createSession, generateSessionToken, setSessionTokenCookie } from "$lib/server/auth/session";
import { get2FARedirect } from "$lib/server/auth/2fa";

import type { SessionFlags } from "$lib/server/auth/session";
import type { Actions, PageServerLoadEvent, RequestEvent } from "./$types";

import {logger} from '$lib/exports';
import { navMap, projectauth, projectroot } from "$lib/constants";

// export const _login = navMap.get('login')?.path ?? `${projectroot}/`;
const login = navMap.get('login')?.path ?? `${projectroot}/`;

export function load(event: PageServerLoadEvent) {
	logger(`SESSIONUSERID: ${event?.locals?.session?.userId}`);
	logger(`USERID: ${event?.locals?.user?.id}`);
	if (event.locals.session !== null && event.locals.user !== null) {
		if (!event.locals.user.emailVerified) {
			return redirect(302, `${projectauth}/verify-email`);
		}
		if (!event.locals.user.registered2FA) {
			return redirect(302, `${projectauth}/2fa/setup`);
		}
		if (!event.locals.session.twoFactorVerified) {
			return redirect(302, get2FARedirect(event.locals.user));
		}
	}

	return {
		auth: projectauth,
		home: `${projectroot}/`,
		login: login,
		session: event.locals?.session,
		user: event.locals?.user
	}
	// return redirect(307, '/auth/login');
	// return {};
}

const throttler = new Throttler<number>([0, 1, 2, 4, 8, 16, 30, 60, 180, 300]);
const ipBucket = new RefillingTokenBucket<string>(20, 1);

export const actions: Actions = {
	default: action
};

async function action(event: RequestEvent) {
	// TODO: Assumes X-Forwarded-For is always included.
	const clientIP = event.request.headers.get("X-Forwarded-For");
	if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
		return fail(429, {
			message: "Too many requests",
			email: ""
		});
	}	

	const formData = await event.request.formData();
	const email = formData.get("email");
	const password = formData.get("password");
	if (typeof email !== "string" || typeof password !== "string") {
		return fail(400, {
			message: "Invalid or missing fields",
			email: ""
		});
	}
	if (email === "" || password === "") {
		return fail(400, {
			message: "Please enter your email and password.",
			email
		});
	}
	if (!verifyEmailInput(email)) {
		return fail(400, {
			message: "Invalid email",
			email
		});
	}
	const user = getUserFromEmail(email);
	if (user === null) {
		return fail(400, {
			message: "Account does not exist",
			email
		});
	}
	if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
		return fail(429, {
			message: "Too many requests",
			email: ""
		});
	}
	if (!throttler.consume(user.id)) {
		return fail(429, {
			message: "Too many requests",
			email: ""
		});
	}
	const passwordHash = getUserPasswordHash(user.id);
	const validPassword = await verifyPasswordHash(passwordHash, password);
	if (!validPassword) {
		return fail(400, {
			message: "Invalid password",
			email
		});
	}
	throttler.reset(user.id);
	const sessionFlags: SessionFlags = {
		twoFactorVerified: false
	};
	const sessionToken = generateSessionToken();
	const session = createSession(sessionToken, user.id, sessionFlags);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);

	if (!user.emailVerified) {
		return redirect(302, `${projectauth}/verify-email`);
	}
	if (!user.registered2FA) {
		return redirect(302, `${projectauth}/2fa/setup`);
	}
	return redirect(302, get2FARedirect(user));
}
