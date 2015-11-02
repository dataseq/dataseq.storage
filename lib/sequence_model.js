'use strict';

/**
	@typedef SequenceRecord
	@type {object}
	@property {string} setId - set id.
	@property {string} id - sequence id.
	@property {string} name - SequenceModel name.
	@property {string} ownerId - SequenceModel owner id.
	@property {Date} createdAt - created datetime.
	@property {Date} updatedAt - updated datetime.
*/

// var utils = require('./utils');
// var _ = utils._;
var Model = require('./model');
var util = require('util');
var assert = require('assert');
var SetModel = require('./set_model');

function createKey(data) {
	assert.ok(data);
	assert.ok(data.setId);
	assert.ok(data.id);
	return [data.setId, data.id].join('#');
}

/**
 * SequenceModel model.
 * @param {(SequenceModel|SequenceRecord)} data - Data of the SequenceModel model.
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @class
 * @augments Model
 */
function SequenceModel(data, scope) {
	return Model.call(this, {
		name: 'Sequence'
	}, data, scope);
}

util.inherits(SequenceModel, Model);

/**
 * Creates an SequenceModel object.
 * @param {(SequenceRecord|SequenceModel)} data - Data to use for creating a new SequenceModel
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @returns {SequenceModel} Returns the SequenceModel passed as param `data` or a new created SequenceModel.
 */
SequenceModel.create = function(data, scope) {
	return Model.create(SequenceModel, data, scope);
};

/**
 * Create a sequence key
 * @param {object} data - Data to create key
 * @param {string} data.setId - Set id
 * @param {string} data.id - Sequence id
 * @returns {string} Created key
 */
SequenceModel.createKey = function(data) {
	return createKey(data);
};

/**
 * Parse a sequence key
 * @param {string} key - Key to parse
 * @returns {object} Parsed key
 */
SequenceModel.parseKey = function(key) {
	assert.ok(key, 'Sequence key must be a string');
	var i = key.indexOf('#');
	var data = {
		setId: key.substr(0, i),
		id: key.substr(i + 1)
	};

	return data;
};

/**
 * Tests a sequence id if it is valid.
 * @returns {boolean} True if the id is valid.
 */
SequenceModel.isValidId = function(id) {
	return id.length > 0 && id.length === id.trim().length;
};

/**
 * Tests if a key is valid.
 * @param {string} key - Key to test
 * @returns {boolean} True if the key is valid.
 */
SequenceModel.isValidKey = function(key) {
	var data;
	try {
		data = SequenceModel.parseKey(key);
	} catch (e) {
		return false;
	}
	return SetModel.isValidId(data.setId) && SequenceModel.isValidId(data.id);
};

module.exports = SequenceModel;
