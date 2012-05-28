// module
var mysql = require("mysql"),
	path = require("path");

// config
var config = require( path.join(__dirname, "..", "..", "config", "database") );

var client = null;

function loadClient(callback) {
	client = mysql.createClient({
		user: config.user,
		password: config.password,
		host: config.host,
		port: config.port,
	}).on("error", function(err) {
			console.log("DB ERROR: " + err);
			client = null;
	});

	// switch to target database
	client.useDatabase( config.database ,function(err) {
		if(err) {
			console.log("DB ERROR: Database cannot select db, detail: " + err);
			client = null;
		}

		callback();
	});
}

// return public method
exports.getInstance = function(callback) {

	if(typeof client === "undefined" || client === null) {
		loadClient(function() {
			callback(client);
		});

		return;
	}

	callback(client);
};
