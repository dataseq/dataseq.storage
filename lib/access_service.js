'use strict';

var utils = require('./utils');
var get = utils.dbGet;
// var _ = utils._;
var models = require('./db/models');

/**
 * Creates a new AccessService object.
 * @class
 */
function AccessService() {

}

/**
 * Find a Set by id.
 * @param {object} params - Finding params
 * @param {string} params.id - Set's id
 * @param {object} [params.params] - DynamoDB params
 * @returns {SetRecord} Founded set record.
 */
AccessService.prototype.oneSet = function(params) {
	return models.Set.getAsync(params.id, params.params).then(get);
};

/**
 * Find a Sequence by setId and id.
 * @param {object} params - Finding params
 * @param {string} params.setId - Set's id
 * @param {string} params.id - Sequence's id
 * @param {object} [params.params] - DynamoDB params
 * @returns {SequenceRecord} Founded sequence record.
 */
AccessService.prototype.oneSequence = function(params) {
	return models.Sequence.getAsync(params.setId, params.id, params.params).then(get);
};

/**
 * Find a Value by key and range.
 * @param {object} params - Finding params
 * @param {string} params.key - Value's key
 * @param {(string|value)} params.range - Sequence's id
 * @param {Object} [params.params] - DynamoDB params
 * @returns {ValueRecord} Founded value record.
 */
AccessService.prototype.oneValue = function(params) {
	return models.Value.getAsync(params.key, params.range, params.params).then(get);
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
