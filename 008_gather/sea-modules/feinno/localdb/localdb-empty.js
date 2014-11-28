define(function (require, exports, module) {
    var localdb = {
            set: function (key, value) {},
            get: function (key) {return null;},
            remove: function (key) {},
            clear: function () {}
        };

    module.exports = localdb;
});