### Example find with multiple criteria...

```js
collection.find(`(owner = :uid OR user = :uid) and title = :tit`).bind('uid', 1).bind('tit', 'NewListTitle')
```

### Duplicating a Document within a Document Collection
#### Question
> How can I use the MySQL XDevAPI Nodejs connector to duplicate a document in my document collection?

To duplicate a document in a MySQL document collection using the X DevAPI Node.js connector, you need to **read the document first, then insert it with a new `_id`**. Here's how:

```js
const mysqlx = require('@mysql/xdevapi');

async function duplicateDocument() {
  const session = await mysqlx.getSession({
    host: 'localhost',
    port: 33060,
    user: 'root',
    password: 'password'
  });

  const schema = session.getSchema('mydb');
  const collection = schema.getCollection('mycollection');

  // Find the document you want to duplicate
  const result = await collection
    .find('_id = :id')
    .bind('id', 'original-doc-id')
    .execute();

  const doc = result.fetchOne();

  if (doc) {
    // Remove the _id field (MySQL will generate a new one)
    delete doc._id;
    
    // Or assign a specific new _id
    // doc._id = 'new-doc-id';

    // Insert the duplicate
    await collection.add(doc).execute();
    console.log('Document duplicated successfully');
  }

  await session.close();
}

duplicateDocument();
```

## Key Points:

1. **Remove or change `_id`**: The `_id` field must be unique. Either delete it to let MySQL generate a new one, or assign a new unique value.

2. **Fetch then Insert**: There's no built-in "duplicate" operation, so you must:
   - Fetch the document with `.find().execute()`
   - Modify the `_id`
   - Insert with `.add().execute()`

3. **Fetching the document**: Use `.fetchOne()` for a single document or `.fetchAll()` for multiple documents.

## Duplicating Multiple Documents:

```js
const results = await collection
  .find('someField = :value')
  .bind('value', 'targetValue')
  .execute();

const docs = results.fetchAll();

// Remove _id from each and insert
const docsToInsert = docs.map(doc => {
  delete doc._id;
  return doc;
});

await collection.add(docsToInsert).execute();
```

This approach works because X DevAPI treats documents as JSON objects that you can manipulate before reinserting.



## Reading and manipulating NoSQL Record Sets and Document Collections
```js
docs = c.find().execute().fetchAll();
for ( let d of docs ) { console.log(...d); console.log(d._id) };

let i = -1;
for ( let d of docs ) { if ( ++i % 2 === 0 ) c.modify('_id = :id').set('editable',false).bind('id',d._id).execute(); }
```

## Find max maximum value of id in collection
```js
c.find().fields('id').sort(['id desc']).limit(1).execute().fetchOne().id;

c.find('owner = :own').fields('id').sort(['id desc']).limit(1).bind('own',1).execute().fetchOne().id;
```

## Basic update of a collection document property
```js
c.modify('_id = "0000692b0ecd000000000000001e"').set('owner', 1).execute();
```