// module
var mysql = require("mysql"),
	path = require("path");

// config
var config = require( path.join(__dirname, "..", "..", "config", "database") );

// create a connection to server
var client = mysql.createClient({
	user: config.user,
	password: config.password,
	host: config.host,
	port: config.port,
});

// switch to target database
client.useDatabase( config.database ,function(err) {
	if(err) {
		console.log("ERROR: Database cannot select db, detail: " + err);
	}
});

// return public method
exports.getInstance = function() {
	return client;
};
