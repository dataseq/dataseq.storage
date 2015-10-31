'use strict';

var utils = require('./utils');
var Promise = utils.Promise;
var models = require('./db/models');
var SetModel = require('./set_model');
var SequenceModel = require('./sequence_model');
var ValueModel = require('./value_model');

var get = utils.dbGet;

/**
 * Creates a new ControlService object.
 * @class
 */
function ControlService() {

}

module.exports = ControlService;

/**
 * Create a new set.
 * @param {(SetModel|SetRecord)} data - A data object to create a new Set Db record.
 * @return {SetRecord} Returns created SetRecord object.
 */
ControlService.prototype.createSet = function(data) {
	try {
		data = SetModel.create(data).normalize().validate().getData();
	} catch (error) {
		return Promise.reject(error);
	}

	var params = {};
	params.ConditionExpression = '#id <> :id';

	params.ExpressionAttributeNames = {
		'#id': 'id'
	};
	params.ExpressionAttributeValues = {
		':id': data.id
	};

	return models.Set.createAsync(data, params).then(get);
};

/**
 * Create a new sequence.
 * @param {(SequenceModel|SequenceRecord)} data - A data object to create a new Sequence Db record.
 * @return {SequenceRecord} Returns created SequenceRecord object.
 */
ControlService.prototype.createSequence = function(data) {
	try {
		data = SequenceModel.create(data).normalize().validate().getData();
	} catch (error) {
		return Promise.reject(error);
	}

	var params = {};
	params.ConditionExpression = '#id <> :id AND #setId <> :setId';

	params.ExpressionAttributeNames = {
		'#id': 'id',
		'#setId': 'setId'
	};
	params.ExpressionAttributeValues = {
		':id': data.id,
		':setId': data.setId
	};

	return models.Sequence.createAsync(data, params).then(get);
};

/**
 * Create or replace a existing value.
 * @param {(ValueModel|ValueRecord)} data - A data object to create or replace a Value Db record.
 * @return {ValueRecord} Returns created ValueRecord object.
 */
ControlService.prototype.setValue = function(data) {
	try {
		data = ValueModel.create(data).normalize().validate().getData();
	} catch (error) {
		return Promise.reject(error);
	}

	return models.Value.createAsync(data).then(get);
};

/**
 * Update an existing Set.
 * @param {(SetModel|SetRecord)} data - A data object to update.
 * @return {SetRecord} Returns updated SetRecord object.
 */
ControlService.prototype.updateSet = function(data) {
	try {
		data = SetModel.create(data, 'update').normalize().validate().getData();
	} catch (error) {
		return Promise.reject(error);
	}

	var params = {};
	params.ConditionExpression = '#id = :id';

	params.ExpressionAttributeNames = {
		'#id': 'id'
	};

	params.ExpressionAttributeValues = {
		':id': data.id
	};

	return models.SetModel.updateAsync(data, params).then(get);
};

/**
 * Update an existing Sequence.
 * @param {(SequenceModel|SequenceRecord)} data - A data object to update.
 * @return {SequenceRecord} Returns updated Sequence object.
 */
ControlService.prototype.updateSequence = function(data) {
	try {
		data = SequenceModel.create(data, 'update').normalize().validate().getData();
	} catch (error) {
		return Promise.reject(error);
	}

	var params = {};
	params.ConditionExpression = '#id = :id AND #setId = :setId';

	params.ExpressionAttributeNames = {
		'#id': 'id',
		'#setId': 'setId'
	};

	params.ExpressionAttributeValues = {
		':id': data.id,
		':setId': data.setId
	};

	return models.SequenceModel.updateAsync(data, params).then(get);
};
