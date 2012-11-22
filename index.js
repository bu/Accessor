// modules
var fs = require("fs"),
	path = require("path");

module.exports = function(table_name, database_engine) {
	var engine = null;
	
	// if engine is not specified, we should lookup installed modules
	if(!database_engine) {
		return findInstalledModule();
	}
	
	// if engine is specified, we will try to require that, but if not found, we should fallback to auto-lookup
	try {
		engine = require("Accessor_" + database_engine);

		return returnInstance();
	} catch(e) {
		
		try {
			engine = require("accessor_" + database_engine);

			return returnInstance();
		} catch(e) {
			return findInstalledModule();
		}
	}
	
	// return engine to user
	function returnInstance() {
		if(engine === null) {
			throw new Error("No engine were found.");
		}

		return new engine(table_name);
	}

	function findInstalledModule() {
		// if not database_engine(eg: MySQL, MongoDB) is not given
		// try to find installed modules
		fs.readdir( path.join(__dirname, ".."), function(err, files) {
			files.map(function(filename) {
				// if not our module, skip it
				if(filename.match(/Accessor_.*/) === null) {
					return;
				}

				// if it is singleton module, skip that
				if(filename === "Accessor_Singleton") {
					return;
				}
				
				// if we found a Accessor_* we just load that
				engine = require(filename);

				return returnInstance();
			}); 
			
			// if we don't find any engine, we just return
			// it should throw Error
			return returnInstance();
		});
	}
};
