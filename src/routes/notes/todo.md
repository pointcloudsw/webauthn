# Project TODO items

### sv check / compiler warnings
#### Accessing contents of $props()
Evidently, as of the latest update of `sv check`, accecssing `props` using the approach below now triggers a warning.  So the question is what's the preferred / recommended approach to accessing `props`?

#### Specific Questions
- What are the options and recommended best practices for passing userId and other state information, into client pages that may or may not be also server side rendered?
- If by props, then from where, to where and how?
- What role can / should various types of files play?
    - `<script module>`
    - `/**/*.svelte.ts`
    - `/**/+layout.server.ts`
    - `/**/+layout.ts`
    - `/**/+server.ts`
    - `/**/+page.svelte`
- Some answers may be available at [sveltekit routing](https://svelte.dev/docs/kit/routing#Other-files)
- Should I use bindable for my data prop even when my child component would not mutate the data attribute (e.g., data.userId)?
- Specifically, for client-specific attributes such as userId, username and other request-specific properties, should all those be stored in context instead?  If stored in context, then would that mean I can remove references to them in props entirely?
```sh
pcs@est:~/sw/webauthn$ npm run check

> webauthn@0.0.1 check
> $npm_package_config_exec $npm_package_config_chk


Loading svelte-check in workspace: /home/pcs/sw/webauthn
Getting Svelte diagnostics...

/home/pcs/sw/webauthn/src/routes/+page.svelte:5:43
Warn: This reference only captures the initial value of `data`. Did you mean to reference it inside a closure instead?
https://svelte.dev/e/state_referenced_locally (svelte)
        let { data } = $props();
        let { action, path, userid, username } = data;

/home/pcs/sw/webauthn/src/routes/+page.svelte:9:14
Warn: This reference only captures the initial value of `data`. Did you mean to reference it inside a closure instead?
https://svelte.dev/e/state_referenced_locally (svelte)
        console.log(`DATA:`);
        console.log(data);
        logger(`\n--------- ↑ /+page.svelte ↑ -----------\n`);

/home/pcs/sw/webauthn/src/routes/todo/+page.svelte:10:17
Warn: This reference only captures the initial value of `data`. Did you mean to reference it inside a closure instead?
https://svelte.dev/e/state_referenced_locally (svelte)
        console.log(`DATA:`);
        console.log(...data);
        logger(`\n--------- ↑ /todo/+page.svelte ↑ -----------\n`);
```