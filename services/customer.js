var customersServices = angular.module('customer.services', ['ngResource']);
	
customersServices.factory('Customers',['$resource', function($resource) {
	var customers = $resource('/customers', null, null);

	var customer = $resource('/customers/:key', null, {
		'post': {method:'POST'},
		'update': {method:'PUT'},
		'get': {method: 'GET'},
		'delete': {method:'DELETE'}
	});

	return {
		customers: customers,
		customer: customer
	};
}]);


