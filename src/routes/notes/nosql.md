## NoSQL Commands

### Update document collection with sequential ID values
```js
c = db.getCollection('collection');
// named function in canonical form
async function updWcursor() {    try {        const res = await c.find().execute();        let doc;        let counter = 1;        while ( (doc = res.fetchOne()) ) {            await c                .modify('_id = :id')                .set('id',counter)                .bind('id',doc._id)                .execute();            counter++;        }    } catch (e) { console.error('Error during update:', e); }}

// anonymous IIAF
(async () => {    try {        const res = await c.find().execute();        let doc;        let counter = 1;        while ( (doc = res.fetchOne()) ) {            await c                .modify('_id = :id')                .set('id',counter)                .bind('id',doc._id)                .execute();            counter++;        }    } catch (e) { console.error('Error during update:', e); }})();

// anonymous IIAF, cleanly formatted
(async () => {
    try {
        const res = await c.find().execute();
        let doc;
        let counter = 1;
        while ( (doc = res.fetchOne()) ) {
            await c
                .modify('_id = :id')
                .set('id',counter)
                .bind('id',doc._id)
                .execute();
                counter++;
        }
    } catch (e) {
        console.error('Error during update:', e);
    }}
)();
```
### Update document collection owners and sequential ID values


```js
c = db.getCollection('collection');
(async () => {
    try {
        let doc;
        let docObjArr = [ 
            { counter: 1, owner: 1 },
            { counter: 1, owner: 2 },
            { counter: 1, owner: 3 }
        ];
        let i = 1;
        const res = await c.find().execute();
        while ( (doc = res.fetchOne()) ) {
            
            await c
                .modify('_id = :id')
                .set('id',docObjArr[i-1].counter++)
                .bind('id',doc._id)
                .execute();
            
            await c
                .modify('_id = :id')
                .set('owner',docObjArr[i-1].owner)
                .bind('id',doc._id)
                .execute();
            
            i = i%3 + 1;
        }
    } catch (e) {
        console.error('Error during update:', e);
    }}
)();
```

### Add records populated with randomonly generated data
```js
c = db.getCollection('todo_lists');
// Codepoint Boundaries
const gr = (min,max) => { return Math.trunc(Math.random() * (max - min) + min) };

// Charcters within the codepoint boundaries
const rs = (i,min,max) => { let str = ''; while ( --i > 0 ) str += String.fromCodePoint(Number(gr(min,max))); return str;};

// Add records function
const addRecs = (owner, startId, count) => { let rec; let i = 0; while ( i++ < count ) { rec = { "id": startId++, "dbid": "", "owner": owner, "title": rs(12,32,125), "created": new Date(), "editable": true, "items": [ { "text": rs(24,32,125), "editable": true, "created": new Date() }] }; c.add(rec).execute(); }};

// Add records
addRecs(1,20,20);
```

### Add item data to each document
```js
c = db.getCollection('todo_lists');
// Codepoint Boundaries
const gr = (min,max) => { return Math.trunc(Math.random() * (max - min) + min) };

// Charcters within the codepoint boundaries
const rs = (i,min,max) => { let str = ''; while ( --i > 0 ) str += String.fromCodePoint(Number(gr(min,max))); return str;};

// Add items function
const addItems = async () => { try { let doc, rec; let counter = 1; const res = await c.find().execute(); while ( (doc = res.fetchOne()) ) { rec = [ { "id": counter++, "text": rs(24,32,125), "editable": true, "created": new Date() }, { "id": counter++, "text": rs(24,32,125), "editable": true, "created": new Date() }, { "id": counter++, "text": rs(24,32,125), "editable": true, "created": new Date() } ]; await c.modify('_id = :id').set('items', rec).bind('id',doc._id).execute(); counter = 1; }} catch (e) { console.error('Error during update:', e); }};
addItems();

