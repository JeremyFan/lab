(function (window) {
    // 定义webstore支持的属性/方法
    var set, get;

    // 支持localStorage的浏览器
    if (typeof window.localStorage == 'object') {
        set = function (key, value) {
            window.localStorage.setItem(key, value);
        };
        get = function (key) {
            return window.localStorage.getItem(key);
        };
    }
        // 支持addBehavior的浏览器
    else if (typeof window.document.documentElement.addBehavior == 'object') {
        // 存储空间名
        var storespace = 'StoreSpace';
        var setStore = function () {
            if (window.store)
                return;
            // 创建存储元素
            var store = document.createElement('div');
            window.document.body.appendChild(store);
            store.addBehavior('#default#userData');
            // 把store添加到window
            window.store = store;
        }
        set = function (key, value) {
            setStore();
            // 写入数据
            store.setAttribute(key, value);
            // 保存到storespace
            store.save(storespace);

        };
        get = function (key) {
            //debugger;
            setStore();
            // 获取storespace中的所有数据
            store.load(storespace);
            // 读取指定数据
            return store.getAttribute(key);
        }

    } else {
        throw new Error("Sorry, your browser doesn't support webstore.js");
    }

    // 创建一个临时的webstore对象
    var webstore = new Object();
    webstore.get = get;
    webstore.set = set;

    // 把webstore对象加进window
    if (typeof webstore.get == 'function' &&
        typeof webstore.set == 'function') {
        window.webstore = webstore;
    } else {
        throw new Error("The object 'webstore' has not been successfully created.")
    }
})(window);