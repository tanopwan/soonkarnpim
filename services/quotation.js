var quotationServices = angular.module('quotation.services', ['ngResource']);
	
quotationServices.factory('QuotationService', ['$resource', function($resource) {
	var quotation = $resource('/quotations', null, {
		list: {method:'GET', isArray: true},
		get: {method:'GET', params: {key: '@key'}},
		accept: {method:'POST', url: '/quotation/accept', headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }},
		delete: {method:'DELETE'}
	});
	var option = $resource('', {key: '@key'}, {
		save_sum_mode: {method:'POST', url: '/quotations/:key/sum_mode', headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}},
		save_vat_mode: {method:'POST', url: '/quotations/:key/vat_mode', headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}}
	})
	var number = $resource('/quotation/number', null, null);
	return {
		quotation: quotation,
		id: number,
		option: option
	};
}]);

