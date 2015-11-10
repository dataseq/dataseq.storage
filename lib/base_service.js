'use strict';

var isValidAppId = require('./db/schemas').isValidAppId;

function BaseService(appId) {
	appId = appId || process.env.DATASEQ_APP_ID;
	if (!isValidAppId) {
		throw new Error('Invalid appId!');
	}
	this.appId = appId;
}

module.exports = BaseService;

BaseService.prototype.getAppId = function() {
	return this.appId;
};
