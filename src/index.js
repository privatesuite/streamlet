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

  async init () {
    return this._read()
  }

  get (index) {
    return this._documents[index]
  }

  insert (document) {
    this._queues.write.push(document)
    return this._fulfillWrite()
  }

  edit (id, document) {
    return this._fulfillWrite(id, document)
  }

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

  insertBulk (bulk) {
    const promises = []
    for (const document of bulk) {
      this._queues.write.push(document)
      promises.push(this._fulfillWrite())
    }

    return Promise.all(promises)
  }

  find (fn) {
    return this._documents.filter(fn)
  }

  findOne (fn) {
    return this._documents.find(fn)
  }

  findById (id) {
    return this.findOne(_ => _._id === id)
  }

  findIndex (fn) {
    return this._documents.findIndex(fn)
  }

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
