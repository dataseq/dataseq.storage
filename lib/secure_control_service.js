'use strict';

var utils = require('./utils');
var Promise = utils.Promise;
var ControlService = require('./control_service');
var SequenceRecord = require('./db/sequence_record');
var SetRecord = require('./db/set_record');
var util = require('util');
var CacheAccessService = require('./cache_access_service');

function formatSequenceData(data) {
	if (!data && !data.appId) {
		throw new Error('`data.appId` param is required');
	}

	if (!data.key && !(data.setId && data.sequenceId)) {
		throw new Error('`data.key` or `data.setId` and `data.sequenceId` params are required');
	}

	var sequenceData = {
		setId: data.setId,
		id: data.sequenceId,
		appId: data.appId
	};

	if (data.key) {
		sequenceData = SequenceRecord.parseKey(data.key);
		sequenceData.appId = data.appId;
	}

	if (!SetRecord.isValidId(sequenceData.setId)) {
		throw new Error('Value setId is invalid');
	}
	if (!SequenceRecord.isValidId(sequenceData.id)) {
		throw new Error('Value sequenceId is invalid');
	}

	return sequenceData;
}

/**
 * @private
 */
function saveValue(self, method, data) {
	var accessService = self.accessService;
	var sequenceData;

	try {
		sequenceData = formatSequenceData(data);
	} catch (e) {
		return Promise.reject(e);
	}

	return accessService.isMySet(sequenceData.setId)
		.then(function(isMy) {
			if (!isMy) {
				return Promise.reject(new Error('Forbidden'));
			}
			return ControlService.prototype[method].call(self, data)
				.then(function(value) {
					if (value) {
						return self.createSequenceIfNotExists(sequenceData)
							.then(function() {
								return value;
							});
					}
					return value;
				});
		});
}

/**
 * SecureControlService class
 * @params {object} [options] - Options
 * @param {AccessService} [accessService=new CacheAccessService()] - An AccessService object
 * @augments ControlService
 * @class
 */
function SecureControlService(options) {
	options = options || {};
	if (!options.appId && options.accessService) {
		options.appId = options.accessService.getAppId();
	}
	ControlService.call(this, options.appId);
	this.accessService = options.accessService || new CacheAccessService(options.appId);
}

util.inherits(SecureControlService, ControlService);

module.exports = SecureControlService;

SecureControlService.prototype.updateSet = function(data) {
	var self = this;
	// var accessService = self.accessService;
	// return accessService.isMySet(data.id, options.appId)
	return ControlService.prototype.updateSet.call(this, data)
		.then(function(value) {
			if (value) {
				if (self.accessService.deleteSetFromCache) {
					self.accessService.deleteSetFromCache(data);
				}
			}
			return value;
		});
};

SecureControlService.prototype.updateSequence = function(data) {
	var self = this;
	return ControlService.prototype.updateSequence.call(this, data)
		.then(function(value) {
			if (value) {
				if (self.accessService.deleteSequenceFromCache) {
					self.accessService.deleteSequenceFromCache(data);
				}
			}
			return value;
		});
};

/**
 * Create or replace an existing value AND ensures sequence exists.
 * @param {(ValueRecord|ValueModel)} data - A data object to create or replace a Value Db record.
 * @param {object} options - An options object.
 * @param {string} options.appId - owner id.
 * @param {object} options.params - AWS params.
 * @return {ValueRecord} Returns created ValueRecord object.
 */
SecureControlService.prototype.putValue = function(data, options) {
	this.setDataAppId(data);
	return saveValue(this, 'putValue', data, options);
};

/**
 * Creates a new value AND ensures sequence exists.
 * @param {(ValueRecord|ValueModel)} data - A data object to create or replace a Value Db record.
 * @param {object} options - An options object.
 * @param {string} options.appId - owner id.
 * @return {ValueRecord} Returns created ValueRecord object.
 */
SecureControlService.prototype.createValue = function(data, options) {
	this.setDataAppId(data);
	return saveValue(this, 'createValue', data, options);
};

/**
 * Test if owner has access to this sequence
 * @param {SequenceRecord} data - Sequence data.
 * @returns {SequenceRecord} Existing or created SequenceRecord data.
 */
SecureControlService.prototype.createSequenceIfNotExists = function(data) {
	var self = this;
	this.setDataAppId(data);

	return this.accessService.getSequence({
			setId: data.setId,
			id: data.id
		})
		.then(function(sequence) {
			if (!sequence) {
				return self.createSequence(data);
			}
			return sequence;
		});
};
