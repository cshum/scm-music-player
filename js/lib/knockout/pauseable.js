/* A fleshed-out implementation of the pausable observables
 * for both array and non-array versions, based on the the work
 * done by Ryan Niemeyer.  
 * (http://www.knockmeout.net/2011/04/pausing-notifications-in-knockoutjs.html)
 */ 
define(['knockout'],function(ko){
ko.extenders.pauseable = function(target) {
	var _actual = target;
	var _cachedValue = null;
	var _isPaused = ko.observable(false);
	var result = null;
		
	result = new ko.computed({
		read: function() {
			if(!_isPaused())
				return _actual();
			else
				return _cachedValue;
		},
		
		write: function(newValue) {
			if(!_isPaused())
				_actual(newValue);
			else
				_cachedValue = newValue;
		}
	});
	
	result.pause = function() {
		_cachedValue = _actual();
		_isPaused(true);
	}
	
	result.resume = function() {
		_actual(_cachedValue);
		_cachedValue = null;
		_isPaused(false);
	}
	
	if(target.removeAll)
	{
		result.push = function(value) {
			if(!_isPaused())
				return(_actual.push(value));
			else
				return(_cachedValue.push(value));
		}
		
		result.remove = function(valueOrPredicate) {
			if(!_isPaused())
				return(_actual.remove(valueOrPredicate));
			else
			{
				//Modified code from the KO source
				var underlyingArray = _cachedValue;
		        var removedValues = [];
		        var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
		        for (var i = 0; i < underlyingArray.length; i++) {
		            var value = underlyingArray[i];
		            if (predicate(value)) {
		                removedValues.push(value);
		                underlyingArray.splice(i, 1);
		                i--;
		            }
		        }
		       
		        return removedValues;
			}
		}
		
		result.removeAll = function(arrayOfValues) {
			if(!_isPaused())
				return(_actual.removeAll(arrayOfValues));
			else
			{
				// If you passed zero args, we remove everything
		        if (arrayOfValues === undefined) {
		            var underlyingArray = _cachedValue;
		            var allValues = underlyingArray.slice(0);
		            underlyingArray.splice(0, underlyingArray.length);
		            return allValues;
		        }
		        // If you passed an arg, we interpret it as an array of entries to remove
		        if (!arrayOfValues)
		            return [];
		        return this['remove'](function (value) {
		            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
		        });
			}
		}
		
		// Populate ko.observableArray.fn with read/write functions from native arrays
		ko.utils.arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (methodName) {
		    result[methodName] = function () {
		    	if(!_isPaused())
		    	{ 
			        var methodCallResult = _actual[methodName].apply(_actual, arguments);
			    }
			    else
			    {
			    	var underlyingArray = _cachedValue;
			        var methodCallResult = underlyingArray[methodName].apply(underlyingArray, arguments);
			        return methodCallResult;
			    }
		    };
		});
		
		// Populate ko.observableArray.fn with read-only functions from native arrays
		ko.utils.arrayForEach(["slice"], function (methodName) {
		    result[methodName] = function () {
		    	var underlyingArray = null;
		    	
		    	if(!_isPaused())
		        	underlyingArray = _actual;
		        else
		        	underlyingArray = _cachedValue;
		        
		        return underlyingArray[methodName].apply(underlyingArray, arguments);
		    };
		});
	}
		
	return result;
}
return ko;
});
