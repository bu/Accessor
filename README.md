# Accessor 0.2.0

A database wrapper, provide easy access to databases.

---

## Install & Setup

1. Install through npm, following command will do that:

		npm install Accessor
		
2. Choose one of available database wrapper for your environment.

3. Now, Accessor is ready to use. Create config file if wrapper required.

## Available Database Wrapper

### MongoDB
* http://github.com/bu/Accessor_MongoDB 
* **DBMS parameter:** MongoDB

### MySQL

* http://github.com/bu/Accessor_MySQL
* **DBMS parameter:** MySQL 

## Usage

1. Require the Accessor module in your script

		var Accessor = require("Accessor");

2. Place constructor where you need the Accessor

		var tester = Accessor("YOUR_TARGET_TABLE", "DBMS"]);
		
	**Note: ** DBMS parameter could be emitted, if you installed just one module within your application. Accessor will automatically lookup your installed modules following Accessor directory to check if a suitable module is availiable.
	
	**P.S.** YOUR_TARGET_TABLE may mean different things by different database wrapper, but it should automaticlly do the same thing.

3. After initialized, please refer to wrapper documents for accessing database.

## Interface

Following methods are implements by our wrappers:

### SELECT

	var options = {
		// where: this option is differ from wrappers
		where: Object or Array even String,
		
		// limit: the count of return data
		limit: 10 (default: no limit)
		
		// we should start lookup data at cursor position #XXX
		offset: 100 (default: 0)
		
		// we should pick up which fields / keys
		fields: ["field1","field2"]
	};
	
	db.select(options, callback(err, data));
	
	// data is a array contains queried data 

### INSERT

	db.insert(dataObject, callback(err, info));
	
	// callback parameter info = {success: INSERT_ID};
	
### REMOVE

	db.remove(options, callback(err, info));
	
	// * method parameter options is a object only exists "where" as same as SELECT
	// callback parameter info = {success: affect rows};
	
### UPDATE

	db.update(options, replaceDataObject, callback(err, info));
	
	// * method parameter options is a object only exists "where" as same as SELECT
	// * callback parameter info = {success: affect rows};

### OTHER METHOD

Some wrapper may define their own method, which is not implemented in all wrappers. Use them with care.


## LICENSE

Copyright (c) 2012 Buwei Chiu <bu@hax4.in>

Licensed under the MIT License
