# Accessor 0.1.0

A database wrapper, provide easy access to database without writing SQL code


## Install & Setup

1. Create a config directory under your application, e.g.
   
    	buGit/config/
2. Then, create a database.js under config directory we just created, which contains like:

		var databaseConfig = { 
    		user: "YOUR_DATABASE_USER",
		    password: "YOUR_DATABASE_PASSWORD",
	    	database: "TARGET_DATABASE",
	    	host: "localhost",
    		port: 3306
		};

		module.exports = databaseConfig;

3. Now, Accessor is ready to use.


## Usage

1. Require the Accessor module in your script

		var Accessor = require("Accessor");

2. Place constructor where you need the Accessor

		var tester = Accessor("YOUR_TARGET_TABLE");

3. After initialization, Accessor will try to obtain the schema, and store it to verify  column existence while updating or creating.

### Methods

#### tester.select( {options}, callback(err, data, fields) );

Perform a select query to obtain data, for example:

		// test_table schema: id, name, email

		var tester = Accessor("test_table");
		
		var options = {
			where: [
				["id", ">", 10],
				"AND",
				["email","LIKE","%@gmail.com"]
			],
			
			limit: 100,
			offset: 50,
			
			fields: ["name"]
		};
		
		tester.select( options, function(err, data, fields) {
			if(err) {
				throw err;
			}	
			
			return data;
		} );

Currently, {options} has implements following attributes:
 
 * where
 * limit
 * offset
 * fields 		
 
##### Note
 
Options may omit which retrieve all records, i.e.

		// test_table schema: id, name, email

		var tester = Accessor("test_table");
		
		tester.select( function(err, data, fields) {
			if(err) {
				throw err;
			}	
			
			return data;
		} );

#### tester.create( {dataObject}, callback(err, info) );

Insert data record by given dataObject

		// test_table schema: id, name, email

		var tester = Accessor("test_table");
		
		var dataObject = {
			name: "bu",
			email: "bu@hax4.in",
			nonSchemaColumn: "test"
		};
		
		tester.create( dataObject, function(err, info) {
			if(err) {
				throw err;
			}	
			
			return info.insertId;
		} );

##### Note

* On above example, we give a non-exist column called "nonSchemaColumn" to Accessor, which may cause hangup if we insert that to sql query.

	Indeed, Accessor will try to check each attribute and ignore them if not exists, and that should print *(on console)*
	
		Warning: nonSchemaColumn is not in database schema, and is not inserted into queryset


#### tester.update( {options}, {updated_dataObject}, callback(err, info) );

Update records filter by option.where with updated_dataObject

		// test_table schema: id, name, email

		var tester = Accessor("test_table");
		
		var dataObject = {
			email: "bu@hax4.in",
			nonSchemaColumn: "test"
		};
		
		var options = {
			where: [ 
				["name", "=", "bu"] 
			],
		};
		
		tester.update( options, dataObject, function(err, info) {
			if(err) {
				throw err;
			}	
			
			return info.affectedRows;
		} );
		
##### Note

* On above example, we give a non-exist column called "nonSchemaColumn" to Accessor, which may cause hangup if we update that in sql query.

	Indeed, Accessor will try to check each attribute and ignore them if not exists, and that should print *(on console)*
	
		Warning: nonSchemaColumn is not in database schema, and is not inserted into queryset

* If options is omitted, it will update all records. (due to no filter)

		// test_table schema: id, name, email

		var tester = Accessor("test_table");
		
		var dataObject = {
			email: "bu@hax4.in",
			nonSchemaColumn: "test"
		};
	
		tester.update( {}, dataObject, function(err, info) {
			if(err) {
				throw err;
			}	
			
			return info.affectedRows;
		} );


#### tester.remove( {options}, callback(err, info) );

Remove records filter by options.where

		// test_table schema: id, name, email

		var tester = Accessor("test_table");
		
		var options = {
			where: [ 
				["name", "=", "bu"] 
			],
		};
		
		tester.update( options, function(err, info) {
			if(err) {
				throw err;
			}	
			
			return info.affectedRows;
		} );
		
##### Note

* If options is omitted, it will remove all records. (due to no filter)

		// test_table schema: id, name, email

		var tester = Accessor("test_table");
	
		tester.remove( {}, function(err, info) {
			if(err) {
				throw err;
			}	
			
			return info.affectedRows;
		} );

### TODO

* Check in where statement
* Log
