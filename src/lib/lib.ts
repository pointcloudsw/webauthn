
// Import all +page.svelte files in src/routes
export const routes = Object.keys(

    import.meta.glob('/src/routes/**/+page.svelte')
)
    .map((path) => {
        // Remove the /src/routes prefix and the +page.svelte suffix
        let route = path
            .replace('/src/routes', '')
            .replace('/+page.svelte', '')
            .replace(/\/index$/, ''); // Remove trailing /index

        // Root route should be "/"
        return route === '' ? '/' : route;
    })
    .sort();
