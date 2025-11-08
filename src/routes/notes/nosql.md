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