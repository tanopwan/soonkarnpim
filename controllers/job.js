var jobApp = angular.module('job.app', [
	'ngResource', 'ui.bootstrap', 'AngularPrint',
	'customer.services', 'quotation.services', 'job.services'
]);

jobApp.controller('controller.job.list', function ($scope, $http, JobService) {
	JobService.job.list().$promise.then(function(data) {
		$scope.jobs = data;
		console.log("controller.job.list retrieved job list");
	});
});