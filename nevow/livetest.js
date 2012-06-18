
var loadObservers = [];

var addLoadObserver = function(observer) {
    loadObservers.push(observer);
}

var loadNotify = function() {
    for (var i in loadObservers) {
        loadObservers[i]();
    }
    loadObservers = [];
}

var passed = function(whichTest) {
    document.getElementById('test-'+whichTest).className = 'test-passes';
}

var failed = function(whichTest) {
    document.getElementById('test-'+whichTest).className = 'test-failures';
}

var setContentLocation = function(newLocation) {
    return document.getElementById('testframe').contentDocument.location = newLocation;
}

