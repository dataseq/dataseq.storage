'use strict';

var utils = require('../utils');
var Promise = utils.Promise;
var Query = require('../../node_modules/vogels/lib/query.js');
var vogels = require('vogels');
var schemas = require('./schemas');
var SetSchema = schemas.SetSchema;
var SequenceSchema = schemas.SequenceSchema;
var ValueSchema = schemas.ValueSchema;

var NAMES = ['Set', 'Sequence', 'Value'];
var tablePrefix = process.env.DATASEQ_TABLE_PREFIX || 'DataSeq';

Query.prototype.execAsync = Query.prototype.execAsync || Promise.promisify(Query.prototype.exec);

var SetModel = vogels.define('DataSeq_Set', {
	tableName: [tablePrefix, 'Sets'].join('_'),
	hashKey: 'id',
	// createdAt, updatedAt
	timestamps: true,
	schema: SetSchema,
	indexes: [{
		hashKey: 'ownerId',
		rangeKey: 'createdAt',
		type: 'global',
		name: 'Sets-ownerId-index',
		projection: {
			ProjectionType: 'ALL'
		}
	}]
});

var SequenceModel = vogels.define('DataSeq_Sequence', {
	tableName: [tablePrefix, 'Sequences'].join('_'),
	hashKey: 'setId',
	rangeKey: 'id',
	// createdAt, updatedAt
	timestamps: true,
	schema: SequenceSchema,
	indexes: []
});

var ValueModel = vogels.define('DataSeq_Value', {
	tableName: [tablePrefix, 'Values'].join('_'),
	hashKey: 'key',
	rangeKey: 'range',
	timestamps: true,
	createdAt: true,
	updatedAt: false,
	schema: ValueSchema,
	indexes: []
});

Promise.promisifyAll(SetModel);
Promise.promisifyAll(SequenceModel);
Promise.promisifyAll(ValueModel);

exports.NAMES = NAMES;
exports.Set = SetModel;
exports.Sequence = SequenceModel;
exports.Value = ValueModel;
