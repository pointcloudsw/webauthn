<script lang="ts">
    let { item } = $props();
</script>
    <p data-name="id" data-value={item.id} data-list-item_id={item.id}>Item ID: {item.id}</p>
    <p data-name="text" data-value={item.text} data-list-item_text={item.text}>Item Text: {item.text}</p>
    <p data-name="created" data-value={item.created} data-list-item_created={item.created}>Item Created: {item.created}</p>
    <p data-name="modified" data-value={item.modified} data-list-item_modified={item.modified}>Item Modified: {item.modified}</p>
    <p data-name="editable" data-value={item.editable} data-list-item_editable={item.editable}>Item is Editable: {item.editable}</p>
<style>
    * { color: #fff89c; }
</style>