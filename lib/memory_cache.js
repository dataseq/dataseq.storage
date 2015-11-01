'use strict';

var cache = require('memory-cache');
var CacheInterface = require('./cache');
var util = require('util');

/**
 * MemoryClass implementation
 * @implements Cache
 * @class
 */
function MemoryCache() {
	CacheInterface.call(this);
}

module.exports = MemoryCache;

util.inherits(MemoryCache, CacheInterface);

MemoryCache.prototype.get = function(key) {
	return cache.get(key);
};

MemoryCache.prototype.put = function(key, value, time) {
	if (time) {
		time = time * 1000;
	}
	return cache.put(key, value, time);
};

MemoryCache.prototype.del = function(key) {
	return cache.del(key);
};

MemoryCache.prototype.clear = function() {
	return cache.clear();
};
