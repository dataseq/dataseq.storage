'use strict';

var AccessService = require('./access_service');
var MemoryCache = require('./memory_cache');
var util = require('util');
var utils = require('./utils');
var Promise = utils.Promise;

function formatCacheKey(name, data, fields) {
	return [name, utils.formatCacheKey(data, fields)].join(':');
}

/**
 * Gets data from cache or storage & then puts into cache.
 * @private
 */
function getData(self, method, fields, time, data, options) {
	options = options || {};
	if (!options.noCache) {
		time = options.cacheTime || time;
		var key = formatCacheKey(method, data, fields);
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
 * @param {Cache} [cache=new MemoryCache()] - A cache object
 * @augments AccessService
 * @class
 */
function CacheAccessService(cache) {
	AccessService.call(this);
	this.cache = cache || new MemoryCache();
}

module.exports = CacheAccessService;

util.inherits(CacheAccessService, AccessService);

CacheAccessService.prototype.getSet = function(data, options) {
	return getData(this, 'getSet', ['id'], 30, data, options);
};

CacheAccessService.prototype.getSequence = function(data, options) {
	return getData(this, 'getSequence', ['setId', 'id'], 30, data, options);
};

/**
 * Deletes a Set from cache.
 * @param {SetRecord} data - Set data
 * @returns {boolean} true if deleted
 */
CacheAccessService.prototype.deleteSetFromCache = function(data) {
	var key = formatCacheKey('getSet', data, ['id']);
	return this.deleteCacheItem(key);
};

/**
 * Deletes a Sequence from cache.
 * @param {SequenceRecord} data - Sequence data
 * @returns {boolean} true if deleted
 */
CacheAccessService.prototype.deleteSequenceFromCache = function(data) {
	var key = formatCacheKey('getSequence', data, ['setId', 'id']);
	return this.deleteCacheItem(key);
};

/**
 * Deletes a value from cache by key.
 * @param {string} key - cache key
 * @returns {boolean} true if deleted
 */
CacheAccessService.prototype.deleteCacheItem = function(key) {
	return this.cache.del(key);
};
