const fs = require("fs");
const split = require("split");
const hyperid = require("hyperid");

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

		this._documents = [];

		this._streams.write.setMaxListeners(100);
		this.idInstance = hyperid({

			fixedLength: 16,

		});
		
	}

	async init () {

		this._documents = await this._read();

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

	async _read () {

		return new Promise((resolve, reject) => {

			let i = 0;
			const arr = [];
			const readStream = fs.createReadStream(this.file).pipe(split());

			readStream.on("data", chunk => {
		
				if (!chunk.trim()) return;

				arr.push({
						
					...JSON.parse(chunk.slice(34).trim()),
					_id: chunk.slice(0, 33).toString()
						
				});

			});
			readStream.on("end", () => resolve(arr));

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
