<script lang="ts">
	import ListItems from "./ListItems.svelte";

    let { list } = $props();
</script>

<p data-name="title" data-value={list.title} data-list_title={list.title}>{list.title}</p>
<p data-name="id" data-value={list.id} data-list_id={list.id}>{list.id}</p>
<p data-name="created" data-value={list.created} data-list_created={list.created}>{list.created}</p>
<p data-name="modified" data-value={list.modified} data-list_modified={list.modified}>{list.modified}</p>
<p data-name="owner" data-value={list.owner} data-list_owner={list.owner}>{list.owner}</p>

<ListItems {list} />