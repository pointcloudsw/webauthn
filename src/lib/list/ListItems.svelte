<script lang="ts">
    import ListItem from "./ListItem.svelte";
    let { list } = $props();
</script>

<div class="todo-items" data-name="items" data-value={`data-list-items_${list.id}`} data-list-items={`list-items_${list.id}`}>
    <!-- <summary>List Items ({list?.items.length})</summary> -->
    <!-- <p>List Items?:{JSON.stringify(list?.items)}</p> -->
    {#each list?.items as item (item)}
        <div data-name="item" data-value={item.id} class="list-item" data-list-item={item.id}>
            <ListItem {item} />
        </div>
    {:else}
        <div>
            <p>no items found</p>
        </div>
    {/each}
    </div>

<style>
    div {
        border: 2px solid mediumslateblue;
    }
    div > div {
        background: #892eb760;
        margin: 0.25rem;
        padding: 0.01rem 1rem;
    }
    .list-item {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        inline-size: fit-content;
        margin: 1rem auto;
        padding: 0.5rem;
    }

    @media screen and (min-width: 960px) {
        .list-item {
            flex-direction: row;
        }
    }
</style>