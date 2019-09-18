const stream = require("stream"); 

const lineRegex = /\r\n|[\n\v\f\r\x85\u2028\u2029]/g;

module.exports = class LineSplitStream extends stream.Transform {

	constructor () {

		super();

	}

	/**
	 * 
	 * @param {Buffer} chunk Chunk of data
	 * @param {string} encoding Encoding
	 * @param {function} cb Callback
	 */
	_transform (chunk, encoding, cb) {

		console.log(`"${chunk.toString()}"`);
		cb(null, chunk);

	}

}
