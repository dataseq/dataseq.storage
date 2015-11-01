'use strict';

var utils = require('./utils');
var Promise = utils.Promise;
var ControlService = require('./control_service');
var SequenceModel = require('./sequence_model');
var util = require('util');
var CacheAccessService = require('./cache_access_service');

/**
 * SecureControlService class
 * @param {AccessService} [accessService] - An AccessService object
 * @augments ControlService
 * @class
 */
function SecureControlService(accessService) {
	ControlService.call(this);
	this.accessService = accessService || new CacheAccessService();
}

module.exports = SecureControlService;

util.inherits(SecureControlService, ControlService);

/**
 * Test if owner has access to this set
 * @private
 */
SecureControlService.prototype.isSecureSet = function(ownerId, setId) {
	return this.accessService.findSet(setId)
		.then(function(set) {
			if (!set || set.ownerId !== ownerId) {
				return Promise.reject(new Error('Invalid Set id'));
			}
		});
};

/**
 * Test if owner has access to this sequence
 * @private
 */
SecureControlService.prototype.ensureSequenceExists = function(ownerId, setId, sequenceId) {
	var self = this;
	return this.accessService.findSequence({
			setId: setId,
			id: sequenceId
		})
		.then(function(sequence) {
			if (!sequence) {
				return self.createSequence({
					ownerId: ownerId,
					setId: setId,
					id: sequenceId
				});
			}
			return sequence;
		});
};

/**
 * Create or replace a existing value.
 * @param {(Object|ValueRecord|ValueModel)} data - A data object to create or replace a Value Db record.
 * @param {string} data.ownetId - Owner id required
 * @return {ValueRecord} Returns created ValueRecord object.
 */
SecureControlService.prototype.setValue = function(data) {
	var self = this;

	var ownerId = data.ownerId;

	if (!ownerId) {
		return Promise.reject(new Error('`ownerId` param is required'));
	}

	var sequenceData = data;
	if (data.key) {
		sequenceData = SequenceModel.parseKey(data.key);
	}
	var setId = sequenceData.setId;
	var sequenceId = sequenceData.sequenceId || sequenceData.id;

	if (!setId) {
		return Promise.reject(new Error('Value setId is requered'));
	}
	if (!sequenceId) {
		return Promise.reject(new Error('Value sequenceId/key is requered'));
	}

	return self.isSecureSet(ownerId, setId)
		.then(function() {
			return ControlService.prototype.setValue.call(self, data)
				.then(function(value) {
					if (value) {
						return self.ensureSequenceExists(ownerId, setId, sequenceId)
							.then(function() {
								return value;
							});
					}
					return value;
				});
		});
};
