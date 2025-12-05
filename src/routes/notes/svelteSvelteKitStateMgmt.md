---
title: Accessing state variables in Svelte & SvelteKit
version: draft-01 
---
## Accessing state variables in Svelte & SvelteKit
### Context API
State information is accessible from Page data as well as from the Context API.

#### Page
Page data from $app/page (requires @sveltejs/kit) provides read-only access to information pertaining to the current page.  Ensure reactivity by assigning its information via the $derived() rune.  See [$app/state](https://svelte.dev/docs/kit/$app-state) for details.

#### Context API
For more direct control, including write access, developers can utilize the Context API in a similar way.  This approach does not require SvelteKit but does require the developer to manually build page context to enable access by children in the component tree.  Enabling reactivity requires assinging (setting) a function to the context key and accessing the key using function notation.  It is highly recommended to assign the key centrally, for example, at the top of the component tree, such as in routes/layout.svelte.  See [Context API](https://svelte.dev/docs/kit/state-management) for details.


# ↓↓↓↓↓ Draft / Under Contruction ↓↓↓↓↓
##### Example
```ts
<script lang="ts">
import { getContext } from 'svelte';
// Retrieve user store from context
const user = getContext('user');
</script>

```
// by Context API
// https://svelte.dev/docs/kit/state-management

// <p>Welcome {user().name}</p>

// -- OR by Page data --
// https://svelte.dev/docs/kit/$app-state
import { page } from '$app/state';
let userId = $derived(page.data.userId);

