var jobServices = angular.module('job.services', ['ngResource']);
	
jobServices.factory('JobService', ['$resource', function($resource) {
	var job = $resource('/jobs', null, {
		list: {method:'GET', isArray: true}
	});
	return {
		job: job
	};
}]);

