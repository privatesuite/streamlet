const fs = require("fs");
const Database = require("../src");

fs.writeFileSync("db", Buffer.from([]));

console.time("Database startup");
const db = new Database("db");
console.timeEnd("Database startup");

(async () => {
	
	console.log("Starting write test");
	console.time("Adding 100,000 documents to the database");
	
	var a = [];
	for (let i = 0; i < 1; i++) {
		
		a.push(db.append({
			
			test: "hello_world"
			
		}));
		
	}
	
	console.log("Waiting for resolution")
	
	await Promise.all(a);
	
	console.timeEnd("Adding 100,000 documents to the database");
	
	let i = 0;
	let count = 0;
	
	fs.createReadStream("db").on('data', function(chunk) {

		for (i=0; i < chunk.length; ++i)
		if (chunk[i] == 10) count++;

	}).on("end", function() {

		console.log(count);

	});
	
})();
