'use strict';

/**
	@typedef SetData
	@type {object}
	@property {string} id - set id.
	@property {string} name - SetRecord name.
	@property {string} description - SetRecord description.
	@property {string} owner - SetRecord owner id.
	@property {string} status - status can be: `active`, `inactive`.
	@property {Date} createdAt - created datetime.
	@property {Date} updatedAt - updated datetime.
*/

var utils = require('../utils');
var _ = utils._;
var schemas = require('./schemas');
var isValidSetId = schemas.isValidSetId;
var updateSchema = schemas.UpdateSetSchema;

/**
 * Creates a new SetRecord id.
 * @returns {string} Returns a new id.
 */
function createNewId() {
	var length = utils.randomInt(4, 7);
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

function validate(data) {
	if (!isValidSetId(data.id)) {
		throw new Error('Invalid Set id: ' + data.id);
	}
}

exports.createNewId = createNewId;

/**
 * Tests a set id if it is valid.
 * @returns {boolean} True if the id is valid.
 */
exports.isValidId = function(id) {
	return isValidSetId(id);
};

exports.config = {
	name: 'Set',
	updateSchema: updateSchema,
	createNormalize: normalizeCreate,
	updateNormalize: normalizeUpdate,
	createValidate: validate,
	updateValidate: validate
};
