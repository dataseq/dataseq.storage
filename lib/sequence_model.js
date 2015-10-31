'use strict';

/**
	@typedef SequenceRecord
	@type {object}
	@property {string} setId - set id.
	@property {string} id - sequence id.
	@property {string} name - SequenceModel name.
	@property {string} owner - SequenceModel owner id.
	@property {Date} createdAt - created datetime.
	@property {Date} updatedAt - updated datetime.
*/

// var utils = require('./utils');
// var _ = utils._;
var Model = require('./model');
var util = require('util');
var assert = require('assert');

function createKey(data) {
	assert.ok(data);
	assert.ok(data.setId);
	assert.ok(data.id);
	return [data.setId.toLowerCase(), data.id.toLowerCase()].join('#');
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

SequenceModel.createKey = function(data) {
	return createKey(data);
};

module.exports = SequenceModel;
