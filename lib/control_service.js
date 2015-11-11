'use strict';

var utils = require('./utils');
var _ = utils._;
var db = require('vogels-helpers');
var util = require('util');
var BaseService = require('./base_service');

/**
 * Creates a new ControlService object.
 * @param {string} appId - Application Id
 * @class
 */
function ControlService(appId) {
	BaseService.call(this, appId);
}

util.inherits(ControlService, BaseService);

module.exports = ControlService;

ControlService.prototype.setDataAppId = function(data) {
	data.appId = this.getAppId();
};

/**
 * Create a new set.
 * @param {SetData} data - A data object to create a new Set Db record.
 * @param {object} [options] - Options
 * @param {object} [options.params] - DynamoDB params
 * @return {SetData} Returns created SetData object.
 */
ControlService.prototype.createSet = function(data, options) {
	options = _.defaults(options || {}, {
		format: 'json',
		cache: false
	});
	this.setDataAppId(data);
	return db.control.create('Set', data, options);
};

/**
 * Create a new sequence.
 * @param {SequenceData} data - A data object to create a new Sequence Db record.
 * @param {object} [options] - Options
 * @param {object} [options.params] - DynamoDB params
 * @return {SequenceData} Returns created SequenceData object.
 */
ControlService.prototype.createSequence = function(data, options) {
	options = _.defaults(options || {}, {
		format: 'json',
		cache: false
	});
	this.setDataAppId(data);
	return db.control.create('Sequence', data, options);
};

/**
 * Create a new Value.
 * @param {ValueData} data - A data object to create a new Value Db record.
 * @param {object} [options] - Options
 * @param {object} [options.params] - DynamoDB params
 * @return {ValueData} Returns created ValueData object.
 */
ControlService.prototype.createValue = function(data, options) {
	options = _.defaults(options || {}, {
		format: 'json',
		cache: false
	});
	this.setDataAppId(data);
	return db.control.create('Value', data, options);
};

/**
 * Create or replace an existing value.
 * @param {ValueData} data - A data object to create or replace a Value Db record.
 * @param {object} [options] - An options object.
 * @param {object} [options.params] - AWS params.
 * @return {ValueData} Returns db ValueData object.
 */
ControlService.prototype.putValue = function(data, options) {
	options = _.defaults(options || {}, {
		format: 'json'
	});
	this.setDataAppId(data);
	return db.control.put('Value', data, options);
};

/**
 * Update an existing Set.
 * @param {SetData} data - A data object to update.
 * @param {object} [options] - An options object.
 * @param {object} [options.params] - AWS params.
 * @return {SetData} Returns updated SetData object.
 */
ControlService.prototype.updateSet = function(data, options) {
	options = _.defaults(options || {}, {
		format: 'json'
	});
	return db.control.update('Set', data, options);
};

/**
 * Update an existing Sequence.
 * @param {SequenceData} data - A data object to update.
 * @param {object} [options] - An options object.
 * @param {object} [options.params] - AWS params.
 * @return {SequenceData} Returns updated Sequence object.
 */
ControlService.prototype.updateSequence = function(data, options) {
	options = _.defaults(options || {}, {
		format: 'json'
	});
	return db.control.update('Sequence', data, options);
};
