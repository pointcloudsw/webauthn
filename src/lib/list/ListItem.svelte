<script lang="ts">
    import editBtn from './pencil_edit.svg'
    import delBtn from './trash_can.svg'
    let { item } = $props();
</script>
    <span data-name="id" data-value={item.id} data-list-item_id={item.id}>Item ID: {item.id}</span>
    <span data-name="text" data-value={item.text} data-list-item_text={item.text}>Item Text: {item.text}</span>
    <span data-name="created" data-value={item.created} data-list-item_created={item.created}>Item Created: {item.created}</span>
    <span data-name="modified" data-value={item.modified} data-list-item_modified={item.modified}>Item Modified: {item.modified}</span>
    <span data-name="editable" data-value={item.editable} data-list-item_editable={item.editable}>Item is Editable: {item.editable}</span>
    <button type="button">
        <img src={editBtn} alt="edit">
    </button>
    <button type="button">
        <img src={delBtn} alt="delete">
    </button>
    <button type="button">
        Save
    </button>
<style>
    * { color: #fff89c; }
    button:has(img) {
        background: transparent;
        border: 1px transparent;
    }
    button:not( :has(img) ) {
        background: slategray;
        color: black;
    }
</style>