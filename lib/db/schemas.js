'use strict';

var Joi = require('joi');

var SET_STATUS = ['active', 'inactive'];
var SET_ID_REGEX = /^[a-z0-9]+$/;

var SetSchema = {
	id: Joi.string().regex(SET_ID_REGEX).length(7).required(),
	ownerId: Joi.string().trim().min(1).max(40).lowercase().required(),
	name: Joi.string().trim().min(3).max(100).required(),
	status: Joi.valid(SET_STATUS).default('active').required(),
	description: Joi.string().trim().max(1000)
};

var UpdateSetSchema = {
	id: Joi.string().regex(SET_ID_REGEX).length(7).required(),
	name: Joi.string().trim().min(3).max(100).invalid(null, ''),
	status: Joi.valid(SET_STATUS).invalid(null, ''),
	description: Joi.string().trim().max(1000)
};

var SequenceSchema = {
	setId: Joi.string().regex(SET_ID_REGEX).length(7).required(),
	id: Joi.string().trim().min(1).max(32).lowercase().required(),
	ownerId: Joi.string().trim().min(1).max(40).lowercase().required(),
	name: Joi.string().trim().min(3).max(100)
};

var UpdateSequenceSchema = {
	id: Joi.string().regex(SET_ID_REGEX).length(7).required(),
	name: Joi.string().trim().min(3).max(100).invalid(null, '')
};

var ValueSchema = {
	key: Joi.string().trim().min(9).max(40).lowercase().required(),
	range: Joi.string().trim().min(1).max(40).required(),
	value: [Joi.string().trim().min(1).max(40).required(), Joi.number().required()],
	label: Joi.string().trim().min(1).max(40),
	data: Joi.string().trim().min(1).max(255)
};


exports.SetSchema = SetSchema;
exports.UpdateSetSchema = UpdateSetSchema;
exports.SequenceSchema = SequenceSchema;
exports.UpdateSequenceSchema = UpdateSequenceSchema;
exports.ValueSchema = ValueSchema;
