/*eslint no-unused-vars:1*/

'use strict';

/**
 * Cache interface
 * @interface
 */
function Cache() {

}

/**
 * Get a cached value.
 * @returns {object} cached value.
 */
Cache.prototype.get = function(key) {

};

/**
 * Put a value in cache.
 * @param {string} key - Cache key.
 * @param {object} value - Cache value.
 * @param {number} [time] - Time in seconds.
 * @returns {object} cached value.
 */
Cache.prototype.put = function(key, value, time) {

};

/**
 * Delete a value from cache.
 * @returns {boolean} Deleted or not.
 */
Cache.prototype.del = function(key) {

};

/**
 * Clear the cache.
 */
Cache.prototype.clear = function() {

};

module.exports = Cache;
