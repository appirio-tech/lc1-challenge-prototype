var bootstrap = angular.module("bootstrap", []);

//Force Click
bootstrap.directive('forceClick', function($document){
	return {
		restrict: 'A',
		link: function(scope, elem, attr, ctrl) {
			elem.bind('click', function(e) {
			// this part keeps it from firing the click on the document.
				e.stopPropagation();
			});
		}
	}
});

//Custom Checkbox
bootstrap.directive('checkbox', function(){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		template: function (tElement, tAttrs) {
			var custom_true  = tAttrs.true  ? ' ng-true-value="'  + tAttrs.true  + '"' : '';
			var custom_false = tAttrs.false ? ' ng-false-value="' + tAttrs.false + '"' : '';
			var more_class = tAttrs.class ? ' '+tAttrs.class : '';
			return '<label ng-transclude><input type="checkbox" ng-model="' + tAttrs.model + '"'+ custom_true + custom_false
			+ '><div class="custom-checkbox'+ more_class +'"></div>'
		}
	}
});

//Click Outside
bootstrap.directive('offClick',['$document',function($document){       
	function targetInFilter(target,filter){
		if(!target || !filter) return false;
		var elms = angular.element(filter);
		var elmsLen = elms.length;
		for (var i = 0; i< elmsLen; ++i)
			if(elms[i].contains(target)) return true;
			return false;
		}
		
		return{
			restrict: 'A',
			scope:{
				offClick: '&',
				offClickIf: '&'
			},
			link: function (scope, elm, attr){
			
				if(attr.offClickIf){
					scope.$watch(scope.offClickIf,function(newVal,oldVal){
						if (newVal && !oldVal){
							$document.on('click', handler);
						} else if(!newVal){
							$document.off('click', handler);
						}
					});
				}else{
					$document.on('click', handler);
					$('header').on('click', handler);
					$('footer').on('click', handler);
				}
			
				function handler(event){
					var target = event.target || event.srcElement;
					if(!(elm[0].contains(target) || targetInFilter(target, attr.offClickFilter))){
						scope.$apply(scope.offClick());
					}
				}
			}
		};
	}
]);

//Limit Number
bootstrap.filter('numberFixedLen',function(){
	return function(n,len){
		var num = parseInt(n,10);
		len = parseInt(len,10);
		if(isNaN(num) || isNaN(len)){
			return n;
		}
		num = ''+num;
		while(num.length<len){
			num = '0'+num;
		}
		return num;
	};
});

//Set Height
bootstrap.directive('resize',function($window,matchmedia){
	return function (scope, element){
		var w = angular.element($window);
		scope.getWindowDimensions = function(){
			return{'h':w.innerHeight()};
		};
		scope.$watch(scope.getWindowDimensions,function(newValue,oldValue){
			scope.windowHeight = newValue.h;
			scope.tablet = navigator.userAgent.match(/(iPod|iPhone|iPad)/) && matchmedia.isLandscape();
			scope.middle = function(element){
				if(element){
					if(newValue.h - angular.element(element).innerHeight()<0){
						return{
							'margin-top': '0px'	
						};	
					}else{
						return{ 
							'margin-top':(newValue.h - angular.element(element).innerHeight())/2 + 'px'	
						};
					}
				}
			};
			if(!scope.tablet){
				scope.style = function(element){	
					if(element){
						return{ 
							'height':(newValue.h - $('.panel-heading').outerHeight() - element) + 'px'	
						};
					}else{
						return{
							'height':(newValue.h - $('.panel-heading').outerHeight()) + 'px'	
						}	
					}
				};
			}else{
				scope.style = function(element){
					if(element){
						return{ 
							'height':(newValue.h - $('.panel-heading').outerHeight() - element - 20) + 'px'	
						};
					}else{
						return{
							'height':(newValue.h - $('.panel-heading').outerHeight() - 20) + 'px'	
						}	
					}
				};	
			}
		
		},true);

	}
});
