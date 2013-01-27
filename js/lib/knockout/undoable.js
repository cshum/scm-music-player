define(['knockout'],function(ko){
ko.extenders.undoable= function(target, options) {
    var _trackChanges = ko.observable(true);
    var _stackSize = options.stackSize || 0;
    var _undoData = {};
    _undoData.undoStack = ko.observableArray([]);
    
    //Setup our stack items
    var StackItem = function(index, data) {
        var item = {
            data: data,
            index: index
        };
        
        item.isCurrentUndoLevel = ko.computed(function() {
            var undoStack = _undoData.undoStack();
            var stackLength = undoStack.length;
            var firstIndex = (stackLength > 0)?undoStack[0].index:0;
            var temp = (stackLength > 0 && this.index - firstIndex == undoStack[stackLength - 1].index);
            return(stackLength > 0 && this.index - firstIndex == undoStack[stackLength - 1].index);
        }, item);
         
        return(item);                
    }
    
    //Track changes to the observable and push changes 
    //to the undo stack
    _undoData.isDirty = ko.computed(function() {
        if(_trackChanges())
        {
            var undoStack = _undoData.undoStack;
            var stackLength = undoStack().length;
            var firstIndex = (stackLength > 0)?undoStack()[0].index:0;
            
            undoStack.push(new StackItem(stackLength + firstIndex, ko.toJSON(target)));
            
            if(_stackSize > 0 && stackLength >= _stackSize)
                undoStack.splice(0, stackLength - _stackSize + 1);
        }
    });
    
    //Setup a dependent observable to track
    //the list of snapshots
    target.undoStack = ko.computed({
        read: function() {
            return _undoData.undoStack();
        },
        write: function() {}
    });
    
    //This is the function that controls how the 
    //snapshots get mapped back to the observable.
    //The data that is passed is JSON.
    var _undoFunction = function(snapshot, target) {
        if($.isPlainObject(target()))
            ko.mapping.fromJSON(snapshot.data, null, target);
        else
            target($.parseJSON(snapshot.data));
    }

    target.undo = function(index) {        
        var undoLength = _undoData.undoStack().length;
        var undoStack = _undoData.undoStack();
        var firstIndex = (undoLength > 0)?undoStack[0].index:0;
    
        //If we are popping off of the stack, pick the correct index        
        if(index === undefined && undoLength > 1)
        {
            this.undo(undoLength - 2);
            return;
        }
    
        //Stop undo tracking
        _trackChanges(false);
        
        if (index === undefined && undoLength > 0) 
            _undoFunction(undoStack.pop(), target);
        else if (index < undoLength) 
            _undoFunction(undoStack.splice(index, undoLength - index)[0], target);
        else if (index.index != null && index.index - firstIndex < undoLength)  
            _undoFunction(undoStack.splice(index.index - firstIndex, undoLength - (index.index - firstIndex))[0], target);

        //Start tracking changes
        _trackChanges(true);
    }

    target.clearUndoStack = function() {
        _undoData.undoStack([]);
    }
        
    return (target);
}

return ko;
});
