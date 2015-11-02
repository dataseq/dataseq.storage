'use strict';

var assert = require('assert');
var utils = require('../lib/utils');
var Promise = utils.Promise;
var Data = require('./common/data');
var OWNER_ID = 'user_id';
var SET_ID = 'asdfgh0';

if (!Data) {
	return;
}

function foo() {}

describe('CacheControlService', function() {
	this.timeout(1000 * 60);

	before('createTables', function() {
		return Data.createTables();
	});

	after('deleteTables', function() {
		return Data.deleteTables('iam-sure').then(function() {
			return Promise.delay(1000 * 10);
		});
	});

	var controlService = Data.secureControlService;
	var accessService = Data.cacheAccessService;

	describe('#createSet()', function() {
		it('should create a set with an id', function() {
			return controlService.createSet({
					id: SET_ID,
					ownerId: OWNER_ID,
					name: 'Name 1'
				})
				.then(function(value) {
					assert.equal(SET_ID, value.id);
				});
		});
	});

	describe('#createValue()', function() {
		it('should fail on invalid set id', function() {
			return controlService.createValue({
					setId: '1234567',
					sequenceId: 'a',
					range: 1,
					value: 10
				}, {
					ownerId: OWNER_ID
				})
				.catch(function(error) {
					assert.ok(error);
					console.log(error.message);
				})
				.then(function(value) {
					assert.equal(undefined, value);
				});
		});

		it('should create a new value', function() {
			return controlService.createValue({
					key: SET_ID + '#a',
					range: 1,
					value: 10
				}, {
					ownerId: OWNER_ID
				})
				.then(function(value) {
					assert.equal(SET_ID + '#a', value.key);
				});
		});
	});

});
