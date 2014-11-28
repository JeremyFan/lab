/**
 * Created by wangyongchao on 2014/8/31.
 */
define("square/src/1.0.0/main-debug", [ "backbone-debug", "underscore-debug", "./routers/router-debug", "./common/util-debug", "./common/phone-adapter-debug", "./routers/subscribe-and-publish-debug", "./views/topic-detail-view-debug", "./models/topic-beside-model-debug", "./models/topic-comment-model-debug", "./content/rich-helper-debug", "./templates/templates-module-debug", "./templates/templates-debug.html", "./collections/topic-comment-collection-debug", "./views/topic-comment-view-debug", "./views/report-topic-view-debug", "./views/floater-view-debug", "./collections/popup-collection-debug", "./views/share-friend-view-debug", "./views/content-view-debug", "./models/page-model-debug", "iscroll-debug", "./views/page-view-debug", "./views/top-bar-view-debug", "./views/message-view-debug", "./content/send-view-debug", "./content/rich-text-view-debug", "./content/face-expression-view-debug", "./views/app-debug", "./views/navi-view-debug", "./models/navi-model-debug", "./controls/topic-manager-debug", "./views/topic-view-debug", "./collections/topic-collection-debug", "./views/slide-view-debug", "./models/slide-model-debug", "localdb-debug" ], function(require, exports, module) {
    window.Backbone = require("backbone-debug");
    window._ = require("underscore-debug");
    // alert(require('./views/test'));
    //各个分类下轮播图的统计位
    var points = {
        "9999": {
            hotImg: [ 412309, 412310, 412311, 412312 ]
        },
        //最热门
        "10": {
            hotImg: [ 412313 ]
        },
        //找妹子
        "19": {
            hotImg: [ 412314 ]
        },
        //笑掉牙
        "1": {
            hotImg: [ 412315 ]
        },
        //星八卦
        "4": {
            hotImg: [ 412316 ]
        },
        //论古今
        "2": {
            hotImg: [ 412317 ]
        },
        //乐活族
        "15": {
            hotImg: [ 412318 ]
        },
        //体育粉
        "78": {
            hotImg: [ 412319 ]
        },
        //说军事
        "9": {
            hotImg: [ 412320 ]
        }
    };
    //埋点
    window.buriedPoint = function(point) {
        seajs.log("buriedPoint: " + point);
        try {
            wa_regIdCount(point);
        } catch (e) {
            seajs.log(e);
        }
    };
    /**
     * 需要转换的统计位
     * @param type 分类type
     * @param index 轮播图的index
     */
    window.transAndPoint = function(type, index) {
        var point = points[type].hotImg[index];
        buriedPoint(point);
    };
    //    require('lazyload');
    // setting routing rule
    var Workspace = require("./routers/router-debug");
    window.squareApp = new Workspace();
    Backbone.history.start();
});

/**
 * Created by wangyongchao on 2014/9/4.
 */
define("square/src/1.0.0/routers/router-debug", [ "square/src/1.0.0/common/util-debug", "square/src/1.0.0/common/phone-adapter-debug", "square/src/1.0.0/routers/subscribe-and-publish-debug", "square/src/1.0.0/views/topic-detail-view-debug", "square/src/1.0.0/models/topic-beside-model-debug", "square/src/1.0.0/models/topic-comment-model-debug", "square/src/1.0.0/content/rich-helper-debug", "square/src/1.0.0/templates/templates-module-debug", "square/src/1.0.0/collections/topic-comment-collection-debug", "square/src/1.0.0/views/topic-comment-view-debug", "square/src/1.0.0/views/report-topic-view-debug", "square/src/1.0.0/views/floater-view-debug", "square/src/1.0.0/collections/popup-collection-debug", "square/src/1.0.0/views/share-friend-view-debug", "square/src/1.0.0/views/content-view-debug", "square/src/1.0.0/models/page-model-debug", "iscroll-debug", "square/src/1.0.0/views/page-view-debug", "square/src/1.0.0/views/top-bar-view-debug", "square/src/1.0.0/views/message-view-debug", "square/src/1.0.0/content/send-view-debug", "square/src/1.0.0/content/rich-text-view-debug", "square/src/1.0.0/content/face-expression-view-debug", "square/src/1.0.0/views/app-debug", "square/src/1.0.0/views/navi-view-debug", "square/src/1.0.0/models/navi-model-debug", "square/src/1.0.0/controls/topic-manager-debug", "square/src/1.0.0/views/topic-view-debug", "square/src/1.0.0/collections/topic-collection-debug", "square/src/1.0.0/views/slide-view-debug", "square/src/1.0.0/models/slide-model-debug", "localdb-debug" ], function(require, exports, module) {
    var util = require("square/src/1.0.0/common/util-debug");
    var pubsub = require("square/src/1.0.0/routers/subscribe-and-publish-debug");
    var TopicDetailView = require("square/src/1.0.0/views/topic-detail-view-debug");
    var Page = require("square/src/1.0.0/views/page-view-debug");
    var adapter = require("square/src/1.0.0/common/phone-adapter-debug");
    var messageView = require("square/src/1.0.0/views/message-view-debug");
    var popupCollection = require("square/src/1.0.0/collections/popup-collection-debug");
    var Workspace = Backbone.Router.extend({
        routes: {
            "": "enterSquareMain",
            message: "enterMessage",
            "topicDetail/:type/:topicId": "enterTopicDetail"
        },
        squarePages: [],
        initialize: function() {
            _.bindAll(this, "back");
            window.squareMain = undefined;
            window.squareDetail = undefined;
            window.sendView = require("square/src/1.0.0/content/send-view-debug");
            if (location.search.indexOf("console") > -1) {
                console.log = function(msg) {
                    $("#test").append("<br/>" + msg);
                };
                var d = $('<div id="logContainer" style="left: 5px; top: 80px;z-index: 100005; height: 60%; width: 95%;border: 1px solid red; background-color: white;position: absolute;">');
                d.append('<div id="test" style="height: 100%; width: 100%; overflow: auto;">');
                d.append('<button id="logClear" style="position: absolute; top:5px; right: 5px;">clear</button>');
                $("#logClear").live("click", function() {
                    $("#test").html("");
                });
                $(document.body).append(d);
            }
            $("#appContainer").append($('<div id="mainPage" class="animate-page">'));
            $("#appContainer").append($('<div id="topicDetailContainer" style="display: none;" class="animate-page">'));
            $("#appContainer").append($('<div id="messageContainer" style="display: none;" class="animate-page">'));
            pubsub.subscribe("NAV_BACK", this.back);
            //注册回调函数给客户端调用
            adapter.registerCallback({
                back: function() {
                    pubsub.publish("NAV_BACK");
                }
            });
            $(window).resize(this.adjustFrame);
            //此处验证登录
            util.validateLogin();
            console.log("$('#appContainer') height:" + $("#appContainer").height());
        },
        /**
         * 内容广场首页
         */
        enterSquareMain: function() {
            var AppView = require("square/src/1.0.0/views/app-debug");
            window.squareMain = new AppView();
            var page = this.openPage({
                wrapper: $("#appContainer #mainPage"),
                topBar: {
                    title: "内容广场",
                    menuBtnType: 0,
                    menuCallback: function() {
                        squareApp.navigate("/message", {
                            trigger: true
                        });
                    }
                }
            });
            squareMain.page = page;
            squareMain.$el = page.contentWrapper;
            page.targetView = squareMain;
            squareMain.initDataFromServer();
            //注册回调函数给客户端调用
            adapter.registerCallback({
                message: function(data) {
                    console.log("received data :" + data);
                }
            });
        },
        /**
         * 话题详情页
         * @param type
         * @param topicId
         */
        enterTopicDetail: function(type, topicId) {
            type = +type;
            if (!squareDetail) {
                $("#appContainer #topicDetailContainer").append($('<div class="topic-detail-page">'));
                var detailPage = $("#appContainer #topicDetailContainer .topic-detail-page");
                //话题详情
                window.squareDetail = new TopicDetailView();
                var page = this.openPage({
                    wrapper: detailPage,
                    topBar: {
                        title: "话题详情",
                        //兼容q2封版的Android
                        menuBtnType: util.isNewVersion ? 2 : 0,
                        menuItems: [ {
                            value: "shareToFriend",
                            text: "分享到朋友圈"
                        }, {
                            value: "shareToGroup",
                            text: "分享到群动态"
                        }, {
                            value: "shareToMessage",
                            text: "分享到飞信消息"
                        }, {
                            value: "report",
                            text: "举报"
                        }, {
                            value: "cancel",
                            text: "取消"
                        } ]
                    }
                });
                squareDetail.page = page;
                page.targetView = squareDetail;
                squareDetail.$el = page.contentWrapper;
                if (util.isNewVersion) {
                    sendView.broadcastDiv = detailPage;
                    sendView.show();
                    sendView.registerEvents({
                        sendComment: squareDetail.sendComment
                    });
                }
            } else {
                this.openPage({
                    page: squareDetail.page
                });
            }
            //兼容q2版本Android的错误
            type = util.isNewVersion ? type : 1;
            squareDetail.show({
                type: type,
                topicId: topicId
            });
        },
        /**
         * 进入消息页
         */
        enterMessage: function() {
            console.log("message");
            $("#appContainer #messageContainer").append($('<div class="messagePage">'));
            var page = this.openPage({
                wrapper: $("#appContainer #messageContainer .messagePage"),
                topBar: {
                    title: "消息列表",
                    menuBtnType: 0,
                    menuCallback: function() {
                        return false;
                    }
                }
            });
            messageView.page = page;
            messageView.$el = page.contentWrapper;
            messageView.render();
        },
        adjustFrame: function() {
            console.log("router adjustFrame invoked~");
            if (squareApp.squarePages.length) {
                _.last(squareApp.squarePages).refresh();
            }
        },
        /**
         * 创建一个页面并显示
         * @param opts
         * @returns {Page}
         */
        openPage: function(opts) {
            if (this.squarePages.length) {
                var prevPage = _.last(this.squarePages);
                prevPage.hideToLeft();
            } else {
                adapter.hideWebTitle();
            }
            var page = opts.page ? opts.page : new Page({
                model: opts.model || {},
                wrapper: opts.wrapper,
                loadMoreCallback: opts.loadMoreCallback,
                topBar: opts.topBar || {}
            });
            this.squarePages.length ? page.showFromRight() : page.show();
            this.squarePages.push(page);
            page.locationHash = Backbone.history.fragment;
            return page;
        },
        /**
         * 返回操作
         */
        back: function() {
            if (popupCollection.length) {
                popupCollection.pop();
            } else {
                var page = this.squarePages.pop();
                if (this.squarePages.length) {
                    page.hideToRight();
                    page = _.last(this.squarePages);
                    page.showFromLeft();
                } else {
                    adapter.destroyWebview();
                }
                squareApp.navigate(page.locationHash, {
                    trigger: false
                });
            }
            return false;
        }
    });
    module.exports = Workspace;
});

/**
 * Created by wangyongchao on 2014/9/3.
 */
define("square/src/1.0.0/common/util-debug", [ "square/src/1.0.0/common/phone-adapter-debug" ], function(require, exports, module) {
    var urlPrev = "/group/beside/";
    var adapter = require("square/src/1.0.0/common/phone-adapter-debug");
    var Util = {
        /**
         * 话题类型
         */
        topicType: {
            group: 1,
            //聊吧
            page: 2
        },
        nativeVersion: 0,
        isNewVersion: false,
        /**
         * ajax请求必须带的参数
         * @param arg 方便以后扩展，目前没什么
         */
        getAjaxCommonParam: function(arg) {
            var param = {};
            return param;
        },
        /**
         * 获取server url
         * @param key
         * @param type 1:聊吧 2:小窗
         * @returns {string}
         */
        getUrl: function(key, type) {
            var url = "";
            switch (key) {
              case "transCkey":
                url = "";
                if (type) {
                    url = "http://192.168.251.19:8080";
                } else {
                    url = "http://221.176.31.206";
                }
                url += "/mbeside/person/convertckey";
                break;

              case "login":
                url = urlPrev + "toLogin";
                //异步登录
                break;

              case "loadCatalog":
                url = "getBesideTypes";
                //取分类
                break;

              case "hotImage":
                //该接口合并到了topTopic
                url = urlPrev + "getRegionImageByTypeId?typeId=9999";
                //分类取头图后台
                break;

              case "topTopic":
                url = urlPrev + "getBesideTopTopicListByType";
                //各分类置顶帖
                break;

              case "topicList":
                url = urlPrev + "getBesideTopicListByType";
                //列表接口
                break;

              case "shareTopic":
                url = urlPrev + "publishBesideFeed";
                //分享话题
                break;

              case "topicDetail":
                //话题详情
                url = urlPrev;
                if (type == Util.topicType.group) {
                    url += "getTopicDetail";
                } else if (type == Util.topicType.page) {
                    url += "getElementDetail";
                }
                break;

              case "reportTopic":
                //举报话题
                if (type == Util.topicType.group) {
                    url = "/report/reportGroup";
                } else if (type == Util.topicType.page) {
                    url = "/report/reportPage";
                }
                break;

              case "deleteTopic":
                //删除话题
                if (type == Util.topicType.group) {
                    url = "group/topic/deleteTopic?userId=200098670&topicId=148880&groupId=6739&feedId=z4izv3tgpiy57&hideFeedId=y4iz5zsgpiy57&isTop=0&isEssence=0";
                } else if (type == Util.topicType.page) {
                    url = "pages/detail/e_delete?ElementID=1322570983&feedid=53izz9qmijx57&pageid=16602&userid=200098670&UserFeedID=63izmeqmijx57";
                }
                break;

              case "topicComments":
                // 获取评论
                url = urlPrev;
                if (type == Util.topicType.group) {
                    url += "getTopicComment";
                } else if (type == Util.topicType.page) {
                    url += "fetchPageComment";
                }
                break;

              case "commentTopic":
                //添加评论
                if (type == Util.topicType.group) {
                    url = "/group/beside/publishReplyformobile";
                } else if (type == Util.topicType.page) {
                    url = urlPrev + "addElementComment";
                }
                break;

              case "deleteComment":
                //删除评论
                url = urlPrev;
                if (type == Util.topicType.group) {
                    url += "deleteTopicComment?Id=860309";
                } else if (type == Util.topicType.page) {
                    url += "deleteElementComment?ElementID=1322570977&commentId=778&CommentCount=100";
                }
                break;
            }
            return url;
        },
        intervalCounter: 0,
        filterHtmlString: function(content) {
            return content;
        },
        /**
         * 消息提示框
         * @param content 提示内容
         */
        toast: function(content) {
            var className = "toast-popup";
            var div = $("<div>");
            div.addClass(className).append($("<span>").text(content));
            $(document.body).append(div);
            div.fadeIn(800, function() {
                setTimeout(function() {
                    div.fadeOut(800, function() {
                        div.remove();
                    });
                }, 1500);
            });
        },
        /**
         * 举报话题
         * @param param
         * @param opts
         */
        reportTopic: function(param, opts) {
            opts = opts || {};
            $.ajax({
                url: Util.getUrl("reportTopic", opts.type),
                type: "post",
                data: param,
                dataType: "json"
            }).done(function() {
                console.log("success");
                Util.toast("举报成功");
                if (opts.done) {
                    opts.done();
                }
            }).fail(function() {
                console.log("fail");
                Util.toast("举报失败");
                if (opts.fail) {
                    opts.fail();
                }
            });
        },
        /**
         * 判断是否需要登录
         */
        validateLogin: function() {
            var isLogin = !!window.__islogin || !!window.__isLogin || (window.PROFILE_DATA ? !!window.PROFILE_DATA.profile : false);
            var version = window.__version || "3.2.0";
            var ckey = window.__ckey || "";
            console.log(ckey);
            version = +version.replace(/\./g, "");
            Util.nativeVersion = version;
            Util.isNewVersion = version > 320;
            if (!isLogin) {
                Util.transCkey(ckey);
            }
        },
        /**
         * 用户登录
         * @param m161key
         */
        phpLogin: function(m161key) {
            console.log("login invoked with ckey: " + m161key);
            var param = {
                c: m161key
            };
            $.ajax({
                type: "POST",
                url: Util.getUrl("login"),
                dataType: "json",
                data: param
            }).done(function(response) {
                if (!response) {
                    Util.toast("登录失败");
                }
                window.__islogin = response;
            });
        },
        /**
         * 转换m161域ckey
         */
        transCkey: function(ckey) {
            var resVersion = +window.__resourceVersion || 1;
            var callback = function(response) {
                if (response.status == 200) {
                    var m161key = encodeURIComponent(response.data[0].c);
                    m161key = m161key.substr(0, m161key.length - 3);
                    Util.phpLogin(m161key);
                } else {
                    if (Util.isNewVersion) {
                        Util.toast("登录失败");
                    }
                }
            };
            if (Util.isNewVersion) {
                Util.phpLogin(ckey);
            } else {
                $.ajax({
                    type: "POST",
                    url: Util.getUrl("transCkey", resVersion == 1) + "?ckey=" + ckey,
                    dataType: "jsonp",
                    success: callback
                });
            }
        }
    };
    module.exports = Util;
});

/**
 * Created by wangyongchao on 2014/9/1.
 */
define("square/src/1.0.0/common/phone-adapter-debug", [], function(require, exports, module) {
    window.JSCallbacker = {};
    var PhoneAdapter = {
        /**
         * 调用客户端方法
         * @param funcName
         * @param [arg]
         * @param [position]
         */
        callFunc: function(funcName, arg, position) {
            try {
                if ($.os.ios) {
                    var json = {
                        type: funcName,
                        param: arg,
                        position: position
                    };
                    window.location.href = encodeURI("square:" + JSON.stringify(json));
                } else {
                    console.log(funcName + " invoked");
                    arg = arg ? JSON.stringify(arg) : "";
                    var obj = window.AdapterObject;
                    switch (funcName) {
                      case "destroyWebview":
                        obj.destroyWebview();
                        break;

                      case "hideWebTitle":
                        obj.hideWebTitle();
                        break;

                      case "clearMessageState":
                        obj.clearMessageState();
                        break;

                      case "shareToGroup":
                        obj.shareToGroup(arg);
                        break;

                      case "shareToMessage":
                        obj.shareToMessage(arg);
                        break;

                      case "report":
                        obj.report(arg);
                        break;

                      case "viewAttachment":
                        obj.viewAttachment(arg, position);
                        break;

                      case "openUrl":
                        obj.openUrl(arg);
                        break;
                    }
                }
            } catch (e) {
                console.log(e);
            }
        },
        /**
         * 获取ckey
         */
        getCredential: function() {
            //            var data = PhoneAdapter.callFunc('getCredential');
            //            var ckey = data && data.ckey ? data.ckey : 'uidfidlogicpool=200307329=1050016788=6917';     //15801633194(amigo123)    33194旅途了
            return "dWlkZmlkbG9naWNwb29sPTIwMDMwNzMyOT0xMDUwMDE2Nzg4PTY5MTc=";
        },
        /**
         * 关闭webview
         */
        destroyWebview: function() {
            PhoneAdapter.callFunc("destroyWebview", "");
        },
        /**
         * 设置消息已读
         */
        clearMessageState: function() {
            PhoneAdapter.callFunc("clearMessageState", "");
        },
        /**
         * 隐藏标题栏
         */
        hideWebTitle: function() {
            PhoneAdapter.callFunc("hideWebTitle", "");
        },
        /**
         * 分享到群动态
         * @param arg {object}
         */
        shareToGroup: function(arg) {
            PhoneAdapter.callFunc("shareToGroup", arg);
        },
        /**
         * 分享到飞信消息
         * @param arg {object}
         */
        shareToMessage: function(arg) {
            PhoneAdapter.callFunc("shareToMessage", arg);
        },
        /**
         * 举报话题
         * @param arg {object}
         */
        report: function(arg) {
            PhoneAdapter.callFunc("report", arg);
        },
        /**
         * 举报话题
         * @param arg {object}
         */
        openUrl: function(arg) {
            PhoneAdapter.callFunc("openUrl", arg);
        },
        /**
         * 举报话题
         * @param arg {object}
         * @param position {int}
         */
        viewAttachment: function(arg, position) {
            PhoneAdapter.callFunc("viewAttachment", arg, position);
        },
        /**
         * 接收到消息回调
         * @param callback {object} e.g.{key1: function(){}, key2: function(){}}
         */
        registerCallback: function(callback) {
            console.log("registerCallback invoked");
            $.extend(JSCallbacker, callback);
        }
    };
    module.exports = PhoneAdapter;
});

define("square/src/1.0.0/routers/subscribe-and-publish-debug", [], function(require, exports, module) {
    var subscribeAndPublishDefaultCenter = {};
    //
    (function(q) {
        var services = {}, subuid = -1;
        // 推送事件消息
        q.publish = function(service, args) {
            if (!services[service]) {
                return false;
            }
            setTimeout(function() {
                var subscribers = services[service];
                var len = subscribers ? subscribers.length : 0;
                while (len--) {
                    subscribers[len].func(service, args);
                }
            }, 0);
        };
        // 监听事件
        q.subscribe = function(service, func) {
            if (!services[service]) {
                services[service] = [];
            }
            var token = (++subuid).toString();
            services[service].push({
                token: token,
                func: func
            });
            return token;
        };
        q.subscribeOnce = function(service, func) {
            if (!services[service]) {
                services[service] = [];
            }
            var token = (++subuid).toString();
            services[service][0] = {
                token: token,
                func: func
            };
            return token;
        };
        // 解除事件监听
        q.unsubscribe = function(token) {
            for (var m in services) {
                if (services[m]) {
                    for (var i = 0, j = services[m].length; i < j; i++) {
                        if (services[m][i].token === token) {
                            services[m].splice(i, 1);
                            return token;
                        }
                    }
                }
            }
            return false;
        };
    })(subscribeAndPublishDefaultCenter);
    module.exports = subscribeAndPublishDefaultCenter;
});

/**
 * Created by wangyongchao on 2014/9/2.
 */
define("square/src/1.0.0/views/topic-detail-view-debug", [ "square/src/1.0.0/models/topic-beside-model-debug", "square/src/1.0.0/models/topic-comment-model-debug", "square/src/1.0.0/content/rich-helper-debug", "square/src/1.0.0/templates/templates-module-debug", "square/src/1.0.0/routers/subscribe-and-publish-debug", "square/src/1.0.0/common/phone-adapter-debug", "square/src/1.0.0/common/util-debug", "square/src/1.0.0/collections/topic-comment-collection-debug", "square/src/1.0.0/views/topic-comment-view-debug", "square/src/1.0.0/views/report-topic-view-debug", "square/src/1.0.0/views/floater-view-debug", "square/src/1.0.0/collections/popup-collection-debug", "square/src/1.0.0/views/share-friend-view-debug", "square/src/1.0.0/views/content-view-debug", "square/src/1.0.0/models/page-model-debug", "iscroll-debug" ], function(require, exports, module) {
    var TopicModel = require("square/src/1.0.0/models/topic-beside-model-debug");
    var TopicCommentModel = require("square/src/1.0.0/models/topic-comment-model-debug");
    var Templates = require("square/src/1.0.0/templates/templates-module-debug");
    var pubsub = require("square/src/1.0.0/routers/subscribe-and-publish-debug");
    var adapter = require("square/src/1.0.0/common/phone-adapter-debug");
    var util = require("square/src/1.0.0/common/util-debug");
    var TopicCommentCollection = require("square/src/1.0.0/collections/topic-comment-collection-debug");
    var TopicCommentView = require("square/src/1.0.0/views/topic-comment-view-debug");
    var shareFriendView = require("square/src/1.0.0/views/share-friend-view-debug");
    var reportTopicVIew = require("square/src/1.0.0/views/report-topic-view-debug");
    var ContentView = require("square/src/1.0.0/views/content-view-debug");
    var TopicDetailView = Backbone.View.extend({
        templateId: "topicDetailTpl",
        subscribeTokens: [],
        commentContainer: null,
        initialized: false,
        events: {
            "tap .imglist img": "viewImage",
            //            'complete .imglist img': 'refreshSize'
            "tap .bottom-comment-default": "showCommentView"
        },
        initialize: function() {
            _.bindAll(this, "addOneComment", "loadMore", "sendComment");
            this.model = new TopicModel();
            this.listenTo(this.model, "change", function() {
                this.commentList = null;
                this.render();
            });
        },
        render: function() {
            // var foo=Templates[this.templateId].call(_, this.model.attributes);
            // this.wrapper.html(Templates[this.templateId].call(_, this.model.attributes));
            var $detail = $(Templates[this.templateId].call(_, this.model.attributes));
            this.wrapper.empty().append($detail.filter(".post"), $detail.filter(".comment-container"));
            // 添加评论框
            if (this.$el.next(".bottom-comment-default").length === 0) {
                this.$el.append($detail.filter(".bottom-comment-default"));
            }
            if (!this.initialized) {
                this.bindTopMenu();
                this.contentView.init();
                this.initialized = true;
            }
            this.getComments();
            this.$(".imglist img").each(function(i, img) {
                img.onload = function() {
                    $(window).resize();
                    console.log("topicDetail img load completed~");
                };
                $(img).attr("src", $(img).attr("data-url")).get(0);
            });
            this.delegateEvents();
            this.refresh();
        },
        show: function(args) {
            if (!this.initialized) {
                var content = new ContentView({
                    wrapper: this.$el,
                    loadMoreCallback: this.loadMore,
                    isOldDetail: !util.isNewVersion
                });
                this.wrapper = content.contentWrapper;
                this.contentView = content;
            }
            sendView.reset();
            this.loadDetail(args.type, args.topicId);
        },
        refresh: function() {
            //            if (util.isNewVersion) {
            //                this.page.minusHeight(sendView.$('.bottom-comment').height());
            //            }
            this.contentView.adjustFrame();
        },
        /**
         * 绑定顶部菜单事件
         */
        bindTopMenu: function() {
            var self = this;
            var menuItems = this.page.options.topBar.menuItems;
            _.each(menuItems, function(item) {
                var token = pubsub.subscribe("topBar_" + item.value, function() {
                    self[item.value].call(self);
                });
                self.subscribeTokens.push(token);
            });
        },
        shareToFriend: function() {
            console.log("shareToFriend");
            shareFriendView.model.set(this.model.attributes);
            if (shareFriendView.$el.is(":hidden")) {
                shareFriendView.render();
            }
        },
        shareToGroup: function() {
            adapter.shareToGroup(this.model.attributes);
            console.log("shareToGroup");
        },
        shareToMessage: function() {
            adapter.shareToMessage(this.model.attributes);
            console.log("shareToMessage");
        },
        viewImage: function(e) {
            var target = $(e.target);
            target = target.is("img") ? target.parent() : target;
            console.log("position: " + target.index());
            adapter.viewAttachment(this.model.attributes, target.index());
            console.log("viewImage");
        },
        report: function() {
            var self = this;
            reportTopicVIew.show();
            reportTopicVIew.reportOK = function(reportData) {
                var param = {
                    type: reportData.type,
                    //举报类型 同同窗其他所有投诉
                    reason: reportData.reason,
                    //举报留言
                    elementId: self.model.get("id")
                };
                if (self.model.get("type") == util.topicType.group) {
                    param.elementType = 6;
                }
                var opts = {
                    type: self.model.get("type"),
                    done: function() {
                        reportData.callback();
                    }
                };
                util.reportTopic(param, opts);
            };
        },
        cancel: function() {
            console.log("cancel");
        },
        /**
         * 获取详情
         * @param type
         * @param topicId
         * @param [opts]
         */
        loadDetail: function(type, topicId, opts) {
            opts = opts || {};
            var self = this;
            var topicModel;
            if (!opts.refresh && squareMain) {
                topicModel = squareMain.currentTopicManager.collection.findWhere({
                    type: type,
                    id: topicId
                });
                if (topicModel) {
                    self.model.set(topicModel.attributes);
                    self.refresh();
                    self.contentView.resetScrollPos({
                        x: 0,
                        y: 0
                    });
                    return;
                }
            }
            //如果没有找到对应的model则从server获取
            if (!topicModel) {
                var param = {
                    type: 0,
                    //这个type不是指小窗或者聊吧，这个传0是为了增加一个浏览数
                    topicId: topicId
                };
                $.extend(param, util.getAjaxCommonParam());
                $.ajax({
                    url: util.getUrl("topicDetail", type),
                    type: "POST",
                    dataType: "json",
                    data: param
                }).done(function(response) {
                    //测试用的高圆圆图片
                    //                    response.PicUrl = 'http://i-imgp.fetionpic.com/fphoto/photo2/M00/71/BD/rBUyL1QWUwOm0ihQAApS4DbshCk341.jpg\u0001http://i-imgp.fetionpic.com/fphoto/photo2/M00/71/BD/rBUyLlQWUwSo7TdtAAi8xae4qgs426.jpg\u0001http://i-imgp.fetionpic.com/fphoto/photo2/M00/71/BD/rBUyL1QWUwT5BtfvAAkolN6aBOc423.jpg\u0001http://i-imgp.fetionpic.com/fphoto/photo2/M00/71/BD/rBUyLlQWUwSxpPqhAAoEOndnR5g177.jpg\u0001http://i-imgp.fetionpic.com/fphoto/spimg1/M00/00/00/rBUyOlQWUwSHkTydAAoa54sBXx0530.jpg';
                    var tmp = self.model.parseData(response);
                    tmp.type = type;
                    self.model.set(tmp);
                    if (opts.callback) {
                        opts.callback();
                    }
                }).fail(function() {
                    console.log("error");
                    util.toast("加载失败");
                });
            }
        },
        /**
         * 获取评论
         */
        getComments: function() {
            var comments = this.commentList;
            if (!comments) {
                var opts = {};
                opts.type = this.model.get("type");
                opts.topicId = this.model.get("id");
                opts.feedId = this.model.get("feedId");
                comments = new TopicCommentCollection([], opts);
                this.listenTo(comments, "reset", this.addAllComment);
                this.listenTo(comments, "add", this.addOneComment);
                this.listenTo(comments, "remove", this.removeComment);
                this.commentList = comments;
            }
            this.commentContainer = this.$(".comment-container");
            comments.initData();
        },
        sendComment: function(data) {
            util.toast("正在发送");
            if (this.loading) {
                return;
            }
            this.loading = true;
            var self = this;
            console.log(data.content);
            var type = +this.model.get("type");
            var param;
            switch (type) {
              case util.topicType.group:
                param = {
                    groupId: this.model.get("groupId"),
                    topicId: this.model.get("id"),
                    topicUserId: PROFILE_DATA.profile.userId,
                    isToFeed: data.isToFeed,
                    feedId: this.model.get("feedId"),
                    content: data.content
                };
                break;

              case util.topicType.page:
                param = {
                    elementID: this.model.get("id"),
                    total: 3,
                    content: data.content,
                    isToFeed: data.isToFeed
                };
                break;
            }
            $.ajax({
                url: util.getUrl("commentTopic", type),
                type: "post",
                data: param,
                dataType: "json"
            }).done(function(response) {
                if (response.status) {
                    console.log("success");
                    util.toast("评论成功");
                    sendView.hideFloater();
                    // 隐藏评论框
                    self.commentSuccess(response);
                } else {
                    console.log("fail");
                    util.toast("评论失败");
                }
            }).fail(function() {
                console.log("fail");
                util.toast("评论失败");
            }).always(function() {
                self.loading = false;
            });
        },
        /**
         * 评论成功之后的回调
         * @param response
         */
        commentSuccess: function(response) {
            var model = new TopicCommentModel();
            var tmp = {
                Id: response.replyId,
                CreatedDateTime: response.CreateDateTime,
                TopicId: response.TopicID,
                Content: response.Data.Content,
                UserId: response.UserInfo.userId,
                nickname: response.UserInfo.nickname,
                portrait: response.UserInfo.portraitTiny
            };
            tmp = model.parseData(tmp);
            tmp.isNewVersion = util.isNewVersion;
            model.set(tmp);
            this.commentList.add(model);
            $(window).resize();
        },
        /**
         * 获取评论
         */
        loadMore: function(param) {
            console.log("刷新回调:" + param.loadType);
            var opts = {
                callback: param.complete
            };
            if (param.loadType) {
                this.commentList.getMoreData(opts);
            } else {
                opts.refresh = true;
                this.loadDetail(this.model.get("type"), this.model.get("id"), opts);
            }
        },
        addAllComment: function() {
            this.commentList.each(this.addOneComment);
            $(window).resize();
        },
        addOneComment: function(model) {
            var commentView = new TopicCommentView({
                model: model
            });
            this.commentContainer.append(commentView.render());
        },
        removeComment: function() {
            console.log("删除评论~");
        },
        /// 显示评论界面
        showCommentView: function() {
            window.sendView.showBottomComment();
        }
    });
    module.exports = TopicDetailView;
});

/**
 * Created by wangyongchao on 2014/9/2.
 */
define("square/src/1.0.0/models/topic-beside-model-debug", [], function(require, exports, module) {
    var TopicModel = Backbone.Model.extend({
        defaults: {
            id: 0,
            //话题id
            userid: 0,
            //
            groupId: 0,
            //小窗的PageID 聊吧的GroupID
            title: "正在加载",
            //标题
            content: "正在加载",
            //内容
            portraituri: "",
            //图片
            browsers: 0,
            //阅读数
            comments: 0,
            //回复数
            time: 0,
            //时间
            markerid: 0,
            //markerid     聊吧
            ishot: 0,
            //热门           聊吧
            vest: 0,
            //马甲发布         聊吧
            sGroupId: 0,
            //聊吧:sGroupId || 小窗:ElementType
            type: 0,
            //话题类型1：聊吧， 2：小窗
            feedId: 0,
            userFeedId: 0,
            //              小窗
            videos: [],
            images: [],
            voices: [],
            //扩展属性
            typeId: 0,
            //话题所属分类
            timeStr: "",
            //时间字符串
            errorImage: __resourceDomain + "/img/app/webunite/squareapp/XM_topic_icon.png",
            //没有图片的时候
            subContent: "",
            page: ""
        },
        parseData: function(data) {
            var tmp = {
                //  属性            聊吧                    小窗                 默认
                id: data.Id || data.ElementID || 0,
                userid: data.UserId || 0,
                groupId: data.GroupId || data.PageID || 0,
                page: data.GroupId || data.PageID || 0,
                content: data.Content || data.TextContent || "",
                portraituri: "",
                title: data.Title || "",
                browsers: data.ReadCount || 0,
                comments: data.ReplyCount || data.CommantCount || 0,
                time: Date.parse(data.CreatedDateTime) || 0,
                markerid: data.markerid || 0,
                //聊吧
                ishot: data.sIsHot || 0,
                //聊吧
                vest: data.sIsVerst || 0,
                //聊吧
                sGroupId: data.sGroupId || data.ElementType || 0,
                type: data.DataType || 0,
                feedId: data.FeedID || data.FeedId || 0,
                userFeedId: data.UserFeedID || 0,
                //小窗
                attachment: data.attachment || [],
                images: [],
                videos: [],
                audios: [],
                timeStr: data.CreatedDateTime || "",
                subContent: ""
            };
            //tmp.subContent = tmp.content.substr(0, 50);
            //话题详情页图文混排 by@Tff
            tmp.subContent = tmp.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, "").substr(0, 50);
            //转化图片
            data.hasOwnProperty("PicUrl") && data.PicUrl.length && !data.attachment.length ? this.parsePicUrl(tmp, data.PicUrl) : this.parseAttachment(tmp, data.attachment || []);
            tmp.portraituri = tmp.images.length ? tmp.images[0].thumburi_s : this.get("errorImage");
            return tmp;
        },
        /**
         * 转化聊吧的图片
         * @param object
         * @param picStr
         */
        parsePicUrl: function(object, picStr) {
            var pics = picStr.split("");
            for (var i in pics) {
                object.images.push({
                    thumburi_s: pics[i],
                    thumburi_m: pics[i],
                    datauri: pics[i],
                    type: 1
                });
            }
        },
        /**
         * 转化小窗的附件
         * @param object
         * @param attachment
         */
        parseAttachment: function(object, attachment) {
            for (var i in attachment) {
                var obj = {
                    datauri: "视频的URI",
                    thumburi_s: "较小尺寸缩略图URI",
                    thumburi_m: "较大尺寸缩略图URI",
                    type: 2
                };
                var tmp = attachment[i].thumburi.split(",");
                obj.thumburi_s = tmp[0];
                obj.thumburi_m = tmp[1];
                obj.datauri = attachment[i].datauri || tmp[1];
                obj.type = attachment[i].type;
                switch (+attachment[i].type) {
                  case 1:
                    object.images.push(obj);
                    break;

                  case 2:
                    object.videos.push(obj);
                    break;

                  case 3:
                    object.voices.push(obj);
                    break;
                }
            }
        }
    });
    module.exports = TopicModel;
});

/**
 * Created by wangyongchao on 2014/9/2.
 */
define("square/src/1.0.0/models/topic-comment-model-debug", [ "square/src/1.0.0/content/rich-helper-debug" ], function(require, exports, module) {
    var richHelper = require("square/src/1.0.0/content/rich-helper-debug");
    var TopicCommentModel = Backbone.Model.extend({
        idAttribute: "commentId",
        defaults: {
            commentId: "",
            content: "",
            downCount: 0,
            feedId: "",
            id: 0,
            isWhisper: 0,
            ownerId: 0,
            parentCommentId: 0,
            parentId: 0,
            poiId: 0,
            publishTime: "",
            screenName: "",
            sourceId: 0,
            upCount: 0,
            userId: 0,
            userName: "",
            userPortrait: "",
            userUrl: "",
            //
            timeStr: ""
        },
        parseData: function(data) {
            var tmp = {
                commentId: data.commentId || data.Id || "",
                content: data.content || data.Content || "",
                feedId: data.feedId || "",
                id: data.id || 0,
                ownerId: data.ownerId || 0,
                parentCommentId: data.parentCommentId || 0,
                parentId: data.parentId || 0,
                publishTime: data.publishTime || "",
                nickName: data.screenName || data.nickname ? data.screenName || data.nickname : data.userName || "",
                userId: data.userId || 0,
                userPortrait: __resourceDomain + (data.userPortrait || data.portrait || ""),
                timeStr: data.CreatedDateTime || ""
            };
            tmp.content = richHelper.filterContentExpression(tmp.content);
            return tmp;
        }
    });
    module.exports = TopicCommentModel;
});

define("square/src/1.0.0/content/rich-helper-debug", [], function(require, exports, module) {
    var helper = {
        /**
         * 过滤回车换行
         * @param contentString
         * @returns {*|XML|string|void}
         */
        filterEnter: function(contentString) {
            if (!contentString) return "";
            return contentString.replace(/\n/g, "<br/>");
        },
        /**
         * 过滤表情
         * @param contentString
         * @returns {*}
         */
        filterContentExpression: function(contentString) {
            var png = true;
            if (!contentString) return "";
            //替换换行符
            contentString = helper.filterEnter(contentString);
            var path = __resourceDomain + "/img/app/webunite/phiz/";
            path += png ? "new_expression/" : "layer/";
            //在定义时同时赋值
            var suffix = png ? ".png" : ".gif";
            var arr = {
                "[/微笑]": "1" + suffix,
                "[/大笑]": "2" + suffix,
                "[/眨眼]": "3" + suffix,
                "[/桃心]": "4" + suffix,
                "[/害羞]": "5" + suffix,
                "[/惊讶]": "6" + suffix,
                "[/疑问]": "7" + suffix,
                "[/天真]": "8" + suffix,
                "[/鬼脸]": "9" + suffix,
                "[/囧]": "10" + suffix,
                "[/悲伤]": "11" + suffix,
                "[/白眼]": "12" + suffix,
                "[/坏笑]": "13" + suffix,
                "[/流泪]": "14" + suffix,
                "[/拍砖]": "15" + suffix,
                "[/尴尬]": "16" + suffix,
                "[/鄙视]": "17" + suffix,
                "[/给力]": "18" + suffix,
                "[/挖鼻孔]": "19" + suffix,
                "[/晕]": "20" + suffix,
                "[/切]": "21" + suffix,
                "[/睡觉]": "22" + suffix,
                "[/鼓掌]": "23" + suffix,
                "[/嘘]": "24" + suffix,
                "[/痛恨]": "25" + suffix,
                "[/忐忑]": "26" + suffix,
                "[/失望]": "27" + suffix,
                "[/困惑]": "28" + suffix,
                "[/担心]": "29" + suffix,
                "[/纠结]": "30" + suffix,
                "[/思考]": "31" + suffix,
                "[/窃喜]": "32" + suffix,
                "[/得意]": "33" + suffix,
                "[/呆子]": "34" + suffix,
                "[/闭嘴]": "35" + suffix,
                "[/汗]": "36" + suffix,
                "[/吐]": "37" + suffix,
                "[/惊恐]": "38" + suffix,
                "[/亲亲]": "39" + suffix,
                "[/胜利]": "40" + suffix,
                "[/痛扁]": "41" + suffix,
                "[/吃饭]": "42" + suffix,
                "[/赞]": "43" + suffix,
                "[/喷血]": "44" + suffix,
                "[/再见]": "45" + suffix,
                "[/生病]": "46" + suffix,
                "[/拥抱]": "47" + suffix,
                "[/无聊]": "48" + suffix,
                "[/灵感]": "49" + suffix,
                "[/赞同]": "50" + suffix,
                "[/愤怒]": "51" + suffix,
                "[/抓狂]": "52" + suffix,
                "[/爱心]": "53" + suffix,
                "[/心碎]": "54" + suffix,
                "[/菜刀]": "55" + suffix,
                "[/OK]": "56" + suffix,
                "[/强]": "57" + suffix,
                "[/弱]": "58" + suffix,
                "[/便便]": "59" + suffix,
                "[/礼物]": "60" + suffix,
                "[/蛋糕]": "61" + suffix,
                "[/钱]": "62" + suffix,
                "[/天使]": "63" + suffix,
                "[/恶魔]": "64" + suffix,
                "[/示爱]": "new_expression_frame_048.png",
                "[/玫瑰]": "new_expression_frame_054.png",
                "[/凋谢]": "new_expression_frame_055.png",
                "[/猪头]": "new_expression_frame_056.png",
                "[/咖啡]": "new_expression_frame_062.png",
                "[/Hold]": "new_expression_frame_070.png",
                "[/足球]": "new_expression_frame_071.png",
                "[/看电视]": "new_expression_frame_072.png",
                "[/棒棒糖]": "new_expression_frame_073.png",
                "[/萌猫]": "new_expression_frame_074.png",
                "[/顶]": "new_expression_frame_075.png",
                "[/骷髅]": "new_expression_frame_076.png"
            };
            var title_arr = {
                "[/微笑]": "微笑",
                "[/大笑]": "大笑",
                "[/眨眼]": "眨眼",
                "[/桃心]": "桃心",
                "[/害羞]": "害羞",
                "[/惊讶]": "惊讶",
                "[/疑问]": "疑问",
                "[/天真]": "天真",
                "[/鬼脸]": "鬼脸",
                "[/悲伤]": "悲伤",
                "[/白眼]": "白眼",
                "[/坏笑]": "坏笑",
                "[/流泪]": "流泪",
                "[/尴尬]": "尴尬",
                "[/鄙视]": "鄙视",
                "[/给力]": "给力",
                "[/挖鼻孔]": "挖鼻孔",
                "[/晕]": "晕",
                "[/切]": "切",
                "[/睡觉]": "睡觉",
                "[/鼓掌]": "鼓掌",
                "[/嘘]": "嘘",
                "[/痛恨]": "痛恨",
                "[/忐忑]": "忐忑",
                "[/失望]": "失望",
                "[/困惑]": "困惑",
                "[/担心]": "担心",
                "[/纠结]": "纠结",
                "[/思考]": "思考",
                "[/窃喜]": "窃喜",
                "[/得意]": "得意",
                "[/呆子]": "呆子",
                "[/闭嘴]": "闭嘴",
                "[/汗]": "汗",
                "[/吐]": "吐",
                "[/惊恐]": "惊恐",
                "[/亲亲]": "亲亲",
                "[/胜利]": "胜利",
                "[/痛扁]": "痛扁",
                "[/吃饭]": "吃饭",
                "[/赞]": "赞",
                "[/喷血]": "喷血",
                "[/再见]": "再见",
                "[/生病]": "生病",
                "[/拥抱]": "拥抱",
                "[/无聊]": "无聊",
                "[/灵感]": "灵感",
                "[/示爱]": "示爱",
                "[/赞同]": "赞同",
                "[/愤怒]": "愤怒",
                "[/抓狂]": "抓狂",
                "[/爱心]": "爱心",
                "[/心碎]": "心碎",
                "[/玫瑰]": "玫瑰",
                "[/凋谢]": "凋谢",
                "[/猪头]": "猪头",
                "[/菜刀]": "菜刀",
                "[/OK]": "OK",
                "[/强]": "强",
                "[/弱]": "弱",
                "[/便便]": "便便",
                "[/咖啡]": "咖啡",
                "[/礼物]": "礼物",
                "[/蛋糕]": "蛋糕",
                "[/钱]": "钱",
                "[/囧]": "囧",
                "[/顶]": "顶",
                "[/天使]": "天使",
                "[/恶魔]": "恶魔",
                "[/拍砖]": "拍砖",
                "[/足球]": "足球",
                "[/萌猫]": "萌猫",
                "[/骷髅]": "骷髅",
                "[/Hold]": "Hold",
                "[/看电视]": "看电视",
                "[/棒棒糖]": "棒棒糖"
            };
            var reg = /\[\/[\u4e00-\u9fa5]{1,4}]|\[\/Hold]|\[\/OK]/gim;
            var arrMatches = contentString.match(reg);
            if (arrMatches) {
                for (var i = 0; i < arrMatches.length; i++) {
                    if (arr[arrMatches[i]]) {
                        contentString = contentString.replace(arrMatches[i], '<img title="' + title_arr[arrMatches[i]] + '" src="' + path + arr[arrMatches[i]] + '"  class="face-size" />');
                    }
                }
            }
            return contentString;
        }
    };
    module.exports = helper;
});

/*
    How to use
    ////////////////////////////////////////
    var Templates = require('Templates');
    Templates['group/vessel'].call(_, {name: 'moe'}));
    */
define("square/src/1.0.0/templates/templates-module-debug", [], function(require, exports, module) {
    var tmplStr = require("square/src/1.0.0/templates/templates-debug.html");
    _.templateSettings = {
        interpolate: /\{\{=(.+?)\}\}/g,
        evaluate: /\{\{(.+?)\}\}/g
    };
    var Templates = {
        registerTemplate: function(name, templateFunc, setting) {
            // invoke _.template() here
            this[name] = _.template(templateFunc());
        }
    };
    // // register all the template here
    (function(TM) {
        // Template "test/test"
        TM.registerTemplate("test/test", function() {
            return "hello: {{= name }}";
        });
        TM.registerTemplate("nav/item", function() {
            var strHtml = "{{= linkAddress}}";
            return strHtml;
        });
        var tmpls = $("<div>").html(tmplStr).children();
        tmpls.each(function() {
            var $el = $(this);
            TM.registerTemplate(this.id, function() {
                return $el.html();
            });
        });
    })(Templates);
    module.exports = Templates;
});

define("square/src/1.0.0/templates/templates-debug.html", [], '<!-- topbar -->\n<script type="text/template" id="topBarTpl">\n    <span class="h_left"></span>\n    <h2 class="title">{{=title}}</h2>\n    <div class="h_right">\n        {{ if(menuBtnType){ }}\n        <span class="menu_btn {{=menuClass}}"></span>\n        {{ if(menuItems && menuItems.length){ }}\n        <div class="top_menu">\n            <ul>\n                {{ for(var i=0; i < menuItems.length; i++){ }}\n                <li data-action="{{=menuItems[i].value}}">\n                    <span class="react">{{=menuItems[i].text}}</span>\n                </li>\n                {{ } }}\n            </ul>\n        </div>\n        {{ } }}\n        {{ } }}\n    </div>\n</script>\n\n<!-- 消息 -->\n<script type="text/template" id="messageTpl">\n    <section class="msg-list">\n        <article class="msg">\n            <img class="head" src="" alt="">\n            <div class="info">\n                <span class="name">马达加斯加</span>\n                <span class="time">15分钟前</span>\n                <p class="re-text">好啊。。那就。。。那就那就那就那就那就那就那就那就那就</p>\n                <p class="topic-text">我的话题：哦哦哦哦哦哦哦。。哦哦哦哦哦哦哦。。哦哦哦哦哦哦哦</p>\n            </div>\n        </article>\n    </section>\n</script>\n\n<!-- 页面框架 -->\n<script type="text/template" id="pageTpl">\n    <header class="page-header"></header>\n    <section class="content-container"></section>\n    <div class="nav_bar"></div>\n</script>\n<!-- 下拉刷新 -->\n<script type="text/template" id="contentTpl">\n    <div class="wrapper">\n        <div class="scroller">\n            <div class="load_top load_more">\n                <div id="load_top" class="touch">\n                    <i></i>\n                    <span class="touch_text">下拉刷新</span>\n                    <span class="start_text">松手刷新</span>\n                    <span class="loading_text">正在加载</span>\n                    <br>\n                    <!--<span class="last_refresh_time">上次更新于2014-9-2 18:45:36</span>-->\n                </div>\n            </div>\n            <div class="content_wrapper">\n            </div>\n            <div class="load_bottom load_more">\n                <div id="load_bottom" class="touch">\n                    <i></i>\n                    <span class="touch_text">上拉加载更多</span>\n                    <span class="start_text">松手加载更多</span>\n                    <span class="loading_text">正在加载</span>\n                </div>\n            </div>\n        </div>\n    </div>\n</script>\n\n<!-- 话题详情 -->\n<script type="text/template" id="topicDetailTpl">\n    <section class="post">\n        <h3 class="title">{{=title}}</h3>\n        <pre class="content">{{=content}}</pre>\n    </section>\n    <section class="comment-container">\n        <div class="cut">\n            <span class="text">大家都在说({{=comments}})</span>\n            <div class="line"></div>\n        </div>\n    </section>\n    <div class="bottom-comment-default active">\n        <div class="btn-comment-box">说点什么吧...</div>\n    </div>\n</script>\n\n<!-- 话题评论 -->\n<script type="text/template" id="topicCommentTpl">\n    <img class="head" src="{{=userPortrait}}" alt="">\n    <div class="info">\n        <span class="name">{{=nickName}}</span>\n        <span class="time">{{=timeStr}}</span>\n\n        <div class="content">\n            {{ if(isNewVersion && false){ }}\n            <div class="re">\n                <span class="show_more">···</span>\n\n                <div class="menu">\n                    <ul>\n                        <li class="report">举报</li>\n                    </ul>\n                </div>\n            </div>\n            {{ } }}\n            <div class="content-c">\n                <p class="text">{{=content}}</p>\n            </div>\n        </div>\n        <!--<div class="location">-->\n        <!--在 东极岛-->\n        <!--</div>-->\n    </div>\n</script>\n\n<!-- 分类目录 -->\n<script type="text/template" id="navTpl">\n    <div class="catalog_bar">\n        <ul class="catalog">\n            {{ for(var i=0; i < items.length; i++){ }}\n            <li class="{{ if(i==0){ }}active{{ } }}" data-id="{{=items[i].id}}" data-type="{{=items[i].Type}}"><span>{{=items[i].TypeName}}</span>\n            </li>\n            {{ } }}\n        </ul>\n    </div>\n</script>\n\n<!-- 滑动切换 -->\n<script type="text/template" id="slideTpl">\n    <div class="viewport">\n        <div class="imageWrapper">\n            <div class="imageScroller">\n                {{ for(var i=0; i < items.length; i++){ }}\n                <div class="slide">\n                    <img src="{{=items[i].img}}">\n\n                    <div class="content">\n                        {{=items[i].title}}\n                    </div>\n                </div>\n                {{ } }}\n            </div>\n        </div>\n    </div>\n    {{ if(items.length > 1) { }}\n    <div class="indicator">\n        <div class="dotty"></div>\n        <ul class="ind_ul">\n            <li></li>\n            <li></li>\n            <li></li>\n            <li></li>\n        </ul>\n    </div>\n    {{ } }}\n</script>\n\n<!-- 分类下的内容 -->\n<script type="text/template" id="tabContentTpl">\n    <section class="slider"></section>\n    <section class="topic_container"></section>\n</script>\n\n<!-- 列表项 -->\n<script type="text/template" id="topicTpl">\n    <img alt="" src="{{=portraituri}}">\n    <h3 class="title">{{=title}}</h3>\n    <p>{{=subContent}}</p>\n    <!--<span class="time">{{=timeStr}}</span>-->\n    <div class="info">\n        <span class="read">{{=browsers}}</span>\n        <span class="comm">{{=comments}}</span>\n    </div>\n</script>\n\n<!-- 评论 -->\n<script type="text/template" id="commentTpl">\n    <header class="cp-hd">\n        <button class="btn-close"></button>\n        评论\n        <button class="btn-pub">发布</button>\n    </header>\n    <section class="cp-content">\n        <textarea></textarea>\n    </section>\n    <footer class="cp-ft">\n        <div class="share">\n            分享到朋友圈\n        </div>\n        <div class="btn-wrap">\n            <button class="btn-pic"></button>\n            <button class="btn-exp"></button>\n        </div>\n    </footer>\n</script>\n\n<!-- 分享 -->\n<script type="text/template" id="shareTopicTpl">\n    <div class="sp_wrap">\n        <section class="sp_content">\n            <div class="content_wrap">\n                <img class="logo" src="{{=portraituri}}" alt="">\n                <h4 class="title">{{=title}}</h4>\n\n                <p class="text">{{=subContent}}</p>\n            </div>\n            <div class="comment_wrap">\n                <textarea id="shareContent" placeholder="说点什么..."></textarea>\n            </div>\n        </section>\n        <footer class="sp_ft">\n            <span class="btn_cancel">取消</span>\n            <span class="btn_sent">发送</span>\n        </footer>\n    </div>\n</script>\n\n<!--举报-->\n<script type="text/template" id="reportTopicTpl">\n    <div class="sp_wrap">\n        <section class="sp_content">\n            <div class="content_wrap">\n                <div class="extend-text">举报理由:</div>\n                <div class="reason-table">\n                    <label><input class="reason-radio" type="radio" value="7" name="reason"/>色情</label>\n                    <label><input class="reason-radio" type="radio" value="6" name="reason"/>政治</label>\n                    <label><input class="reason-radio" type="radio" value="8" name="reason"/>广告</label>\n                    <label><input class="reason-radio" type="radio" value="11" name="reason"/>其他</label>\n                </div>\n            </div>\n            <div class="comment_wrap">\n                <div class="extend-text">补充说明:</div>\n                <div><textarea class="reason-content" type=\'text\'/></div>\n            </div>\n        </section>\n        <footer class="sp_ft">\n            <span class="btn_cancel">取消</span>\n            <span class="btn_sent">举报</span>\n        </footer>\n    </div>\n</script>\n\n<!--暂时放这里-->\n<!-- 公用内容输入及调用表情 -->\n<script type="text/template" id="common-content-alone-template">\n    <div class="bc-header">\n        <h3 class="bc-title">评论</h3>\n    </div>\n    <div class="bc-body">\n        <div class="reply-textarea"></div>\n        <div class="more-wrap">\n            <span class="btn-expression"></span><span class="btn-picture"></span>\n            <div class="checkbox-wrapper">\n                <input type="checkbox" id="chkShare">\n                <label for="chkShare">同步到朋友圈</label>\n            </div>\n        </div>\n        <span class="btn-send">发送</span>\n    </div>\n</script>\n\n<!-- 公用内容输入及调用表情 -->\n<script type="text/template" id="common-text-template">\n    <div class="bottom-comment">\n        <div class="c-l">\n            <span class="btn-expression"></span>\n            <span class="btn-picture"></span>\n        </div>\n        <div class="c-m reply-textarea">\n            <textarea id="poor-text-area" placeholder="说点什么"></textarea>\n        </div>\n        <div class="c-r">\n            <span class="btn-send">发送</span>\n        </div>\n    </div>\n</script>\n\n<!-- 富文本编辑框 -->\n<script type="text/template" id="rich-text-template">\n    <div class="rich-text-back">\n        <span class="placeholder" style="display: none"></span>\n\n        <div contenteditable="true" id="rich-text-div" class="rich-text-div">\n\n        </div>\n    </div>\n</script>\n\n<!-- 公用表情表达式 -->\n<script type="text/template" id="face-expression-template">\n    <div class="face-scroller">\n        <div class="face-page">\n            <i title="微笑"></i>\n            <i title="大笑"></i>\n            <i title="眨眼"></i>\n            <i title="桃心"></i>\n            <i title="害羞"></i>\n            <i title="惊讶"></i>\n            <i title="疑问"></i>\n            <i title="天真"></i>\n            <i title="鬼脸"></i>\n            <i title="悲伤"></i>\n            <i title="白眼"></i>\n            <i title="坏笑"></i>\n            <i title="流泪"></i>\n            <i title="尴尬"></i>\n            <i title="鄙视"></i>\n            <i title="给力"></i>\n            <i title="挖鼻孔"></i>\n            <i title="晕"></i>\n            <i title="切"></i>\n            <i title="睡觉"></i>\n            <i title="鼓掌"></i>\n            <i title="嘘"></i>\n            <i title="痛恨"></i>\n            <i title="忐忑"></i>\n            <i title="失望"></i>\n            <i title="困惑"></i>\n            <i title="担心"></i>\n            <span class="btn-delete-expression"></span>\n        </div>\n        <div class="face-page">\n            <i title="纠结"></i>\n            <i title="思考"></i>\n            <i title="窃喜"></i>\n            <i title="得意"></i>\n            <i title="呆子"></i>\n            <i title="闭嘴"></i>\n            <i title="汗"></i>\n            <i title="吐"></i>\n            <i title="惊恐"></i>\n            <i title="亲亲"></i>\n            <i title="胜利"></i>\n            <i title="痛扁"></i>\n            <i title="吃饭"></i>\n            <i title="赞"></i>\n            <i title="喷血"></i>\n            <i title="再见"></i>\n            <i title="生病"></i>\n            <i title="拥抱"></i>\n            <i title="无聊"></i>\n            <i title="灵感"></i>\n            <i title="示爱"></i>\n            <i title="赞同"></i>\n            <i title="拍砖"></i>\n            <i title="囧"></i>\n            <i title="愤怒"></i>\n            <i title="抓狂"></i>\n            <i title="爱心"></i>\n            <span class="btn-delete-expression"></span>\n        </div>\n        <div class="face-page">\n            <i title="心碎"></i>\n            <i title="玫瑰"></i>\n            <i title="凋谢"></i>\n            <i title="猪头"></i>\n            <i title="菜刀"></i>\n            <i title="OK"></i>\n            <i title="Hold"></i>\n            <i title="便便"></i>\n            <i title="强"></i>\n            <i title="弱"></i>\n            <i title="看电视"></i>\n\n            <i title="骷髅"></i>\n            <i title="棒棒糖"></i>\n            <i title="萌猫"></i>\n            <i title="咖啡"></i>\n            <i title="蛋糕"></i>\n            <i title="顶"></i>\n\n            <i title="礼物"></i>\n            <i title="钱"></i>\n            <i title="天使"></i>\n            <i title="恶魔"></i>\n            <span class="place-holder-box"></span>\n            <span class="place-holder-box"></span>\n            <span class="place-holder-box"></span>\n            <span class="place-holder-box"></span>\n            <span class="place-holder-box"></span>\n            <span class="place-holder-box"></span>\n            <span class="btn-delete-expression"></span>\n        </div>\n    </div>\n    <div class="indicator">\n        <div class="dotty"></div>\n        <ul class="ind_ul">\n            <li></li>\n            <li></li>\n            <li></li>\n        </ul>\n    </div>\n</script>');

/**
 * 话题collection
 */
define("square/src/1.0.0/collections/topic-comment-collection-debug", [ "square/src/1.0.0/models/topic-comment-model-debug", "square/src/1.0.0/content/rich-helper-debug", "square/src/1.0.0/common/util-debug", "square/src/1.0.0/common/phone-adapter-debug" ], function(require, exports, module) {
    var TopicCommentModel = require("square/src/1.0.0/models/topic-comment-model-debug");
    var util = require("square/src/1.0.0/common/util-debug");
    var TopicCommentCollection = Backbone.Collection.extend({
        model: TopicCommentModel,
        url: "",
        offset: 0,
        //偏移量，加载更多次数
        initialize: function(models, opts) {
            this.options = this.options || {};
            _.extend(this.options, opts);
        },
        /**
         * 清洗转化数据
         * @param response
         * @returns {*}
         */
        parse: function(response) {
            return response;
        },
        //		comparator: function(model){
        //			return -(model.get("time"));
        //		},
        populate: function(responseJSON, reset) {
            // populate collection
            var models = responseJSON.hasOwnProperty("data") ? responseJSON.data : responseJSON;
            // 如果返回错误，什么也不执行
            if (!models) {
                return;
            }
            var topicList = [];
            for (var i = 0; i < models.length; i++) {
                var model = new TopicCommentModel();
                model.set(model.parseData(models[i]));
                //兼容q2封版的Android
                model.set({
                    isNewVersion: util.isNewVersion
                });
                topicList.push(model);
            }
            if (reset) {
                this.reset(topicList);
            } else {
                this.set(topicList, {
                    remove: false
                });
            }
        },
        initData: function() {
            this.getData({
                offset: 0
            }, true);
        },
        getMoreData: function(opts) {
            opts.offset = this.offset;
            this.getData(opts);
        },
        getData: function(opts, reset) {
            var self = this;
            var param;
            switch (this.options.type) {
              case util.topicType.group:
                param = {
                    topicId: this.options.topicId,
                    page: opts.offset + 1,
                    pagesize: 20
                };
                break;

              case util.topicType.page:
                param = {
                    feedid: this.options.feedId,
                    offset: opts.offset,
                    step: 20
                };
                break;
            }
            //追加公共参数
            $.extend(param, util.getAjaxCommonParam());
            $.ajax({
                url: util.getUrl("topicComments", this.options.type),
                type: "POST",
                dataType: "json",
                data: param
            }).done(function(response) {
                var responseJSON = self.parse(response);
                self.populate(responseJSON, reset);
                self.offset = ++opts.offset;
            }).fail(function() {
                seajs.log("failed to get more topic list from server");
            }).always(function() {
                if (opts.callback) {
                    opts.callback();
                }
            });
        }
    });
    module.exports = TopicCommentCollection;
});

/**
 * Created by wangyongchao on 2014/9/2.
 */
define("square/src/1.0.0/views/topic-comment-view-debug", [ "square/src/1.0.0/models/topic-comment-model-debug", "square/src/1.0.0/content/rich-helper-debug", "square/src/1.0.0/templates/templates-module-debug", "square/src/1.0.0/common/util-debug", "square/src/1.0.0/common/phone-adapter-debug", "square/src/1.0.0/views/report-topic-view-debug", "square/src/1.0.0/views/floater-view-debug", "square/src/1.0.0/collections/popup-collection-debug" ], function(require, exports, module) {
    var TopicCommentModel = require("square/src/1.0.0/models/topic-comment-model-debug");
    var Templates = require("square/src/1.0.0/templates/templates-module-debug");
    var util = require("square/src/1.0.0/common/util-debug");
    var reportTopicVIew = require("square/src/1.0.0/views/report-topic-view-debug");
    var FloaterView = require("square/src/1.0.0/views/floater-view-debug");
    var TopicCommentView = Backbone.View.extend({
        tagName: "article",
        className: "comment",
        templateId: "topicCommentTpl",
        model: TopicCommentModel,
        events: {
            "tap .re .show_more": "showMore",
            "tap .re .menu .report": "report"
        },
        initialize: function() {},
        render: function() {
            var self = this;
            this.$el.html(Templates[this.templateId].call(_, this.model.attributes));
            this.floater = new FloaterView({
                clickHide: true,
                style: {
                    top: -100,
                    zIndex: 9999
                }
            });
            this.$(".re").append(this.floater.render());
            this.listenTo(this.floater, "hideFloater", function() {
                self.hideMore();
            });
            return this.$el;
        },
        showMore: function() {
            this.$(".re .menu").css({
                zIndex: 10001
            }).fadeIn();
            this.floater.show();
        },
        hideMore: function() {
            this.$(".re .menu").hide();
            this.floater.hideBy();
        },
        report: function() {
            var self = this;
            this.hideMore();
            reportTopicVIew.show();
            reportTopicVIew.reportOK = function(reportData) {
                var param = {
                    type: reportData.type,
                    //举报类型 同同窗其他所有投诉
                    reason: reportData.reason,
                    //举报留言
                    elementId: self.model.get("commentId"),
                    //话题Id
                    elementType: 7
                };
                var opts = {
                    type: self.model.collection.type,
                    done: function() {
                        reportData.callback();
                    },
                    fail: function() {}
                };
                util.reportTopic(param, opts);
            };
        }
    });
    module.exports = TopicCommentView;
});

/**
 * Created by wangyongchao on 2014/8/31.
 */
define("square/src/1.0.0/views/report-topic-view-debug", [ "square/src/1.0.0/templates/templates-module-debug", "square/src/1.0.0/views/floater-view-debug", "square/src/1.0.0/common/util-debug", "square/src/1.0.0/common/phone-adapter-debug", "square/src/1.0.0/collections/popup-collection-debug" ], function(require, exports, module) {
    var Templates = require("square/src/1.0.0/templates/templates-module-debug");
    var FloaterView = require("square/src/1.0.0/views/floater-view-debug");
    var util = require("square/src/1.0.0/common/util-debug");
    var popupCollection = require("square/src/1.0.0/collections/popup-collection-debug");
    var ReportTopicView = Backbone.View.extend({
        tagName: "div",
        className: "report-container share_popup",
        templateId: "reportTopicTpl",
        reportOK: function(data) {},
        events: {
            "tap .btn_cancel": "hideView",
            "tap .btn_sent": "report"
        },
        initialize: function() {},
        render: function() {
            this.$el.html(Templates[this.templateId].call(_));
            this.floater = new FloaterView({
                clickHide: false,
                style: {
                    opacity: .5,
                    zIndex: 9999
                }
            });
            $(document.body).append(this.floater.render());
            this.floater.show();
            $(document.body).append(this.$el);
        },
        show: function() {
            var self = this;
            var div = $(".report-container");
            if (div.length) {
                this.floater.show();
                div.show();
                this.$el.html(Templates[this.templateId].call(_));
            } else {
                this.render();
            }
            popupCollection.push({
                callback: function() {
                    self.close();
                }
            });
        },
        report: function() {
            var type = $("input[name='reason']:checked").val();
            if (!type) {
                util.toast("请选择举报理由");
                return;
            }
            var reason = $(".reason-content");
            this.reportOK({
                type: type,
                reason: reason.val(),
                callback: function() {
                    reason.val("");
                }
            });
            this.hideView();
            return false;
        },
        hideView: function() {
            popupCollection.pop();
        },
        close: function() {
            $(".reason-content").blur();
            var self = this;
            setTimeout(function() {
                self.floater.hideBy();
                self.$el.hide();
            }, 50);
        }
    });
    module.exports = new ReportTopicView();
});

define("square/src/1.0.0/views/floater-view-debug", [], function(require, exports, module) {
    var FloaterView = Backbone.View.extend({
        tagName: "div",
        className: "page_floater",
        events: {
            tap: "hide"
        },
        initialize: function() {},
        render: function() {
            this.$el.css(this.options.style);
            this.$el.width($(window).width() + 200);
            this.$el.height($(window).height() + 200);
            return this.$el;
        },
        hideBy: function() {
            this.$el.hide();
        },
        hide: function() {
            if (this.options.clickHide) {
                this.$el.hide();
                this.trigger("hideFloater");
            }
        },
        show: function() {
            this.$el.show();
            var opacity = this.options.style.opacity || 0;
            this.$el.css({
                opacity: opacity
            });
        },
        remove: function() {
            this.$el.remove();
        }
    });
    module.exports = FloaterView;
});

define("square/src/1.0.0/collections/popup-collection-debug", [], function(require, exports, module) {
    var PopupCollection = Backbone.Collection.extend({
        // set the model
        initialize: function() {
            this.on("remove", this.removePopup, this);
        },
        removePopup: function(model) {
            model.get("callback")();
        }
    });
    module.exports = new PopupCollection();
});

/**
 * Created by wangyongchao on 2014/9/2.
 */
define("square/src/1.0.0/views/share-friend-view-debug", [ "square/src/1.0.0/templates/templates-module-debug", "square/src/1.0.0/common/phone-adapter-debug", "square/src/1.0.0/common/util-debug", "square/src/1.0.0/views/floater-view-debug", "square/src/1.0.0/models/topic-beside-model-debug", "square/src/1.0.0/collections/popup-collection-debug" ], function(require, exports, module) {
    var Templates = require("square/src/1.0.0/templates/templates-module-debug");
    var adapter = require("square/src/1.0.0/common/phone-adapter-debug");
    var util = require("square/src/1.0.0/common/util-debug");
    var FloaterView = require("square/src/1.0.0/views/floater-view-debug");
    var TopicModel = require("square/src/1.0.0/models/topic-beside-model-debug");
    var popupCollection = require("square/src/1.0.0/collections/popup-collection-debug");
    var ShareFriendView = Backbone.View.extend({
        templateId: "shareTopicTpl",
        tagName: "div",
        className: "share_popup",
        initialized: false,
        events: {
            "tap .btn_cancel": "hideView",
            "tap .btn_sent": "shareTopic"
        },
        initialize: function() {
            //            _.bindAll(this,'toggleSendView','toggleFaceView', 'validateContent', 'hideSendView');
            this.model = new TopicModel();
            this.listenTo(this.model, "change", this.render);
        },
        render: function() {
            var self = this;
            this.$el.html(Templates[this.templateId].call(_, this.model.attributes));
            if (!this.initialized) {
                $(document.body).append(this.$el);
                this.floater = new FloaterView({
                    clickHide: false,
                    style: {
                        opacity: .5,
                        zIndex: 9999
                    }
                });
                $(document.body).append(this.floater.render());
                this.floater.show();
                this.initialized = true;
            } else {
                this.floater.show();
                this.$el.fadeIn();
            }
            popupCollection.push({
                callback: function() {
                    self.close();
                }
            });
        },
        hideView: function() {
            popupCollection.pop();
        },
        close: function() {
            this.$el.fadeOut();
            this.floater.hideBy();
        },
        shareTopic: function() {
            var self = this;
            var param = {
                topicId: this.model.get("id"),
                type: this.model.get("type"),
                genre: this.model.get("typeId"),
                summary: this.$("#shareContent").val()
            };
            //追加公共参数
            $.extend(param, util.getAjaxCommonParam());
            this.hideView();
            $.ajax({
                url: util.getUrl("shareTopic"),
                type: "post",
                dataType: "json",
                data: param
            }).done(function(response) {
                util.toast("已分享");
                self.$("#shareContent").val("");
            }).fail(function() {
                util.toast("分享失败");
            });
        }
    });
    module.exports = new ShareFriendView();
});

/**
 * Created by wangyongchao on 2014/10/11.
 */
define("square/src/1.0.0/views/content-view-debug", [ "square/src/1.0.0/models/page-model-debug", "square/src/1.0.0/templates/templates-module-debug", "iscroll-debug" ], function(require, exports, module) {
    var PageModel = require("square/src/1.0.0/models/page-model-debug");
    var Templates = require("square/src/1.0.0/templates/templates-module-debug");
    var IScroll = require("iscroll-debug");
    var ContentView = Backbone.View.extend({
        templateId: "contentTpl",
        scrollerPos: {
            x: 0,
            y: 0
        },
        events: {},
        initialize: function(opts) {
            opts = opts ? opts : {};
            this.$el = $(opts["wrapper"]);
            this.model = new PageModel(opts.model);
            this.overLoadHeight = opts.overLoadHeight || 50;
            this.loadMoreType = 0;
            //0: 下拉加载, 1: 上拉加载
            this.refresh = false;
            this.loadMoreCallback = opts.loadMoreCallback || null;
            _.bindAll(this, "initLoadMore", "adjustFrame");
            this.render();
        },
        render: function() {
            this.$el.html(Templates[this.templateId].call(_, this.model.attributes));
            this.contentWrapper = this.$(".content_wrapper");
        },
        init: function() {
            var param = {
                probeType: 3,
                mouseWheel: true,
                scrollbars: true,
                interactiveScrollbars: true,
                shrinkScrollbars: "scale",
                fadeScrollbars: true
            };
            //ios6以下不兼容，无法显示滚动条，会导致无法拖动
            if ($.os.ios && +$.os.version.split(".")[0] < 6) {
                param = {
                    probeType: 3,
                    mouseWheel: true
                };
            }
            this.scroller = new IScroll(this.$(".wrapper")[0], param);
            this.adjustFrame();
            this.initLoadMore();
        },
        initLoadMore: function() {
            var self = this;
            var scrollStart, scrollMove, touchEnd, scrollEnd;
            scrollStart = function() {
                self.scrollTouched = true;
                if (sendView) {
                    sendView.hideFaceView();
                }
            };
            scrollMove = function() {
                if (!self.refresh && !self.scrollTouched && this.y > 0) {
                    self.$(".load_top").animate({
                        marginTop: -40
                    });
                }
                //判断底部的有些复杂，写在这里
                var bottomPos = self.offsetHeight < self.contentWrapper.height() && this.y + self.contentWrapper.height() - self.offsetHeight;
                if (!self.refresh && self.scrollTouched) {
                    if (this.y > 0) {
                        //下拉
                        self.$("#load_top").removeClass().addClass("touch");
                        if (this.y < self.overLoadHeight) {
                            var mTop = Math.ceil(this.y) - self.overLoadHeight + 20;
                            self.$(".load_top").css({
                                marginTop: mTop
                            });
                        }
                        if (this.y > self.overLoadHeight / 2) {
                            self.$("#load_top").removeClass().addClass("start");
                            self.loadMoreType = 0;
                        }
                    } else if (bottomPos < 0) {
                        //上划
                        self.$(".load_bottom").show();
                        self.$("#load_bottom").removeClass().addClass("touch");
                        if (bottomPos < -self.overLoadHeight) {
                            self.$("#load_bottom").removeClass().addClass("start");
                            self.$(".load_bottom").show();
                            self.loadMoreType = 1;
                        }
                    }
                }
            };
            touchEnd = function() {
                if (self.refresh) return;
                self.scrollTouched = false;
                var top = self.scroller.y > self.overLoadHeight / 2;
                var bottom = self.offsetHeight < self.contentWrapper.height() && self.scroller.y + self.contentWrapper.height() - self.offsetHeight < -self.overLoadHeight;
                self.refresh = top || bottom;
                if (top) {
                    self.$(".load_top").animate({
                        marginTop: 0
                    });
                } else if (bottom) {
                    self.$(".scroller").animate({
                        top: -40
                    }, {
                        duration: 450,
                        complete: function() {
                            self.$("#load_bottom").removeClass().addClass("loading");
                        }
                    });
                }
            };
            scrollEnd = function() {
                self.scrollerPos = {
                    x: this.x,
                    y: this.y
                };
                if (self.refresh && self.loadMoreCallback) {
                    //正在加载
                    var el = self.loadMoreType == 0 ? self.$("#load_top") : self.$("#load_bottom");
                    el.removeClass().addClass("loading");
                    //调用加载数据的回调
                    setTimeout(function() {
                        self.loadMoreCallback({
                            loadType: self.loadMoreType,
                            complete: function() {
                                self.finishLoad();
                            }
                        });
                    }, 1e3);
                }
            };
            if (this.loadMoreCallback) {
                this.scroller.on("scrollStart", scrollStart);
                this.scroller.on("scroll", scrollMove);
                this.contentWrapper.on("touchend", touchEnd);
                this.scroller.on("scrollEnd", scrollEnd);
            }
        },
        /**
         * 加载完成后的回调
         */
        finishLoad: function() {
            console.log("load completed");
            var self = this;
            if (this.loadMoreType == 0) {
                this.$(".load_top").animate({
                    marginTop: -this.overLoadHeight
                }, {
                    complete: function() {
                        self.adjustFrame();
                    }
                });
                this.$("#load_top").removeClass().addClass("touch");
            } else {
                this.$("#load_bottom").removeClass().addClass("touch");
                this.$(".scroller").animate({
                    top: 0
                }, {
                    complete: function() {
                        self.adjustFrame();
                    }
                });
            }
            this.refresh = false;
            self.overRefresh = false;
        },
        /**
         * 用于内容view设置高度
         */
        adjustFrame: function() {
            this.$(".load_bottom").hide();
            this.offsetHeight = this.$(".wrapper").height();
            console.log("window height:" + $(window).height());
            console.log(".wrapper height:" + this.offsetHeight);
            this.scroller.refresh();
        },
        /**
         * 重设滚动条
         * @param pos e.g.{x: 0, y: 0}
         */
        resetScrollPos: function(pos) {
            pos = pos || this.scrollerPos;
            this.scroller.scrollTo(pos.x, pos.y);
        }
    });
    module.exports = ContentView;
});

/**
 * Created by wangyongchao on 2014/8/31.
 */
define("square/src/1.0.0/models/page-model-debug", [], function(require, exports, module) {
    module.exports = Backbone.Model.extend({});
});

/**
 * Created by wangyongchao on 2014/8/31.
 */
define("square/src/1.0.0/views/page-view-debug", [ "square/src/1.0.0/views/top-bar-view-debug", "square/src/1.0.0/templates/templates-module-debug", "square/src/1.0.0/routers/subscribe-and-publish-debug", "square/src/1.0.0/views/floater-view-debug" ], function(require, exports, module) {
    var TopBarView = require("square/src/1.0.0/views/top-bar-view-debug");
    var Templates = require("square/src/1.0.0/templates/templates-module-debug");
    var Page = Backbone.View.extend({
        templateId: "pageTpl",
        initialize: function(opts) {
            opts = opts ? opts : {};
            this.$el = $(opts["wrapper"]);
            this.topBar = new TopBarView(opts.topBar);
            this.render();
        },
        render: function() {
            this.$el.html(Templates[this.templateId].call(_, this.model.attributes));
            this.topBar.$el = this.$(".page-header");
            this.topBar.render();
            this.contentWrapper = this.$(".content-container");
        },
        /**
         * 用于内容view设置高度
         */
        refresh: function() {
            console.log("page-view refresh invoked~");
            //            var tmpHeight = $(window).height();
            ////            //ios7滚动条拉不到底
            ////            if ($.os.ios && (+$.os.version.split('.')[0]) > 6) {
            ////                tmpHeight -= 50;
            ////            }
            //            this.$el.height(tmpHeight);
            //
            //            //计算content-container的高度
            //            tmpHeight -= this.$('.page-header').height();
            //            this.$('.content-container').height(tmpHeight);
            console.log(".content-container height:" + this.$(".content-container").height());
            this.targetView.refresh();
        },
        /**
         * 减去内容层多余的高度
         * @param height
         */
        minusHeight: function(height) {
            this.$(".content-container").height(this.$(".content-container").height() - height);
        },
        hideToRight: function() {
            var opts = {
                props: {
                    left: "100%"
                },
                show: false
            };
            this.animateToggle(opts);
        },
        hideToLeft: function() {
            var opts = {
                props: {
                    left: "-100%"
                },
                show: false
            };
            this.animateToggle(opts);
        },
        showFromLeft: function() {
            var self = this;
            var opts = {
                props: {
                    left: 0
                },
                show: true,
                callback: function() {
                    self.trigger("showFromLeft");
                    //滚动条丢失问题
                    self.refresh();
                }
            };
            this.animateToggle(opts);
        },
        show: function() {
            var target = this.$el.hasClass("animate-page") ? this.$el : this.$el.parents(".animate-page");
            target.show();
        },
        showFromRight: function() {
            var opts = {
                prevProps: {
                    left: "100%"
                },
                show: true,
                props: {
                    left: 0
                }
            };
            this.animateToggle(opts);
        },
        /**
         * 过度动画
         * @param opts {object} e.g. {prevProps: {left: '100%'}, props: {left: 0}, callback: function(){}}
         */
        animateToggle: function(opts) {
            var target = this.$el.hasClass("animate-page") ? this.$el : this.$el.parents(".animate-page");
            var args = {
                duration: 300,
                complete: function() {
                    opts.show ? "" : target.hide();
                    if (opts.callback) {
                        opts.callback();
                    }
                }
            };
            if (opts.prevProps) {
                target.css(opts.prevProps);
            }
            opts.show ? target.fadeIn() : "";
            target.animate(opts.props, args);
        }
    });
    module.exports = Page;
});

/**
 * Created by wangyongchao on 2014/8/31.
 */
define("square/src/1.0.0/views/top-bar-view-debug", [ "square/src/1.0.0/templates/templates-module-debug", "square/src/1.0.0/routers/subscribe-and-publish-debug", "square/src/1.0.0/views/floater-view-debug" ], function(require, exports, module) {
    var Templates = require("square/src/1.0.0/templates/templates-module-debug");
    var pubsub = require("square/src/1.0.0/routers/subscribe-and-publish-debug");
    var FloaterView = require("square/src/1.0.0/views/floater-view-debug");
    module.exports = Backbone.View.extend({
        templateId: "topBarTpl",
        events: {
            "tap .h_left": "back",
            "tap .menu_btn": "showMenu",
            "tap .top_menu": "clickItem",
            "tap .title": "resize"
        },
        resize: function() {
            $(window).resize();
        },
        initialize: function() {},
        render: function() {
            var self = this;
            var data = {};
            data.title = this.options.title || "";
            data.menuItems = this.options.menuItems || [];
            data.menuBtnType = this.options.menuBtnType || 0;
            switch (+this.options.menuBtnType) {
              case 0:
                data.menuClass = "";
                this.$el.html(Templates[this.templateId].call(_, data));
                break;

              case 1:
                data.menuClass = "btn_msg";
                this.$el.html(Templates[this.templateId].call(_, data));
                break;

              case 2:
                data.menuClass = "btn_more";
                this.$el.html(Templates[this.templateId].call(_, data));
                this.floater = new FloaterView({
                    clickHide: true,
                    style: {
                        top: -100,
                        zIndex: 9999
                    }
                });
                this.$el.append(this.floater.render());
                this.listenTo(this.floater, "hideFloater", function() {
                    self.hideMenu();
                });
                break;
            }
            this.delegateEvents();
        },
        showMenu: function() {
            var callback = this.options.menuCallback;
            if (callback) {
                callback();
            } else {
                this.$(".top_menu").show();
                this.floater.show();
            }
            return false;
        },
        hideMenu: function() {
            this.$(".top_menu").hide();
        },
        clickItem: function(e) {
            e = e || window.event;
            var target = $(e.target || e.srcElement);
            target = target.is("span") ? target.parent() : target;
            var action = target.attr("data-action");
            pubsub.publish("topBar_" + action);
            this.floater.hide();
        },
        back: function() {
            //触发router的返回事件
            pubsub.publish("NAV_BACK");
            //触发监听此topBar的返回事件(一般是做一些unbind操作)
            this.trigger("NAV_BACK");
            return false;
        }
    });
});

/**
 * Created by wangyongchao on 2014/9/2.
 */
define("square/src/1.0.0/views/message-view-debug", [ "square/src/1.0.0/templates/templates-module-debug", "square/src/1.0.0/common/phone-adapter-debug" ], function(require, exports, module) {
    var Templates = require("square/src/1.0.0/templates/templates-module-debug");
    var adapter = require("square/src/1.0.0/common/phone-adapter-debug");
    var MessageView = Backbone.View.extend({
        templateId: "messageTpl",
        events: {},
        initialize: function() {},
        render: function() {
            this.$el.html(Templates[this.templateId].call(_));
            adapter.clearMessageState();
        }
    });
    module.exports = new MessageView();
});

define("square/src/1.0.0/content/send-view-debug", [ "square/src/1.0.0/common/util-debug", "square/src/1.0.0/common/phone-adapter-debug", "square/src/1.0.0/content/rich-text-view-debug", "square/src/1.0.0/content/rich-helper-debug", "square/src/1.0.0/templates/templates-module-debug", "square/src/1.0.0/views/floater-view-debug", "square/src/1.0.0/collections/popup-collection-debug", "square/src/1.0.0/content/face-expression-view-debug", "iscroll-debug" ], function(require, exports, module) {
    var util = require("square/src/1.0.0/common/util-debug");
    var RichTextView = require("square/src/1.0.0/content/rich-text-view-debug");
    var Templates = require("square/src/1.0.0/templates/templates-module-debug");
    var FloaterView = require("square/src/1.0.0/views/floater-view-debug");
    var popupCollection = require("square/src/1.0.0/collections/popup-collection-debug");
    var SendView = Backbone.View.extend({
        // templateId: 'common-content-template',
        templateAloneId: "common-content-alone-template",
        tagName: "div",
        // attributes: function () {
        //     return {
        //         style: 'display: none'
        //     };
        // },
        // className: 'common-reply-div',
        className: "bottom-comment",
        broadcastDiv: "",
        plugin: {},
        maxCount: 400,
        //默认最多可输入400字
        placeHolder: "",
        initinalized: false,
        regEvents: {},
        events: {
            "tap #btn-test": "test",
            "tap .btn-expression": "toggleFaceView",
            "tap .textarea": "hideFaceView",
            "tap .btn-send": "sendComment",
            "tap .btn-delete-expression": "deleteExpression"
        },
        test: function() {
            alert();
        },
        initialize: function() {
            _.bindAll(this, "show", "hide", "toggleFaceView", "validateContent");
        },
        render: function() {
            var self = this;
            self.initinalized = true;
            self.$el.html(Templates[self.templateAloneId].call(_));
            this.$body = $(document.body);
            // this.broadcastDiv.append(self.$el);
            // this.$body.append(self.$el);
            this.delegateEvents();
            this.plugin.richTextView = new RichTextView();
            this.plugin.richTextView.render(this.$el.find(".reply-textarea"));
            this.plugin.richTextView.registerEvents({
                validate: function() {
                    self.validateContent();
                }
            });
            this.$shareCheckbox = this.$el.find("#chkShare");
            // this.$bottomCommentDefault=this.$el.find('.bottom-comment-default');
            this.$bottomComment = this.$el.find(".bottom-comment");
            this.$body.append(this.$el);
            // this.broadcastDiv.append(this.$bottomCommentDefault);
            this.floater = new FloaterView({
                clickHide: true,
                style: {
                    opacity: .5,
                    zIndex: 9997
                }
            });
            this.listenTo(this.floater, "hideFloater", function() {
                // self.hideBottomComment();
                // self.reset();
                self.hideView();
            });
            // this.broadcastDiv.append(this.floater.render());
            this.$body.append(this.floater.render());
        },
        /**
         * 为sendView注册事件
         * @param evt e.g. {sendComment: function(arg){}}
         */
        registerEvents: function(evt) {
            this.regEvents = evt;
        },
        show: function(content) {
            buriedPoint(36008005);
            // if (this.broadcastDiv.find(".common-reply-div").length == 0) {
            // if (this.$(document.body).find(".common-reply-div").length == 0) {
            //     this.render();
            // }
            if ($(document.body).find(".bottom-comment").length === 0) {
                this.render();
            }
            content = content ? content : "";
            var txt = content ? '<span id="replyTo"><button onclick="return false;" tabindex="-1" contenteditable="false" class="input-button">' + content + "：</button></span>" : "";
            // if (this.$el.is(":hidden")) {
            //     this.$el.show();
            // }
            // if(!this.$el.hasClass('active')){
            //     this.$el.addClass('active');
            // }
            //每次设置之前先清空一下silent:不触发change事件，不然preContent相同的话触发不了change事件，造成光标无法定位在最后
            this.plugin.richTextView.model.clear({
                silent: true
            });
            this.plugin.richTextView.model.set("placeholder", content ? content : "我也说一句");
            this.plugin.richTextView.model.set("preContent", txt);
            this.delegateEvents();
            return false;
        },
        hide: function() {
            seajs.log("hideSendView");
            // this.$el.slideUp(300);
            this.$el.removeClass("active");
            if (this.plugin.richTextView) {
                this.plugin.richTextView.resetFocus();
            }
            if (this.plugin.faceView) {
                this.plugin.faceView.hideExpressionPanel();
            }
        },
        hideFaceView: function() {
            if (this.plugin.faceView) {
                this.plugin.faceView.hideExpressionPanel();
            }
            if (this.plugin.richTextView) {
                this.plugin.richTextView.blur();
            }
        },
        toggleFaceView: function(e) {
            var self = this;
            var faceView = this.plugin.faceView;
            if (!faceView) {
                faceView = this.plugin.faceView = require("square/src/1.0.0/content/face-expression-view-debug");
            }
            faceView.parentDiv = this.$el;
            faceView.registerEvents({
                pickExpression: function(data) {
                    self.plugin.richTextView.insertEl(data.el);
                }
            });
            //            faceView.afterClickFace = this.clickFaceCallback;
            faceView.toggleExpressionPanel();
            return false;
        },
        /// 删除表情
        deleteExpression: function() {
            this.plugin.richTextView.deleteEl();
        },
        sendComment: function() {
            //调用回调函数处理发送按钮
            var content = this.plugin.richTextView.getContent();
            if (!content.length) {
                util.toast("请输入评论内容");
                return;
            }
            // this.hideFaceView();
            this.hideView();
            this.regEvents.sendComment({
                content: content,
                isToFeed: this.getShareCheckboxValue() || 0
            });
            return false;
        },
        validateContent: function() {
            var content = this.plugin.richTextView.getContent();
            if (!content) {
                this.$(".send-comment-button").addClass("grey").attr("disabled", "disabled");
            } else {
                this.$(".send-comment-button").removeClass("grey").removeAttr("disabled");
            }
        },
        /// 显示底部评论框
        showBottomComment: function() {
            // if(this.$bottomCommentDefault){
            //     this.$bottomCommentDefault.removeClass('active');
            // }
            var self = this;
            if (this.floater) {
                this.floater.show();
            }
            if (this.$el) {
                this.$el.addClass("active");
                popupCollection.push({
                    callback: function() {
                        self.floater.hideBy();
                        self.hideBottomComment();
                        self.reset();
                    }
                });
            }
            if (this.plugin.richTextView) {
                this.plugin.richTextView.focus();
            }
        },
        /// 隐藏底部评论框
        hideBottomComment: function() {
            if (this.$el) {
                this.$el.removeClass("active");
                popupCollection.pop();
            }
        },
        /// 触发
        hideFloater: function() {
            this.floater.hide();
        },
        /// 重置分享复选框，默认不勾选
        resetShareCheckbox: function() {
            if (this.$shareCheckbox) {
                this.$shareCheckbox.prop("checked", false);
            }
        },
        /// 获取分享复选框的值
        getShareCheckboxValue: function() {
            if (this.$shareCheckbox) {
                return Number(this.$shareCheckbox.prop("checked"));
            } else {
                throw new Error("can not find share checkbox.");
            }
        },
        reset: function() {
            this.resetShareCheckbox();
            this.hideFaceView();
            this.plugin.richTextView.reset();
        },
        hideView: function() {
            popupCollection.pop();
        }
    });
    module.exports = new SendView();
});

/**
 * Created by Wangyongchao on 2014/5/30.
 */
define("square/src/1.0.0/content/rich-text-view-debug", [ "square/src/1.0.0/content/rich-helper-debug", "square/src/1.0.0/templates/templates-module-debug" ], function(require, exports, module) {
    var richHelper = require("square/src/1.0.0/content/rich-helper-debug");
    var Templates = require("square/src/1.0.0/templates/templates-module-debug");
    var RichText = Backbone.View.extend({
        templateId: "rich-text-template",
        tagName: "div",
        className: "textarea",
        maxCount: 400,
        //默认最多可输入400字
        focusNode: null,
        focusOffset: 0,
        regEvents: {},
        //解决飞信客户端丢失滚动条
        scroll: 0,
        events: {
            "click .placeholder": "focus",
            "keyup #rich-text-div": "validateContent",
            "mouseup #rich-text-div": "validateContent",
            "paste #rich-text-div": "pasteHtml"
        },
        initialize: function() {
            this.model = new Backbone.Model({
                placeholder: this.placeHolder,
                preContent: this.preContent
            });
            this.model.on("change:preContent", function() {
                seajs.log("rich-text-model changed~~~");
                this.resetFocus();
                this.$el.find("#rich-text-div").html("");
                var val = arguments[1];
                val ? this.insertEl(val) : "";
            }, this);
            this.model.on("change:placeholder", function() {
                this.$el.find(".placeholder").text(arguments[1]);
                this.$el.find(".placeholder").show();
            }, this);
        },
        reset: function() {
            var tmp = _.clone(this.model.attributes);
            this.model.clear();
            this.model.set(tmp);
        },
        render: function(container) {
            this.$el.html(Templates[this.templateId].call(_));
            container.append(this.$el);
            this.delegateEvents();
        },
        /**
         * 为富文本框注册事件
         * @param evt e.g. {sendComment: function(arg){}}
         */
        registerEvents: function(evt) {
            this.regEvents = evt;
        },
        getContent: function() {
            return this.filterContent();
        },
        getHtml: function() {
            this.scroll = this.$("#rich-text-div")[0].scrollTop;
            return this.$("#rich-text-div").html();
        },
        getUsefulHtml: function() {
            if (this.getContent().length) {
                return this.getHtml();
            } else {
                return "";
            }
        },
        /**
         * 对输入框做粘贴的时候过滤掉原生的html
         */
        pasteHtml: function() {
            var self = this;
            setTimeout(function() {
                var tmpHtml = self.$("#rich-text-div").html();
                self.$("#rich-text-div").html("");
                tmpHtml = $("<i/>" + tmpHtml + "<i/>");
                var text = self.filterPaste(tmpHtml);
                self.insertEl(text + "&nbsp;", true);
                //把回复xxx补回来
                if (self.model.get("preContent")) {
                    self.$("#rich-text-div").prepend(self.model.get("preContent"));
                }
            }, 0);
        },
        /**
         * 过滤从网页中copy的富文本
         * @param html
         * @returns string
         */
        filterPaste: function(html) {
            var self = this;
            var htmlStr = "";
            html.each(function(idx, el) {
                var $el = $(el);
                if ($el.attr("id") == "replyTo") {
                    //回复xxx
                    return true;
                }
                if ($el.is("img") && $el.hasClass("face-size")) {
                    //表情
                    htmlStr += $el.prop("outerHTML");
                } else if ($el.is("br")) {
                    //回车是br
                    htmlStr += "<br/>";
                } else if ($el.is("i")) {
                    //手动添加的元素方便标记
                    //不做任何处理
                    return true;
                } else if ($el.is("div")) {
                    //div递归获取
                    htmlStr += "<br/>" + self.filterPaste($("<i/>" + $el.html() + "<i/>"));
                } else {
                    //其他元素直接取text
                    //                    if(!$el.is("span")){
                    //                        htmlStr += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;";
                    //                    }
                    htmlStr += richHelper.filterEnter($el.text());
                }
            });
            //            seajs.log(text.val());
            return htmlStr;
        },
        /**
         *  提交前过滤内容
         */
        filterContent: function() {
            var html = this.getHtml();
            var content = "";
            var isReply = false;
            if (html.length) {
                html = $("<i/>" + html + "<i/>");
                var obj = this.getRichText(html);
                isReply = obj.isReply;
                content = obj.content;
            }
            //显示placeholder
            if (!content.length && !isReply) {
                this.$el.find(".placeholder").show();
            } else {
                this.$el.find(".placeholder").hide();
            }
            return $.trim(content);
        },
        /**
         * 从富文本编辑框里获取内容
         * @param html
         * @returns {{isReply: boolean, content: string}}
         */
        getRichText: function(html) {
            var self = this;
            //声明一个textarea来接收内容，过滤作用
            var text = $("<textarea>");
            var isReply = false;
            html.each(function(idx, el) {
                var $el = $(el);
                if ($el.attr("id") == "replyTo") {
                    //回复xxx
                    isReply = true;
                    return true;
                }
                if ($el.is("img")) {
                    //表情
                    text.val(text.val() + "[/" + $el.attr("title") + "]");
                } else if ($el.is("br")) {
                    //firefox中回车是br
                    text.val(text.val() + "\r\n");
                } else if ($el.is("i")) {
                    //手动添加的元素方便标记
                    //不做任何处理
                    return true;
                } else if ($el.is("div")) {
                    //chrome的回车是添加一个div
                    var con = "";
                    //div中不是纯文本并且不是以br开始的
                    if ($el.children().length && !$el.find(":first-child").is("br")) {
                        //有时候chrome会在回车添加的div的内容的最后添加一个br，需要删除掉
                        if ($el.children().length > 1 && $el.find(":last-child").is("br")) {
                            $el.find(":last-child").remove();
                        }
                        con = "\r\n";
                    }
                    //换行div中是纯文本
                    if (!$el.children().length) {
                        con = "\r\n";
                    }
                    //递归获取div中的内容
                    con += self.getRichText($("<i/>" + $el.html() + "<i/>")).content;
                    text.val(text.val() + con);
                } else {
                    text.val(text.val() + html[idx].textContent);
                }
            });
            return {
                isReply: isReply,
                content: text.val()
            };
        },
        validateContent: function() {
            this.setFocus();
            var content = this.getContent();
            if (this.regEvents.validate) {
                this.regEvents.validate(content.length);
            }
        },
        resetFocus: function() {
            this.setFocus({
                node: this.$el.find("#rich-text-div")[0],
                offset: 0
            });
        },
        setFocus: function(arg) {
            var selection = window.getSelection();
            this.focusNode = arg ? arg.node : selection.anchorNode;
            this.focusOffset = arg ? arg.offset : selection.focusOffset;
        },
        focus: function() {
            this.$el.find("#rich-text-div").focus();
        },
        blur: function() {
            this.$el.find("#rich-text-div").blur();
        },
        keyDown: function(e) {
            switch (e.keyCode) {
              case 8:
                //backspace
                if (this.focusNode.id == "replyTo") {
                    e.returnValue = false;
                    return false;
                }
                break;

              case 46:
                //delete
                if (this.focusNode.id == "rich-text-div" && this.focusOffset == 0) {
                    e.returnValue = false;
                    return false;
                }
                break;
            }
            this.validateContent();
        },
        /**
         * 添加元素
         * @param el
         * @param flag 不传或默认(false)就获取已经记录的focus
         */
        insertEl: function(el, flag) {
            var $ipt = this.$el.find("#rich-text-div");
            var other = $ipt.find("#other");
            if (other) {
                other.remove();
            }
            if (el) {
                //                var scrollTop = $ipt[0].scrollTop;
                var selection = window.getSelection();
                if (selection.rangeCount && selection.anchorNode.id === "rich-text-div") {
                    var range = selection.getRangeAt(0);
                    range.collapse(false);
                    try {
                        if (!flag) {
                            range.setStart(this.focusNode, this.focusOffset);
                            range.setEnd(this.focusNode, this.focusOffset);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                    var hasR = range.createContextualFragment(el);
                    var lastChild = hasR.lastChild;
                    range.insertNode(hasR);
                    if (lastChild) {
                        range.setEndAfter(lastChild);
                        range.setStartAfter(lastChild);
                    }
                    selection.removeAllRanges();
                    selection.addRange(range);
                    $ipt.blur();
                } else {
                    $ipt.append(el);
                }
                if (this.scroll) {
                    $ipt.scrollTop(this.scroll);
                }
                this.validateContent();
            }
        },
        deleteEl: function() {
            var $ipt = this.$el.find("#rich-text-div"), $expressionList = $ipt.children("img[title]"), $expression, // 要删除的expression
            selection = window.getSelection(), selectionType = selection.type, selectionRange;
            if ($.trim($ipt.html()) === "") return;
            // 无
            if (selectionType === "None") {
                $expression = _.last($expressionList);
                if ($expression) {
                    $expression.remove();
                }
            } else if (selectionType === "Range") {
                selectionRange = selection.getRangeAt();
                if (selectionRange) {
                    selectionRange.deleteContents();
                }
            } else if (selectionType === "Caret") {
                selectionRange = document.createRange();
                try {
                    selectionRange.setStart(selection.anchorNode, selection.anchorOffset - 1);
                    selectionRange.setEnd(selection.focusNode, selection.focusOffset);
                    selectionRange.deleteContents();
                    if (typeof selection.anchorNode.id !== "undefined") {
                        selection.collapse(this.anchorNode, this.focusOffset - 1);
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        }
    });
    module.exports = RichText;
});

define("square/src/1.0.0/content/face-expression-view-debug", [ "square/src/1.0.0/content/rich-helper-debug", "square/src/1.0.0/templates/templates-module-debug", "iscroll-debug" ], function(require, exports, module) {
    var richHelper = require("square/src/1.0.0/content/rich-helper-debug");
    var Templates = require("square/src/1.0.0/templates/templates-module-debug");
    var IScroll = require("iscroll-debug");
    var FaceExpressionView = Backbone.View.extend({
        tagName: "div",
        id: "common-expression-panel",
        className: "facePanel",
        templateId: "face-expression-template",
        parentDiv: "",
        regEvents: {},
        events: {
            "tap i": "clickExpression"
        },
        initialize: function() {
            _.bindAll(this, "render", "toggleExpressionPanel", "hideExpressionPanel");
        },
        render: function() {
            if (this.$el.html() == "") {
                this.$el.html(Templates[this.templateId].call(_));
                var height = Math.floor($(window).width() / 7 * 4);
                this.$(".face-scroller").height(height);
                this.$el.height(height - 13);
                this.scroller = new IScroll(this.$el[0], {
                    scrollX: true,
                    scrollY: false,
                    momentum: false,
                    snap: true,
                    snapSpeed: 400,
                    indicators: {
                        el: this.$(".indicator")[0],
                        resize: false
                    }
                });
            }
            this.parentDiv.append(this.$el);
            this.delegateEvents();
        },
        toggleExpressionPanel: function() {
            if (this.parentDiv.find("#common-expression-panel").length == 0) {
                this.render();
                this.scroller.refresh();
            } else {
                var flag = $("#common-expression-panel").is(":visible");
                this.showExpressionPanel(!flag);
            }
        },
        showExpressionPanel: function(flag) {
            if (flag) {
                this.$el.show();
                this.scroller.refresh();
            } else {
                this.$el.hide();
            }
        },
        hideExpressionPanel: function() {
            this.showExpressionPanel(false);
            this.scroller.scrollTo(0, 0);
        },
        display: function() {
            return $("#common-expression-panel").is(":visible");
        },
        //        deleteExpression: function(e) {
        //            var self = this;
        //            var str = "" + self.targetContent.val();
        //            if (str.length) {
        //                var reg = /\[\/[\u4e00-\u9fa5]{1,4}]$|\[\/Hold]$|\[\/OK\]$/gim;
        //                var newStr;
        //                var arr = reg.exec(str);
        //                if (arr == null) {
        //                    newStr = str.substring(0, str.length - 1);
        //                } else if (arr.length) {
        //                    newStr = str.replace(reg, "");
        //                }
        //            }
        //
        //            self.targetContent.val(newStr);
        //            self.targetContent.trigger("focus");
        //        },
        registerEvents: function(evt) {
            this.regEvents = evt;
        },
        clickExpression: function(e) {
            var target = e.target;
            if ($(e.target).hasClass("delete-expression")) return;
            // 不可选
            if ($(e.target).hasClass("unselect")) return;
            var title = $(target).attr("title");
            var str = "[/" + title + "]";
            var image = richHelper.filterContentExpression(str);
            //            $("#common-expression-panel").toggle();
            this.regEvents.pickExpression({
                el: image
            });
        },
        changeExpressionPanel: function(e) {
            var target = $(e.target);
            var self = this;
            if (target.hasClass("index1")) {
                self.$("#expression-slider").css("left", "-252px");
            } else {
                self.$("#expression-slider").css("left", "0px");
            }
        }
    });
    module.exports = new FaceExpressionView();
});

define("square/src/1.0.0/views/app-debug", [ "square/src/1.0.0/common/util-debug", "square/src/1.0.0/common/phone-adapter-debug", "square/src/1.0.0/views/navi-view-debug", "square/src/1.0.0/templates/templates-module-debug", "iscroll-debug", "square/src/1.0.0/models/navi-model-debug", "square/src/1.0.0/controls/topic-manager-debug", "square/src/1.0.0/views/topic-view-debug", "square/src/1.0.0/collections/topic-collection-debug", "square/src/1.0.0/models/topic-beside-model-debug", "square/src/1.0.0/views/slide-view-debug", "square/src/1.0.0/models/slide-model-debug", "localdb-debug", "square/src/1.0.0/views/content-view-debug", "square/src/1.0.0/models/page-model-debug" ], function(require, exports, module) {
    var util = require("square/src/1.0.0/common/util-debug");
    var naviView = require("square/src/1.0.0/views/navi-view-debug");
    var NaviModel = require("square/src/1.0.0/models/navi-model-debug");
    var TopicManager = require("square/src/1.0.0/controls/topic-manager-debug");
    var localdb = require("localdb-debug");
    var AppView = Backbone.View.extend({
        el: "",
        catalog: {},
        //缓存各个分类下边的内容
        page: null,
        events: {
            "swipe .content_wrapper .catalog": "changeTab"
        },
        initialize: function() {},
        render: function() {},
        refresh: function() {
            //            this.$('.nav-tab-content').height(this.$el.height() - naviView.$el.height());
            this.currentTopicManager ? this.currentTopicManager.refresh() : "";
        },
        initDataFromServer: function() {
            this.listenTo(this.page, "showFromLeft", function() {
                $(window).resize();
                naviView.scroller.refresh();
            });
            this.initCatalog();
        },
        /**
         * 获取内容广场分类
         */
        initCatalog: function() {
            console.log("initCatalog~");
            var self = this;
            var successFunc = function(data) {
                //如果已经初始化，则刷新一下
                if (naviView.initialized) {
                    naviView.model.set(data);
                } else {
                    naviView.model = new NaviModel({
                        items: data
                    });
                    self.page.contentWrapper.prepend(naviView.render());
                    console.log("listen tabChanged changed~");
                    self.listenTo(naviView, "tabChanged", self.showTopicList);
                }
                console.log("naviView.initScroller~");
                naviView.initScroller();
                console.log("self.showTopicList~");
                self.showTopicList();
            };
            var param = {};
            var dataKey = "square_catalog";
            var oldCatalog = localdb.get(dataKey);
            if (oldCatalog) {
                successFunc(oldCatalog);
            }
            //请求数据，刷新，此处流量不大，不到1kb所以就刷新一下
            $.extend(param, util.getAjaxCommonParam());
            $.ajax({
                url: util.getUrl("loadCatalog"),
                type: "POST",
                dataType: "json",
                data: param
            }).done(function(response) {
                localdb.set(dataKey, response);
                if (!oldCatalog) {
                    successFunc(response);
                }
            }).fail(function(d, config, err) {
                console.log("API FAIL. " + err);
            });
        },
        /**
         * 显示话题列表
         */
        showTopicList: function() {
            var currentTab = naviView.getCurrentTab();
            var prevTab = naviView.prevTab;
            if (prevTab) {
                var prevManager = this.catalog[prevTab.id];
                prevManager.hide();
            }
            var topicManager = this.catalog[currentTab.id];
            if (topicManager) {
                //showSection
                topicManager.show();
            } else {
                topicManager = new TopicManager({
                    dataId: currentTab.id,
                    dataType: currentTab.type
                });
                this.catalog[currentTab.id] = topicManager;
                this.page.contentWrapper.append(topicManager.render());
            }
            this.currentTopicManager = topicManager;
            $(window).resize();
        }
    });
    module.exports = AppView;
});

define("square/src/1.0.0/views/navi-view-debug", [ "square/src/1.0.0/templates/templates-module-debug", "iscroll-debug" ], function(require, exports, module) {
    var Templates = require("square/src/1.0.0/templates/templates-module-debug");
    var IScroll = require("iscroll-debug");
    var NaviView = Backbone.View.extend({
        templateId: "navTpl",
        tagName: "nav",
        prevTab: null,
        initialized: false,
        events: {
            "tap .catalog li": "changeTab"
        },
        initialize: function() {
            _.bindAll(this, "adjustFrame");
            $(window).resize(this.adjustFrame);
        },
        render: function() {
            this.$el.html(Templates[this.templateId].call(_, this.model.attributes));
            if (!this.initialized) {
                this.listenTo(this.model, "change", this.render);
            }
            this.initialized = true;
            return this.$el;
        },
        adjustFrame: function() {
            this.$el.width($(window).width());
        },
        /**
         * 切换分类
         */
        changeTab: function(e) {
            e = e || window.event;
            var target = $(e.target || e.srcElement);
            target = target.is("li") ? target : target.parent();
            //选中页不等于当前页
            if (!target.hasClass("active")) {
                console.log("changeTab");
                this.prevTab = this.getCurrentTab();
                $(".catalog li.active").removeClass("active");
                target.addClass("active");
                this.trigger("tabChanged");
            }
        },
        /**
         * 获取当前分类
         * @returns {{id: *, type: *}}
         */
        getCurrentTab: function() {
            var li = $(".catalog li.active");
            var id = li.attr("data-id");
            var type = li.attr("data-type");
            return {
                id: id,
                type: type
            };
        },
        initScroller: function() {}
    });
    module.exports = new NaviView();
});

/**
 * Created by wangyongchao on 2014/9/2.
 */
define("square/src/1.0.0/models/navi-model-debug", [], function(require, exports, module) {
    var NaviModel = Backbone.Model.extend({
        defaults: {
            items: [ {
                id: "1",
                TypeName: "最热门",
                Type: "9999"
            } ]
        },
        parse: function() {
            var items = this.get("items");
            for (var i in items) {
                console.log(items[i]);
            }
        }
    });
    module.exports = NaviModel;
});

define("square/src/1.0.0/controls/topic-manager-debug", [ "square/src/1.0.0/common/util-debug", "square/src/1.0.0/common/phone-adapter-debug", "square/src/1.0.0/views/topic-view-debug", "square/src/1.0.0/templates/templates-module-debug", "square/src/1.0.0/collections/topic-collection-debug", "square/src/1.0.0/models/topic-beside-model-debug", "square/src/1.0.0/views/slide-view-debug", "iscroll-debug", "square/src/1.0.0/models/slide-model-debug", "localdb-debug", "square/src/1.0.0/views/content-view-debug", "square/src/1.0.0/models/page-model-debug" ], function(require, exports, module) {
    var util = require("square/src/1.0.0/common/util-debug");
    var TopicView = require("square/src/1.0.0/views/topic-view-debug");
    var TopicCollection = require("square/src/1.0.0/collections/topic-collection-debug");
    var Templates = require("square/src/1.0.0/templates/templates-module-debug");
    var SlideView = require("square/src/1.0.0/views/slide-view-debug");
    var localdb = require("localdb-debug");
    var ContentView = require("square/src/1.0.0/views/content-view-debug");
    var TopicManager = Backbone.View.extend({
        tagName: "div",
        templateId: "tabContentTpl",
        className: "nav-tab-content",
        attributes: function() {
            var id = "topic_container_" + this.options.dataId;
            return {
                id: id
            };
        },
        initialize: function(opts) {
            _.bindAll(this, "addOne", "addAll", "loadMoreTopics");
            var collection = new TopicCollection();
            collection.typeId = opts.dataType;
            collection.offset = {
                group: 0,
                page: 0
            };
            this.listenTo(collection, "add", this.addOne);
            this.listenTo(collection, "reset", this.addAll);
            this.collection = collection;
        },
        render: function() {
            var content = new ContentView({
                wrapper: this.$el,
                loadMoreCallback: this.loadMoreTopics
            });
            this.wrapper = content.contentWrapper;
            this.contentView = content;
            this.wrapper.html(Templates[this.templateId].call(_));
            this.initData({
                refresh: false
            });
            content.init();
            return this.$el;
        },
        addOne: function(model) {
            var view = new TopicView({
                model: model
            });
            this.$(".topic_container").append(view.render());
        },
        addAll: function() {
            console.log("reset topic list");
            this.$(".topic_container").html("");
            if (this.collection.length) {
                this.collection.each(this.addOne);
            }
            $(window).resize();
        },
        /**
         * 渲染顶部图片
         * @param images
         */
        renderSlider: function(images) {
            if (this.imageSlider) {
                this.imageSlider.initImgData(images);
            } else {
                var slideView = new SlideView({
                    items: images,
                    type: this.options.dataType
                });
                slideView.$el = this.$(".slider");
                slideView.render();
                this.imageSlider = slideView;
            }
        },
        /**
         * 初始化分类下的内容
         * @param opts
         */
        initData: function(opts) {
            var self = this;
            var param = {
                typeId: self.options.dataType
            };
            var dataKey = "topicList_" + self.options.dataType;
            var successFunc = function(data) {
                self.renderSlider(data.images);
                self.collection.initData(data.list);
                if (opts && opts.callback) {
                    opts.callback();
                }
            };
            //从本地数据库获取
            try {
                var data = localdb.get(dataKey);
            } catch (e) {
                util.toast("无法从本地获取数据");
            }
            if (data && data.list && data.list.length && !opts.refresh) {
                successFunc(data);
            } else {
                $.extend(param, util.getAjaxCommonParam());
                $.ajax({
                    url: util.getUrl("topTopic"),
                    data: param,
                    type: "POST",
                    dataType: "json"
                }).done(function(response) {
                    if (response && response.list && response.list.length) {
                        successFunc(response);
                        //存入本地数据库
                        try {
                            localdb.set(dataKey, response);
                        } catch (e) {
                            util.toast("无法缓存数据到本地");
                        }
                    } else {
                        util.toast("加载失败，请稍后再试");
                    }
                }).fail(function() {
                    util.toast("加载失败，请稍后再试");
                });
            }
        },
        /**
         * 滑动刷新回调函数
         * @param param
         */
        loadMoreTopics: function(param) {
            console.log("刷新回调:" + param.loadType);
            //模拟ajax加载数据，complete为回调函数，关闭加载状态
            //            setTimeout(param.complete, 2000);
            var opts = {
                callback: param.complete
            };
            if (param.loadType) {
                this.collection.getMoreData(opts);
            } else {
                opts.refresh = true;
                this.initData(opts);
            }
        },
        hide: function() {
            this.$el.hide();
        },
        show: function() {
            this.$el.fadeIn();
        },
        refresh: function() {
            console.log("topicManager refresh~");
            if (this.imageSlider && this.imageSlider.scroller) {
                this.imageSlider.scroller.refresh();
            }
            this.contentView.adjustFrame();
            this.contentView.resetScrollPos();
        }
    });
    module.exports = TopicManager;
});

/**
 * Created by wangyongchao on 2014/9/2.
 */
define("square/src/1.0.0/views/topic-view-debug", [ "square/src/1.0.0/templates/templates-module-debug" ], function(require, exports, module) {
    var Templates = require("square/src/1.0.0/templates/templates-module-debug");
    module.exports = Backbone.View.extend({
        templateId: "topicTpl",
        attributes: function() {
            return {
                "data-id": this.model.get("id")
            };
        },
        tagName: "article",
        className: "topic",
        events: {
            tap: "dumpToDetailPage"
        },
        initialize: function() {},
        render: function() {
            this.$el.html(Templates[this.templateId].call(_, this.model.toJSON()));
            return this.$el;
        },
        dumpToDetailPage: function() {
            console.log("跳转到详情页!");
            var count = +this.model.get("browsers");
            this.model.set("browsers", count + 1);
            squareApp.navigate("/topicDetail/" + this.model.get("type") + "/" + this.model.get("id"), {
                trigger: true
            });
        }
    });
});

/**
 * 话题collection
 */
define("square/src/1.0.0/collections/topic-collection-debug", [ "square/src/1.0.0/models/topic-beside-model-debug", "square/src/1.0.0/common/util-debug", "square/src/1.0.0/common/phone-adapter-debug" ], function(require, exports, module) {
    var TopicModel = require("square/src/1.0.0/models/topic-beside-model-debug");
    var util = require("square/src/1.0.0/common/util-debug");
    var TopicCollection = Backbone.Collection.extend({
        model: TopicModel,
        url: "",
        initialize: function(data, opts) {},
        /**
         * 清洗转化数据
         * @param response
         * @returns {*}
         */
        parse: function(response) {
            return response;
        },
        //		comparator: function(model){
        //			return -(model.get("time"));
        //		},
        populate: function(responseJSON, reset) {
            // populate collection
            var models = responseJSON;
            // 如果返回错误，什么也不执行
            if (!models) {
                return;
            }
            var topicList = [];
            for (var i = 0; i < models.length; i++) {
                var topicModel = new TopicModel();
                topicModel.set(topicModel.parseData(models[i]));
                topicModel.set({
                    topicId: this.topicId
                });
                topicList.push(topicModel);
                switch (topicModel.get("type")) {
                  case util.topicType.group:
                    this.offset.group = topicModel.get("id");
                    break;

                  case util.topicType.page:
                    this.offset.page = topicModel.get("id");
                    break;
                }
            }
            if (reset) {
                this.reset(topicList);
            } else {
                this.set(topicList, {
                    remove: false
                });
            }
        },
        initData: function(response) {
            this.populate(response, true);
        },
        getMoreData: function(opts) {
            var self = this;
            var param = {
                typeId: this.typeId,
                topicid: this.offset.group,
                elementid: this.offset.page,
                pagesize: 20,
                logic: true
            };
            //追加公共参数
            $.extend(param, util.getAjaxCommonParam());
            $.ajax({
                url: util.getUrl("topicList"),
                type: "POST",
                dataType: "json",
                data: param
            }).done(function(response) {
                var responseJSON = self.parse(response);
                self.populate(responseJSON);
            }).fail(function() {
                seajs.log("failed to get more topic list from server");
            }).always(function() {
                if (opts.callback) {
                    opts.callback();
                }
            });
        }
    });
    module.exports = TopicCollection;
});

define("square/src/1.0.0/views/slide-view-debug", [ "square/src/1.0.0/templates/templates-module-debug", "iscroll-debug", "square/src/1.0.0/common/phone-adapter-debug", "square/src/1.0.0/models/slide-model-debug" ], function(require, exports, module) {
    var Templates = require("square/src/1.0.0/templates/templates-module-debug");
    var IScroll = require("iscroll-debug");
    var adapter = require("square/src/1.0.0/common/phone-adapter-debug");
    var SlideModel = require("square/src/1.0.0/models/slide-model-debug");
    var SlideView = Backbone.View.extend({
        templateId: "slideTpl",
        events: {
            "tap .slide": "enterHotBlock"
        },
        initialize: function(opts) {
            this.initialized = false;
            this.initImgData(opts.items);
            this.listenTo(this.model, "change", this.render);
        },
        initImgData: function(items) {
            var model = this.model ? this.model : new SlideModel();
            model.set({
                items: model.populate(items)
            });
            this.model = model;
        },
        render: function() {
            this.$el.html(Templates[this.templateId].call(_, this.model.attributes));
            if (this.initialized) {
                this.scroller ? this.scroller.refresh() : null;
            } else {
                if (this.model.get("items").length > 1) {
                    this.loadedImage();
                }
                this.initialized = true;
            }
            this.delegateEvents();
        },
        loadedImage: function() {
            this.scroller = new IScroll(this.$(".imageWrapper")[0], {
                scrollX: true,
                scrollY: false,
                momentum: false,
                snap: true,
                snapSpeed: 400,
                indicators: {
                    el: this.$(".indicator")[0],
                    resize: false
                }
            });
        },
        enterHotBlock: function(e) {
            var target = $(e.target);
            target = target.is("img") || target.hasClass("content") ? target.parent() : target;
            var obj = this.model.get("items")[target.index()];
            transAndPoint(this.options.type, target.index());
            switch (+obj.type) {
              case 0:
                adapter.openUrl(obj);
                break;

              case 1:
                squareApp.navigate("/topicDetail/1/" + obj.url, {
                    trigger: true
                });
                break;

              case 2:
                squareApp.navigate("/topicDetail/2/" + obj.url, {
                    trigger: true
                });
                break;
            }
            return false;
        }
    });
    module.exports = SlideView;
});

/**
 * Created by wangyongchao on 2014/9/2.
 */
define("square/src/1.0.0/models/slide-model-debug", [], function(require, exports, module) {
    var SlideModel = Backbone.Model.extend({
        defaults: {
            items: [ {
                id: 0,
                title: "",
                summary: "",
                url: "",
                //0的时候是链接，1和2的时候是话题id
                img: "http://imgl.1.png",
                type: 0
            } ]
        },
        populate: function(items) {
            var self = this;
            var tems = [];
            _.each(items, function(item) {
                tems.push(self.parseData(item));
            });
            return tems;
        },
        parseData: function(data) {
            var tmp = {
                id: data.id || 0,
                title: data.Title || "",
                summary: data.Summary || "",
                url: data.URL || "",
                //0的时候是链接，1和2的时候是话题id
                img: data.Img || "http://imgl.1.png",
                type: data.Type || 0
            };
            return tmp;
        }
    });
    module.exports = SlideModel;
});
