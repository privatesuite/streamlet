const fs = require("fs");
const chalk = require("chalk").default;
const Database = require("../../src");

module.exports = {

	async run (args) {

		console.time("_read()");
		const db = new Database(args.dbPath);
		await db.init();
		console.log(`_read(): Read ${db._documents.length} items successfully!`);
		console.log(`_read(): First element:`, db._documents[0]);
		console.timeEnd("_read()");
		console.log();

		console.log(chalk.blue(`Testing "find" and "findOne"`));

		console.time("find()");
		console.log(`find(): Found ${db.find(_ => _.value.startsWith("0.2")).length} unique items!`);
		console.timeEnd("find()");

		console.time("findOne()");
		db.findOne(_ => _.value.startsWith("0.2")).length;
		console.timeEnd("findOne()");
		console.log();

		console.log(chalk.blue(`Testing "findIndexes" and "findIndex"`));

		console.time("findIndexes()");
		console.log(`findIndexes(): Found ${db.findIndexes(_ => _.value.startsWith("0.2")).length} unique items!`);
		console.timeEnd("findIndexes()");

		console.time("findIndex()");
		db.findIndex(_ => _.value.startsWith("0.2")).length;
		console.timeEnd("findIndex()");
		console.log();

	}

}
