﻿var aQuery = function(selector, context) {
    return  new aQuery.prototype.init();
}
aQuery.prototype = {
    init: function() {
        return this;
    },
    name: function() {
        console.log(this)
    },
    age: 20
}

aQuery.prototype.init.prototype = aQuery.prototype;

console.log(aQuery().name())