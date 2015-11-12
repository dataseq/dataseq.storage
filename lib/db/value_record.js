'use strict';

/**
	@typedef ValueData
	@type {object}
	@property {string} key - key.
	@property {number} range - range.
	@property {(string|number)} value - value.
	@property {string} label - value label.
	@property {string} data - value custom data.
	@property {Date} createdAt - created datetime.
*/

var utils = require('../utils');
var _ = utils._;
var SequenceRecord = require('./sequence_record');
var schemas = require('./schemas');
var updateSchema = schemas.UpdateValueSchema;

function normalizeCreate(data) {
	data = _.clone(data);

	if (!data.key) {
		if (data.setId && data.sequenceId) {
			data.key = SequenceRecord.createKey({
				setId: data.setId,
				id: data.sequenceId
			});
		}
	}

	return data;
}

function validate(data) {
	if (!SequenceRecord.isValidKey(data.key)) {
		throw new Error('Value key is invalid: "' + data.key + '"');
	}
}

function validateCreate(data) {
	validate(data);
	if (~[null, undefined, ''].indexOf(data.value)) {
		throw new Error('Value cannot be empty!');
	}
}

exports.config = {
	name: 'Value',
	updateSchema: updateSchema,
	createNormalize: normalizeCreate,
	createValidate: validateCreate,
	updateValidate: validate
};
