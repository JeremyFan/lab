define(function (require, exports, module) {
    var localdb = {
            set: function (key, value) {},
            get: function (key) {},
            remove: function (key) {},
            clear: function () {}
        };
    var localStorageName = 'localStorage',
        globalStorageName = 'globalStorage',
        storage;
    if (localStorageName in window && window[localStorageName]) {
        storage = window[localStorageName];
        localdb.set = function (key, val) {
            storage.setItem(key, val)
        };
        localdb.get = function (key) {
            return storage.getItem(key)
        };
        localdb.remove = function (key) {
            storage.removeItem(key)
        };
        localdb.clear = function () {
            storage.clear()
        };
    } else if (globalStorageName in window && window[globalStorageName]) {
        storage = window[globalStorageName][window.location.hostname];
        localdb.set = function (key, val) {
            storage[key] = val
        };
        localdb.get = function (key) {
            return storage[key] && storage[key].value
        };
        localdb.remove = function (key) {
            delete storage[key]
        };
        localdb.clear = function () {
            for (var key in storage) {
                delete storage[key]
            }
        };
    } else if (window.document.documentElement.addBehavior) {
        function getStorage() {
            if (storage) {
                return storage
            }
            storage = window.document.body.appendChild(window.document.createElement('div'));
            storage.style.display = 'none';
            storage.addBehavior('#default#userData');
            storage.load(localStorageName);
            return storage;
        }

        localdb.set = function (key, val) {
            var storage = getStorage();
            storage.setAttribute(key, val);
            storage.save(localStorageName);
        };
        localdb.get = function (key) {
            var storage = getStorage();
            return storage.getAttribute(key);
        };
        localdb.remove = function (key) {
            var storage = getStorage();
            storage.removeAttribute(key);
            storage.save(localStorageName);
        };
        localdb.clear = function () {
            var storage = getStorage();
            var attributes = storage.XMLDocument.documentElement.attributes;
            storage.load(localStorageName);
            for (var i = 0, attr; attr = attributes[i]; i++) {
                storage.removeAttribute(attr.name);
            }
            storage.save(localStorageName);
        };
    }

    var api = {
        set: function (key, value) {
            try {
                localdb.set(key, JSON.stringify(value));
            } catch(e) {
                console.log(e);
            }
        },
        get: function (key) {
            try {
                return JSON.parse(localdb.get(key));
            } catch(e) {
                console.log(e);
                alert(e);
            }
            return null;
        },
        remove: function (key) {
            try {
                localdb.remove(key);
            } catch(e) {
                console.log(e);
            }
        },
        clear: function () {
            try {
                localdb.clear();
            } catch(e) {
                console.log(e);
            }

        }
    };
    module.exports = api;
});