var quotationApp = angular.module('quotation.app', [
	'ngResource', 'ui.bootstrap', 'ui.select', 'AngularPrint', 'ui.router',
	'customer.services'
]);

quotationApp.factory('QuotationService', ['$resource', function($resource) {
	var quotations = $resource('/quotations', null, null);
	var quotation = $resource('/quotations/:key', null, {
		get: {method:'GET'},
		post: {method:'POST'},
		delete: {method:'DELETE'}
	});
	var number = $resource('/quotation/number', null, null);
	return {
		quotations: quotations,
		quotation: quotation,
		id: number
	};
}]);

quotationApp.controller('controller.quotation.list', function ($scope, $http, QuotationService) {
	QuotationService.quotations.query().$promise.then(function(data) {
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

