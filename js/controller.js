'use strict';

/* Controller */
var controllers = angular.module('controllers',['ngRoute','ui.bootstrap','AAFServices']);

//Main Controller
controllers.controller("mainCtrl",
	function($scope,$compile,$element,$modal,$document,subApplicationsList,applicationsList,userProfile,notificationsList,settingsList,$window,matchmedia,$timeout){
	
	$scope.myOption = {
		options: {
			html: true,
			focusOpen: false,
			onlySelect: true,
			appendTo: '.ui-navbar .search',
			source: function(request,response){
				$.getJSON("data/autoComplete.json",function(data){
					response($.map(data.source,function(value){
						return {
							label: value
						};
					}));
				});
			}
		}
	};
	
	$scope.myOptionFlyout = {
		options: {
			html: true,
			focusOpen: false,
			onlySelect: true,
			appendTo: '.panel-search .search',
			position: {
				collision: 'none'
			},
			source: function(request,response){
				$.getJSON("data/autoComplete.json",function(data){
					response($.map(data.source,function(value){
						return {
							label: value
						};
					}));
				});
			},
			select: function(event,ui){
				$(this).val(ui.item.label);
				event.stopPropagation();
				return false;
		 }
		}
	};		
	
	angular.element($window).bind('orientationchange',function(){
		$(".search input[type='search']").autocomplete("close");
		$('body').scrollTop(0);
	});
	
	angular.element($window).bind('resize',function(){
		$scope.desktop = matchmedia.isDesktop();
		if($scope.desktop){
			$(".search input[type='search']").autocomplete("close");
		}
	});
	
	//Advance Search Modal
	$scope.advance_open = function(){
		$scope.phone = matchmedia.isPhone();
		$scope.advanceSearchInstance = $modal.open({
			templateUrl: 'template/advance_search_tpl.html',
			windowClass: 'modal-advance-search',
			controller: modalAdvanceCtrl
		});	
		$scope.advance_popover_open = true;	
		
		$scope.advanceSearchInstance.result.then(function (selectedItem) {
      $scope.advance_popover_open = false;
    }, function () {
      $scope.advance_popover_open = false;
    })['finally'](function(){
			$scope.advanceSearchInstance = undefined  // <--- This fixes
		});
		
		$scope.advance_close = function($modalInstance){
		$scope.advance_popover_open = false;
		if($scope.advanceSearchInstance){
			$scope.advanceSearchInstance.dismiss('cancle');
		}
	}
		
	}
	
	var modalAdvanceCtrl = function($scope,$modalInstance){
		$scope.cancel_advance = function (){
			$modalInstance.dismiss('cancle');
		};
	};
	
	/***
		Search Panel In Mobile
	****/
	$scope.mobileSearch = false;
	
	//Open Search Panel
	$scope.mobile_search_open = function(){
		$scope.mobileSearch = !$scope.mobileSearch;
	}
	
	$scope.mobile_search_close = function(){
		$scope.mobileSearch = false;
	}
	
	//Setting Modal
	
	//Get Settings
	var promise = settingsList.query();
	promise.then(function(data) {
		$scope.settings = data.settings;
	}, function(data) {});
	
	$scope.settings_open = function(){
		$scope.settingInstance = $modal.open({
      templateUrl: 'template/settings_tpl.html',
			windowClass: 'modal-settings',
			controller: modalSettingsCtrl,
      resolve: {
        settings: function () {
          return $scope.settings;
        }
      }
    });
		$scope.settingInstance.result.then(function(settings){
    	$scope.settingseModal = false;
			$scope.settings_popover_open = false;	
			$scope.settings = settings;
    },function(){
			$scope.settingseModal = false;
			$scope.settings_popover_open = false;	
		})['finally'](function(){
			$scope.settingInstance = undefined  // <--- This fixes
		});
		
		$scope.settingseModal = true;
		$scope.settings_popover_open = true;
		$scope.setting_close = function(){
			$scope.settings_popover_open = false;	
			$scope.settingseModal = false;
			if($scope.settingInstance){
				$scope.settingInstance.dismiss('cancle');
			}
		}
		$scope.setting_ok = function(){
			$scope.settingInstance.close($scope.settings);	
		}
	}
	var modalSettingsCtrl = function($scope,$modalInstance,settings){
		$scope.settings = angular.copy(settings);
		$scope.cancel_settings = function(){
			$modalInstance.dismiss('cancle');
		};
		$scope.ok = function () {
			$modalInstance.close($scope.settings);
		};
	};
	
	/****
		Sub Applications Panel
	****/
	$scope.directPanel = false;
	
	//Get Sub Applications
	var promise = subApplicationsList.query();
	promise.then(function(data) {
		$scope.subApplications = data.applications;
	}, function(data) {});
	
	//Open Sub Applications Panel
	$scope.direct_open =  function($element){
		$scope.directPanel = !$scope.directPanel;
		$('.panel-direct .ui-row').scrollTop(0);
	}
	
	//Close Sub Applications Panel
	$scope.direct_hide =  function(){
		$scope.directPanel = false;
	}

    $scope.$on('$routeChangeStart', function(next, current) {
        $timeout(function(){$scope.direct_hide();},500);
    });

	/****
		Applications Panel
	****/
	$scope.applicationsPanel = false;
	$scope.filterScope = {scope: true};
	
	//Get Applications
	var promise = applicationsList.query();
	promise.then(function(data) {
		$scope._deferApplications = data.applications;
		$scope.applications = angular.copy($scope._deferApplications);
	}, function(data) {});
	
	//Open Applications Panel
	$scope.applications_open =  function(){
		$scope.applicationsPanel = !$scope.applicationsPanel;	
		$scope.allAppications = false;
		$scope.filterScope = {scope: true};
		$scope.mobileSearch = false;
		$('.panel-applications .ui-row').scrollTop(0);
	}
	
	//Hide Applications Panel
	$scope.applications_hide =  function(){
		$scope.applicationsPanel = false;
		$scope.applications = angular.copy($scope._deferApplications);
	}
	
	//Add Application
	$scope.showAllApplications = function(){
		$scope.allAppications = true;
		$scope.filterScope = {scope: ''};
		$('.panel-applications .ui-row').scrollTop(0);
	}
	
	//Get Selected Checkbox Count
	$scope.$watch('filterred', function(filterred){
		$scope.count = 0;
		angular.forEach(filterred, function(application){
			if(application.scope){
				$scope.count += 1;
			}
		})
	}, true);
	
	//Cancel Add Application
	$scope.cancelApplication = function(){
		$scope.allAppications = false;
		$scope.filterScope = {scope: true};	
		$scope.applications = angular.copy($scope._deferApplications);
	}
	
	//Select Add Application
	$scope.selectApplication = function(){
		$scope.allAppications = false;
		$scope.filterScope = {scope: true};
		$scope._deferApplications = angular.copy($scope.applications);
	}
	
	/****
		Profile Popover
	****/
	$scope.popoverProfile = false;
	
	//Get Profile Information
	var promise = userProfile.query();
	promise.then(function(data) {
		$scope.userInfo = data.userInfo;
	}, function(data) {});	
	
	//Profile Povover Open
	$scope.profile_open = function(){
		$scope.popoverProfile = !$scope.popoverProfile;
		$scope.mobileSearch = false;
	}
	
	//Profile Popover Hide
	$scope.profile_close =  function(){
		$scope.popoverProfile = false;
	}
	
	/****
		Notifications Popover
	****/
	$scope.popoverNotifications = false;
	
	//Get Profile Information
	var promise = notificationsList.query();
	promise.then(function(data) {
		$scope.notifications = data.notifications;
	}, function(data) {});	
	
	//Notifications Povover Open
	$scope.notifications_open = function(){
		$scope.popoverNotifications = !$scope.popoverNotifications;
		$scope.mobileSearch = false;
	}
	
	//Notifications Povover Close
	$scope.notification_hide = function(){
		$scope.popoverNotifications = false;
	}

});

//landing page controller
controllers.controller("tableController",
	function($scope, ngTableParams, $filter, $timeout, subApplicationTable, matchmedia,actionList, $modal, $location, $routeParams, $log, $window,browser){

        $scope.portrait=matchmedia.isPortrait();
        $scope.browser=browser();
        angular.element($window).bind('orientationchange',function(){
            $scope.portrait=matchmedia.isPortrait();
        });
	    $scope.view = 'list';
        $scope.phone = matchmedia.isPhone();

        var url = $location.url();
        var sortCol = {col1: 'asc'};
        var suffix = url.substring(url.lastIndexOf('/')+1, url.length);

        $scope.challengeId = $routeParams.challengeId;
        if (suffix === 'challenges') {
        	$scope.type = 'Challenges';
        	sortCol = {lastUpdatedAt: 'desc'};
        }
        else if (suffix === 'submissions') {
        	$scope.type = 'Submission';
        	sortCol = {col1: 'asc'};
        }
        else if (suffix === 'results') {
        	$scope.type = 'Review';
        }
        else {
        	$scope.type = 'Scorecard';
        }

        var promise = subApplicationTable.query();
        $scope.data =[];
        $scope.columnHeaders =[];
        promise.then(function(data) {
            $scope.data = data["tableData" + $scope.type];
            $scope.columnHeaders = data["columnHeaders" + $scope.type];
            // if($scope.phone){
            //     $scope.data = data.tableDataMobile;
            //     $scope.columnHeaders = data.columnHeadersMobile;
            // } 
            // else {
            //     $scope.data = data.tableData;
            //     $scope.columnHeaders = data.columnHeaders;
            // }

            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: parseInt($scope.pagerSelection),          // count per page
                sorting: sortCol // initial sorting
            }, {
                total: $scope.data.length, // length of data
                getData: function($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                        $filter('orderBy')($scope.data, params.orderBy()) :
                        $scope.data;

                    $defer.resolve($scope.tableRows=orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

            // $log.info($scope.columnHeaders);

        }, function(data) {});

        $scope.checkboxes = { 'checked': false, items: {} };

        // watch for check all checkbox
        $scope.$watch('checkboxes.checked', function(value) {
            angular.forEach($scope.tableRows, function(item) {
                if (angular.isDefined(item.id)) {
                    $scope.checkboxes.items[item.id] = value;
                }
            });
        });

        // watch for data checkboxes
        $scope.checked = 0;
        $scope.unchecked = 0;
        $scope.$watch('checkboxes.items', function(values) {
            if (!$scope.tableRows) {
                return;
            }
            $scope.checked = 0;
            $scope.unchecked = 0;
            $scope.total = $scope.tableRows.length;
            angular.forEach($scope.tableRows, function(item) {
                $scope.checked   +=  ($scope.checkboxes.items[item.id]) || 0;
                $scope.unchecked += (!$scope.checkboxes.items[item.id]) || 0;
            });
            if (($scope.unchecked ===0) || ($scope.checked ===0)) {
                $scope.checkboxes.checked = ($scope.checked ===$scope.total);
            }
            if($scope.checked===0){
                $scope.action_popover_open =false;
            }
        }, true);


        /*pagination options*/
        $scope.pagerOptions = ['5','10', '20', 'All'];
        $scope.pagerSelection = '10';

        /*changeCount*/
        $scope.changeCount = function(count){
            if(!$scope.tableParams){
                return false;
            }
            if(count ==='All'){
                $scope.tableParams.$params.count= 10000;
            }else{
                $scope.tableParams.$params.count= parseInt(count);
            }
            $scope.tableParams.$params.page= 1;
            $scope.tableParams.reload();
        };

        /*delete*/
        $scope.delete = function(row){
            var rowId = row.id;
            var index = $scope.data.indexOf(row);
            $scope.data.splice(index, 1);
            $scope.tableParams.total($scope.data.length);
            $scope.tableParams.reload();
            $scope.checkboxes.items[rowId]=false;
        };

        /*deleteSelected*/
        $scope.deleteSelected = function(){
            if ($scope.checkboxes.checked) {
                $scope.data = [];
            } else {
                angular.forEach($scope.tableRows, function (row) {
                    if ($scope.checkboxes.items[row.id]) {
                        var index = $scope.data.indexOf(row);
                        $scope.data.splice(index, 1);
                        $scope.checkboxes.items[row.id] = false;
                    }
                });
            }
            $scope.tableParams.total($scope.data.length);
            $scope.tableParams.reload();
        };

        /*reset filter popup*/
        $scope.filter_reset = function(){
            $scope.name1 = '';
            $scope.name2 = '';
            $scope.name3 = 1;
            $scope.name4 = 1;
            $scope.filterChecked = true;
        };
        $scope.filter_reset();

        $scope.filter_popover_open = false;
        //filter Modal
        $scope.filter_open = function(){
            $scope.action_popover_open =false;
            $scope.phone = matchmedia.isPhone();
            $scope.filterInstance = $modal.open({
                templateUrl: 'template/filter_tpl.html',
                windowClass: 'modal-advance-search',
                controller: filterCtrl
            });
            $scope.filter_popover_open = true;

            $scope.filter_close = function(){
                $scope.filter_popover_open = false;
            };

            $scope.filterInstance.result.then(function (selectedItem) {
                $scope.filter_popover_open = false;
            }, function () {
                $scope.filter_popover_open = false;
            })['finally'](function(){
                $scope.filterInstance = undefined  // <--- This fixes
            });
        };

        var filterCtrl = function($scope,$modalInstance){
            $scope.filter_close = function (){
                $modalInstance.dismiss('cancle');
            };
            $scope.filter_reset = function(){
                $scope.name1 = '';
                $scope.name2 = '';
                $scope.name3 = 1;
                $scope.name4 = 1;
                $scope.filterChecked = true;
            };
        };
        //action popup
        $scope.action_open = function(){
            $scope.action_popover_open = !$scope.action_popover_open;
            $scope.filter_popover_open = false;
        };

        //Get action List
        $scope.actionList =[];
        var promise_action = actionList.query();
        promise_action.then(function(data) {
            $scope.actionList = data.actionList;
        }, function(data) {});

        /*view change*/
        $scope.$watch('view',function(){
            $scope.setGridCount();
        });

        angular.element($window).bind('orientationchange',function(){
            $scope.setGridCount();
        });

        $scope.setGridCount = function(){
            if($scope.view === 'grid'){
                if(matchmedia.isDesktop() || (matchmedia.isTablet() && matchmedia.isLandscape())){
                    $scope.pagerOptions = ['8','12', '20', 'All'];
                    $scope.pagerSelection = '12';
                    $timeout(function(){ $scope.changeCount('12')},300);

                }else if(matchmedia.isTablet() && matchmedia.isPortrait()){
                    $scope.pagerOptions = ['6','9', '18', 'All'];
                    $scope.pagerSelection = '9';
                    $timeout(function(){ $scope.changeCount('9')},300);
                }
            }else{
                $scope.pagerOptions = ['5','10', '20', 'All'];
                $scope.pagerSelection = '10';
                $timeout(function(){ $scope.changeCount('10')},300);
            }
        }

        /*toggle view*/
        $scope.toggleView = function(){
            if($scope.view === 'grid'){
                $scope.view = 'list';
            }else{
                $scope.view = 'grid';
            }
        }

        /*toggle expand*/
        $scope.toggleExpand = function(row){
            row.expand = !row.expand;
        }
});

//card controller
controllers.controller("cardController",
	function($scope, ngTableParams, $filter, $timeout, subApplicationCard, matchmedia, $window, actionList, $modal){


        $scope.portrait=matchmedia.isPortrait();
        angular.element($window).bind('orientationchange',function(){
            $scope.portrait=matchmedia.isPortrait();
        });
	    $scope.view = 'list';
        $scope.phone = matchmedia.isPhone();
	    $scope.view = 'grid';
        $scope.data =[];
        $scope.columnHeaders =[];
        var promise = subApplicationCard.query();
        promise.then(function(data) {
            $scope.data = data.tableData;
            $scope.columnHeaders = data.columnHeaders;
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: parseInt($scope.pagerSelection),          // count per page
                sorting: {
                    name: 'asc'     // initial sorting
                }
            }, {
                total: $scope.data.length, // length of data
                getData: function($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                        $filter('orderBy')($scope.data, params.orderBy()) :
                        $scope.data;

                    $defer.resolve($scope.tableRows=orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

        }, function(data) {});

        $scope.checkboxes = { 'checked': false, items: {} };

        // watch for check all checkbox
        $scope.$watch('checkboxes.checked', function(value) {
            angular.forEach($scope.tableRows, function(item) {
                if (angular.isDefined(item.id)) {
                    $scope.checkboxes.items[item.id] = value;
                }
            });
        });

        // watch for data checkboxes
        $scope.checked = 0;
        $scope.unchecked = 0;
        $scope.$watch('checkboxes.items', function(values) {
            if (!$scope.tableRows) {
                return;
            }
            $scope.checked = 0;
            $scope.unchecked = 0;
            $scope.total = $scope.tableRows.length;
            angular.forEach($scope.tableRows, function(item) {
                $scope.checked   +=  ($scope.checkboxes.items[item.id]) || 0;
                $scope.unchecked += (!$scope.checkboxes.items[item.id]) || 0;
            });
            if (($scope.unchecked ===0) || ($scope.checked ===0)) {
                $scope.checkboxes.checked = ($scope.checked ===$scope.total);
            }
            if($scope.checked===0){
                $scope.action_popover_open =false;
            }
        }, true);


        /*pagination options*/
        $scope.pagerOptions = ['4','8', '20', 'All'];
        $scope.pagerSelection = '4';

        /*changeCount*/
        $scope.changeCount = function(count){
            if(!$scope.tableParams){
                return false;
            }
            if(count ==='All'){
                $scope.tableParams.$params.count= 10000;
            }else{
                $scope.tableParams.$params.count= parseInt(count);
            }
            $scope.tableParams.$params.page= 1;
            $scope.tableParams.reload();
        };

        /*delete*/
        $scope.delete = function(row){
            var rowId = row.id;
            var index = $scope.data.indexOf(row);
            $scope.data.splice(index, 1);
            $scope.tableParams.total($scope.data.length);
            $scope.tableParams.reload();
            $scope.checkboxes.items[rowId]=false;
        };

        /*deleteSelected*/
        $scope.deleteSelected = function() {
            if ($scope.checkboxes.checked) {
                $scope.data = [];
            } else {
                angular.forEach($scope.tableRows, function (row) {
                    if ($scope.checkboxes.items[row.id]) {
                        var index = $scope.data.indexOf(row);
                        $scope.data.splice(index, 1);
                        $scope.checkboxes.items[row.id] = false;
                    }
                });
            }
            $scope.tableParams.total($scope.data.length);
            $scope.tableParams.reload();
        };

        /*reset filter popup*/
        $scope.filter_reset = function(){
            $scope.name1 = '';
            $scope.name2 = '';
            $scope.name3 = 1;
            $scope.name4 = 1;
            $scope.filterChecked = true;
        };
        $scope.filter_reset();
        $scope.filter_popover_open = false;
        //filter Modal
        $scope.filter_open = function(){
            $scope.action_popover_open =false;
            $scope.phone = matchmedia.isPhone();
            $scope.filterInstance = $modal.open({
                templateUrl: 'template/filter_tpl.html',
                windowClass: 'modal-advance-search',
                controller: filterCtrl
            });
            $scope.filter_popover_open = true;

            $scope.filter_close = function(){
                $scope.filter_popover_open = false;
            };

            $scope.filterInstance.result.then(function (selectedItem) {
                $scope.filter_popover_open = false;
            }, function () {
                $scope.filter_popover_open = false;
            })['finally'](function(){
                $scope.filterInstance = undefined  // <--- This fixes
            });
        };

        var filterCtrl = function($scope,$modalInstance){
            $scope.filter_close = function (){
                $modalInstance.dismiss('cancle');
            };
            $scope.filter_reset = function(){
                $scope.name1 = '';
                $scope.name2 = '';
                $scope.name3 = 1;
                $scope.name4 = 1;
                $scope.filterChecked = true;
            }
        };

        //action popup
        $scope.action_open = function(){
            $scope.action_popover_open = !$scope.action_popover_open;
            $scope.filter_popover_open = false;
        };

        //Get action List
        $scope.actionList =[];
        var promise_action = actionList.query();
        promise_action.then(function(data) {
            $scope.actionList = data.actionList;
        }, function(data) {});

        /*view change*/
        $scope.$watch('view',function(){
            $scope.setGridCount();
        });

        angular.element($window).bind('orientationchange',function(){
            $scope.setGridCount();
        });

        $scope.setGridCount = function(){
            if($scope.view === 'grid'){
                if(matchmedia.isDesktop() || (matchmedia.isTablet() && matchmedia.isLandscape())){
                    $scope.pagerOptions = ['4','8', '20', 'All'];
                    $scope.pagerSelection = '8';
                    $timeout(function(){ $scope.changeCount('8')},300);

                }else if(matchmedia.isTablet() && matchmedia.isPortrait()){
                    $scope.pagerOptions = ['6','9', '18', 'All'];
                    $scope.pagerSelection = '6';
                    $timeout(function(){ $scope.changeCount('6')},300);
                }else if(matchmedia.isPhone() && matchmedia.isPortrait()){
                    $scope.pagerOptions = ['3','6', '9', 'All'];
                    $scope.pagerSelection = '6';
                    $timeout(function(){ $scope.changeCount('6')},300);
                }else{
                    $scope.pagerOptions = ['5','10', '15', 'All'];
                    $scope.pagerSelection = '10';
                    $timeout(function(){ $scope.changeCount('10')},300);
                }
            }else{
                $scope.pagerOptions = ['4','8', '20', 'All'];
                $scope.pagerSelection = '4';
                $timeout(function(){ $scope.changeCount('4')},300);
            }
        };

        $scope.rate = 7;
        $scope.max = 10;
        $scope.isReadonly = false;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };

        /*toggle view*/
        $scope.toggleView = function(){
            if($scope.view === 'grid'){
                $scope.view = 'list';
            }else{
                $scope.view = 'grid';
            }
        }

        /*toggle view*/
        $scope.showAction = function(row){
            if(row.showAction){
                row.showAction = !row.showAction
            }else{
                row.showAction = true;
            }
        }

});

//schedule controller
controllers.controller("scheduleController",
	function($scope, $timeout, calendarEventsList, ngTableParams, $filter, matchmedia){

        $scope.portrait=matchmedia.isPortrait();
        $scope.phone = matchmedia.isPhone();
        $scope.view = "week";
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();


        /* event source that contains custom events on the scope */
        $scope.events = [];
        $scope.data=[];
        $scope.columnHeaders =[];
        /*pagination options*/
        $scope.pagerOptions = ['5','10', '15', 'All'];
        $scope.pagerSelection = '5';
        var promise = calendarEventsList.query();
        promise.then(function(data) {
            angular.forEach(data.events, function(value, key) {
                value.start = new Date(value.start);
                value.id = key;
                $scope.events.push(value);
            });
            $timeout(function(){$scope.highlightDate();},100);

            /*copy event data to table data*/
            angular.copy($scope.events, $scope.data);

            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: parseInt($scope.pagerSelection),          // count per page
                sorting: {
                    name: 'asc'     // initial sorting
                }
            }, {
                total: $scope.data.length, // length of data
                getData: function($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                        $filter('orderBy')($scope.data, params.orderBy()) :
                        $scope.data;

                    $defer.resolve($scope.tableRows=orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

        }, function(data) {});

        var columnFormat = 'dddd';
        if($scope.phone){
            columnFormat = 'ddd';
        }
        /* config object */
        $scope.uiConfig = {
            calendar:{
                height: 450,
                editable: false,
                header:{
                    left: 'prev',
                    center: 'title',
                    right: 'next'
                },
                titleFormat: {
                    month: 'MMMM yyyy',
                    week: "MMMM yyyy",
                    day: 'dddd, MMM d, yyyy'
                },
                columnFormat: {
                    month: columnFormat,
                    week: columnFormat,
                    day: columnFormat
                },
                allDaySlot:false,
                axisFormat: 'HH(:mm)TT',
                tRender: $scope.eventRender,
//                defaultView: 'agendaWeek'
                defaultView: 'agendaWeek',
                buttonText:{
                    prev: "<span class='fc-text-arrow'></span>",
                    next: "<span class='fc-text-arrow'></span>",
                    prevYear: "<span class='fc-text-arrow'></span>",
                    nextYear: "<span class='fc-text-arrow'></span>"
                }
            },
            viewDisplay: function(view) {
                $("#calendar .fc-view-month td").append('<input type="checkbox"/>AM<br>');
            }
        };

        /* event sources array*/
        $scope.eventSources = [$scope.events];

        /* Change View */
        $scope.changeView = function(view,calendar) {
            calendar.fullCalendar('changeView',view);
            $timeout(function(){$scope.highlightDate();},100);
        };

        $( "body" ).on( "click", ".fc-event-action .delete", function() {
            var id = $(this).data("id");
            $scope.removeEvent(parseInt(id));
        });
        /*prev next click*/
        $( "body" ).on( "click", ".fc-button-prev, .fc-button-next", function() {
            $timeout(function(){$scope.highlightDate();$scope.formatColumn();},100);
        });
        
        /* remove event */
        $scope.removeEvent = function(index) {
            var ind = 0;
            angular.forEach($scope.events, function(value, key) {
                if(value.id === index){
                    ind = key;
                }
            });
            $scope.events.splice(ind,1);
            $scope.data.splice(ind,1);

            $scope.tableParams.total($scope.data.length);
            $scope.tableParams.reload();

            $timeout(function(){$scope.highlightDate();},100);
        };

        /*changeCount*/
        $scope.changeCount = function(count){
            if(!$scope.tableParams){
                return false;
            }
            if(count ==='All'){
                $scope.tableParams.$params.count= 10000;
            }else{
                $scope.tableParams.$params.count= parseInt(count);
            }
            $scope.tableParams.$params.page= 1;
            $scope.tableParams.reload();
        };


        /*highlight days with events*/
        $scope.highlightDate = function () {
            $('.fc-border-separate tr td').each(function(){
                var cellDate = $(this).data("date");
                if(!cellDate){
                    return;
                }
                var th = this;
                var event = false;
                angular.forEach($scope.events, function(value, key) {
                    if(value.start.getDate()===parseInt(cellDate.split('-')[2])&&value.start.getMonth()===(parseInt(cellDate.split('-')[1])-1)&&value.start.getYear()===(parseInt(cellDate.split('-')[0])-1900)){
                        $(th).addClass('fc-state-event');
                        event = true
                    }
                });
                if(!event){
                    $(th).removeClass('fc-state-event');
                }
            });
        };
        $scope.formatColumn = function () {
            if(!$scope.phone){return}
            $('.fc-border-separate thead tr.fc-first th').each(function(){
                if($.trim($(this).text())!==''){
                    $(this).html($(this).html().charAt(0));
                }
            });
        };

        $timeout(function(){
            $scope.highlightDate();
            if($scope.phone){
                $scope.formatColumn();
            }
        },10);

        /*toggle view*/
        $scope.toggleView = function(calendar){
            if($scope.view === 'month'){
                $scope.changeView('agendaWeek', calendar);
                $scope.view = 'week'
            }else{
                $scope.changeView('month', calendar);
                $scope.view = 'month'
            }
            $timeout(function(){
                if($scope.phone){
                    $scope.formatColumn();
                }
            },100);
        }
});