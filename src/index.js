const fs = require('fs')
const split = require('split')
const hyperid = require('hyperid')

const dateISORegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/

function _jsonParse (key, val) {
  if (typeof val === 'string') {
    if (dateISORegex.exec(val)) return new Date(val)
  }
  return val
}

/**
 * Main Database Constructor
 * @consructor
 */
class Database {
  constructor (file) {
    this.file = file

    this._streams = {

      write: fs.createWriteStream(file, {
        flags: 'a+'
      })

    }

    this._queues = {
      write: []
    }

    // this._docIndMap = new Map();
    this._documents = []
    this._documentIdentifiers = new Set()

    this._streams.write.setMaxListeners(100)
    this.idInstance = hyperid({
      fixedLength: 16
    })
  }

  /**
   * Initialise the database file
   */
  async init () {
    return this._read()
  }

  /**
   * Get the Document at index
   * @param {number} index
   * @returns {object}
   */
  get (index) {
    return this._documents[index]
  }

  /**
   * Insert a document into the database
   * @param {object} document
   * @returns {string} The ID of the element
   * @example
   * // insert user information
   * db.insert({'type': 'user', 'name': 'foo', 'details': 'bar'})
   */
  insert (document) {
    this._queues.write.push(document)
    return this._fulfillWrite()
  }

  /**
   * Replace a document in the database
   * @param {string} id
   * @param {object} document
   * @example
   * // Edit the element with a specific ID
   * db.edit('XXXX/0001', {'type': 'Modified data'})
   */
  edit (id, document) {
    return this._fulfillWrite(id, document)
  }

  /**
   * Append an instruction telling parser to ignore the value of ID
   * @param {string} id
   * @example
   * // Delete the element with a specific ID
   * db.delete('XXXX/0001')
   */
  delete (id) {
    return new Promise((resolve, reject) => {
      const index = this.findIndex(_ => _._id === id)

      this._documents.splice(index, 1)
      this._documentIdentifiers.delete(id)

      this._streams.write.write(id + '-DELETE' + '\n', err => {
        if (err) throw err
        resolve()
      })
    })
  }

  /**
   * Write multiple documents to the database
   * @param {Array<object>} bulk
   * @example
   * // Insert bulk data
   * const bulk = [
   *  {'type': 'bulk', 'data': 'foo'},
   *  {'type': 'bulk', 'data': 'bar'}
   * ]
   * db.insertBulk(bulk)
   */
  insertBulk (bulk) {
    const promises = []
    for (const document of bulk) {
      this._queues.write.push(document)
      promises.push(this._fulfillWrite())
    }

    return Promise.all(promises)
  }

  /**
   * Find all elements that match a callback
   * @param {function} fn - A Callback for an internal filter() function
   * @returns {Array<object>}
   * @example
   * // Find all elements where field 'type' is 'data'
   * db.find(_ => _.type === 'data') // returns [{'type': 'data', 'data': 'foo'}, {'type': 'data', 'data': 'bar'}]
   */
  find (fn) {
    return this._documents.filter(fn)
  }

  /**
   * Find the first element that matches a callback
   * @param {function} fn - A Callback for an internal filter() function
   * @returns {object}
   * @example
   * // Find the first element where field 'type' is 'data'
   * db.findOne(_ => _.type === 'data') // returns {'type': 'data', 'data': 'foo'}
   */
  findOne (fn) {
    return this._documents.find(fn)
  }

  /**
   * Find an element that matches ID
   * @param {string} id
   * @returns {object}
   * @example
   * // Find the element with a specific ID
   * db.findbyID('XXXX-0001') // returns {'type': 'data', 'data': 'foo'}
   */
  findById (id) {
    return this.findOne(_ => _._id === id)
  }

  /**
   * Find the index of a Document
   * @param {function} fn - A Callback for an internal findIndex() function
   * @returns {number}
   */
  findIndex (fn) {
    return this._documents.findIndex(fn)
  }

  /**
   * Find the indexes of documents that match the callback
   * @param {function} fn - A Callback for an internal findIndex() function
   * @returns {Array<number>}
   */
  findIndexes (fn) {
    return this._documents.map((e, i) => fn(e) ? i : undefined).filter(_ => _)
  }

  _push (id, document) {
    if (this._documentIdentifiers.has(id)) {
      const index = this.findIndex(_ => _._id === id)

      this._documents[index] = {
        ...document,
        _id: id
      }
    } else {
      this._documents.push({
        ...document,
        _id: id
      })
      this._documentIdentifiers.add(id)
    }
  }

  async _read () {
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(this.file).pipe(split())

      readStream.on('data', chunk => {
        if (!chunk.trim()) return

        const id = chunk.slice(0, 33).toString()
        const data = chunk.slice(34).trim()

        if (data === 'DELETE') {
          const index = this.findIndex(_ => _._id === id)

          this._documents.splice(index, 1)
          this._documentIdentifiers.delete(id)

          return
        }

        this._push(id, JSON.parse(data, _jsonParse))
      })
      readStream.on('end', () => resolve(this._documents))
    })
  }

  async _fulfillWrite (uid = this.idInstance(), data = this._queues.write.shift()) {
    delete data._id

    return new Promise((resolve, reject) => {
      const id = uid || this.idInstance()

      this._push(id, data)

      this._streams.write.write(id + '-' + JSON.stringify(data) + '\n', err => {
        if (err) throw err
        resolve(id)
      })
    })
  }
}

module.exports = Database
