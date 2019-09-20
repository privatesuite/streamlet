const fs = require("fs");
const split = require("split");
const hyperid = require("hyperid");

const dateISORegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

function _jsonParse (key, val) {

	if (typeof val === "string") {

		if (dateISORegex.exec(val)) return new Date(val);

	}

	return val;

}

class Database {

	constructor (file) {

		this.file = file;

		this._streams = {

			write: fs.createWriteStream(file, {

				flags: "a+"

			})

		}

		this._queues = {

			write: []

		}

		this._docIndMap = new Map();
		this._documents = [];

		this._streams.write.setMaxListeners(100);
		this.idInstance = hyperid({

			fixedLength: 16,

		});
		
	}

	async init () {

		return this._read();

	}

	async insert (document) {

		this._queues.write.push(document);
		return this._fulfillWrite();

	}

	async insertBulk (bulk) {

		const promises = [];
		for (const document of bulk) {

			this._queues.write.push(document);
			promises.push(this._fulfillWrite());

		}

		return Promise.all(promises);

	}

	find (fn) {

		return this._documents.filter(fn);

	}

	findOne (fn) {

		return this._documents.find(fn);

	}

	findIndex (fn) {

		return this._documents.findIndex(fn);

	}

	findIndexes (fn) {

		return this.find(fn).map(_ => this._docIndMap.get(_._id));

	}

	async _push (id, data) {

		if (this._docIndMap.has(id)) {

			this._documents.splice(this._docIndMap.get(id), 1);

		}

		this._docIndMap.set(id, this._documents.length);

		this._documents.push({
						
			...data,
			_id: id
			
		});

	}

	async _read () {

		return new Promise((resolve, reject) => {

			const readStream = fs.createReadStream(this.file).pipe(split());

			readStream.on("data", chunk => {
		
				if (!chunk.trim()) return;

				this._push(chunk.slice(0, 33).toString(), JSON.parse(chunk.slice(34).trim(), _jsonParse));

			});
			readStream.on("end", () => resolve(this._documents));

		});

	}

	async _fulfillWrite (uid = this.idInstance(), data = this._queues.write.shift()) {

		return new Promise((resolve, reject) => {

			const id = uid || this.idInstance();

			this._documents.push({...data, _id: id});

			this._streams.write.write(id + "-" + JSON.stringify(data) + "\n", err => {

				if (err) throw err;
	
				resolve();
				
			});

		});

	}

}

module.exports = Database;
