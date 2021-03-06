'use strict';

var assert = require('assert');
var utils = require('../lib/utils');
var Promise = utils.Promise;
var Data = require('./common/data');
var OWNER_ID = 'user_id';
var SET_ID = 'asdfgh0';
var APP_ID = process.env.DATASEQ_APP_ID;

if (!Data) {
	return;
}

function foo() {}

describe('ControlService', function() {
	this.timeout(1000 * 60);

	before('createTables', function() {
		return Data.createTables();
	});

	after('deleteTables', function() {
		return Data.deleteTables('iam-sure').then(function() {
			return Promise.delay(1000 * 10);
		});
	});

	var controlService = Data.controlService;
	var accessService = Data.accessService;

	describe('#createSet()', function() {
		it('should create a new Set without id', function() {
			return controlService.createSet({
					name: 'Name 1'
				})
				.then(function(set) {
					assert.ok(set);
					assert.ok(set.id);
					assert.equal(APP_ID, set.appId);
				});
		});

		it('should create a new Set with id', function() {
			return controlService.createSet({
					id: SET_ID,
					name: 'Name 1'
				})
				.then(function(set) {
					assert.ok(set);
					assert.equal(SET_ID, set.id);
					assert.equal(APP_ID, set.appId);
				});
		});

		it('should throw error: wrong id', function() {
			return controlService.createSet({
					id: 1,
					name: 'Name 2'
				})
				.catch(function(error) {
					assert.ok(error);
					assert.equal(true, !!error.message.indexOf('"id"'));
				})
				.then(function(set) {
					assert.equal(undefined, set);
				});
		});

		it('should throw error: no name', function() {
			return controlService.createSet({})
				.catch(function(error) {
					assert.ok(error);
					assert.equal(true, !!error.message.indexOf('"name"'));
				})
				.then(function(set) {
					console.log('set', set);
					assert.equal(undefined, set);
				});
		});
	});

	describe('#getSet()', function() {
		it('should find one Set', function() {
			return controlService.createSet({
					name: 'Name 1'
				})
				.then(function(set) {
					assert.ok(set);
					assert.ok(set.id);
					return accessService.getSet({
							id: set.id
						})
						.then(function(foundedSet) {
							assert.ok(foundedSet);
							assert.equal(set.id, foundedSet.id);
						});
				});
		});
	});

	describe('#createSequence()', function() {
		it('should create a Sequence', function() {
			return controlService.createSequence({
					setId: SET_ID,
					id: 'us'
				})
				.then(function(sequence) {
					assert.ok(sequence);
					assert.equal('us', sequence.id);
					assert.equal(SET_ID, sequence.setId);
				});
		});
		it('should create second Sequence', function() {
			return controlService.createSequence({
					setId: SET_ID,
					id: 'ro'
				})
				.then(function(sequence) {
					assert.ok(sequence);
					assert.equal('ro', sequence.id);
					assert.equal(SET_ID, sequence.setId);
				});
		});
		it('should fail on create Sequence', function() {
			return controlService.createSequence({
					setId: SET_ID,
					id: 'ro'
				})
				.catch(function(error) {
					assert.ok(error);
					// console.log(error);
					assert.equal('ConditionalCheckFailedException', error.code);
				})
				.then(function(sequence) {
					assert.equal(undefined, sequence);
				});
		});
		it('should find created Sequence', function() {
			return controlService.createSequence({
					setId: SET_ID,
					id: 'ru'
				})
				.then(function(sequence) {
					assert.ok(sequence);
					assert.equal('ru', sequence.id);
					assert.equal(SET_ID, sequence.setId);
					return accessService.getSequence({
							id: sequence.id,
							setId: sequence.setId
						})
						.then(function(foundedSequence) {
							assert.ok(foundedSequence);
							assert.equal(sequence.id, foundedSequence.id);
						});
				});
		});
	});

	describe('#putValue()', function() {
		var invalidData = require('./common/invalid_values');
		invalidData.forEach(function(idata) {
			it('should fail: ' + (idata.name || idata.data.key), function() {
				return controlService.putValue(idata.data)
					.catch(function(error) {
						assert.ok(error);
					})
					.then(function(value) {
						assert.equal(undefined, value);
					});
			});
		});

		it('should fail on creating dublicate values', function() {
			return controlService.createValue({
					setId: SET_ID,
					sequenceId: 'a',
					value: 1,
					range: 1
				})
				.then(function(value) {
					var key = SET_ID + '#a';
					assert.equal(key, value.key);
					return controlService.createValue({
							key: key,
							value: 1,
							range: 1
						})
						.catch(function(error) {
							assert.ok(error);
						})
						.then(function(value2) {
							assert.equal(undefined, value2);
						});
				});
		});
	});
});
