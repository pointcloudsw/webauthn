### Example find with multiple criteria...

```js
collection.find(`(owner = :uid OR user = :uid) and title = :tit`).bind('uid', 1).bind('tit', 'NewListTitle')
```