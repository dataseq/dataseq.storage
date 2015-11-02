'use strict';

var _ = require('lodash');

function randomString(length) {
	var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
	var result = '';
	for (var i = length; i > 0; --i) {
		result += chars[Math.round(Math.random() * (chars.length - 1))];
	}
	return result;
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function dbGet(data) {
	if (_.isNull(data) || _.isUndefined(data)) {
		return data;
	}
	if (_.isArray(data)) {
		return data.map(dbGet);
	}
	if (_.isArray(data.Items)) {
		return dbGet(data.Items);
	}
	if (_.isFunction(data.toJSON)) {
		return data.toJSON();
	}
	if (_.isObject(data)) {
		Object.keys(data).forEach(function(key) {
			data[key] = dbGet(data[key]);
		});
	}
	return data;
}

function formatCacheKey(data, fields) {
	if (_.isString(data)) {
		return data;
	}
	if (_.isPlainObject(data)) {
		if (!fields || fields.length < 1) {
			throw new Error('`fields` param cannot be empty');
		}
		var value = '';
		if (fields.length === 1) {
			return data[fields[0]].toString();
		}
		for (var i = 0; i < fields.length; i++) {
			value += [fields[i], data[fields[i]].toString()].join('=') + '|';
		}
		return value;
	}
	return data.toString();
}

exports.Promise = require('bluebird');
exports._ = _;
exports.randomString = randomString;
exports.randomInt = randomInt;
exports.dbGet = dbGet;
exports.formatCacheKey = formatCacheKey;
