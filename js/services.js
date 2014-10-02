'use strict';

/* Services */
var AAFServices = angular.module('AAFServices', ['ngResource']);

//Sub Applications List
AAFServices.factory('subApplicationsList',['$http','$q',function($http, $q){
	return {
		query : function() {
			var deferred = $q.defer();
			$http({method: 'GET', url: 'data/subApplications.json'}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(data);
			});
			return deferred.promise;
		} 
	};
}]);

//Sub action List
AAFServices.factory('actionList',['$http','$q',function($http, $q){
	return {
		query : function() {
			var deferred = $q.defer();
			$http({method: 'GET', url: 'data/actionList.json'}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(data);
			});
			return deferred.promise;
		}
	};
}]);

//Sub Applications List
AAFServices.factory('applicationsList',['$http','$q',function($http, $q){
	return {
		query : function() {
			var deferred = $q.defer();
			$http({method: 'GET', url: 'data/applications.json'}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(data);
			});
			return deferred.promise;
		} 
	};
}]);

//Profile
AAFServices.factory('userProfile',['$http','$q',function($http, $q){
	return {
		query : function() {
			var deferred = $q.defer();
			$http({method: 'GET', url: 'data/userProfile.json'}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(data);
			});
			return deferred.promise;
		} 
	};
}]);

//Notifications
AAFServices.factory('notificationsList',['$http','$q',function($http, $q){
	return {
		query : function() {
			var deferred = $q.defer();
			$http({method: 'GET', url: 'data/notifications.json'}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(data);
			});
			return deferred.promise;
		} 
	};
}]);

//Settings
AAFServices.factory('settingsList',['$http','$q',function($http, $q){
	return {
		query : function() {
			var deferred = $q.defer();
			$http({method: 'GET', url: 'data/settings.json'}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(data);
			});
			return deferred.promise;
		} 
	};
}]);

//Auto Complete
AAFServices.factory('autoCompleteList',['$http','$q',function($http, $q){
	return {
		query : function() {
			var deferred = $q.defer();
			$http({method: 'GET', url: 'data/autoComplete.json'}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(data);
			});
			return deferred.promise;
		} 
	};
}]);

//table data
AAFServices.factory('subApplicationTable',['$http','$q',function($http, $q){
	return {
		query : function() {
			var deferred = $q.defer();
			$http({method: 'GET', url: 'data/subApplicationsTable.json'}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(data);
			});
			return deferred.promise;
		}
	};
}]);

//card data
AAFServices.factory('subApplicationCard',['$http','$q',function($http, $q){
	return {
		query : function() {
			var deferred = $q.defer();
			$http({method: 'GET', url: 'data/subApplicationsCard.json'}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(data);
			});
			return deferred.promise;
		}
	};
}]);

//event data
AAFServices.factory('calendarEventsList',['$http','$q',function($http, $q){
	return {
		query : function() {
			var deferred = $q.defer();
			$http({method: 'GET', url: 'data/calendarEventsList.json'}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(data);
			});
			return deferred.promise;
		}
	};
}]);
//event data
AAFServices.service('browser', ['$window', function($window) {

    return function() {

        var userAgent = $window.navigator.userAgent;

        var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};

        for(var key in browsers) {
            if (browsers[key].test(userAgent)) {
                return key;
            }
        };

        return 'unknown';
    }

}]);