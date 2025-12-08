<script lang="ts">
    let { list, printVars } = $props();
    let deleteMe = document.querySelectorAll("dialog");
    
</script>

<div class="todo-items" data-name="items" data-value={`data-list-items_${list.id}`} data-list-items={`list-items_${list.id}`}>
    <h3>Array?:{Array.isArray(list?.items)}</h3>
    <h5>Type?:{typeof list?.items}</h5>
    <h5>Values?:{JSON.stringify(list?.items)}</h5>
    <h5>PrintVars: {printVars(list?.id, list?.items)}</h5>
    {#each deleteMe.entries() as entry}
    <p>{entry}</p>
    {/each}
    {#each list?.items as item (item)}
        <div data-name="item" data-value={item.id} class="list-item" data-list-item={item.id}>
            <p data-name="id" data-value={item.id} data-list-item_id={item.id}>Item ID: {item.id}</p>
            <p data-name="text" data-value={item.text} data-list-item_text={item.text}>Item Text: {item.text}</p>
            <p data-name="created" data-value={item.created} data-list-item_created={item.created}>Item Created: {item.created}</p>
            <p data-name="modified" data-value={item.modified} data-list-item_modified={item.modified}>Item Modified: {item.modified}</p>
            <p data-name="editable" data-value={item.editable} data-list-item_editable={item.editable}>Item is Editable: {item.editable}</p>
        </div>
    {:else}
        <div>
            <p>no items found</p>
        </div>
    {/each}
</div>