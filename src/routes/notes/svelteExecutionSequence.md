# Execution sequence

/hooks.server.ts(rateLimitHandle):21
/hooks.server.ts(authHandle):41
/hooks.server.ts(authHandle):43
/hooks.server.ts(authHandle):46
/hooks.server.ts(authHandle):55
/hooks.server.ts(redirectHandle):61
/hooks.server.ts(redirectHandle):70

/todo/+page.server.ts(load):12
/todo/+page.server.ts(load):17

/hooks.server.ts(rateLimitHandle):21
...
/hooks.server.ts(redirectHandle):70

/+layout.server.ts(load):9
/+layout.server.ts(load):12

/+page.server.ts(load):16
/+page.server.ts(load):21

/+layout.svelte(eval):21
/+layout.svelte(eval):23

/+page.svelte(eval):21
/+page.svelte(eval):24
/+page.svelte(eval):25

/hooks.server.ts(rateLimitHandle):21
...
/hooks.server.ts(redirectHandle):70

/hooks.server.ts(rateLimitHandle):21
...
/hooks.server.ts(redirectHandle):70

/todo/+page.server.ts(load):12
/todo/+page.server.ts(load):17



/+layout.server.ts(load):9
/+layout.server.ts(load):12

/todo/+page.server.ts(load):12
/todo/+page.server.ts(load):17

/+layout.svelte(eval):21
/+layout.svelte(eval):23

/todo/+page.svelte(eval):23
/todo/+page.svelte(eval):26

