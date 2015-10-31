'use strict';

/**
	@typedef ValueRecord
	@type {object}
	@property {string} key - key.
	@property {number} range - range.
	@property {(string|number)} value - value.
	@property {string} label - value label.
	@property {string} data - value custom data.
	@property {Date} createdAt - created datetime.
*/

// var utils = require('./utils');
// var _ = utils._;
var Model = require('./model');
var util = require('util');

/**
 * ValueModel model.
 * @param {(ValueModel|ValueRecord)} data - Data of the ValueModel model.
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @class
 * @augments Model
 */
function ValueModel(data, scope) {
	return Model.call(this, {
		name: 'Value'
	}, data, scope);
}

util.inherits(ValueModel, Model);

/**
 * Creates an ValueModel object.
 * @param {(ValueRecord|ValueModel)} data - Data to use for creating a new ValueModel
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @returns {ValueModel} Returns the ValueModel passed as param `data` or a new created ValueModel.
 */
ValueModel.create = function(data, scope) {
	return Model.create(ValueModel, data, scope);
};

module.exports = ValueModel;
