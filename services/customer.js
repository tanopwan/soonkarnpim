var customersServices = angular.module('customer.services', ['ngResource']);
	
customersServices.factory('Customers',['$resource', function($resource) {
	//var customers = $resource('/customers', null, null);

	var customer = $resource('/customers', null, {
		'list': {method:'GET', isArray: true},
		'get': {method: 'GET', params: {key: '@key'}},
	});

	return {
		//customers: customers,
		customer: customer
	};
}]);


