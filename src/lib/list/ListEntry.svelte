<script lang="ts">
	import ListItems from "./ListItems.svelte";

    let { list } = $props();
</script>

{#if (list?.items?.length > 1)}
<details>
    <!-- <p data-name="title" data-value={list.title} data-list_title={list.title}>{list.title}</p> -->
    <!-- <summary data-name="title" data-value={list.title} data-list_title={list.title}>{list.title}</summary> -->
    <summary data-name="title" data-value={list.title} data-list_title={list.title}><div><span>{list.title} - {list?.id} - {list?.owner} ({list?.items?.length ?? 0})</span><span>Put fancy buttons here</span></div></summary>

<!-- <p data-name="id" data-value={list.id} data-list_id={list.id}>{list.id}</p>
<p data-name="created" data-value={list.created} data-list_created={list.created}>{list.created}</p>
<p data-name="modified" data-value={list.modified} data-list_modified={list.modified}>{list.modified}</p>
<p data-name="owner" data-value={list.owner} data-list_owner={list.owner}>{list.owner}</p> -->

<!-- <span>Items: {list?.items?.length}</span> -->
<ListItems {list} />
</details>
{:else}
<div>
    <!-- <p data-name="title" data-value={list.title} data-list_title={list.title}>{list.title}</p> -->
    <!-- <summary data-name="title" data-value={list.title} data-list_title={list.title}>{list.title}</summary> -->
    <div data-name="title" data-value={list.title} data-list_title={list.title}><div><span>{list.title} - {list?.id} - {list?.owner} ({list?.items?.length ?? 0})</span><span>Put fancy buttons here</span></div></div>

<!-- <p data-name="id" data-value={list.id} data-list_id={list.id}>{list.id}</p>
<p data-name="created" data-value={list.created} data-list_created={list.created}>{list.created}</p>
<p data-name="modified" data-value={list.modified} data-list_modified={list.modified}>{list.modified}</p>
<p data-name="owner" data-value={list.owner} data-list_owner={list.owner}>{list.owner}</p> -->

<!-- <span>Items: {list?.items?.length}</span> -->
</div>
{/if}
<style>
    details {
        border: 2px solid slateblue;
    }

    summary  div {
        display: inline-flex;
        inline-size: 95%;
        place-content: space-between;
        /* justify-self: end; */
        /* text-align-last: end; */
    }
    summary div :last-child {
        justify-self: end;
        color: red;
    }
    
</style>