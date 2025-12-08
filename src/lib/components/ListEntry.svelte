<script lang="ts">
    let { data } = $props();
</script>

					<!-- <div data-name="list" data-value={data.id} data-list={data.id}> -->
						<p data-name="title" data-value={data.title} data-list_title={data.title}>{data.title}</p>
						<p data-name="id" data-value={data.id} data-list_id={data.id}>{data.id}</p>
						<p data-name="created" data-value={data.created} data-list_created={data.created}>{data.created}</p>
						<p data-name="modified" data-value={data.modified} data-list_modified={data.modified}>{data.modified}</p>
						<p data-name="owner" data-value={data.owner} data-list_owner={data.owner}>{data.owner}</p>
						<!-- <label data-name="editable" data-value={data.editable} data-list_editable={data.editable} aria-label="Lock list">{#if ( data?.editable ) }
								<input type='checkbox' defaultChecked={true} value={true} checked={true} />
							{:else}
								<input type='checkbox' defaultChecked={false} value={false} checked={false} />
							{/if}
						 </label> -->
						<!-- <button name="deleteListFormButton" form="deleteListForm" type="submit" value="{userId},{data.id}" aria-label="Delete list"></button>

						<button name="updateListFormButton" onclick={async () => { let l = Number(list?.id);
							[ localList ] = await getLists({userId, listId: l});
							updateListModalState.value = true; selectedList = l; await populateListModal(selectedList) as undefined; }} aria-label="Update list"></button> -->

						<div class="todo-items" data-name="items" data-value={`data-list-items_${data.id}`} data-list-items={`list-items_${data.id}`}>
							<h3>Array?:{Array.isArray(data?.items)}</h3>
							<h5>Type?:{typeof data?.items}</h5>
							<h5>Values?:{JSON.stringify(data?.items)}</h5>
							{#each data?.items as item (item)}
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