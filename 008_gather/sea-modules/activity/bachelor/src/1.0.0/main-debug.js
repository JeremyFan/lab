/**
 * Created by wangyongchao on 2014/11/3.
 */
define("activity/bachelor/src/1.0.0/main-debug", [ "backbone-debug", "marquee-debug", "./views/app-debug", "./views/pop-view-debug", "./templates/template-debug", "./templates/templates-debug.html", "./common/util-debug", "./models/score-model-debug", "placeholders-debug" ], function(require, exports, module) {
    //seajs中的preload无法顺序加载，而backbone又依赖于 $ _ 所以只有在这里加载backbone了
    require("backbone-debug");
    //jquery插件同样依赖jquery
    require("marquee-debug");
    //埋点
    window.buriedPoint = function(point) {
        seajs.log("buriedPoint: " + point);
        try {
            wa_regIdCount(point);
        } catch (e) {
            seajs.log(e);
        }
    };
    var App = require("./views/app-debug");
    window.bachelorApp = new App();
    //ie8-兼容placeholder
    if ($browser.type == "ie" && $browser.version < 9) {
        //ie8-兼容placeholder
        require("placeholders-debug").enable();
    }
});

define("activity/bachelor/src/1.0.0/views/app-debug", [ "activity/bachelor/src/1.0.0/views/pop-view-debug", "activity/bachelor/src/1.0.0/templates/template-debug", "activity/bachelor/src/1.0.0/common/util-debug", "activity/bachelor/src/1.0.0/models/score-model-debug" ], function(require, exports, module) {
    var PopView = require("activity/bachelor/src/1.0.0/views/pop-view-debug");
    var ScoreModel = require("activity/bachelor/src/1.0.0/models/score-model-debug");
    var util = require("activity/bachelor/src/1.0.0/common/util-debug");
    var AppView = Backbone.View.extend({
        el: $(document.body),
        events: {
            "click .detail_btn": "showDetail",
            "click .look_btn": "showMyScore",
            "click .invite_btn": "showInvite",
            "click .sign": "sign",
            "click .publish_btn": "publish",
            "mouseenter .top_nav": "showTop",
            "mouseenter .week_nav": "showWeekTop"
        },
        initialize: function() {
            var self = this;
            this.isLogin = !!window.__islogin || !!window.__isLogin || !!window.PROFILE_DATA.profile;
            this.render();
            this.showTop(true);
            window.adapterObj = {
                //flash调用js
                isLogin: function() {
                    return self.isLogin;
                },
                gameReturn: function(arg) {
                    if (arg.returnCode == 200 && +arg.data == 1) {
                        self.successView.model.set(arg.result);
                        self.successView.show();
                    } else {
                        self.failedView.show();
                    }
                },
                showLogin: function() {
                    self.needLogin();
                },
                noChance: function() {
                    self.moreChanceView.show();
                },
                noReplay: function() {
                    self.noChanceView.show();
                },
                buriedPoint: function(regId) {
                    buriedPoint(regId);
                },
                //js调用flash
                replay: function() {
                    try {
                        document.getElementById("myMoviename1").replay();
                    } catch (e) {
                        document.getElementById("myMoviename").replay();
                    }
                }
            };
        },
        render: function() {
            if (!this.isLogin && Fetion.APP.Web.Dialog.WindowLogin) {
                this.loginView = new Fetion.APP.Web.Dialog.WindowLogin();
            }
            this.renderSign();
            this.detailView = new PopView({
                templateId: "detailTpl"
            });
            this.successView = new PopView({
                templateId: "successTpl",
                shareType: util.shareType.success,
                model: new ScoreModel()
            });
            this.failedView = new PopView({
                templateId: "failedTpl",
                shareType: util.shareType.failed
            });
            this.scoreView = new PopView({
                templateId: "myScoreTpl",
                shareType: util.shareType.score,
                model: new ScoreModel()
            });
            this.loginDialog = new PopView({
                templateId: "loginTpl",
                data: {
                    isSign: false
                }
            });
            this.signLoginDialog = new PopView({
                templateId: "loginTpl",
                data: {
                    isSign: true
                }
            });
            this.moreChanceView = new PopView({
                templateId: "moreChanceTpl"
            });
            this.noChanceView = new PopView({
                templateId: "noChanceTpl",
                shareType: util.shareType.failed
            });
            this.flower = $('<div class="framemask" style="height: 100%; width: 100%; position: fixed; display: none;">');
            $(document.body).append(this.flower);
        },
        renderSign: function() {
            if (this.isLogin && +__signStatus) {
                $(".signed").show();
                $(".sign").remove();
            } else {
                $(".sign").show();
                $(".signed").hide();
            }
        },
        initMarquee: function(topList) {
            var param = {
                direction: "up",
                pauseOnHover: "true"
            };
            if (topList.find("ol").height() > topList.height()) {
                topList.marquee(param);
            }
        },
        /**
         * 显示总排行榜
         * @param init 是否初始化的时候第一次调用
         */
        showTop: function(init) {
            var topList = $(".top_con .top_list");
            if (topList.is(":hidden") || init === true) {
                this.$(".week_nav.on").removeClass("on");
                this.$(".top_nav").addClass("on");
                this.$(".week_list").hide();
                topList.show();
                this.initMarquee(topList);
            }
        },
        showWeekTop: function() {
            var weekList = $(".top_con .week_list");
            if (weekList.is(":hidden")) {
                this.$(".top_nav.on").removeClass("on");
                this.$(".week_nav").addClass("on");
                this.$(".top_list").hide();
                weekList.show();
                this.initMarquee(weekList);
            }
        },
        /**
         * 活动详情
         */
        showDetail: function() {
            this.detailView.show();
        },
        /**
         * 我的桃心
         */
        showMyScore: function() {
            var self = this;
            this.needLogin(function() {
                buriedPoint(35420003);
                $.ajax({
                    url: util.url.score,
                    type: "POST"
                }).done(function(response) {
                    console.log(response);
                    self.scoreView.model.set(response.data);
                });
                self.scoreView.show();
            });
        },
        /**
         * 发动态
         */
        publish: function() {
            this.needLogin(function() {
                var area = $(".publish_con");
                var summary = $.trim(area.val());
                if (summary.length && summary != area.attr("placeholder")) {
                    buriedPoint(35420004);
                    $.ajax({
                        url: util.url.publish,
                        data: {
                            summary: summary,
                            type: 1
                        },
                        //type为1的话会加一次游戏机会
                        type: "POST"
                    }).done(function(response) {
                        console.log(response);
                        if (response["returnCode"] == 200) {
                            util.toast("发布成功！");
                            $(".publish_con").val("");
                        } else {
                            util.toast("发布失败！");
                        }
                    });
                } else {
                    util.toast("请输入内容！");
                }
            });
        },
        /**
         * 需要登录才能执行
         * @param [callback] 若登录了要执行的代码
         * @param [isSign] 是否是签到的
         */
        needLogin: function(callback, isSign) {
            if (this.isLogin) {
                callback && callback();
            } else {
                isSign ? this.signLoginDialog.show() : this.loginDialog.show();
            }
        },
        /**
         * 邀请好友
         */
        showInvite: function() {
            var self = this;
            this.needLogin(function() {
                //这个控件无法隐藏，所以只能每次都new一个
                new Fetion.APP.Web.Dialog.Services.CommonInvite({
                    limitcount: 10,
                    //控制邀请的好友数目 不传默认是10个
                    sendHandler: function(ids, dialog) {
                        //ids为用户ids  dialog为弹层句柄 用于控制弹层关闭 这俩形参的名可以随便起但是不能缺
                        self.inviteBuddies(ids, dialog);
                    }
                });
            });
        },
        inviteBuddies: function(buddies, dialog) {
            if (!buddies) {
                util.toast("请先选择好友！");
                return;
            }
            buriedPoint(35420005);
            var param = {
                buddys: buddies
            };
            $.ajax({
                url: util.url.invite,
                type: "POST",
                data: param
            }).done(function(response) {
                if (response["returnCode"] == 200) {
                    util.toast("邀请成功！");
                    dialog.close();
                }
            });
        },
        /**
         * 点击登录按钮
         */
        showLogin: function() {
            if (!this.isLogin && this.loginView) {
                this.loginView.open();
            }
        },
        /**
         * 签到
         */
        sign: function() {
            var self = this;
            this.needLogin(function() {
                buriedPoint(35420001);
                $.ajax({
                    url: util.url.sign,
                    type: "POST"
                }).done(function(response) {
                    console.log(response);
                    switch (response["returnCode"]) {
                      case 200:
                        window.__signStatus = 1;
                        self.renderSign();
                        util.toast("签到成功!");
                        break;

                      case 202:
                        util.toast("已经签过到了!");
                        break;
                    }
                });
            }, true);
        },
        showFlower: function() {
            this.flower.show();
        },
        hideFlower: function() {
            this.flower.fadeOut();
        }
    });
    module.exports = AppView;
});

/**
 * Created by wangyongchao on 2014/9/2.
 */
define("activity/bachelor/src/1.0.0/views/pop-view-debug", [ "activity/bachelor/src/1.0.0/templates/template-debug", "activity/bachelor/src/1.0.0/common/util-debug" ], function(require, exports, module) {
    var Templates = require("activity/bachelor/src/1.0.0/templates/template-debug");
    var util = require("activity/bachelor/src/1.0.0/common/util-debug");
    var PopView = Backbone.View.extend({
        className: "skinv pop-container",
        events: {
            "click .close": "hide",
            "click .tomorrow": "hide",
            "click .share-friend": "shareToFriend",
            "click .try-again": "tryAgain",
            "click .sign_btn": "showLogin"
        },
        initialize: function(opts) {
            this.templateId = opts.templateId;
            this.initialized = false;
            this.jsonData = opts.data || {};
            this.shareType = opts.shareType;
            this.render();
            if (this.model) {
                this.listenTo(this.model, "change", this.render);
            }
        },
        render: function() {
            var data = this.model ? this.model.attributes : this.jsonData;
            this.$el.html(Templates.template(this.templateId, data));
            if (!this.initialized) {
                this.initialized = true;
                $(document.body).append(this.$el);
            }
        },
        show: function() {
            bachelorApp.showFlower();
            this.$el.fadeIn();
        },
        hide: function() {
            this.$el.fadeOut();
            bachelorApp.hideFlower();
            (this.shareType == util.shareType.failed || this.shareType == util.shareType.success) && this.replay();
        },
        replay: function() {
            adapterObj.replay();
        },
        tryAgain: function() {
            this.hide();
            this.replay();
        },
        shareToFriend: function() {
            var summary = util.getShareTips(this.shareType, this.model ? this.model.attributes : null);
            buriedPoint(35420008);
            $.ajax({
                url: util.url.publish,
                data: {
                    summary: summary
                },
                type: "POST"
            }).done(function(response) {
                console.log(response);
                switch (response["returnCode"]) {
                  case 200:
                    util.toast("分享成功！");
                    break;

                  case 503:
                    util.toast("已分享！");
                    break;
                }
            });
            this.hide();
            if (this.shareType == util.shareType.success || this.shareType == util.shareType.failed) {
                this.tryAgain();
            }
        },
        showLogin: function() {
            buriedPoint(35420006);
            bachelorApp.showLogin();
            this.hide();
        }
    });
    module.exports = PopView;
});

/*
 How to use
 ////////////////////////////////////////
 var Templates = require('template');
 Template.template(templateId, {name: 'moe'}));
 */
define("activity/bachelor/src/1.0.0/templates/template-debug", [], function(require, exports, module) {
    var tmplStr = require("activity/bachelor/src/1.0.0/templates/templates-debug.html");
    _.templateSettings = {
        interpolate: /\{\{=(.+?)\}\}/g,
        evaluate: /\{\{(.+?)\}\}/g
    };
    var templateFuncs = {};
    $(tmplStr).filter("script").each(function() {
        var $el = $(this);
        templateFuncs[this.id] = _.template($el.html());
    });
    var Template = {
        template: function(templateId, json) {
            json = json || {};
            return templateFuncs[templateId](json);
        }
    };
    module.exports = Template;
});

define("activity/bachelor/src/1.0.0/templates/templates-debug.html", [], '<!-- 拆散成功 -->\n<script type="text/template" id="successTpl">\n    <div class="pop"><!--成功拆散-->\n        <a href="javascript: void(0);" class="close"></a>\n\n        <h3 class="p_c">成功拆散</h3>\n\n        <div class="popa">\n            <div class="mark clr">\n                <span class="mark_left">\n                    获得了：<br>\n                    <em></em><i>{{=gotHeart}}</i>\n                </span>\n            </div>\n            <div class="msg p_c">\n                桃花运暴增，简直是饿棍中的战斗机！<br>\n                再接再厉，脱单指日可待！\n            </div>\n            <div class="btn clr">\n                <span class="a_b share-friend">分享至朋友圈</span>\n                <span class="b_b try-again"><a href="#">再来一次</a></span>\n            </div>\n        </div>\n    </div>\n</script>\n\n<!-- 拆散失败 -->\n<script type="text/template" id="failedTpl">\n    <div class="pop"><!--拆散失败-->\n        <a href="javascript: void(0);" class="close"></a>\n\n        <h3 class="p_c">拆散失败</h3>\n\n        <div class="popa">\n            <div class="msg p_c p_p">\n                很遗憾您未能成功拆散！继续战斗吧，<br>\n                成就一代恶棍，为自己代言！\n            </div>\n            <div class="btn clr">\n                <span class="a_b share-friend">分享至朋友圈</span>\n                <span class="b_b try-again"><a href="#">再来一次</a></span>\n            </div>\n        </div>\n    </div>\n</script>\n\n<!--登录提示-->\n<script type="text/template" id="loginTpl">\n    <div class="pop"><!--去登陆-->\n        <a href="javascript: void(0);" class="close"></a>\n\n        <h3 class="p_c">尊敬的用户</h3>\n\n        <div class="popa">\n            <div class="msg p_c p_p{{=isSign?\'2\':\'\'}}">\n                {{ if(isSign){ }}\n                您还未登录，请登录后再签到\n                {{ } else { }}\n                想成为一个合格的饿棍？<br>\n                亲，您还没登录哦！\n                {{ } }}\n            </div>\n            <div class="btn clr">\n                <span class="sign_btn">去登录</span>\n            </div>\n        </div>\n    </div>\n</script>\n\n<!-- 更多机会 -->\n<script type="text/template" id="moreChanceTpl">\n    <div class="pop"><!--获更多游戏机会-->\n        <a href="javascript: void(0);" class="close"></a>\n        <h4 class="p_c">赢iPhone6，将拆侣进行到底！<br>\n            想获取更多游戏机会？</h4>\n\n        <div class="popa">\n            <div class="explain">\n                <p>\n                    每日登录，5次<br>\n                    每日签到，+1次<br>\n                    发布动态，+1次<br>\n                    邀请好友，+1次\n                </p>\n            </div>\n            <div class="btn clr">\n                <span class="sign_btn tomorrow">我知道了</span>\n            </div>\n        </div>\n    </div>\n</script>\n\n<!-- 更多机会 -->\n<script type="text/template" id="noChanceTpl">\n    <div class="pop"><!--明天再来-->\n        <a href="javascript: void(0);" class="close"></a>\n        <h4 class="p_c">您已没有更多游戏机会哦！<br>\n            明天继续来战斗吧!</h4>\n        <div class="popa">\n            <div class="msg p_c p_p2">\n                拆情侣，赢iPhone6，根本停不下来！\n            </div>\n            <div class="btn clr">\n                <span class="a_b share-friend">分享至朋友圈</span>\n                <span class="b_b tomorrow">明天再来</span>\n            </div>\n        </div>\n    </div>\n</script>\n\n<!-- 我的桃心 -->\n<script type="text/template" id="myScoreTpl">\n    <div class="pop2"><!--我的桃心-->\n        <a href="javascript: void(0);" class="close"></a>\n\n        <h3>我的桃心</h3>\n\n        <div class="popa2">\n            <div class="mark clr">\n                <span class="mark_left">\n                    您已经累计获取 :<br>\n                    <em></em><i>{{=gotHeart}}</i>\n                </span>\n                <span class="mark_con">\n                    总排名:<br>\n                    <em></em><i>{{=rank}}</i>\n                </span>\n                <span class="mark_right">\n                    打败了：<br>\n                    <i>{{=percent}}%</i>的用户\n                </span>\n            </div>\n            <div class="msg p_c">\n                <!--有桃心提示-->\n                <span class="urge">再接再厉哦，脱单指日可待！</span><br>\n                <!--无桃心提示-->\n                <span class="remind" style="display:none">\n                    您还未获取桃心，继续战斗吧骚年，<br>\n                    <em>我们的宗旨是：做一名合格的饿棍，让情侣过节，让自己脱单！</em>\n                </span>\n            </div>\n            <div class="btn clr">\n                <span class="a_b share-friend btn-con">分享至朋友圈</span>\n            </div>\n        </div>\n    </div>\n</script>\n\n<!-- 活动详情 -->\n<script type="text/template" id="detailTpl">\n    <div class="pop4"><!--活动规则-->\n        <a href="javascript: void(0);" class="close"></a>\n\n        <h3>活动规则</h3>\n\n        <div class="popa4">\n            <h4>获奖规则：</h4>\n            <ul class="prize clr">\n                <li>\n                    <h5>总冠军</h5>\n\n                    <div class="iphone">\n                    </div>\n                    <span>iPhone6，共一部</span>\n\n                    <p>\n                        <strong>活动期间：</strong><br>\n                        总排行榜排名第一的用户将获得iPhone6一部；\n                    </p>\n                </li>\n                <li>\n                    <h5>周冠军</h5>\n\n                    <div class="audio">\n                    </div>\n                    <span>幻想音响，共五个</span>\n\n                    <p>\n                        <strong>活动期间：</strong><br>\n                        每周排行榜排名第一的用户，将获得幻想音响一台，共计五个周期，五个周冠军；\n                    </p>\n                </li>\n            </ul>\n            <h4>派奖时间及方式：</h4>\n            <ul class="illustrate">\n                <li>1）活动结束后两个工作日内（11月26-12月30），由工作人员统计中奖用户信息，并通过电话、飞信\n                    和用户沟通，确认中奖用户信息；\n                </li>\n                <li>2）实物奖品（iPhone6、音响）在活动结束后5个工作日内（2015年1月2号-1月8号），将会通过邮寄的方式\n                    寄送到用户指定收获地址；\n                </li>\n                <li>3）备注：奖品的获取和寄送，如由于用户告知信息错误导致无法收到奖品，后果将由用户自行承担。</li>\n            </ul>\n        </div>\n    </div>\n</script>');

define("activity/bachelor/src/1.0.0/common/util-debug", [], function(require, exports, module) {
    var gameUrl = "http://i.feixin.10086.cn/activity/bachelor";
    var baseUrl = "bachelor/";
    var Util = {
        url: {
            sign: baseUrl + "sign",
            score: baseUrl + "getHeartNum",
            publish: baseUrl + "publishCount",
            invite: baseUrl + "inviteCount",
            share: "/feedoperation/publishStatus"
        },
        shareType: {
            failed: 0,
            success: 1,
            score: 2,
            share: 3
        },
        getShareTips: function(type, data) {
            var msg = "";
            switch (type) {
              case Util.shareType.failed:
                msg = "想接吻？没门儿！史上最腹黑游戏，拆情侣，赢iPhone6，根本停不下来，猛戳";
                break;

              case Util.shareType.success:
                msg = "拆散了一对情侣，获得" + data.gotHeart + "颗桃心，我也是蛮拼了！史上最腹黑游戏，拆情侣，赢iPhone6，根本停不下来，猛戳";
                break;

              case Util.shareType.score:
                if (+data.gotHeart) {
                    msg = "拆情侣，赢iPhone6，我已获取" + data.gotHeart + "颗桃心，打败了" + data.percent + "%的用户，根本停不下来，不服来战！猛戳";
                } else {
                    msg = "想接吻？没门儿！史上最腹黑游戏，拆情侣，赢iPhone6，根本停不下来，猛戳";
                }
                break;

              case Util.shareType.share:
                msg = "想接吻？没门儿！史上最腹黑游戏，拆情侣，赢iPhone6，根本停不下来，我已经沦陷了，你还在等什么？猛戳";
                break;
            }
            msg += gameUrl;
            return msg;
        },
        /**
         * 消息提示框
         * @param content 提示内容
         */
        toast: function(content) {
            var div = $("<div>");
            div.addClass("toast-popup").append($("<span>").text(content));
            $(document.body).append(div);
            div.fadeIn();
            setTimeout(function() {
                div.fadeOut(400, function() {
                    div.remove();
                });
            }, 1500);
        }
    };
    module.exports = Util;
});

/**
 * Created by wangyongchao on 2014/9/2.
 */
define("activity/bachelor/src/1.0.0/models/score-model-debug", [], function(require, exports, module) {
    var ScoreModel = Backbone.Model.extend({
        defaults: {
            percent: 0,
            //打败的用户百分比
            rank: 0,
            //排名
            gotHeart: 0
        }
    });
    module.exports = ScoreModel;
});
