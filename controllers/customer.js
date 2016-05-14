var customerApp = angular.module('customer.app', ['ui.router']);

customerApp.controller('controller.customer.list',
	function($scope, Customers) {
		$scope.customers = Customers.customer.list();
        console.log("controller.customer.list retrieved customer list");
	});

customerApp.controller('controller.customer.add', ['$scope',
    function($scope) {

    }]);

customerApp.controller('controller.customer.edit', ['$scope', '$stateParams', 'Customers',
    function($scope, $stateParams, Customers) 
    {
        var customer_id = $stateParams.key;
        Customers.customer.get({key:customer_id}).$promise.then(function(user) 
        {
            $scope.edit = user;
        });

        $scope.update = function() 
        {
            console.log("update");
            $('#customerForm').attr('action', "/customers/" + customer_id);
            $('#customerForm').submit();
        }   
    }]);
