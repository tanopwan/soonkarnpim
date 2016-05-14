var quotationApp = angular.module('quotation.app', [
	'ngResource', 'ui.bootstrap', 'ui.select', 'AngularPrint', 'ui.router',
	'customer.services', 'quotation.services'
]);

quotationApp.controller('controller.quotation.list', function ($scope, $http, QuotationService) {
	QuotationService.quotation.list().$promise.then(function(data) {
		$scope.quotations = data;
		console.log("controller.quotation.list retrieved quotation list");
	});
});

quotationApp.factory('DataList', ['$resource',
  	function($resource){
    	return $resource('/resources/data.json', {}, {
      		get: {method:'GET'}
    	});
 }]);

