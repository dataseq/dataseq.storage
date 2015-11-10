'use strict';

if (!process.env.AWS_REGION) {
	module.exports = false;
	console.log('To run all tests you must set ENV variables for AWS');
	return;
}

var storage = require('../../lib');
var ControlService = storage.ControlService;
var AccessService = storage.AccessService;
var cacheAccessService = new storage.CacheAccessService();

var data = {
	accessService: new AccessService(),
	controlService: new ControlService(),
	cacheAccessService: cacheAccessService,
	secureControlService: new storage.SecureControlService({
		accessService: cacheAccessService
	}),
	createTables: storage.createTables,
	deleteTables: storage.deleteTables
};

module.exports = data;
