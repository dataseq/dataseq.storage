'use strict';

var Joi = require('vogels-helpers').Joi;

var SET_STATUS = ['active', 'inactive'];
var SET_ID_REGEX = /^[^\s#]{4,32}$/;
var SEQUENCE_ID_REGEX = /^[^\s#]{1,32}$/;
var APP_ID_REGEX = /^[\w-]{24,40}$/;

var SetSchema = {
	id: Joi.string().regex(SET_ID_REGEX).required(),
	appId: Joi.string().regex(APP_ID_REGEX).required(),
	name: Joi.string().trim().min(3).max(100).required(),
	status: Joi.valid(SET_STATUS).default('active').required(),
	description: Joi.string().trim().max(1000)
};

var UpdateSetSchema = {
	id: Joi.string().regex(SET_ID_REGEX).required(),
	name: Joi.string().trim().min(3).max(100).invalid(null, ''),
	status: Joi.valid(SET_STATUS).invalid(null, ''),
	description: Joi.string().trim().max(1000)
};

var SequenceSchema = {
	setId: Joi.string().regex(SET_ID_REGEX).required(),
	id: Joi.string().regex(SEQUENCE_ID_REGEX).required(),
	appId: Joi.string().regex(APP_ID_REGEX).required(),
	name: Joi.string().trim().min(3).max(100)
};

var UpdateSequenceSchema = {
	setId: Joi.string().regex(SET_ID_REGEX).required(),
	id: Joi.string().regex(SEQUENCE_ID_REGEX).required(),
	name: Joi.string().trim().min(3).max(100).invalid(null, '')
};

var ValueSchema = {
	key: Joi.string().trim().min(9).max(65).required(),
	range: Joi.number().required(),
	value: [Joi.string().trim().min(1).max(40).required(), Joi.number().required()],
	label: Joi.string().trim().min(1).max(40),
	data: Joi.string().trim().min(1).max(255)
};

function isValidSetId(value) {
	return SET_ID_REGEX.test(value);
}

function isValidSequenceId(value) {
	return SEQUENCE_ID_REGEX.test(value);
}

function isValidAppId(value) {
	return APP_ID_REGEX.test(value);
}

exports.SetSchema = SetSchema;
exports.UpdateSetSchema = UpdateSetSchema;
exports.SequenceSchema = SequenceSchema;
exports.UpdateSequenceSchema = UpdateSequenceSchema;
exports.ValueSchema = ValueSchema;
exports.isValidSetId = isValidSetId;
exports.isValidSequenceId = isValidSequenceId;
exports.isValidAppId = isValidAppId;
