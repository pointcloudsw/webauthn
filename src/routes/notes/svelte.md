# Svelte notes, tips & tricks

- `+page.svelte` files (i.e., for use by clients) have access to `{ data, url, route }` objects from  `+page.server.ts` `load` functions by way of `$props()`.
- use `filterSerializedResponseHeaders` to serialize and access headers
- ensuring authentication guards via universal loaders:

When running server `load` functions, the `event` object passed to the function as an argument can also be retrieved with [`getRequestEvent`]($app-server#getRequestEvent). This allows shared logic (such as authentication guards) to access information about the current request without it needing to be passed around.

For example, you might have a function that requires users to be logged in, and redirects them to `/login` if not:

```js [!file]
/// file: src/lib/server/auth.js
import { redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';

export function requireLogin() {
	const { locals, url } = getRequestEvent();

	// assume `locals.user` is populated in `handle`
	if (!locals.user) {
		const redirectTo = url.pathname + url.search;
		const params = new URLSearchParams({ redirectTo });

		redirect(307, `/login?${params}`);
	}

	return locals.user;
}
```