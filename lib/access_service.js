'use strict';

var utils = require('./utils');
var _ = utils._;
var db = require('vogels-helpers');

/**
 * Creates a new AccessService object.
 * @class
 */
function AccessService() {

}

/**
 * Get a Set by id.
 * @param {object} data - Set key
 * @param {string} data.id - Set id
 * @param {object} [options] - Options
 * @param {object} [options.params] - DynamoDB params
 * @returns {SetRecord} Founded set record.
 */
AccessService.prototype.getSet = function(data, options) {
	options = _.defaults(options || {}, {
		format: 'json'
	});

	return db.access.getItem('Set', data, options);
};

/**
 * Set a Sequence by setId and id.
 * @param {object} data - Sequence key
 * @param {string} data.setId - Set id
 * @param {string} data.id - Sequence id
 * @param {Object} [options] - Options
 * @param {Object} [options.params] - DynamoDB params
 * @returns {SequenceRecord} Founded sequence record.
 */
AccessService.prototype.getSequence = function(data, options) {
	options = _.defaults(options || {}, {
		format: 'json'
	});
	return db.access.getItem('Sequence', data, options);
};

/**
 * Get a Value by key and range.
 * @param {object} data - Value key
 * @param {string} data.key - Hash key
 * @param {(string|value)} data.range - Range key
 * @param {Object} [options] - Options
 * @param {Object} [options.params] - DynamoDB params
 * @returns {ValueRecord} Founded value record.
 */
AccessService.prototype.getValue = function(data, options) {
	options = _.defaults(options || {}, {
		format: 'json'
	});
	return db.access.getItem('Value', data, options);
};

/**
 * Tests if a Set exists and if set's ownerId is equal with param `ownerId`.
 * @param {string} setId - Set id
 * @param {string} ownerId - Owner id
 * @returns {boolean} True if set exists and its ownerId == param ownerId.
 */
AccessService.prototype.isMySet = function(setId, ownerId) {
	return this.getSet(setId)
		.then(function(set) {
			return set && set.ownerId === ownerId;
		});
};

module.exports = AccessService;
