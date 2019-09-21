const fs = require("fs");
const chalk = require("chalk").default;
const assert = require("assert");
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

		console.log(chalk.blue(`Testing "findById"`));

		console.time("findById()");
		assert(db.findById(db.get(0)._id), "findById() returned undefined!");
		console.timeEnd("findById()");
		console.log();

		console.log(chalk.blue(`Testing "edit" and "delete"`));

		const first = db.get(0);
		const second = db.get(1);
		const third = db.get(2);

		console.time("edit()");

		db.edit(first._id, {

			...first,
			modified: true

		});

		db.edit(second._id, {

			...second,
			modified2: true

		});

		db.edit(third._id, {

			...third,
			modified3: true

		});

		assert(db.get(0).modified && db.get(1).modified2 && db.get(2).modified3, "Items could not be edited!");

		console.timeEnd("edit()");
		console.time("delete()");

		await db.delete(first._id);

		assert(db.get(0)._id === second._id, "Item could not be deleted!");

		console.timeEnd("delete()");
		console.log();

	}

}
