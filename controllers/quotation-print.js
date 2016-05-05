
quotationApp.controller('controller.quotation.print', function($scope, $stateParams, QuotationService, Customers) {

	var quotation_id = $stateParams.key;

	$scope.sum_mode = "none";
	$scope.$watch('sum_mode', function(newValue, oldValue) {
		if ($scope.quotation) {
			calculate();
		}
	});

	$scope.vat_mode = "vat";
	$scope.$watch('vat_mode', function(newValue, oldValue) {
		if ($scope.quotation) {
			calculate();
		}
	});

	QuotationService.quotation.get({key: quotation_id}).$promise.then(function(data) {
		console.log(data);
		$scope.quotation = data
		calculate();
		var monthNamesThai = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤษจิกายน","ธันวาคม"];

		var d = new Date($scope.quotation.job_date);
		$scope.date_string = d.getDate() + " " + monthNamesThai[d.getMonth()] + "  " + d.getFullYear();

	}).then(function() {
		var customer_id = $scope.quotation.customer_id;
		if (customer_id != "? undefined:undefined ?") {
			Customers.customer.get({key: customer_id}).$promise.then(function(data) {
			$scope.customer = data;
		});	
		}
	});

	$scope.hasSubPrices = function(object){
		if (object.sub_prices == null || object.sub_prices.length <= 0){
			return false;
		}
		var sub_prices = JSON.parse(object.sub_prices);
		if (sub_prices != null && sub_prices.length > 0) {
			return true;
		}
		return false;
	}

	$scope.hasSubJobs = function(object) {
		if (object.sub_jobs == null || object.sub_jobs.length <= 0) {
			return false;
		}
		var sub_jobs = JSON.parse(object.sub_jobs);		
		if (sub_jobs != null && sub_jobs.length > 0) {
			return true;
		}
		return false;
	}

	var calculate = function() {
		$scope.enableSubprices0 = true;
		if ($scope.quotation.sub_prices && $scope.quotation.sub_prices.length > 0) {
			$scope.enableSubprices0 = false;
		}

		$scope.enableAutosum = true;
		if ($scope.quotation.sub_jobs && $scope.quotation.sub_jobs.length > 0) {
			$scope.enableAutosum = false;
		}

		if ($scope.quotation.sub_prices) {
			$scope.quotation.sub_prices.forEach (function(sub_price) {
				sub_price.each_show = true;
				if (sub_price.each_baht == 0 && sub_price.each_satang == 0) {
					sub_price.each_show = false;
				}

				sub_price.total_show = true;
				if (sub_price.total_baht == 0 && sub_price.total_satang == 0) {
					sub_price.total_show = false;
				}
				
				if (sub_price.each_baht == 0) {
					sub_price.each_baht = "0";
				}
				if (sub_price.each_satang == 0) {
					sub_price.each_satang = "00";
				}

				if (sub_price.total_baht == "") {
					sub_price.total_baht = 0;
				}
				if (sub_price.total_satang == "") {
					sub_price.total_satang = "00";
				}
				sub_price.each_baht_str = sub_price.each_baht.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				sub_price.total_baht_str = sub_price.total_baht.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			});
		}

		if ($scope.quotation.sub_jobs) {
			$scope.quotation.sub_jobs.forEach (function(sub_job) {	
				sub_job.each_show = true;
				if (sub_job.each_baht == 0 && sub_job.each_satang == 0) {
					sub_job.each_show = false;
				}

				sub_job.total_show = true;
				if (sub_job.total_baht == 0 && sub_job.total_satang == 0) {
					sub_job.total_show = false;
				}

				if (sub_job.each_baht == 0) {
					sub_job.each_baht = "0";
				}
				if (sub_job.each_satang == 0) {
					sub_job.each_satang = "00";
				}
				if (sub_job.total_baht == "") {
					sub_job.total_baht = 0;
				}
				if (sub_job.total_satang == "") {
					sub_job.total_satang = 0;
				}
				sub_job.each_baht_str = sub_job.each_baht.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				sub_job.total_baht_str = sub_job.total_baht.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			});
		}

		var sum_mode = $scope.sum_mode;
		if (sum_mode == "auto") {
			$scope.sub_total_baht = 0;
			$scope.sub_total_satang = 0;

			if ($scope.quotation.sub_jobs) {
				$scope.quotation.sub_jobs.forEach (function(sub_job) {
					$scope.sub_total_baht += parseInt(sub_job.total_baht);
					$scope.sub_total_satang += parseInt(sub_job.total_satang);
				});
			}
			
		}
		else if (sum_mode == "input" && $scope.quotation.sub_prices.length > 0) {
			$scope.sub_total_baht = $scope.quotation.sub_prices[0].total_baht;
			$scope.sub_total_satang = $scope.quotation.sub_prices[0].total_satang;
			$scope.sub_total_baht_str = $scope.sub_total_baht.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		else {
			$scope.sub_total_baht = "-";
			$scope.sub_total_satang = "-";
			$scope.vat_baht = "-";
			$scope.vat_satang = "-";
			$scope.total_baht = "-";
			$scope.total_satang = "-";
			return;
		}
		
		if ($scope.vat_mode == "vat") {
			$scope.vat = Math.ceil(parseFloat($scope.sub_total_baht + "." + $scope.sub_total_satang) * 0.07 * 100);
			$scope.vat_baht = parseInt($scope.vat / 100);
			$scope.vat_satang = parseInt((($scope.vat / 100) - parseInt($scope.vat / 100)) * 100);
			if ($scope.vat_satang < 10) {
					$scope.vat_satang = "0" + $scope.vat_satang;
				}

			$scope.total_baht = parseInt($scope.sub_total_baht) + parseInt($scope.vat_baht);

			$scope.total_satang = parseInt($scope.sub_total_satang) + parseInt($scope.vat_satang);
			if ($scope.total_satang > 100) {
				$scope.total_baht = parseInt($scope.total_baht) + 1;
				$scope.total_satang = parseInt($scope.total_satang) - 100;
				if ($scope.total_satang < 10) {
					$scope.total_satang = "0" + $scope.total_satang;
				}
			}

			if ($scope.sub_total_satang == 0) {
				$scope.sub_total_satang = "00";
			}

			if ($scope.vat_satang == 0) {
				$scope.vat_satang = "00";
			}

			if ($scope.total_satang == 0) {
				$scope.total_satang = "00";
			}
		}
		else {
			$scope.vat_baht = "-";
			$scope.vat_satang = "-";
			$scope.total_baht = $scope.sub_total_baht;
			$scope.total_satang = $scope.sub_total_satang;
		}
		
	};
});