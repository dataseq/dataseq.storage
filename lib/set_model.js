'use strict';

/**
	@typedef SetRecord
	@type {object}
	@property {string} id - set id.
	@property {string} name - SetModel name.
	@property {string} description - SetModel description.
	@property {string} owner - SetModel owner id.
	@property {string} status - status can be: `active`, `inactive`.
	@property {Date} createdAt - created datetime.
	@property {Date} updatedAt - updated datetime.
*/

var utils = require('./utils');
var _ = utils._;
var Model = require('./model');
var util = require('util');
var isValidSetId = require('./db/schemas').isValidSetId;

function createNewId() {
	var length = utils.randomInt(3, 7);
	return utils.randomString(length);
}

function normalizeCreate(data) {
	data = _.clone(data);

	data.id = data.id || createNewId();
	data.status = data.status || 'active';

	if (data.description) {
		data.description = _.trunc(data.description, 1000);
	}

	return data;
}

function normalizeUpdate(data) {
	data = _.clone(data);

	if (data.description) {
		data.description = _.trunc(data.description, 1000);
	}

	return data;
}

/**
 * SetModel model.
 * @param {(SetModel|SetRecord)} data - Data of the SetModel model.
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @class
 * @augments Model
 */
function SetModel(data, scope) {
	return Model.call(this, {
		name: 'Set',
		normalizeCreate: normalizeCreate,
		normalizeUpdate: normalizeUpdate
	}, data, scope);
}

util.inherits(SetModel, Model);

/**
 * Creates an SetModel object.
 * @param {(SetRecord|SetModel)} data - Data to use for creating a new SetModel
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @returns {SetModel} Returns the SetModel passed as param `data` or a new created SetModel.
 */
SetModel.create = function(data, scope) {
	return Model.create(SetModel, data, scope);
};

/**
 * Creates a new SetModel id.
 * @returns {string} Returns a new id.
 */
SetModel.createNewId = function() {
	return createNewId();
};

/**
 * Tests a set id if it is valid.
 * @returns {boolean} True if the id is valid.
 */
SetModel.isValidId = function(id) {
	return isValidSetId(id);
};

module.exports = SetModel;
