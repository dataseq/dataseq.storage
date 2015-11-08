'use strict';

var vogels = require('vogels-helpers');
var schemas = require('./schemas');
var SetSchema = schemas.SetSchema;
var SequenceSchema = schemas.SequenceSchema;
var ValueSchema = schemas.ValueSchema;
var SetRecord = require('./set_record');
var SequenceRecord = require('./sequence_record');
var ValueRecord = require('./value_record');

var NAMES = ['Set', 'Sequence', 'Value'];
var tablePrefix = process.env.DATASEQ_TABLE_PREFIX || 'DataSeq';

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
}, SetRecord.config);

var SequenceModel = vogels.define('DataSeq_Sequence', {
	tableName: [tablePrefix, 'Sequences'].join('_'),
	hashKey: 'setId',
	rangeKey: 'id',
	// createdAt, updatedAt
	timestamps: true,
	schema: SequenceSchema,
	indexes: []
}, SequenceRecord.config);

var ValueModel = vogels.define('DataSeq_Value', {
	tableName: [tablePrefix, 'Values'].join('_'),
	hashKey: 'key',
	rangeKey: 'range',
	timestamps: true,
	createdAt: true,
	updatedAt: false,
	schema: ValueSchema,
	indexes: []
}, ValueRecord.config);

exports.NAMES = NAMES;
exports.Set = SetModel;
exports.Sequence = SequenceModel;
exports.Value = ValueModel;
