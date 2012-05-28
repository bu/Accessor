//
// Module require
//
var database = require("./database"); 

// 
// factory method
//
var GenericObjectFactory = function(table_name) {
	var obj = new GenericObject(table_name);

	return obj;
};

//
// GenericObject Constructor and important startup function
//
var GenericObject = function(table_name) {
	var self = this;

	self._table_name = table_name;
	self._fields = []; 

	// collect fields
	self.select( { limit: 1, offset: 0 }, function(err, data, fields) {
		if(err) {
			return;
		}

		self._fields = fields;
	});

};

//
// CRUD action
//
GenericObject.prototype.create = function(dataObject, callback) {
	var self = this;

	// sql building
	var _sql_fieldValues = self._fieldValueBuilder(dataObject);

	var sql = "INSERT INTO " + self._table_name + " SET " + _sql_fieldValues + ";";

	// sql executing
	self._query(sql, callback);
};

GenericObject.prototype.select = function() {
	var self = this;

	// argument parser
	var callback, options;

	if( typeof arguments[0] === "function" ) {
		callback = arguments[0];
	} else {
		options = arguments[0];
		callback = arguments[1];
	}
	
	// just in case of no option exists
	options = (!options) ? {} : options;

	// building sql
	var _sql_where = self._whereClauseBuilder(options);

	// remaining sql
	var _sql_fields = ( options.fields && Array.isArray(options.fields) ) ? ("`" + options.fields.join("`,`") + "`") : "*";
	var _sql_limit = ( options.limit && parseInt(options.limit) > 0 ) ? " LIMIT " + parseInt(options.limit) : "";
	var _sql_offset = ( options.offset && parseInt(options.offset) > 0 ) ? " OFFSET " + parseInt(options.offset) : "";

	// sql execute
	var sql = "SELECT " + _sql_fields  + " FROM " + self._table_name + _sql_where + _sql_limit + _sql_offset + ";";

	self._query(sql, callback);
};

GenericObject.prototype.update = function(options, newDataObject, callback) {
	var self = this;
	
	// sql building
	var _sql_fieldValues = self._fieldValueBuilder(newDataObject),
		_sql_where = self._whereClauseBuilder(options);

	var sql = "UPDATE " + self._table_name + " SET " + _sql_fieldValues + _sql_where + ";";

	// sql executing
	self._query(sql, callback);
};

GenericObject.prototype.remove = function(options, callback) {
	var self  = this;

	// sql building
	var _sql_where = self._whereClauseBuilder(options);
	var sql = "DELETE FROM " + self._table_name + _sql_where + ";";
	
	// sql executing
	self._query(sql, callback);
};

// 
// Helpers
//
GenericObject.prototype._keys = function (object) {
	var key_list = [],
		key;

	for(key in object) {
		key_list.push(key);
	}

	return key_list;
};

GenericObject.prototype._whereClauseBuilder = function(options) {
	var _sql_where = "";

	if( options.where && Array.isArray(options.where) ) {
		_sql_where = " WHERE";
		options.where.map(function(value) {
			if( Array.isArray(value) ) {
				if ( value.length === 3 ) { // field, opeator, value
					_sql_where += " `" + value[0] + "` " + value[1] + " '" + value[2] + "' ";
				}
			} else {
				_sql_where += " " + value + " ";
			}
		});
	}

	return _sql_where;
};

GenericObject.prototype._fieldValueBuilder = function(dataObject) {
	var field_list = [],
		self = this,
		key;
	
	for(key in dataObject) {
		if( self._fields.indexOf(key) === -1 ) {
			console.log( "Warning: " + key + " is not in database schema, and is not inserted into queryset.");
			continue;
		}

		field_list.push("`" + key + "` = '" + dataObject[key] + "'");
	}

	return field_list.join(",");
};

GenericObject.prototype._query = function(sql, callback) {
	var self = this;

	database.getInstance(function(db) {
		if(db === null) {
			return callback(new Error("No database connection."));
		}

		db.query(sql, function(err, data, fields) {
			
			if(err) {
				console.log("ERROR: Database select error, detail: " + err);
				process.nextTick(function() { callback(err); });
				return;
			}

			console.log("QUERIED: " + sql);
			
			if(typeof fields === "undefined") {
				process.nextTick(function() { callback( null, data ) ; });
			} else {
				process.nextTick(function() { callback( null, data, self._keys(fields) ) ; });
			}
		});
	});
};

//
// Module export
//
module.exports = GenericObjectFactory;
