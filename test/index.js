const path = require("path");
const args = require("minimist")(process.argv.slice(2));
const chalk = require("chalk").default;

const dbPath = path.join(__dirname, "db");

(async () => {

	console.log(chalk.blue(`Running test ${args.test || "write"}...`));
	console.time(chalk.blue(`Test ${args.test || "write"}`));

	await require(`./tests/${args.test || "write"}`).run({

		dbPath,
		...args

	});

	console.timeEnd(chalk.blue(`Test ${args.test || "write"}`));

})();
