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

exports.Promise = require('bluebird');
exports._ = _;
exports.randomString = randomString;
exports.dbGet = dbGet;
