<script lang="ts">

</script>

<!-- 
		<dialog id="newListItemDialog" bind:this={newListItemDialog} onclose={() => {(modalDialog.value = false);}}>

			<form {...createList} id="createListForm" name="createListForm" enctype="multipart/form-data">

				<h2>List Entry</h2>

				<label>
					<h2>Title</h2>
					<input {...title.as("text")} name="title" data-field="title" type="text" />
				</label>
				
				<label>
					Editable
					<input {...editable.as("checkbox")} name="editable" data-field="editable" type="checkbox" defaultChecked={listMap.get('editable')} checked={listMap.get('editable')} value={listMap.get('editable')} />
				</label>

				<input {...owner.as("number")} name="owner" data-field="owner" data-value={listMap.get('owner')} type="hidden" value={listMap.get('owner')} />

				<input {...createList.fields.id.as("number")} name="id" data-field="id" data-value={listMap.get('id')} type="hidden" value={listMap.get('id')} />

				<input {...created.as("text")} name="created" data-field="created" type="hidden" value={listMap.get('created')} />

				<input {...modified.as("text")} name="modified" data-field="modified" type="hidden" value={listMap.get('modified')} />

				<p>
					Items
					<label>
						Created
						<input {...items[0].created.as("text")} />
					</label>
					<label>
						DBID
						<input {...items[0].dbid.as("text")} />
					</label>
					<label>
						Editable
						<input {...items[0].editable.as("checkbox")} />
					</label>
					<label>
						Flag
						<input {...items[0].flag.as("number")} />
					</label>
					<label>
						ID
						<input {...items[0].id.as("number")} />
					</label>
					<label>
						Priority
						<input {...items[0].priority.as("number")} />
					</label>
					<label>
						Sequence
						<input {...items[0].sequence.as("number")} />
					</label>
					<label>
						Status
						<input {...items[0].status.as("number")} />
					</label>
					<label>
						Description
						<input {...items[0].text.as("text")} />
					</label>
				</p>

				<button type="reset">Clear</button>

				<button
					type="button"
					onclick={() => {
						createListDialog?.close();
						createListModal.value = false;
					}}>Cancel</button
				>

				<button
					type="submit"
					onclick={() => {
						updateFormValues(listMap, { name: 'createListForm', fields: [ 'created', 'id', 'modified', 'owner' ] });
						createListDialog?.close();
						createListModal.value = false;
					}}>Save</button
				>
			</form>
		</dialog> -->