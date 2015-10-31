'use strict';

var utils = require('./utils');
var get = utils.dbGet;
var models = require('./db/models');

/**
 * Creates a new AccessService object.
 * @class
 */
function AccessService() {

}

/**
 * Find a Set by id.
 * @param {object} data - Finding params
 * @param {string} data.id - Set's id
 * @param {object} [options] - Options
 * @param {object} [options.params] - DynamoDB params
 * @returns {SetRecord} Founded set record.
 */
AccessService.prototype.findSet = function(data, options) {
	return models.Set.getAsync(data, options && options.params).then(get);
};

/**
 * Find a Sequence by setId and id.
 * @param {Object} data - Finding params
 * @param {string} data.id - Sequence id
 * @param {string} data.setId - Set id
 * @param {Object} [options] - Options
 * @param {Object} [options.params] - DynamoDB params
 * @returns {SequenceRecord} Founded sequence record.
 */
AccessService.prototype.findSequence = function(data, options) {
	return models.Sequence.getAsync(data, options && options.params).then(get);
};

/**
 * Find a Value by key and range.
 * @param {Object} data - Finding params
 * @param {string} data.key - Value's key
 * @param {(string|value)} data.range - Sequence's id
 * @param {Object} [options] - Options
 * @param {Object} [options.params] - DynamoDB params
 * @returns {ValueRecord} Founded value record.
 */
AccessService.prototype.findValue = function(data, options) {
	return models.Value.getAsync(data, options && options.params).then(get);
};

// AccessService.prototype.setByOwnerId = function(params) {
// 	return models.GlobalEntity
// 		.query(params.id)
// 		.usingIndex('Sets-ownerId-index')
// 		.limit(1)
// 		.select('ALL_PROJECTED_ATTRIBUTES')
// 		.execAsync()
// 		.then(get).then(function(result) {
// 			if (result && result.length > 0) {
// 				return result[0];
// 			}
// 			return null;
// 		});
// };

module.exports = AccessService;
