'use strict';

var AccessService = require('./access_service');
var MemoryCache = require('./memory_cache');
var util = require('util');
var utils = require('./utils');
var formatKey = utils.formatCacheKey;
var Promise = utils.Promise;

function getData(self, method, fields, time, data, options) {
	options = options || {};
	if (!options.noCache) {
		time = options.cacheTime || time;
		var key = [method, formatKey(data, ['id'])].join(':');
		var value = self.cache.get(key);
		if (value !== null) {
			// console.log('got value from cache:', key);
			return Promise.resolve(value);
		}
	}
	return AccessService.prototype[method].call(self, data, options)
		.then(function(result) {
			if (!options.noCache && [null, undefined].indexOf(result) === -1) {
				self.cache.put(key, result, time);
			}
			return result;
		});
}

/**
 * CacheAccessService class.
 * @param {Cache} [cache] - A cache object
 * @augments AccessService
 * @class
 */
function CacheAccessService(cache) {
	AccessService.call(this);
	this.cache = cache || new MemoryCache();
}

module.exports = CacheAccessService;

util.inherits(CacheAccessService, AccessService);

CacheAccessService.prototype.findSet = function(data, options) {
	return getData(this, 'findSet', ['id'], 30, data, options);
};

CacheAccessService.prototype.findSequence = function(data, options) {
	return getData(this, 'findSequence', ['setId', 'id'], 30, data, options);
};
