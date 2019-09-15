const fs = require("fs");
const stream = require("stream");
const msgpack = require("msgpack-lite");

class Database {

	constructor (file) {

		this.file = file;

		this.streams = {

			read: fs.createReadStream(file, {

				flags: "r"

			}),
			write: fs.createWriteStream(file, {

				flags: "a+"

			}),

			encode: msgpack.createEncodeStream()

		}

		this.queues = {

			read: [],
			write: []

		}

		this.__ = {

			newLine: Buffer.from("\n")

		}

		this.streams.write.setMaxListeners(100);
		this.streams.encode.pipe(this.streams.write, {end: false});

	}

	async append (document) {

		this.queues.write.push(document);
		return this.__fulfillWrite();

	}

	async __fulfillWrite (uid = Math.random().toString(36).replace("0.", "").slice(0, 9), data = this.queues.write.shift()) {

		return new Promise((resolve, reject) => {

			const id = uid || Math.random().toString(36).replace("0.", "").slice(0, 9);

			this.streams.write.write(Buffer.concat([Buffer.from(id + "-"), msgpack.encode(data), this.__.newLine]), err => {

				if (err) throw err;
	
				resolve();
				
			});

		});

	}

}

module.exports = Database;
