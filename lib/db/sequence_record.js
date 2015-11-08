'use strict';

/**
	@typedef SequenceData
	@type {object}
	@property {string} setId - set id.
	@property {string} id - sequence id.
	@property {string} name - SequenceRecord name.
	@property {string} ownerId - SequenceRecord owner id.
	@property {Date} createdAt - created datetime.
	@property {Date} updatedAt - updated datetime.
*/

var assert = require('assert');
var SetRecord = require('./set_record');
var schemas = require('./schemas');
var updateSchema = schemas.UpdateSequenceSchema;

/**
 * Create a sequence key
 * @param {SequenceData} data - Data to create key
 * @param {string} data.setId - Set id
 * @param {string} data.id - Sequence id
 * @returns {string} Created key
 */
function createKey(data) {
	assert.ok(data);
	assert.ok(data.setId);
	assert.ok(data.id);
	return [data.setId, data.id].join('#');
}

/**
 * Parse a sequence key
 * @param {string} key - Key to parse
 * @returns {object} Parsed key
 */
function parseKey(key) {
	assert.ok(key, 'Sequence key must be a string');
	var i = key.indexOf('#');
	var data = {
		setId: key.substr(0, i),
		id: key.substr(i + 1)
	};

	return data;
}

/**
 * Tests a sequence id if it is valid.
 * @returns {boolean} True if the id is valid.
 */
function isValidId(id) {
	return id.length > 0 && id.length === id.trim().length;
}

/**
 * Tests if a key is valid.
 * @param {string} key - Key to test
 * @returns {boolean} True if the key is valid.
 */
function isValidKey(key) {
	var data;
	try {
		data = parseKey(key);
	} catch (e) {
		return false;
	}
	return SetRecord.isValidId(data.setId) && isValidId(data.id);
}

function validate(data) {
	if (!isValidId(data.id)) {
		throw new Error('Invalid Sequence id: ' + data.id);
	}
	if (!SetRecord.isValidId(data.setId)) {
		throw new Error('Invalid Set id: ' + data.setId);
	}
}

exports.createKey = createKey;
exports.parseKey = parseKey;
exports.isValidId = isValidId;
exports.isValidKey = isValidKey;
exports.config = {
	name: 'Sequence',
	updateSchema: updateSchema,
	createValidate: validate,
	updateValidate: validate
};
