const fs = require("fs");
const Database = require("../../src");

module.exports = {

	async run (args) {

		console.time("Database Startup Time");
		const db = new Database(args.dbPath);
		console.timeEnd("Database Startup Time");

		if (args.reset || args.clear || args.fromScratch || args.fromZero) {

			fs.writeFileSync(args.dbPath, Buffer.from([]));

		}

		const items = args.items || 100000;

		const itemsAdded = [];
		for (let i = 0; i < items; i++) {
		
			itemsAdded.push({
				
				test: "hello_world",
				value: Math.random().toString(36),
				date: new Date()
				
			});
			
		}
		
		console.time(`Writing ${items} to database`);

		await db.insertBulk(itemsAdded);
		
		console.timeEnd(`Writing ${items} to database`);

	}

}
