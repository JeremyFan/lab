define("group/src/1.0.1/main-debug", [ "backbone-debug", "underscore-debug", "./routers/router-debug", "./views/app-view-debug", "./views/list-view-debug", "./templates/templates-module-debug", "./templates/templates-debug.html", "./collections/topic-collection-debug", "./models/topic-model-debug", "./views/topic-view-debug", "./views/group-head-view-debug", "./models/group-model-debug", "./views/new-topic-view-debug", "iscroll-debug", "./views/detail-view-debug" ], function(require, exports, module) {
    var Backbone = require("backbone-debug");
    window._ = require("underscore-debug");
    var WorkSpace = require("./routers/router-debug");
    window.app = new WorkSpace();
    window.groupInfo = window.group_info;
    window.groupList = window.resultGroup;
    Backbone.history.start();
});

define("group/src/1.0.1/routers/router-debug", [ "backbone-debug", "group/src/1.0.1/views/app-view-debug", "group/src/1.0.1/views/list-view-debug", "group/src/1.0.1/templates/templates-module-debug", "group/src/1.0.1/collections/topic-collection-debug", "group/src/1.0.1/models/topic-model-debug", "group/src/1.0.1/views/topic-view-debug", "group/src/1.0.1/views/group-head-view-debug", "group/src/1.0.1/models/group-model-debug", "group/src/1.0.1/views/new-topic-view-debug", "iscroll-debug", "group/src/1.0.1/views/detail-view-debug" ], function(require, exports, module) {
    var Backbone = require("backbone-debug"), AppView = require("group/src/1.0.1/views/app-view-debug"), ListView = require("group/src/1.0.1/views/list-view-debug"), DetailView = require("group/src/1.0.1/views/detail-view-debug");
    var WorkSpace = Backbone.Router.extend({
        routes: {
            "": "initGroup",
            "detail/:Id": "initTopicDetail"
        },
        initialize: function() {},
        initGroup: function() {
            // new ListView();
            this.appView = new AppView();
        },
        initTopicDetail: function(Id) {
            var detailView = new DetailView();
            detailView.showDetail(Id);
        }
    });
    module.exports = WorkSpace;
});

define("group/src/1.0.1/views/app-view-debug", [ "backbone-debug", "group/src/1.0.1/views/list-view-debug", "group/src/1.0.1/templates/templates-module-debug", "group/src/1.0.1/collections/topic-collection-debug", "group/src/1.0.1/models/topic-model-debug", "group/src/1.0.1/views/topic-view-debug", "group/src/1.0.1/views/group-head-view-debug", "group/src/1.0.1/models/group-model-debug", "group/src/1.0.1/views/new-topic-view-debug", "iscroll-debug" ], function(require, exports, module) {
    var Backbone = require("backbone-debug"), ListView = require("group/src/1.0.1/views/list-view-debug"), GroupHeadView = require("group/src/1.0.1/views/group-head-view-debug"), IScroll = require("iscroll-debug");
    var AppView = Backbone.View.extend({
        el: "body",
        events: {
            "tap .btn-more": "loadMore"
        },
        initialize: function() {
            this.initGroupList();
        },
        render: function() {},
        initGroupList: function() {
            // this.$el.empty();
            var groupHeadView = new GroupHeadView();
            this.$el.append(groupHeadView.render());
            this.listView = new ListView();
            // this.$el.append(listView.render());
            // this.$el.append($('<div id="wrapper"></div>').append($('<div id="scroller"></div>').append(listView.render()));
            var $scroller = $("<div></div>");
            var $groupbd = $('<div class="group-bd"></div>');
            var $wrapper = $('<div class="scroll-wrapper" id="group-scroll-wrapper"></div>');
            $scroller.append(this.listView.render());
            $scroller.append('<div class="group-ft btn-more">点击加载更多</div>');
            $wrapper.append($scroller);
            $groupbd.append($wrapper);
            this.$el.append($groupbd);
            this.iScroll = new IScroll("#group-scroll-wrapper", {
                // scrollbars:true,
                mouseWheel: true
            });
        },
        loadMore: function() {
            if ($(".btn-more").hasClass("disable")) return;
            this.setBtnMoreLoading();
            this.listView.loadMore();
            this.iScroll.refresh();
        },
        setBtnMoreNoMore: function() {
            $(".btn-more").removeClass("loading").addClass("disable").html("没有更多帖子了");
        },
        setBtnMoreLoading: function() {
            $(".btn-more").html("").addClass("loading");
        },
        setBtnMoreNormal: function() {
            $(".btn-more").html("点击加载更多").removeClass("loading");
        }
    });
    module.exports = AppView;
});

define("group/src/1.0.1/views/list-view-debug", [ "backbone-debug", "group/src/1.0.1/templates/templates-module-debug", "group/src/1.0.1/collections/topic-collection-debug", "group/src/1.0.1/models/topic-model-debug", "group/src/1.0.1/views/topic-view-debug" ], function(require, exports, module) {
    var Backbone = require("backbone-debug"), Templates = require("group/src/1.0.1/templates/templates-module-debug"), Topiclist = require("group/src/1.0.1/collections/topic-collection-debug"), TopicView = require("group/src/1.0.1/views/topic-view-debug");
    var ListView = Backbone.View.extend({
        templateId: "template-list",
        tagName: "section",
        className: "sec-topiclist",
        initialize: function() {
            // _.bindAll(this,'addOne','addAll');
            this.topiclist = new Topiclist();
            this.listenTo(this.topiclist, "add", this.addOne);
            this.listenTo(this.topiclist, "reset", this.addAll);
            this.topiclist.fill();
            window.topiclist = this.topiclist;
        },
        render: function() {
            return this.$el;
        },
        addOne: function(topic) {
            var topicView = new TopicView({
                model: topic
            });
            this.$el.append(topicView.render());
        },
        addAll: function() {
            this.$el.html("");
            this.topiclist.each(this.addOne, this);
        },
        loadMore: function() {
            this.topiclist.getMoreTopicData();
        }
    });
    module.exports = ListView;
});

/*
    How to use
    ////////////////////////////////////////
    var Templates = require('Templates');
    Templates['group/vessel'].call(_, {name: 'moe'}));
    */
define("group/src/1.0.1/templates/templates-module-debug", [], function(require, exports, module) {
    var tmplStr = require("group/src/1.0.1/templates/templates-debug.html");
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

define("group/src/1.0.1/templates/templates-debug.html", [], '<!-- 页面框架 -->\n<script type="text/template" id="template-page">\n    <header>header</header>\n    <div></div>\n</script>\n\n<!-- 聊吧信息 -->\n<script type="text/template" id="template-group-head">\n  <img src="{{=SmallLogo}}" alt="">\n  <div class="content">\n    <h3>{{=Name}}</h3>\n    <div class="info">\n      <span class="count-members">{{=UserCount}}</span> 成员\n      <span class="count-topics">{{=TotalCount}}</span> 帖子\n      <button class="btn-new" type="button">发新帖</button>\n    </div>\n  </div>\n</script>\n\n<!-- 帖子 -->\n<script type="text/template" id="template-topic">\n  <h3 class="title">{{=Title}}</h3>\n  <p class="content">{{=Summary}}</p>\n  <div class="info">\n    <span class="user">{{=nickname}}</span>\n    <span class="time">{{=Offset}}</span>\n    <span class="comments">{{=ReplyCount}}</span>\n  </div>\n</script>\n\n<!-- 帖子详情 -->\n<script type="text/template" id="template-detail">\n  <header class="page-hd">\n    <h3>帖子详情</h3>\n    <button class="btn-back" type="button"></button>\n  </header>\n  <div class="detail-bd">\n    <div class="scroll-wrapper" id="detail-scroll-wrapper">\n      <div>\n      <div class="detail-head">\n        <h3 class="title">{{=Title}}</h3>\n        <div class="user">{{=nickname}}</div>\n        <div class="info">\n          创建于:<span class="time">{{=Offset}}</span>\n        </div>       \n      </div>\n\n      <div class="content">\n        {{=Content}}\n      </div>\n      </div>\n    </div>\n  </div>\n</script>\n\n<!-- 发新帖 -->\n<script type="text/template" id="template-newtopic">\n  <header class="page-hd">发新帖\n    <button class="btn-back" type="button"></button>\n  </header>\n    <div class="nt-container">\n      <div class="nt-container-c">\n        <div class="nt-title-wrap">\n          <input type="text" class="nt-title" placeholder="标题">\n        </div>\n        <div class="nt-content-wrap">\n          <textarea class="nt-content" placeholder="内容"></textarea>\n        </div>\n      </div>\n    </div>\n  <footer class="page-ft">\n    <button type="button" class="btn-publish"></button>\n  </footer>\n</script>');

define("group/src/1.0.1/collections/topic-collection-debug", [ "backbone-debug", "group/src/1.0.1/models/topic-model-debug" ], function(require, exports, module) {
    var Backbone = require("backbone-debug"), TopicModel = require("group/src/1.0.1/models/topic-model-debug");
    var TopicCollection = Backbone.Collection.extend({
        model: TopicModel,
        initialize: function() {
            this.pageCount = 2;
        },
        fill: function(data) {
            var topics = data || this.getTopicData(), topicList = [], topicModel, i;
            for (i = 0; i < topics.length; i++) {
                topicModel = new TopicModel();
                topicModel.set(topics[i]);
                topicModel.set("id", topics[i].Id);
                topicList.push(topicModel);
            }
            this.set(topicList, {
                remove: false
            });
            if (window.app.appView) {
                window.app.appView.iScroll.refresh();
            }
        },
        // 获取帖子数据
        getTopicData: function() {
            if (window.groupList.length) {
                return window.groupList;
            } else {
                throw new Error("can not find topics");
            }
        },
        getMoreTopicData: function() {
            var collection = this, data = {
                groupId: window.groupInfo.Id,
                page: this.pageCount,
                essenType: 0
            };
            $.ajax({
                url: "/group/groupwap/topiclist",
                data: data,
                type: "post",
                dataType: "json",
                success: function(result) {
                    if (result.grouptopicList.length) {
                        this.topiclist.fill(result.grouptopicList);
                        window.app.appView.setBtnMoreNormal();
                        collection.pageCount++;
                    } else {
                        window.app.appView.setBtnMoreNoMore();
                    }
                },
                error: function() {
                    debugger;
                }
            });
        }
    });
    module.exports = TopicCollection;
});

define("group/src/1.0.1/models/topic-model-debug", [ "backbone-debug" ], function(require, exports, module) {
    var Backbone = require("backbone-debug");
    var TopicModel = Backbone.Model.extend({
        defaults: {}
    });
    module.exports = TopicModel;
});

define("group/src/1.0.1/views/topic-view-debug", [ "backbone-debug", "group/src/1.0.1/templates/templates-module-debug" ], function(require, exports, module) {
    var Backbone = require("backbone-debug");
    Templates = require("group/src/1.0.1/templates/templates-module-debug");
    var TopicView = Backbone.View.extend({
        templateId: "template-topic",
        tagName: "article",
        className: "topic",
        events: {
            // 'click': 'detail',
            tap: "detail"
        },
        render: function() {
            this.$el.html(Templates[this.templateId].call(_, this.model.toJSON()));
            return this.$el;
        },
        detail: function() {
            window.app.navigate("/detail/" + this.model.get("Id"), {
                trigger: true
            });
        }
    });
    module.exports = TopicView;
});

define("group/src/1.0.1/views/group-head-view-debug", [ "backbone-debug", "group/src/1.0.1/templates/templates-module-debug", "group/src/1.0.1/models/group-model-debug", "group/src/1.0.1/views/new-topic-view-debug" ], function(require, exports, module) {
    var Backbone = require("backbone-debug"), Templates = require("group/src/1.0.1/templates/templates-module-debug"), GroupModel = require("group/src/1.0.1/models/group-model-debug"), NewTopicView = require("group/src/1.0.1/views/new-topic-view-debug");
    var GroupHeadView = Backbone.View.extend({
        templateId: "template-group-head",
        tagName: "header",
        className: "group-hd",
        // model:GroupModel,
        events: {
            "tap .btn-new": "showNewTopic"
        },
        initialize: function() {
            this.model = new GroupModel();
        },
        showNewTopic: function() {
            var newTopicView = new NewTopicView();
            newTopicView.showNewTopic();
        },
        render: function() {
            this.build();
            this.$el.html(Templates[this.templateId].call(_, this.model.toJSON()));
            return this.$el;
        },
        build: function() {
            var group = this.getGroupInfo();
            group.SmallLogo = __resourceDomain + group.SmallLogo;
            group.MiddleLogo = __resourceDomain + group.MiddleLogo;
            this.model.set(group);
        },
        getGroupInfo: function() {
            // return {
            //   id: 1,
            //   members: 567,
            //   topics: 1878,
            //   name: '我们什么都聊',
            //   description: '小组简介：第一时间知晓天下大事，这里有时下大家都在讨论的最热事件、这里有大家的自由观点，这里有你志同道合的好“话友”！'
            // }
            if (typeof window.groupInfo !== "undefined") {
                return window.groupInfo;
            } else {
                throw new Error("can not find group.");
            }
        }
    });
    module.exports = GroupHeadView;
});

define("group/src/1.0.1/models/group-model-debug", [ "backbone-debug" ], function(require, exports, module) {
    var Backbone = require("backbone-debug");
    var GroupModel = Backbone.Model.extend({
        defaults: {}
    });
    module.exports = GroupModel;
});

define("group/src/1.0.1/views/new-topic-view-debug", [ "backbone-debug", "group/src/1.0.1/templates/templates-module-debug" ], function(require, exports, module) {
    var Backbone = require("backbone-debug");
    Templates = require("group/src/1.0.1/templates/templates-module-debug");
    var NewTopicView = Backbone.View.extend({
        templateId: "template-newtopic",
        tagName: "section",
        className: "sec-newtopic",
        events: {
            "tap .btn-back": "hideNewTopic",
            "tap .btn-publish": "publishTopic"
        },
        render: function() {
            var $container = $("body");
            this.$el.html(Templates[this.templateId]);
            $container.append(this.$el);
        },
        showNewTopic: function() {
            this.render();
            // this.$el.show().addClass('active');
            this.$el.show();
        },
        hideNewTopic: function() {
            // this.$el.removeClass('active');
            // this.$el.one('webkitTransitionEnd',function(){
            //   $(this).remove();
            // })
            this.$el.remove();
        },
        publishTopic: function() {
            var view = this, title = this.$el.find(".nt-title").val(), content = this.$el.find(".nt-content").val(), data;
            if (typeof title == "undefined" || $.trim(title) == "") {
                view.showMessage("请输入标题");
                return;
            }
            if (typeof content == "undefined" || $.trim(content) == "") {
                view.showMessage("请输入正文");
                return;
            }
            data = {
                groupId: window.groupInfo.Id,
                title: title,
                content: content,
                isSensitive: 0
            };
            $.ajax({
                url: "/group/groupwap/publishTopic",
                data: data,
                type: "post",
                dataType: "json",
                success: function(result) {
                    debugger;
                    var msg;
                    if (typeof result === "undefined") return;
                    if (result.status) {
                        msg = "发布成功！";
                        view.showMessage(msg);
                        view.hideNewTopic();
                    } else {
                        switch (result.code) {
                          case 0:
                            msg = "还正被封禁呢";
                            break;

                          case 1:
                            msg = "发帖要先加入聊吧哦";
                            break;

                          case 2:
                            msg = "发帖过快，休息一下吧~";
                            break;

                          case 3:
                            msg = "发布失败，有高危词哦";
                            break;

                          case 4:
                          case 5:
                          case 6:
                            msg = "网络开小差了，休息一下吧~";
                            break;

                          case 7:
                            msg = "已入库，但有敏感词哦";
                            break;

                          case 8:
                            msg = "发布失败，有敏感词哦";
                            break;

                          case 0:
                            msg = "";
                            break;

                          default:
                            msg = "网络开小差了，休息一下吧~";
                        }
                        view.showMessage(msg);
                    }
                },
                error: function() {
                    debugger;
                }
            });
        },
        // todo: 弹框美化
        showMessage: function(msg) {
            alert(msg);
        }
    });
    module.exports = NewTopicView;
});

define("group/src/1.0.1/views/detail-view-debug", [ "backbone-debug", "group/src/1.0.1/templates/templates-module-debug", "group/src/1.0.1/models/topic-model-debug", "iscroll-debug" ], function(require, exports, module) {
    var Backbone = require("backbone-debug");
    Template = require("group/src/1.0.1/templates/templates-module-debug"), TopicModel = require("group/src/1.0.1/models/topic-model-debug"), 
    IScroll = require("iscroll-debug");
    var DetailView = Backbone.View.extend({
        templateId: "template-detail",
        tagName: "section",
        className: "sec-topicdetail",
        model: TopicModel,
        events: {
            "click .btn-back": "hideDetail"
        },
        initialize: function() {},
        showDetail: function(id) {
            this.render(id);
            // this.$el.show().addClass('active');
            this.$el.show();
            new IScroll("#detail-scroll-wrapper", {
                mouseWheel: true
            });
        },
        hideDetail: function() {
            // this.$el.removeClass('active');
            this.$el.remove();
            window.app.navigate("", {
                trigger: false
            });
        },
        render: function(id) {
            var $container = $("body");
            this.build(id);
            $container.append(this.$el);
            this.$el.find("img").on("load", function() {
                $(window).resize();
            });
        },
        build: function(id) {
            // this.model=new TopicModel();  
            // this.model.set(this.getTopicDetail(id));
            this.model = this.getTopicDetail(id);
            this.$el.html(Templates[this.templateId].call(_, this.model.attributes));
        },
        // 获取帖子详情
        // todo：请求服务器
        getTopicDetail: function(id) {
            // return {
            //   id: id,
            //   title: '志愿者跳舞助威南京青奥会',
            //   content: '日前，一百多名南京青奥会颁奖礼仪志愿者在南京新街口正洪街广场集中亮相，以一场充满青春活力的舞蹈快闪助力青奥会网络火炬传递，同时呼吁更多的人关注并参与到青奥会中来。据了解，作为南京青奥会重要组成部分的网络火炬传递，目前全球网络火炬传递人气指数超过6600万。中新社发 泱波 摄(来源：华奥星空)'
            // }
            return window.topiclist.get(id);
        }
    });
    module.exports = DetailView;
});
