<a name="Database"></a>

## Database
Main Database Constructor

**Kind**: global class  
**Consructor**:   

* [Database](#Database)
    * [.init()](#Database+init)
    * [.get(index)](#Database+get) ⇒ <code>object</code>
    * [.insert(document)](#Database+insert) ⇒ <code>string</code>
    * [.edit(id, document)](#Database+edit)
    * [.delete(id)](#Database+delete)
    * [.insertBulk(bulk)](#Database+insertBulk)
    * [.find(fn)](#Database+find) ⇒ <code>Array.&lt;object&gt;</code>
    * [.findOne(fn)](#Database+findOne) ⇒ <code>object</code>
    * [.findById(id)](#Database+findById) ⇒ <code>object</code>
    * [.findIndex(fn)](#Database+findIndex) ⇒ <code>number</code>
    * [.findIndexes(fn)](#Database+findIndexes) ⇒ <code>Array.&lt;number&gt;</code>

<a name="Database+init"></a>

### database.init()
Initialise the database file

**Kind**: instance method of [<code>Database</code>](#Database)  
<a name="Database+get"></a>

### database.get(index) ⇒ <code>object</code>
Get the Document at index

**Kind**: instance method of [<code>Database</code>](#Database)  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

<a name="Database+insert"></a>

### database.insert(document) ⇒ <code>string</code>
Insert a document into the database

**Kind**: instance method of [<code>Database</code>](#Database)  
**Returns**: <code>string</code> - The ID of the element  

| Param | Type |
| --- | --- |
| document | <code>object</code> | 

**Example**  
```js
// insert user information
db.insert({'type': 'user', 'name': 'foo', 'details': 'bar'})
```
<a name="Database+edit"></a>

### database.edit(id, document)
Replace a document in the database

**Kind**: instance method of [<code>Database</code>](#Database)  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 
| document | <code>object</code> | 

**Example**  
```js
// Edit the element with a specific ID
db.edit('XXXX/0001', {'type': 'Modified data'})
```
<a name="Database+delete"></a>

### database.delete(id)
Append an instruction telling parser to ignore the value of ID

**Kind**: instance method of [<code>Database</code>](#Database)  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 

**Example**  
```js
// Delete the element with a specific ID
db.delete('XXXX/0001')
```
<a name="Database+insertBulk"></a>

### database.insertBulk(bulk)
Write multiple documents to the database

**Kind**: instance method of [<code>Database</code>](#Database)  

| Param | Type |
| --- | --- |
| bulk | <code>Array.&lt;object&gt;</code> | 

**Example**  
```js
// Insert bulk data
const bulk = [
 {'type': 'bulk', 'data': 'foo'},
 {'type': 'bulk', 'data': 'bar'}
]
db.insertBulk(bulk)
```
<a name="Database+find"></a>

### database.find(fn) ⇒ <code>Array.&lt;object&gt;</code>
Find all elements that match a callback

**Kind**: instance method of [<code>Database</code>](#Database)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | A Callback for an internal filter() function |

**Example**  
```js
// Find all elements where field 'type' is 'data'
db.find(_ => _.type === 'data') // returns [{'type': 'data', 'data': 'foo'}, {'type': 'data', 'data': 'bar'}]
```
<a name="Database+findOne"></a>

### database.findOne(fn) ⇒ <code>object</code>
Find the first element that matches a callback

**Kind**: instance method of [<code>Database</code>](#Database)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | A Callback for an internal filter() function |

**Example**  
```js
// Find the first element where field 'type' is 'data'
db.findOne(_ => _.type === 'data') // returns {'type': 'data', 'data': 'foo'}
```
<a name="Database+findById"></a>

### database.findById(id) ⇒ <code>object</code>
Find an element that matches ID

**Kind**: instance method of [<code>Database</code>](#Database)  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 

**Example**  
```js
// Find the element with a specific ID
db.findbyID('XXXX-0001') // returns {'type': 'data', 'data': 'foo'}
```
<a name="Database+findIndex"></a>

### database.findIndex(fn) ⇒ <code>number</code>
Find the index of a Document

**Kind**: instance method of [<code>Database</code>](#Database)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | A Callback for an internal findIndex() function |

<a name="Database+findIndexes"></a>

### database.findIndexes(fn) ⇒ <code>Array.&lt;number&gt;</code>
Find the indexes of documents that match the callback

**Kind**: instance method of [<code>Database</code>](#Database)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | A Callback for an internal findIndex() function |

