<script lang="ts">
import { createList, getLists } from './data.remote';
import { page } from '$app/state';

let { showModal = $bindable() } = $props();
let userId = page.data.userId;

createList.fields.created.set((new Date()).toString());
createList.fields.editable.set(true);
createList.fields.owner.set(userId);
console.log(createList.fields);

const { created, dbid, editable, id, items, owner, title } = createList.fields;

</script>

			<form {...createList} enctype="multipart/form-data">
				<label>
					<h2>Title</h2>
					<input {...title.as('text')} />
				</label>
				<label>
					Editable
					<input {...editable.as('checkbox')} />
				</label>
				<label>
					Owner
					<input {...owner.as('number')} />
				</label>
				<label>
					Created
					<input {...created.as('text')} />
				</label>
				<label>
					ID
					<input {...id.as('number')} />
				</label>
				<label>
					DBID
					<input {...dbid.as('text')} />
				</label>
				<p>Items
					<label>
						Created
						<input {...items[0].created.as('text')} />
					</label>
					<label>
						DBID
						<input {...items[0].dbid.as('text')} />
					</label>
					<label>
						Editable
						<input {...items[0].editable.as('checkbox')} />
					</label>
					<label>
						Flag
						<input {...items[0].flag.as('number')} />
					</label>
					<label>
						ID
						<input {...items[0].id.as('number')} />
					</label>
					<label>
						Priority
						<input {...items[0].priority.as('number')} />
					</label>
					<label>
						Sequence
						<input {...items[0].sequence.as('number')} />
					</label>
					<label>
						Status
						<input {...items[0].status.as('number')} />
					</label>
					<label>
						Description
						<input {...items[0].text.as('text')} />
					</label>
				</p>
				<!-- <button type="button" popovertarget="editModal" popovertargetaction="hide"  onclick={()=>(console.log(createList))}>Save</button> -->
				<button type="button">Save</button>
			</form>

<style>
form {
	background: slategrey;
	display: grid;
	grid: auto / 1fr;
}
</style>