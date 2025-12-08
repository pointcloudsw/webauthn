<script lang="ts">
    let { list } = $props();
</script>

					<!-- <div data-name="list" data-value={list.id} data-list={list.id}> -->
						<p data-name="title" data-value={list.title} data-list_title={list.title}>{list.title}</p>
						<p data-name="id" data-value={list.id} data-list_id={list.id}>{list.id}</p>
						<p data-name="created" data-value={list.created} data-list_created={list.created}>{list.created}</p>
						<p data-name="modified" data-value={list.modified} data-list_modified={list.modified}>{list.modified}</p>
						<p data-name="owner" data-value={list.owner} data-list_owner={list.owner}>{list.owner}</p>
						<!-- <label data-name="editable" data-value={list.editable} data-list_editable={list.editable} aria-label="Lock list">{#if ( list?.editable ) }
								<input type='checkbox' defaultChecked={true} value={true} checked={true} />
							{:else}
								<input type='checkbox' defaultChecked={false} value={false} checked={false} />
							{/if}
						 </label> -->
						<!-- <button name="deleteListFormButton" form="deleteListForm" type="submit" value="{userId},{list.id}" aria-label="Delete list"></button>

						<button name="updateListFormButton" onclick={async () => { let l = Number(list?.id);
							[ localList ] = await getLists({userId, listId: l});
							updateListModalState.value = true; selectedList = l; await populateListModal(selectedList) as undefined; }} aria-label="Update list"></button> -->

						<div class="todo-items" data-name="items" data-value={`data-list-items_${list.id}`} data-list-items={`list-items_${list.id}`}>
							<h3>Array?:{Array.isArray(list?.items)}</h3>
							<h5>Type?:{typeof list?.items}</h5>
							<h5>Values?:{JSON.stringify(list?.items)}</h5>
							{#each list?.items as item (item)}
								<div data-name="item" data-value={item.id} class="list-item" data-list-item={item.id}>
									<p data-name="id" data-value={item.id} data-list-item_id={item.id}>Item ID: {item.id}</p>
									<p data-name="text" data-value={item.text} data-list-item_text={item.text}>Item Text: {item.text}</p>
									<p data-name="created" data-value={item.created} data-list-item_created={item.created}>Item Created: {item.created}</p>
									<p data-name="modified" data-value={item.modified} data-list-item_modified={item.modified}>Item Modified: {item.modified}</p>
									<p data-name="editable" data-value={item.editable} data-list-item_editable={item.editable}>Item is Editable: {item.editable}</p>
								</div>
							{/each}
						</div>
					<!-- </div> -->