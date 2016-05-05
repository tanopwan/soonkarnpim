quotationApp.controller('controller.quotation.add.edit', function ($scope, $http, $location, $window, $stateParams, QuotationService, Customers, DataList) {
	console.log("controller.quotation.add.edit");
	$scope.edit = false;
	$scope.editHeader = "A d d . Q u o t a t i o n";

	var quotation_id = $stateParams.key;
	if (quotation_id) {
		$scope.edit = true;
		$scope.editHeader = "E d i t . Q u o t a t i o n";
		QuotationService.quotation.get({key: quotation_id}).$promise.then(function(data) {
			console.log(data);

			$scope.quotation = data;
			$scope.quotation.quantity = parseInt(data.quantity) || "";
			$scope.quotation.total_baht = parseInt(data.total_baht) || "";
			$scope.quotation.total_satang = parseInt(data.total_satang) || "";
			//$scope.quotation.each_baht = parseInt(data.each_baht) || "";
			$scope.quotation.each_satang = parseInt(data.each_satang) || "";
			$scope.quotation.term = data.term || "ยืนยันราคา 30 วัน";

			$scope.number = $scope.quotation.number;

			$scope.quotation.sub_prices = data.sub_prices || [];
			for (var i = 0; i < $scope.quotation.sub_prices.length; i++){
				$scope.quotation.sub_prices[i].quantity = parseInt(data.sub_prices[i].quantity) || "";
				$scope.quotation.sub_prices[i].total_baht = parseInt(data.sub_prices[i].total_baht) || "";
				$scope.quotation.sub_prices[i].total_satang = parseInt(data.sub_prices[i].total_satang) || "";
				$scope.quotation.sub_prices[i].each_baht = parseInt(data.sub_prices[i].each_baht) || "";
				$scope.quotation.sub_prices[i].each_satang = parseInt(data.sub_prices[i].each_satang) || "";
			}
			
			$scope.quotation.sub_jobs = data.sub_jobs || [];
			for (var i = 0; i < $scope.quotation.sub_jobs.length; i++) {
				$scope.quotation.sub_jobs[i].quantity = parseInt(data.sub_jobs[i].quantity) || "";
				$scope.quotation.sub_jobs[i].total_baht = parseInt(data.sub_jobs[i].total_baht) || "";
				$scope.quotation.sub_jobs[i].total_satang = parseInt(data.sub_jobs[i].total_satang) || "";
				$scope.quotation.sub_jobs[i].each_baht = parseInt(data.sub_jobs[i].each_baht) || "";
				$scope.quotation.sub_jobs[i].each_satang = parseInt(data.sub_jobs[i].each_satang) || "";
			};
			
			$scope.quotation.papers = data.papers || [];
			for (var i = 0; i < $scope.quotation.papers.length; i++) {
				$scope.quotation.papers[i].sub_jobs = data.papers[i].sub_jobs ? JSON.parse(data.papers[i].sub_jobs) : [];
				$scope.quotation.papers[i].gram = parseInt(data.papers[i].gram) || 0;
			};

			$scope.quotation.prints = data.prints || [];
			for (var i = 0; i < $scope.quotation.prints.length; i++) {
				$scope.quotation.prints[i].sub_jobs = data.prints[i].sub_jobs ? JSON.parse(data.prints[i].sub_jobs) : [];
				$scope.quotation.prints[i].plate = parseInt(data.prints[i].plate) || 0;
				$scope.quotation.prints[i].set = parseInt(data.prints[i].set) || 0;
				$scope.quotation.prints[i].cut = parseInt(data.prints[i].cut) || 4;
			};

			$scope.quotation.coats = data.coats || [];
			for (var i = 0; i < $scope.quotation.coats.length; i++) {
				$scope.quotation.coats[i].sub_jobs = data.coats[i].sub_jobs ? JSON.parse(data.coats[i].sub_jobs) : [];
				$scope.quotation.coats[i].page = parseInt(data.coats[i].page) || 0;
			};

			$scope.quotation.diecuts = data.diecuts || [];
			for (var i = 0; i < $scope.quotation.diecuts.length; i++) {
				$scope.quotation.diecuts[i].sub_jobs = data.diecuts[i].sub_jobs ? JSON.parse(data.diecuts[i].sub_jobs) : [];
			};

			$scope.quotation.folds = data.folds || [];
			for (var i = 0; i < $scope.quotation.folds.length; i++) {
				$scope.quotation.folds[i].sub_jobs = data.folds[i].sub_jobs ? JSON.parse(data.folds[i].sub_jobs) : [];
			};

			$scope.quotation.binds = data.binds || [];
			for (var i = 0; i < $scope.quotation.binds.length; i++) {
				$scope.quotation.binds[i].sub_jobs = data.binds[i].sub_jobs ? JSON.parse(data.binds[i].sub_jobs) : [];
			};
			$scope.dt = new Date(data.job_date);
		});
	}
	else {
		QuotationService.id.get().$promise.then(function(data) {
			$scope.number = data.seq;
			console.log("add quotation with seq number: " + $scope.number);
		});
	}

	Customers.customers.query().$promise.then(function(data) {
		$scope.customers = data;
	});

	$scope.deleteTab = function(name, index) {
		console.log("DeteteTab '" + name + "'' at " + index);
		if (name == 'sub_price'){
			$scope.quotation.sub_prices.splice(index, 1);
		}
		else if (name == 'sub_job') {
			$scope.quotation.sub_jobs.splice(index, 1);
		}
		else if (name == 'paper') {
			$scope.quotation.papers.splice(index, 1);
		}
		else if (name == 'print') {
			$scope.quotation.prints.splice(index, 1);
		}
		else if (name == 'coat') {
			$scope.quotation.coats.splice(index, 1);
		}
		else if (name == 'diecut') {
			$scope.quotation.diecuts.splice(index, 1);
		}
		else if (name == 'fold') {
			$scope.quotation.folds.splice(index, 1);
		}
		else if (name == 'bind') {
			$scope.quotation.binds.splice(index, 1);
		}
	}

	$scope.addTab = function(name) {
		if (name == 'sub_price'){
			var sub_price = { name: [], size: "", quantity: ""};
			$scope.quotation.sub_prices.push(sub_price);
		}
		else if (name == 'sub_job') {
			var sub_job = { name: [], size: "", quantity: ""};
			$scope.quotation.sub_jobs.push(sub_job);
		}
		else if (name == 'paper') {
			var paper = { sub_job: [], type: "ปอนด์", size: "", gram: ""};
			$scope.quotation.papers.push(paper);
		}
		else if (name == 'print') {
			var print = { sub_job: [], cut: 4, plate: 0, set: 0, color: ""};
			$scope.quotation.prints.push(print);
		}
		else if (name == 'coat') {
			var coat = { sub_job: [], type: "ยูวี", page: 1, comment: ""};
			$scope.quotation.coats.push(coat);
		}
		else if (name == 'diecut') {
			var diecut = { sub_job: [], type: "ปั้มขาด", size: "", comment: ""};
			$scope.quotation.diecuts.push(diecut);
		}
		else if (name == 'fold') {
			var fold = { sub_job: [], type: "", comment: ""};
			$scope.quotation.folds.push(fold);
		}
		else if (name == 'bind') {
			var bind = { sub_job: [], type: "เย็บลวดมุงหลังคา", comment: ""};
			$scope.quotation.binds.push(bind);
		}
		console.log("AddTab '" + name + "'' at last index");
	}

	$scope.update = function() {
		console.log("update");
		$('#quotationForm').attr('action', "/quotations/" + quotation_id);
		$('#quotationForm').submit();
	}

	$scope.delete = function() {
		console.log("delete");
		QuotationService.quotation.delete({key: quotation_id}).$promise.then(function(data) {
			//$window.location.href = '/quotation.html';
			$state.go('quotation');
		});
	}

	$scope.go = function ( path ) {
	 	$location.path( path );
	};

	$scope.quotation = {};
	$scope.quotation.term = "ยืนยันราคา 30 วัน";
	$scope.quotation.sub_prices = [];
	$scope.quotation.sub_jobs = [];
	$scope.quotation.papers = [];
	$scope.quotation.prints = [];
	$scope.quotation.coats = [];
	$scope.quotation.diecuts = [];
	$scope.quotation.folds = [];
	$scope.quotation.binds = [];

	var today = new Date();
	var maxDate = new Date();
	maxDate.setMonth(today.getMonth()+6);
	console.log(maxDate);
	$scope.today = function() {
	    $scope.dt = today;
	};

	$scope.today();
	$scope.opened        = false;
	$scope.dateOptions = {
		showWeeks : false,
		maxDate: maxDate,
    	minDate: new Date(2016, 1, 1)
	};

	$scope.$watch('dt', function(newValue, oldValue) {
		console.log("dt watch!");
		if (newValue) {
			$scope.month = newValue.getMonth();
			$scope.year = newValue.getFullYear();
		}
	});

	$scope.$watch('quotation.sub_prices', function(newValue, oldValue) {
		// To force model update
	}, true);

	$scope.$watch('quotation.sub_jobs', function(newValue, oldValue) {
		// To force model update
	}, true);

	$scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
      };
	
	DataList.get(function(data) {
		$scope.paperTypes = data.paperTypes;
		$scope.printTypes = data.printTypes;
		$scope.coatTypes = data.coatTypes;
		$scope.diecutTypes = data.diecutTypes;
		$scope.bindTypes = data.bindTypes;
		console.log($scope.paperTypes[0]);
	});
});

