define("job/src/1.0.0/main-debug", [ "backbone-debug", "./views/app-debug", "./common/util-debug", "./collections/job-info-collection-debug", "./models/job-info-model-debug", "./views/job-info-view-debug", "./templates/templates_module-debug", "./templates/templates-debug.html", "./collections/contact-collection-debug", "./models/contact-model-debug", "./views/contact-view-debug", "./views/person-card-view-debug", "./common/view-util-debug", "./views/dialog-view-debug", "./models/dialog-model-debug", "autocompleter-debug", "autocompleterStyle-debug", "./views/message-view-debug", "./views/browser-view-debug", "./common/antiXSS-debug", "./models/switch-model-debug", "./views/switch-view-debug", "./models/industry-info-model-debug", "./views/industry-info-view-debug", "./routers/subscribe_and_publish-debug", "./views/my-job-view-debug", "./views/my-tag-view-debug", "./views/industry-tag-view-debug", "./views/search-job-view-debug", "cookie-debug" ], function(require, exports, module) {
    /****************************************************
     *          初始化的时候加载一些自启动的脚本            *
     ****************************************************/
    //扩展原生的属性
    //    require('./common/extensions');
    // loading plugin
    //    require('./common/loadingPlugin');
    //preload 加载时是无序加载,这里需要单独引
    require("backbone-debug");
    //埋点
    window.buriedPoint = function(point) {
        seajs.log("buriedPoint");
        try {
            wa_regIdCount(point);
        } catch (e) {
            seajs.log(e);
        }
    };
    var AppView = require("./views/app-debug");
    window.appView = new AppView();
    if (typeof JSON !== "object") {
        //兼容(ie8-)JSON
        require.async("json-debug");
        //ie8-兼容placeholder
        require.async("placeholders-debug").enable();
    }
});

define("job/src/1.0.0/views/app-debug", [ "job/src/1.0.0/common/util-debug", "job/src/1.0.0/collections/job-info-collection-debug", "job/src/1.0.0/models/job-info-model-debug", "job/src/1.0.0/views/job-info-view-debug", "job/src/1.0.0/templates/templates_module-debug", "job/src/1.0.0/collections/contact-collection-debug", "job/src/1.0.0/models/contact-model-debug", "job/src/1.0.0/views/contact-view-debug", "job/src/1.0.0/views/person-card-view-debug", "job/src/1.0.0/common/view-util-debug", "job/src/1.0.0/views/dialog-view-debug", "job/src/1.0.0/models/dialog-model-debug", "autocompleter-debug", "autocompleterStyle-debug", "job/src/1.0.0/views/message-view-debug", "job/src/1.0.0/views/browser-view-debug", "job/src/1.0.0/common/antiXSS-debug", "job/src/1.0.0/models/switch-model-debug", "job/src/1.0.0/views/switch-view-debug", "job/src/1.0.0/models/industry-info-model-debug", "job/src/1.0.0/views/industry-info-view-debug", "job/src/1.0.0/routers/subscribe_and_publish-debug", "job/src/1.0.0/views/my-job-view-debug", "job/src/1.0.0/views/my-tag-view-debug", "job/src/1.0.0/views/industry-tag-view-debug", "job/src/1.0.0/views/search-job-view-debug", "cookie-debug" ], function(require, exports, module) {
    var util = require("job/src/1.0.0/common/util-debug");
    var InfoCollection = require("job/src/1.0.0/collections/job-info-collection-debug");
    var pubsub = require("job/src/1.0.0/routers/subscribe_and_publish-debug");
    var ContactModel = require("job/src/1.0.0/models/contact-model-debug");
    var MyJobView = require("job/src/1.0.0/views/my-job-view-debug");
    var MyTagView = require("job/src/1.0.0/views/my-tag-view-debug");
    var IndustryTagView = require("job/src/1.0.0/views/industry-tag-view-debug");
    var cardView = require("job/src/1.0.0/views/person-card-view-debug");
    var searchJobView = require("job/src/1.0.0/views/search-job-view-debug");
    var Templates = require("job/src/1.0.0/templates/templates_module-debug");
    require("cookie-debug");
    var AppView = Backbone.View.extend({
        el: $(document.body),
        events: {
            //职场动态
            "mouseenter .jobdynamic .d_name a.n_t": "loadOnePerson",
            "mouseleave .jobdynamic .d_name": "hideCard",
            "click .recruit .delete": "clearRecruit",
            "click .newpopbox .nexico": "closeTestDiv",
            "click .newpopbox .newclz": "closeTestDiv",
            "click .get_more_feed": "getMoreData",
            "click #careerTab": "showIndustryInfo",
            "click #employmentTab": "showJobInfo"
        },
        dynamicPeople: {},
        initialize: function() {
            _.bindAll(this, "adjustFrame", "getMoreData");
            this.adjustFrame();
            // bind all event to the this namespace
            this.jobInfoCollection = new InfoCollection([], {
                viewContainer: $(".hpmwp #jobfeedContainer"),
                url: util.url.jobInfo,
                type: 1
            });
            this.industryInfoCollection = new InfoCollection([], {
                viewContainer: $(".hpmwp #industryfeedContainer"),
                url: util.url.industryInfo,
                type: 2
            });
            window.jobCollection = this.jobInfoCollection;
            $(window).resize(this.adjustFrame);
            this.render();
            //页面上写的一个变量，标识是否为第一次进来
            this.initDataFromServer();
        },
        /**
         * 刷新或者初始化职位信息
         * @param opts reset 是否要清空原来的数据
         */
        initJobInfo: function(opts) {
            opts = opts ? opts : {};
            if (opts.reset) {
                jobCollection.reset([]);
            }
            jobCollection.initData();
        },
        /**
         * 初始化数据
         */
        initDataFromServer: function() {
            //初始化职位信息
            this.initJobInfo();
            var loading = $(".bottomload");
            var loadingTips = loading.find(".loading");
            loading.show();
            //            loadingTips.html("<a href='javascript:void(0)' class='get_more_feed'>点击加载更多</a>");
            //滚动加载更多
            $(window).scroll(this.getMoreData);
            //加载更多完成后
            pubsub.subscribe("loading_jobCollection", function(key, response) {
                seajs.log("scroll subscribe:callback:" + key);
                if (response && response["returnCode"] == 200 && response.data && !response.data.length) {
                    loadingTips.html("没有更多内容了~");
                } else {
                    loadingTips.html("<a href='javascript:void(0)' class='get_more_feed'>点击加载更多</a>");
                }
            });
            //获取我的职位信息
            $.ajax({
                type: "POST",
                url: util.url.workInfo,
                dataType: "json",
                data: {},
                success: function(response) {
                    if (response["returnCode"] == 200) {
                        var myJobModel = new ContactModel();
                        myJobModel.set(myJobModel.parse(response["data"]));
                        var myJobView = new MyJobView({
                            model: myJobModel
                        });
                        myJobView.render($(".myjobnew"));
                        var myTagView = new MyTagView({
                            model: myJobModel
                        });
                        myTagView.render($(".t_bot .jobnews"));
                        if (isFirstVisit) {
                            myTagView.toggleAddTag();
                        }
                        window.myJobModel = myJobModel;
                    } else {
                        seajs.log(response);
                    }
                },
                error: function() {
                    seajs.log("location get failed.");
                }
            });
            //获取我的资讯标签
            $.ajax({
                type: "POST",
                url: util.url.industryTag,
                dataType: "json",
                data: {},
                success: function(response) {
                    if (response["returnCode"] == 200) {
                        var industryTagView = new IndustryTagView({
                            model: {
                                tags: response["data"]
                            }
                        });
                        industryTagView.render($(".t_bot .info"));
                    } else {
                        seajs.log(response);
                    }
                },
                error: function() {
                    seajs.log("location get failed.");
                }
            });
        },
        /**
         * 展示资讯信息
         */
        showIndustryInfo: function() {
            window.buriedPoint(35506044);
            $(".t_top li a").addClass("t_act");
            $(".t_top li.r_b a").removeClass("t_act");
            $("#jobfeedContainer").hide();
            $("#industryfeedContainer").show();
            $(".jobnews").hide();
            $(".info").show();
            $(".bottomload .loading").html("<a href='javascript:void(0)' class='get_more_feed'>点击加载更多</a>");
            window.jobCollection = this.industryInfoCollection;
            if (!jobCollection.length) {
                jobCollection.initData();
            }
        },
        /**
         * 展示招聘信息
         */
        showJobInfo: function() {
            window.buriedPoint(35506043);
            $(".t_top li a").removeClass("t_act");
            $(".t_top li.r_b a").addClass("t_act");
            $("#industryfeedContainer").hide();
            $(".info").hide();
            $("#jobfeedContainer").show();
            $(".jobnews").show();
            $(".bottomload .loading").html("<a href='javascript:void(0)' class='get_more_feed'>点击加载更多</a>");
            window.jobCollection = this.jobInfoCollection;
        },
        //滚动加载更多职位信息
        getMoreData: function() {
            //            var self=this;
            var loading = $(".bottomload");
            var loadingTips = loading.find(".loading");
            var loadingSpan, docScrollTop;
            loadingSpan = loading.find("span");
            docScrollTop = $(document).scrollTop();
            this.floatPieces();
            if (loading.find(".get_more_feed").length && /*loadingSpan.is(":hidden") &&*/ docScrollTop + $(window).height() >= $(document).height() - 20) {
                if (jobCollection.length) {
                    loading.show();
                    loadingTips.html("加载中...<span></span>");
                    jobCollection.getMoreData();
                }
            }
        },
        render: function() {
            seajs.log("app render");
            $(".jobsearch").html(searchJobView.render());
        },
        // adjust the container's height and widht
        adjustFrame: function() {
            // setting the content's height
            this.floatPieces();
        },
        //滚动条滚动过程中 判断需要挂在页面上的块
        floatPieces: function() {
            var leftSub = $("#left_sub");
            var rightSub = $("#right_sub");
            var rightPiece = rightSub.find(".rightPiece");
            var height = rightSub.height() - rightPiece.height();
            height = height < rightPiece.height() ? 200 : height;
            var docScrollTop = $(document).scrollTop();
            if (docScrollTop > height) {
                rightPiece.addClass("coffixed");
                rightPiece.css("left", function() {
                    if ($(window).width() <= 750) {
                        return 750 - $(document).scrollLeft();
                    } else {
                        return ($(window).width() - 980) / 2 + 750;
                    }
                });
            } else {
                rightPiece.removeClass("coffixed");
            }
        },
        /**
         * 加载个人信息
         * @param e
         */
        loadOnePerson: function(e) {
            var self = this;
            e = e || window.event;
            var $target = $(e.target || e.srcElement);
            var uid = $target.attr("data-id");
            var type = $target.attr("data-type");
            var person = this.dynamicPeople[uid];
            if (!person) {
                person = new ContactModel({
                    loading: true
                });
                this.dynamicPeople[uid] = person;
                //异步获取
                var container = $target.parents(".d_name:first");
                this.ajaxGetPerson(person, {
                    uid: uid,
                    type: type,
                    container: container,
                    callback: function() {
                        //如果卡片还在
                        if (cardView.isShow()) {
                            self.showPersonCard(container, person.attributes);
                        }
                    }
                });
            }
            this.showPersonCard($target.parents(".d_name:first"), person.attributes);
        },
        ajaxGetPerson: function(person, opts) {
            var self = this;
            var param = {
                buddyId: opts.uid,
                type: opts.type
            };
            $.ajax({
                type: "POST",
                url: util.url.person,
                dataType: "json",
                data: param,
                success: function(response) {
                    if (response["returnCode"] == 200) {
                        var json = response["data"];
                        $.extend(json, param);
                        person.set(person.parse(response["data"]));
                        if (opts.callback) {
                            opts.callback();
                        }
                    } else {
                        seajs.log(response);
                    }
                },
                error: function() {
                    seajs.log("location get failed.");
                }
            });
        },
        /**
         * 显示卡片
         * @param container
         * @param data
         */
        showPersonCard: function(container, data) {
            var pos = {
                div: {
                    top: 20,
                    left: -150
                },
                i: {
                    top: -6,
                    left: 160
                }
            };
            cardView.showPersonCard(container, data, pos);
        },
        /**
         * 隐藏卡片
         */
        hideCard: function() {
            cardView.hidePersonCard();
        },
        /**
         * 清除关注的招聘
         */
        clearRecruit: function() {},
        /**
         * 设置搜索信息
         * @param text
         */
        setSearchText: function(text) {
            if (!text) {
                $(".search_end .job").text("抱歉，没有找到 '" + jobCollection.keyWords + "' 相关结果!");
                $(".search_end .result").hide();
            } else {
                $(".search_end .job").text(text);
                $(".search_end .result").show();
                //清除之前加载更多时，产生的“没有更多了”的提示消息
                $(".bottomload").hide();
                $(".bottomload .loading").text("加载中...").append($("<span>"));
            }
        },
        /**
         *是否进入测试页
         * @param
         */
        jobFunnyTest: function() {
            $("body").append(Templates["job-funnytest"].call(_));
        },
        /**
         * 关闭测试窗口
         */
        closeTestDiv: function() {
            var self = this;
            $(".newpopbox").fadeOut(300, function() {
                $(".photo_mask").hide();
                $(".newpopbox").remove();
                //初始化数据
                self.initDataFromServer();
            });
        }
    });
    module.exports = AppView;
});

define("job/src/1.0.0/common/util-debug", [], function(require, exports, module) {
    var basePath = "/contacts/job/";
    var utils = {
        /**
         * ajax请求必须带的参数
         * @param arg 方便以后扩展，目前没什么用
         */
        getAjaxCommonParam: function() {
            var param = {};
            return param;
        },
        collectionInstanceIndex: 0,
        /**
         * 获取一个标识符，为了标识唯一
         * @returns {number}
         */
        getCollectionInstanceIndex: function() {
            return this.collectionInstanceIndex++;
        },
        /**
         * 与server交互的url地址
         */
        url: {
            testfeed: "http://x.fx-dev.com/careertest/sendTestFeed",
            //开始测试发feed。
            questionlist: "http://x.fx-dev.com/careertest/questionlist",
            //获取试题。
            //            addTag: basePath + 'addInterestPosition', //添加用户感兴趣的职位
            //            delTag: basePath + 'delInterestPosition', //删除用户感兴趣的职位
            saveTag: basePath + "multAddInterestPosition",
            //保存感兴趣的职位
            person: basePath + "personalInfoCard",
            //获取卡片
            jobInfo: basePath + "jobRecommend",
            //获取职位信息推荐
            industryInfo: basePath + "jobNews",
            //获取资讯信息推荐
            recommendJobInfo: basePath + "getJobRecommender",
            //获取招聘推荐信息
            recommendIndustry: basePath + "newInfoByKey",
            //获取资讯相关职位信息推荐
            jobSearch: basePath + "jobSearch",
            //根据关键词 获取职位推荐
            jobEvent: basePath + "jobEvent($userId)",
            //获取职场动态
            workInfo: basePath + "isPersonalInfoCompleted",
            //获取个人相关职位信息和感兴趣的职位
            industryTag: basePath + "getAllNewsTag",
            //获取资讯标签
            myIndustryTag: basePath + "updateInterestNewsTag",
            //我感兴趣的资讯标签
            editWorkInfo: basePath + "updatePersonalInfo",
            //个人信息添加修改
            province: basePath + "getProvince",
            //获取中国省份
            city: basePath + "getCityListBypro",
            //获取城市
            addFriend: basePath + "addBuddy",
            //添加好友
            sendMessage: "/messages/charttoprivacy",
            //联系TA  发消息
            addBrowser: basePath + "addViewNewsUser",
            //添加资讯阅读用户
            getBrowser: basePath + "getViewNewsUser"
        },
        /**
         * 消息提示框
         * @param time 消失时长(毫秒)
         * @param title 提示内容
         * @param className 提示层的样式 可选
         */
        createPop: function(time, title, className) {
            className = className ? className : "temp-popup";
            $("body").append($("<div class=" + className + ">" + title + "</div>"));
            // seajs.log($('.'+className).css('width'));
            //            var leftPx = $('.' + className).css('width');
            //            seajs.log(Number(leftPx));
            //$('.'+className).css('left', -40);
            setTimeout(function() {
                $("." + className).animate({
                    height: 0
                }, function() {
                    $("." + className).remove();
                });
            }, time);
        },
        subtituteSpecChar: function(originString) {
            var re = /</g;
            var result = String(originString).replace(re, "&lt");
            re = />/g;
            result = String(result).replace(re, "&gt");
            return result;
        },
        //添加阅读更多分割标记处理
        addSpliteMoreSign: function(originString) {
            if (originString.length > 200) {
                var result = originString.substr(0, 200);
                var lastString = result + "$splite&" + originString.substr(200, originString.length - 1);
                return lastString;
            } else {
                return originString;
            }
        },
        /**
         * 截取字符串
         * @param $input
         * @param maxCount
         * @returns {String}
         */
        subContent: function($input, maxCount) {
            var content = $input.val();
            var flag = /[^\s]+/.test(content);
            if (flag && content.length > maxCount) {
                var left = content.substr(0, maxCount);
                seajs.log("substr====" + left);
                $input.val(left);
                this.createPop(2e3, "最多输入" + maxCount + "字", "temp-popup");
            }
            return content;
        },
        subUrlString: function(originString) {
            // var strRegex = "[a-zA-Z0-9\\.\\-]+\\.([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&*+?:_/=<>]*)?";
            var strRegex = "((file|gopher|news|nntp|telnet|http|ftp|https|ftps|sftp)://)?((([a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})*(\\.com|\\.edu|\\.gov|\\.int|\\.mil|\\.net|\\.org|\\.biz|\\.info|\\.pro|\\.name|\\.museum|\\.coop|\\.aero|\\.xxx|\\.idv|\\.au|\\.mo|\\.ru|\\.fr|\\.ph|\\.kr|\\.ca|\\.kh|\\.la|\\.my|\\.mm|\\.jp|\\.tw|\\.th|\\.hk|\\.sg|\\.it|\\.in|\\.id|\\.uk|\\.vn|\\.cn)))|(((25[0-5])|(2[0-4]\\d)|(1\\d\\d)|([1-9]\\d)|\\d)(\\.((25[0-5])|(2[0-4]\\d)|(1\\d\\d)|([1-9]\\d)|\\d)){3}))(:((6[0-5][0-5][0-3][0-5])|([1-5][0-9][0-9][0-9][0-9])|([0-9]{1,4})))?(/[a-zA-Z0-9\\.\\-~!@#$%^&*+?:_/=<>]*)?";
            var re = new RegExp(strRegex, "gi");
            var arrMactches = originString.match(re);
            if (arrMactches) {
                for (var i = 0; i < arrMactches.length; i++) {
                    originString = originString.replace(re, "<a class='urlstring'>" + arrMactches[i] + "</a>");
                }
            }
            return originString;
        },
        //        /**
        //         * 日期格式
        //         */
        //        dateFormat: {
        //            "default": "MM月dd日 HH:mm",
        //            "long": "yyyy-MM-dd HH:mm",
        //            "short": "yyyy-MM-dd"
        //        },
        //
        //        /**
        //         * 时间转化
        //         * @param postTimeStamp {long}
        //         * @returns {String}
        //         */
        //        processTimeStamp: function (postTimeStamp) {
        //            var currentStamp = new Date().getTime();
        //
        //            var todayStamp = new Date().setHours(0, 0, 0, 0);
        //            var yesterdayStamp = todayStamp - 86400000 * 1;
        //            var beforyesterdayStamp = todayStamp - 86400000 * 2;
        //
        //            var interval = currentStamp - postTimeStamp;
        //
        //            var timeText;
        //            var time = new Date(postTimeStamp).Format("HH:mm");
        //
        //            if (postTimeStamp < yesterdayStamp && postTimeStamp >= beforyesterdayStamp){
        //                timeText = "前天 " + time;
        //            } else if (postTimeStamp < todayStamp && postTimeStamp >= yesterdayStamp){
        //                timeText = "昨天" + time;
        //            } else if (postTimeStamp >= todayStamp){
        //                if (interval < 60 * 1000) {
        //                    timeText = "刚刚";
        //                } else if (interval >= 60 * 1000 && interval < 60 * 60 * 1000) {
        //                    timeText = Math.floor(interval / (1000 * 60)) + "分钟前";
        //                } else {
        //                    timeText = "今天" + time;
        //                }
        //
        //            } else {
        //                timeText = new Date(postTimeStamp).Format(this.dateFormat.default);
        //            }
        //
        //            return timeText;
        //        },
        /**
         * 过滤表情
         * @param contentString
         */
        filterContentExpression: function(contentString) {
            if (!contentString) return "";
            //在定义时同时赋值
            var arr = {
                "[/微笑]": "new_expression_frame_001.png",
                "[/大笑]": "new_expression_frame_002.png",
                "[/Hold]": "new_expression_frame_070.png",
                "[/足球]": "new_expression_frame_071.png",
                "[/骷髅]": "new_expression_frame_076.png"
            };
            var reg = /\[\/[\u4e00-\u9fa5]{1,4}]|\[\/Hold]/gim;
            var arrMatches = contentString.match(reg);
            if (arrMatches) {
                for (var i = 0; i < arrMatches.length; i++) {
                    if (arr[arrMatches[i]]) {
                        contentString = contentString.replace(arrMatches[i], '<img title="' + '" src="images/new_expression/' + arr[arrMatches[i]] + '"  class="face-size" />');
                    }
                }
            }
            return contentString;
        },
        /**
         * 模拟浏览器的confirm
         * @param title 标题
         * @param msg 提示信息
         * @param callback 确定和取消的回调函数
         */
        confirm: function(title, msg, callback) {
            var confirmDiv = '<div class="delete-broadcast-popup">' + '<div class="mask-layer"></div>' + '<div class="alert-container">' + '<div class="alert-main-con">' + '<div class="confirm-text">' + msg + "</div>" + '<div class="confirm-button">' + '<span class="confirm-ok">确定</span>' + '<span class="confirm-cancel">取消</span>' + "</div>" + "</div>" + "</div>" + "</div>";
            $("#alert-dialog").html(confirmDiv);
            $("#alert-dialog .confirm-ok").on("click", function() {
                if (callback.OK) {
                    callback.OK();
                }
                $("#alert-dialog").hide();
            });
            $("#alert-dialog .confirm-cancel").on("click", function() {
                if (callback.CANCEL) {
                    callback.CANCEL();
                }
                $("#alert-dialog").hide();
            });
            $("#alert-dialog").show();
        },
        //随机样式
        tagStart: [ "a", "b", "c" ],
        //上次随机的数字
        lastNum: undefined,
        /**
         * 随机获取标签的样式
         * @param repeat 是否可以重复 default: true
         * @returns {string}样式名
         */
        randomPrefix: function(repeat) {
            var last = repeat ? repeat : utils.lastNum;
            var _start = utils.randomNum(utils.tagStart.length, last);
            //记录上一次随机的数字
            utils.lastNum = _start;
            return utils.tagStart[_start] + "_";
        },
        /**
         * 随机一个指定范围的数字
         * @param range 范围
         * @param last 上次随机结果
         * @returns {number}
         */
        randomNum: function(range, last) {
            var num = Math.floor(Math.random() * range);
            if (last != undefined) {
                if (num == last) {
                    num = utils.randomNum(range, last);
                }
            }
            return num;
        },
        provinces: [],
        /**
         * 获取省份
         * @returns {*}
         */
        getProvinces: function() {
            if (!utils.provinces.length) {
                $.ajax({
                    url: utils.url.province,
                    type: "POST",
                    async: false,
                    dataType: "json",
                    data: {},
                    success: function(response) {
                        //                        if(response['returnCode'] == 200) {
                        utils.provinces = response;
                    },
                    error: function() {
                        seajs.log("JobInfo get more data from server failed");
                    }
                });
            }
            return utils.provinces;
        },
        /**
         * 判断的字节长度
         * @param text
         * @returns {number}
         */
        getByteLength: function(text) {
            var count = 0;
            for (var i = 0; i < text.length; i++) {
                if (text.charAt(i).match(/[^\x00-\xff]/gi) != null) //全角
                count += 2; else count += 1;
            }
            return count;
        },
        /**
         * 设置滚动条高度
         * @param opts e.g. {container: el, scrollHeight: 0}
         */
        restoreScroll: function(opts) {
            if (opts.container) {
                $(opts.container).animate({
                    scrollTop: opts.scrollHeight
                });
            } else {
                //不传container就是document，此处为了兼容不同浏览器
                if (document.documentElement && document.documentElement.scrollTop) {
                    document.documentElement.scrollTop = opts.scrollHeight;
                } else {
                    $(document.body).animate({
                        scrollTop: opts.scrollHeight
                    });
                }
            }
        },
        /**
         * 直辖市/自治区
         */
        bigCities: [ 1, 2, 3, 4, 33, 34 ],
        /**
         * 是否是直辖市
         * @param id
         * @returns {boolean}
         */
        isBigCites: function(id) {
            for (var i in this.bigCities) {
                if (this.bigCities[i] == id) {
                    return true;
                }
            }
            return false;
        },
        /**
         * 候选职位
         */
        //jobs: ["农艺师", "林业技术人员", "园艺师", "畜牧师", "动物育种/养殖", "动物营养/饲料研发", "饲料销售", "其他", "首席执行官CEO/总裁/总经理", "首席运营官COO", "首席财务官CFO", "CTO/CIO", "副总裁/副总经理", "分公司/代表处负责人", "部门/事业部管理", "总裁助理/总经理助理", "总编/副总编", "行长/副行长", "工厂厂长/副厂长", "校长/副校长", "合伙人", "其他", "化工工程师", "化工研发工程师", "化学分析", "化学技术应用", "化学操作", "化学制剂研发", "油漆/化工涂料研发", "塑料工程师", "化学实验室技术员/研究员", "化工项目管理", "其他", "工厂厂长/副厂长", "生产总监", "生产经理/车间主任", "生产主管/督导/组长", "生产运营管理", "生产项目经理/主管", "生产项目工程师", "产品管理", "生产计划", "制造工程师", "工艺/制程工程师", "工业工程师", "生产设备管理", "生产物料管理（PMC）", "包装工程师", "技术文档工程师", "其他", "医药代表", "医药销售经理/主管", "药品市场推广经理/主管", "药品市场推广专员/助理", "医疗器械销售", "医疗器械推广", "医药学术推广", "医药招商", "医药项目管理", "医药项目招投标管理", "生物工程/生物制药", "药品研发", "医疗器械研发", "临床研究员", "临床协调员", "临床数据分析员", "医药化学分析", "医药技术研发管理人员", "药品注册", "医疗器械注册", "药品生产/质量管理", "医疗器械生产/质量管理", "医疗器械维修/保养", "其他", "石油/天然气技术人员", "空调/热能工程师", "核力/火力工程师", "水利/水电工程师", "电力工程师/技术员", "地质勘查/选矿/采矿", "能源/矿产项目管理", "其他", "高级建筑工程师/总工", "建筑工程师", "建筑设计师", "土木/土建/结构工程师", "岩土工程", "建筑制图", "建筑工程测绘/测量", "道路/桥梁/隧道工程技术", "水利/港口工程技术", "架线和管道工程技术", "给排水/暖通/空调工程", "智能大厦/布线/弱电/安防", "室内装潢设计", "幕墙工程师", "园林/景观设计", "城市规划与设计", "市政工程师", "工程监理/质量管理", "工程造价/预结算", "工程资料管理", "建筑施工现场管理", "施工队长", "施工员", "建筑工程安全管理", "其他", "房地产项目策划经理/主管", "房地产项目策划专员/助理", "房地产项目招投标", "房地产项目开发报建", "房地产项目配套工程师", "房地产销售经理", "房地产销售主管", "房地产销售/置业顾问", "房地产评估", "房地产中介/交易", "房地产项目管理", "其他", "物业经理/主管", "物业管理专员/助理", "物业租赁/销售", "物业维修", "物业顾问", "物业招商管理", "其他", "高级软件工程师", "软件工程师", "软件研发工程师", "需求工程师", "系统架构设计师", "系统分析员", "数据库开发工程师", "ERP技术/开发应用", "互联网软件工程师", "手机软件开发工程师", "嵌入式软件开发", "移动互联网开发", "WEB前端开发", "语音/视频/图形开发", "用户界面（UI）设计", "用户体验（UE/UX）设计", "网页设计/制作/美工", "游戏设计/开发", "游戏策划", "游戏界面设计", "系统集成工程师", "其他", "电子技术研发工程师", "电子/电器工程师", "电器研发工程师", "电子/电器工艺/制程工程师", "电路工程师/技术员", "模拟电路设计/应用工程师", "版图设计工程师", "集成电路IC设计/应用工程师", "IC验证工程师", "电子元器件工程师", "射频工程师", "无线电工程师", "激光/光电子技术", "光源/照明工程师", "变压器与磁电工程师", "电池/电源开发", "家用电器/数码产品研发", "空调工程/设计", "音频/视频工程师/技术员", "安防系统工程师", "电子/电器设备工程师", "电子/电器维修/保养", "电子/电器项目管理", "电气工程师", "电气设计", "电气线路设计", "线路结构设计", "半导体技术", "仪器/仪表/计量工程师", "自动化工程师", "现场应用工程师（FAE）", "测试/可靠性工程师", "其他", "互联网产品经理/主管", "互联网产品专员/助理", "电子商务经理/主管", "电子商务专员/助理", "网络运营管理", "网络运营专员/助理", "网站编辑", "SEO/SEM", "其他", "高级硬件工程师", "硬件工程师", "嵌入式硬件开发", "其他", "IT质量管理经理/主管", "IT质量管理工程师", "系统测试", "软件测试", "硬件测试", "配置管理工程师", "信息技术标准化工程师", "其他", "公务员/事业单位人员", "科研管理人员", "科研人员", "其他", "CTO/CIO", "IT技术/研发总监", "IT技术/研发经理/主管", "IT项目总监", "IT项目经理/主管", "IT项目执行/协调人员", "其他", "信息技术经理/主管", "信息技术专员", "IT技术支持/维护经理", "IT技术支持/维护工程师", "系统工程师", "系统管理员", "网络工程师", "网络管理员", "网络与信息安全工程师", "数据库管理员", "计算机硬件维护工程师", "ERP实施顾问", "IT技术文员/助理", "IT文档工程师", "Helpdesk", "其他", "志愿者/义工", "社会工作者/社工", "其他", "信托服务", "担保业务", "拍卖师", "典当业务", "珠宝/收藏品鉴定", "其他", "厨师/面点师", "食品加工/处理", "调酒师/茶艺师/咖啡师", "营养师", "厨工", "食品/饮料研发", "食品/饮料检验", "其他", "项目总监", "项目经理/项目主管", "项目专员/助理", "广告/会展项目管理", "IT项目总监", "IT项目经理/主管", "IT项目执行/协调人员", "通信项目管理", "房地产项目配套工程师", "房地产项目管理", "证券/投资项目管理", "保险项目经理/主管", "生产项目经理/主管", "生产项目工程师", "汽车工程项目管理", "电子/电器项目管理", "服装/纺织/皮革项目管理", "医药项目管理", "化工项目管理", "物流/仓储项目管理", "咨询项目管理", "能源/矿产项目管理", "其他", "环保技术工程师", "环境评价工程师", "环境监测工程师", "水处理工程师", "固废处理工程师", "废气处理工程师", "生态治理/规划", "环境管理/园林景区保护", "其他", "质量管理/测试经理", "质量管理/测试主管", "质量管理/测试工程师", "质量检验员/测试员", "化验/检验", "认证/体系工程师/审核员", "环境/健康/安全经理/主管", "环境/健康/安全工程师", "供应商/采购质量管理", "安全管理", "安全消防", "其他", "美发/发型师", "化妆师", "美容师/美甲师", "美容顾问(BA)", "健身/美体/舞蹈教练", "按摩/足疗", "救生员", "其他", "医疗管理人员", "综合门诊/全科医生", "内科医生", "外科医生", "儿科医生", "牙科医生", "美容整形科医生", "中医科医生", "麻醉医生", "心理医生", "眼科医生/验光师", "医学影像/放射科医师", "化验/检验科医师", "药房管理/药剂师", "理疗师", "兽医", "护士/护理人员", "营养师", "针灸/推拿", "其他", "首席财务官CFO", "财务总监", "财务经理", "财务主管/总帐主管", "财务顾问", "财务助理", "财务分析经理/主管", "财务分析员", "会计经理/主管", "会计/会计师", "会计助理/文员", "出纳员", "审计经理/主管", "审计专员/助理", "税务经理/主管", "税务专员/助理", "成本经理/主管", "成本会计", "资产/资金管理", "资金专员", "统计员", "其他", "证券总监/部门经理", "证券/期货/外汇经纪人", "证券/投资客户总监", "证券/投资客户经理", "证券/投资客户主管", "证券/投资客户代表", "证券分析/金融研究", "投资/理财服务", "投资银行业务", "融资总监", "融资经理/主管", "融资专员/助理", "股票/期货操盘手", "资产评估", "风险管理/控制/稽查", "储备经理人", "证券/投资项目管理", "其他", "行长/副行长", "银行经理/主任", "银行大堂经理", "银行客户总监", "银行客户经理", "银行客户主管", "银行客户代表", "银行客户服务", "综合业务经理/主管", "综合业务专员/助理", "银行会计/柜员", "公司业务", "个人业务", "银行卡/电子银行业务推广", "信贷管理/资信评估/分析", "信审核查", "外汇交易", "进出口/信用证结算", "清算人员", "风险控制", "其他", "法务经理/主管", "法务专员/助理", "律师", "律师助理", "企业律师/合规经理/主管", "企业律师/合规顾问", "知识产权/专利顾问/代理人", "合同管理", "其他", "幼教", "小学教师", "初中教师", "高中教师", "大学教师", "职业技术教师", "家教", "兼职教师", "理科教师", "文科教师", "外语教师", "音乐教师", "美术教师", "体育老师/教练", "校长/副校长", "教学/教务管理人员", "培训督导", "培训师/讲师", "培训助理/助教", "教育产品开发", "培训策划", "培训/招生/课程顾问", "其他", "设计管理人员", "艺术/设计总监", "绘画", "原画师", "CAD设计/制图", "平面设计", "三维/3D设计/制作", "Flash设计/开发", "特效设计", "视觉设计", "用户体验（UE/UX）设计", "美术编辑/美术设计", "多媒体/动画设计", "包装设计", "家具设计", "家居用品设计", "工艺品/珠宝设计", "玩具设计", "店面/展览/展示/陈列设计", "工业设计", "游戏界面设计", "其他", "导演/编导", "总编/副总编", "艺术指导/舞美设计", "摄影师/摄像师", "化妆师/造型师/服装/道具", "主持人/司仪", "演员/模特", "配音员", "音效师", "后期制作", "经纪人/星探", "放映管理", "作家/编剧/撰稿人", "文字编辑/组稿", "美术编辑/美术设计", "记者/采编", "电话采编", "文案策划", "校对/录入", "发行管理", "排版设计", "印刷排版/制版", "印刷操作", "其他", "英语翻译", "法语翻译", "日语翻译", "德语翻译", "俄语翻译", "西班牙语翻译", "意大利语翻译", "葡萄牙语翻译", "阿拉伯语翻译", "韩语/朝鲜语翻译", "其他语种翻译", "咨询总监", "咨询经理/主管", "咨询顾问/咨询员", "专业顾问", "调研员", "数据分析师", "情报信息分析", "猎头顾问/助理", "咨询项目管理", "其他", "兼职", "临时", "其他", "其他", "行政总监", "行政经理/主管/办公室主任", "行政专员/助理", "助理/秘书/文员", "前台/总机/接待", "文档/资料管理", "电脑操作/打字/录入员", "后勤人员", "其他", "客户服务总监", "客户服务经理", "客户服务主管", "客户服务专员/助理", "客户关系/投诉协调人员", "客户咨询热线/呼叫中心人员", "网络/在线客服", "售前/售后技术支持管理", "售前/售后技术支持工程师", "其他", "销售代表", "客户代表", "销售工程师", "渠道/分销专员", "区域销售专员/助理", "业务拓展专员/助理", "大客户销售代表", "电话销售", "网络/在线销售", "团购业务员", "销售业务跟单", "医药代表", "其他", "机动车司机/驾驶", "列车驾驶/操作", "船舶驾驶/操作", "飞机驾驶/操作", "公交/地铁乘务", "列车乘务", "船舶乘务", "船员/水手", "航空乘务", "地勤人员", "其他", "物流总监", "物流经理/主管", "物流专员/助理", "货运代理", "运输经理/主管", "快递员/速递员", "水运/空运/陆运操作", "集装箱业务", "报关员", "单证员", "仓库经理/主管", "仓库/物料管理员", "理货/分拣/打包", "物流/仓储调度", "物流/仓储项目管理", "搬运工", "其他", "旅游产品销售", "旅游顾问", "导游/票务", "旅游计划调度", "旅游产品/线路策划", "签证业务办理", "其他", "市场总监", "市场经理", "市场主管", "市场专员/助理", "市场营销经理", "市场营销主管", "市场营销专员/助理", "业务拓展经理/主管", "业务拓展专员/助理", "产品经理", "产品主管", "产品专员/助理", "品牌经理", "品牌主管", "品牌专员/助理", "市场策划/企划经理/主管", "市场策划/企划专员/助理", "市场文案策划", "活动策划", "活动执行", "促销主管/督导", "促销员", "网站推广", "SEO/SEM", "学术推广", "选址拓展/新店开发", "市场调研与分析", "其他", "采购总监", "采购经理/主管", "采购专员/助理", "供应商开发", "供应链管理", "买手", "外贸/贸易经理/主管", "外贸/贸易专员/助理", "贸易跟单", "报关员", "其他", "公关总监", "公关经理/主管", "公关专员/助理", "媒介经理/主管", "媒介专员/助理", "媒介策划/管理", "政府事务管理", "其他", "通信技术工程师", "通信研发工程师", "数据通信工程师", "移动通信工程师", "电信网络工程师", "电信交换工程师", "有线传输工程师", "无线/射频通信工程师", "通信电源工程师", "通信标准化工程师", "通信项目管理", "其他", "人力资源总监", "人力资源经理", "人力资源主管", "人力资源专员/助理", "培训经理/主管", "培训专员/助理", "招聘经理/主管", "招聘专员/助理", "薪酬福利经理/主管", "薪酬福利专员/助理", "绩效考核经理/主管", "绩效考核专员/助理", "员工关系/企业文化/工会", "企业培训师/讲师", "人事信息系统(HRIS)管理", "猎头顾问/助理", "其他", "工程机械经理", "工程机械主管", "机械设备经理", "机械设备工程师", "机械工程师", "机械设计师", "机械制图员", "机械研发工程师", "机械结构工程师", "机械工艺/制程工程师", "气动工程师", "CNC/数控工程师", "模具工程师", "夹具工程师", "注塑工程师", "铸造/锻造工程师/技师", "机电工程师", "材料工程师", "机械维修/保养", "飞机设计与制造", "飞机维修/保养", "列车设计与制造", "列车维修/保养", "船舶设计与制造", "船舶维修/保养", "其他", "车床/磨床/铣床/冲床工", "模具工", "钳工/机修工/钣金工", "电焊工/铆焊工", "电工", "水工/木工/油漆工", "铲车/叉车工", "空调工/电梯工/锅炉工", "汽车维修/保养", "普工/操作工", "其他", "店长/卖场管理", "楼面管理", "品牌/连锁招商管理", "大堂经理/领班", "酒店管理", "客房管理", "收银主管", "收银员", "店员/营业员/导购员", "理货员", "促销主管/督导", "促销员", "品类管理", "前厅接待/礼仪/迎宾", "预订员", "行李员", "服务员", "防损员/内保", "奢侈品销售", "主持人/司仪", "其他", "实习生", "培训生", "储备干部", "其他", "保安经理", "保安", "家政人员", "婚礼/庆典策划服务", "宠物护理和美容", "保姆/母婴护理", "搬运工", "保洁", "其他", "销售总监", "销售经理", "销售主管", "客户总监", "客户经理", "客户主管", "渠道/分销总监", "渠道/分销经理/主管", "区域销售总监", "区域销售经理/主管", "业务拓展经理/主管", "大客户销售经理", "团购经理/主管", "医药销售经理/主管", "其他", "销售行政经理/主管", "销售行政专员/助理", "销售运营经理/主管", "销售运营专员/助理", "商务经理/主管", "商务专员/助理", "销售培训师/讲师", "销售数据分析", "其他", "汽车动力系统工程师", "汽车底盘/总装工程师", "车身设计工程师", "汽车电子工程师", "汽车机械工程师", "汽车零部件设计师", "汽车装配工艺工程师", "安全性能工程师", "汽车工程项目管理", "其他", "汽车销售", "汽车零配件销售", "汽车售后服务/客户服务", "汽车维修/保养", "汽车质量管理/检验检测", "汽车定损/车险理赔", "汽车装饰美容", "二手车评估师", "4S店管理", "其他", "广告创意/设计总监", "广告创意/设计经理/主管", "广告创意/设计师", "广告文案策划", "广告美术指导", "广告制作执行", "广告客户总监", "广告客户经理", "广告客户主管", "广告客户代表", "广告/会展业务拓展", "会展策划/设计", "会务经理/主管", "会务专员/助理", "广告/会展项目管理", "其他", "服装/纺织品设计", "服装打样/制版", "服装/纺织/皮革工艺师", "电脑放码员", "裁床", "样衣工", "面料辅料开发/采购", "服装/纺织/皮革跟单", "服装/纺织品/皮革销售", "服装/纺织品/皮革质量管理", "服装/纺织/皮革项目管理", "其他", "保险业务管理", "保险代理/经纪人/客户经理", "保险顾问/财务规划师", "保险产品开发/项目策划", "保险培训师", "保险契约管理", "核保理赔", "汽车定损/车险理赔", "保险精算师", "客户服务/续期管理", "保险内勤", "保险项目经理/主管", "储备经理人", "其他"]
        jobs: [ "销售经理/主管", "销售代表", "销售助理", "销售支持", "电话销售", "渠道专员", "汽车销售", "医疗器械销售", "网络销售", "销售总监", "医药代表", "区域销售", "渠道经理/总监", "客户经理/主管", "大客户经理", "团购业务员/经理", "会籍顾问", "客服经理/主管", "客服专员/助理", "客户关系管理", "电话客服", "售前/售后服务", "客服总监", "销售经理/主管", "销售代表", "销售助理", "销售支持", "电话销售", "渠道专员", "汽车销售", "医疗器械销售", "网络销售", "销售总监", "医药代表", "区域销售", "渠道经理/总监", "客户经理/主管", "大客户经理", "团购业务员/经理", "会籍顾问", "客服经理/主管", "客服专员/助理", "客户关系管理", "电话客服", "售前/售后服务", "客服总监", "市场专员/助理", "市场拓展", "市场调研", "市场策划", "媒介专员/助理", "会务会展专员/经理", "市场经理/总监", "品牌专员/经理", "媒介经理/主管", "公关专员/助理", "公关经理/主管", "企划经理/主管", "人事专员/助理", "薪酬/绩效/员工关系", "前台/总机/接待", "文员", "人事经理/主管", "经理助理/秘书", "后勤", "猎头顾问", "行政专员/助理", "行政经理/主管", "人事总监", "行政总监", "培训专员/助理", "培训经理/主管", "招聘专员/助理", "招聘经理/主管", "财务总监", "会计/会计师", "审计专员/助理", "出纳", "税务专员/助理", "统计员", "财务经理/主管", "财务/会计助理", "审计经理/主管", "税务经理/主管", "财务分析员", "成本管理员", "律师/法律顾问", "法务专员/主管", "产权/专利顾问", "合规管理", "律师助理", "法务经理/主管（关）", "物流经理/主管", "物流专员/助理", "仓库管理员", "快递员", "调度员", "供应链管理", "单证员", "装卸/搬运工", "物流总监", "仓库经理/主管", "国际货运", "技术总监/经理", "硬件工程师", "软件工程师", "数据库管理/DBA", "网页设计/制作", "技术支持/维护", "系统架构师", "语音/视频/图形", "产品经理/专员", "网站编辑", "网络管理员", "测试工程师", "通信技术工程师", "质量工程师", "游戏设计/开发", "网站运营", "网络与信息安全工程师", "项目经理/主管", "程序员", "技术专员/助理", "网站策划", "实施工程师", "保险经纪人", "保险精算师", "保险客户经理", "保险项目经理", "保险顾问", "车险专员", "保险内勤", "保险客服", "保险培训师", "储备经理人", "保险其他职位", "外贸经理/主管", "外贸专员/助理", "报关员", "商务专员/经理", "采购经理/总监", "采购员", "业务跟单（关）", "采购助理", "买手", "建筑工程师/总工", "土木/土建工程师", "道路桥梁技术", "给排水/制冷/暖通", "园林/景观设计", "测绘/测量", "造价师/预算师", "工程项目管理", "工程监理", "幕墙工程师", "安防工程师", "安全管理/安全员", "资料员", "市政工程师", "综合布线/弱电", "餐饮管理", "大堂经理/领班", "迎宾/接待", "服务员", "传菜员", "厨师/厨师长", "面点师", "洗碗工", "后厨", "配菜/打荷", "茶艺师", "送餐员", "学徒", "杂工", "咖啡师", "预订员", "综合维修工", "普工", "电工", "钳工", "切割/焊工", "钣金工", "车工/铣工", "缝纫工", "锅炉工", "制冷/水暖工", "铲车/叉车工", "铸造/注塑/模具工", "木工", "油漆工", "操作工", "包装工", "电梯工", "手机维修", "水泥工", "钢筋工", "管道工", "瓦工", "组装工", "样衣工", "染工", "纺织工", "印花工", "压熨工", "广告创意", "广告文案", "广告设计/制作", "咨询顾问", "创意指导/总监", "会展策划/设计", "咨询经理/主管", "客户主管/专员", "企业策划", "媒介策划/管理", "婚礼策划师", "医疗管理", "医生", "美容整形师", "心理医生", "营养师", "药剂师", "护士/护理", "宠物护理/兽医", "验光师", "护理主任/护士长", "理疗师", "医药质检", "保健医生", "导医", "电子/电气工程师", "电路工程师/技术员", "自动化工程师", "无线电工程师", "测试/可靠性工程师", "产品工艺/规划工程师", "音频/视频工程师", "灯光/照明设计工程师", "研发工程师", "电子/电器维修", "汽车/摩托车修理", "4S店管理", "汽车美容", "汽车设计工程师", "装配工艺工程师", "汽车机械工程师", "汽车电子工程师", "汽车检验/检测", "二手车评估师", "发动机/总装工程师", "安全性能工程师", "理赔专员/顾问", "洗车工", "停车管理员", "加油站工作员", "轮胎工", "影视/后期制作", "主持人", "摄影师/摄像师", "音效师", "礼仪/迎宾", "调酒师", "酒吧服务员", "配音员", "放映员", "娱乐厅服务员", "灯光师", "总编/副总编/主编", "编辑/撰稿", "出版/发行", "排版设计/制作", "装订/烫金", "记者/采编", "印刷操作", "教师/助教", "教学/教务管理", "幼教", "培训师/讲师", "学术研究/科研", "家教", "教育产品开发", "培训策划", "培训助理", "招生/课程顾问", "校长", "野外拓展训练师", "其他职位", "商务司机", "出租车司机", "班车司机", "货运司机", "特种车司机", "客运司机", "驾校教练/陪练", "公交/地铁司机（关闭）", "保洁", "保姆", "月嫂", "育婴师/保育员", "洗衣工", "保安", "钟点工", "护工", "送水工", "发型师", "美容师", "化妆师", "洗头工", "美发助理/学徒", "美甲师", "美容店长", "美容/瘦身顾问", "美容助理/学徒", "宠物美容", "彩妆培训师", "美容导师", "美体师", "收银员", "促销/导购员", "店员/营业员", "店长/卖场经理", "理货员/陈列员", "防损员/内保", "招商经理/主管", "奢侈品业务", "品类管理", "食品加工/处理", "督导", "CEO/总裁/总经理", "首席运营官COO", "首席财务官CFO", "首席技术官CTO", "副总裁/副总经理", "总裁助理/总经理助理", "总监", "分公司经理", "合伙人", "证券经理/总监", "银行经理/主任", "银行会计/柜员", "信贷管理/资信评估", "外汇/基金/国债经理人", "融资经理/总监", "风险管理/控制", "证券/期货/外汇经纪人", "投资/理财顾问", "证券分析/金融研究", "信用卡/银行卡业务", "资产评估", "担保/拍卖/典当", "拍卖师", "融资专员", "股票交易员", "法语翻译", "德语翻译", "英语翻译", "日语翻译", "韩语翻译", "俄语翻译", "小语种翻译", "西班牙语翻译", "意大利语翻译", "葡萄牙语翻译", "阿拉伯语翻译", "污水处理工程师", "环境工程技术", "环境管理/保护", "环保技术", "EHS管理", "环保工程师", "环保检测", "水质检测员", "环境绿化", "饲料业务", "养殖人员", "农艺师", "畜牧师", "场长", "养殖部主管", "动物营养/饲料研发", "服装设计师", "服装打样/制版", "生产管理", "样衣工", "食品/饮料研发/检验", "板房/底格出格师", "电脑放码员", "纸样师/车板工", "纺织品设计师", "质量管理/测试经理", "质量检验员/测试员", "测试工程师", "安全消防", "认证工程师/审核员", "安全管理", "网店店长", "淘宝客服", "淘宝美工", "店铺文案编辑", "店铺推广", "活动策划", "物业维修", "物业管理员", "物业经理/主管", "合同管理", "招商经理/主管", "房产开发/策划", "房产经纪人", "置业顾问", "房产店长/经理", "房产店员/助理", "房产客服", "房产内勤", "房产评估师", "其他房产职位", "导游", "旅游顾问", "行李员", "救生员", "签证专员", "酒店前台", "客房服务员", "楼面经理", "酒店管理", "订票员", "计调", "总工程师/副总工程师", "技术工程师", "设备管理维护", "工艺设计", "车间主任", "生产计划", "化验/检验", "厂长/副厂长", "质量管理", "生产总监", "生产主管/组长", "维修工程师", "工业工程师", "材料工程师", "工艺/珠宝设计", "多媒体/动画设计", "平面设计", "店面/陈列/展览设计", "家具/家居用品设计", "服装设计", "装修装潢设计", "美编/美术设计", "美术指导", "产品/包装设计", "CAD设计/制图", "医疗器械研发/维修", "医药研发/生产/注册", "临床研究/协调", "生物工程/生物制药", "机电工程师", "仪器/仪表/计量", "版图设计工程师", "机械工程师", "研发工程师", "测试/可靠性工程师", "按摩师", "足疗师", "针灸推拿", "搓澡工", "健身教练", "瑜伽教练", "舞蹈老师", "游泳教练", "台球教练", "高尔夫球助理" ]
    };
    module.exports = utils;
});

/**
 * 职位信息collection
 */
define("job/src/1.0.0/collections/job-info-collection-debug", [ "job/src/1.0.0/models/job-info-model-debug", "job/src/1.0.0/common/util-debug", "job/src/1.0.0/views/job-info-view-debug", "job/src/1.0.0/templates/templates_module-debug", "job/src/1.0.0/collections/contact-collection-debug", "job/src/1.0.0/models/contact-model-debug", "job/src/1.0.0/views/contact-view-debug", "job/src/1.0.0/views/person-card-view-debug", "job/src/1.0.0/common/view-util-debug", "job/src/1.0.0/views/dialog-view-debug", "job/src/1.0.0/models/dialog-model-debug", "autocompleter-debug", "autocompleterStyle-debug", "job/src/1.0.0/views/message-view-debug", "job/src/1.0.0/views/browser-view-debug", "job/src/1.0.0/common/antiXSS-debug", "job/src/1.0.0/models/switch-model-debug", "job/src/1.0.0/views/switch-view-debug", "job/src/1.0.0/models/industry-info-model-debug", "job/src/1.0.0/views/industry-info-view-debug", "job/src/1.0.0/routers/subscribe_and_publish-debug" ], function(require, exports, module) {
    var JobInfoModel = require("job/src/1.0.0/models/job-info-model-debug");
    var JobInfoView = require("job/src/1.0.0/views/job-info-view-debug");
    var IndustryInfoModel = require("job/src/1.0.0/models/industry-info-model-debug");
    var IndustryInfoView = require("job/src/1.0.0/views/industry-info-view-debug");
    var pubsub = require("job/src/1.0.0/routers/subscribe_and_publish-debug");
    var xssFilter = require("job/src/1.0.0/common/antiXSS-debug");
    var util = require("job/src/1.0.0/common/util-debug");
    var JobInfoCollection = Backbone.Collection.extend({
        model: JobInfoModel,
        url: "",
        /**
         * 标识自己
         */
        name: "JobInfoCollection",
        key: "",
        keyWords: "",
        //搜索用的关键词
        type: 1,
        //1: 正常推荐, 2: 搜索
        viewContainer: null,
        offset: 0,
        //信息偏移量
        loadStatus: false,
        //是否正在加载；
        initialize: function(data, opts) {
            _.bindAll(this, "addJobInfo");
            // 添加监听事件
            var self = this;
            self.viewContainer = opts.viewContainer;
            self.url = opts.url;
            self.type = opts.type;
            self.key = self.name + util.getCollectionInstanceIndex();
            // setting JobInfo event
            this.on("add", this.addOneJobInfo, this);
            this.on("reset", this.addAllJobInfo, this);
        },
        /**
         * 清洗转化数据
         * @param response
         * @returns {*}
         */
        parse: function(response) {
            var re = /("broadid":)(\d+)/g;
            var result = String(response).replace(re, '$1"$2"');
            //过滤 cards中的id
            var re1 = /("id":)(\d+)/g;
            result = result.replace(re1, '$1"$2"');
            //过滤xss攻击
            result = xssFilter.filterHTMLTag(result);
            return $.parseJSON(result);
        },
        //		comparator: function(model){
        //			return -(model.get("time"));
        //		},
        populate: function(responseJSON, reset) {
            // populate collection
            var models = responseJSON["data"];
            // 如果返回错误，什么也不执行
            if (!models) {
                return;
            }
            var jobs = [];
            for (var i = 0; i < models.length; i++) {
                var model;
                switch (this.type) {
                  case 1:
                    model = new JobInfoModel();
                    break;

                  case 2:
                    model = new IndustryInfoModel();
                    break;
                }
                model = model.set(model.parse(models[i]));
                jobs.push(model);
            }
            if (reset) {
                if (this.type == 2 && !jobs.length) {
                    appView.setSearchText();
                    return;
                }
                this.reset(jobs);
            } else {
                this.set(jobs, {
                    remove: false
                });
            }
        },
        initData: function() {
            var self = this;
            //            this.viewContainer.createLoading({
            //                className: self.length > 0 ? "load-top" : "load-center",
            //                key: self.key,
            //                callBack: function () {
            self.getData({
                offset: 0
            }, true);
        },
        getMoreData: function() {
            var param = {
                offset: this.offset
            };
            if (!this.loadStatus) {
                buriedPoint(35506022);
                this.loadStatus = true;
                this.getData(param);
            }
        },
        getData: function(param, reset) {
            var self = this;
            //追加公共参数
            $.extend(param, util.getAjaxCommonParam());
            $.ajax({
                url: self.url,
                type: "POST",
                dataType: "text text text",
                //                timeout: 10000,
                data: param,
                success: function(response) {
                    var responseJSON = self.parse(response);
                    if (responseJSON["returnCode"] == 200) {
                        self.populate(responseJSON, reset);
                        self.offset = responseJSON["os"] || self.offset;
                        pubsub.publish("loading_jobCollection", responseJSON);
                    } else {
                        seajs.log(response);
                    }
                    self.loadStatus = false;
                },
                error: function() {
                    seajs.log("JobInfo get more data from server failed");
                    //ajax失败后通知移除loading状态
                    pubsub.publish("MESSAGES_XMLHTTPREQUESTDONE_" + self.key);
                }
            });
        },
        // JobInfo section
        addAllJobInfo: function() {
            //            seajs.log("invoked addAllJobInfo");
            //职位信息容器
            this.viewContainer.html("");
            if (this.length) {
                this.each(this.addJobInfo);
            }
        },
        // JobInfo section
        addOneJobInfo: function(model) {
            this.addJobInfo(model);
        },
        addJobInfo: function(model) {
            var view;
            if (this.type == 1) {
                view = new JobInfoView({
                    model: model
                });
            } else if (this.type == 2) {
                view = new IndustryInfoView({
                    model: model
                });
            }
            view.render(this.viewContainer);
        }
    });
    //单例
    module.exports = JobInfoCollection;
});

define("job/src/1.0.0/models/job-info-model-debug", [ "job/src/1.0.0/common/util-debug" ], function(require, exports, module) {
    var util = require("job/src/1.0.0/common/util-debug");
    /**
     * @namespace
     * @name JobInfoModel
     * @type Object
     * @description
     */
    module.exports = Backbone.Model.extend({
        defaults: {
            sequence: 0,
            //序列
            jobInfoId: 1,
            //招聘信息ID
            source: 2,
            //来源
            companyName: 3,
            //公司名称
            industry: 4,
            //行业
            companyAddress: 5,
            //公司地址
            linkman: 6,
            //联系人
            tel: 7,
            //联系电话
            positionName: 8,
            //职位名称
            publishDate: 9,
            //发布日期
            expireDate: 10,
            //截止日期
            salaryRange: 11,
            //薪资范围
            location: 12,
            //工作地点
            experience: 13,
            //经验要求
            education: 14,
            //学历
            jobType: 15,
            //工作性质
            welfare: 16,
            //福利，逗号分开 eg:养老保险，医疗保险,工商保险
            description: 17,
            //职位描述
            requirements: 18,
            //职位要求
            count: 19,
            //招聘数量
            type: 1,
            //1:jobinfo(招聘内容），2：newinfo(行业资讯);
            //扩展字段
            url: ""
        },
        parse: function(response) {
            return response;
        }
    });
});

define("job/src/1.0.0/views/job-info-view-debug", [ "job/src/1.0.0/templates/templates_module-debug", "job/src/1.0.0/collections/contact-collection-debug", "job/src/1.0.0/models/contact-model-debug", "job/src/1.0.0/common/util-debug", "job/src/1.0.0/views/contact-view-debug", "job/src/1.0.0/views/person-card-view-debug", "job/src/1.0.0/common/view-util-debug", "job/src/1.0.0/views/dialog-view-debug", "job/src/1.0.0/models/dialog-model-debug", "autocompleter-debug", "autocompleterStyle-debug", "job/src/1.0.0/views/message-view-debug", "job/src/1.0.0/views/browser-view-debug", "job/src/1.0.0/common/antiXSS-debug", "job/src/1.0.0/models/switch-model-debug", "job/src/1.0.0/views/switch-view-debug" ], function(require, exports, module) {
    var Templates = require("job/src/1.0.0/templates/templates_module-debug");
    var ContactCollection = require("job/src/1.0.0/collections/contact-collection-debug");
    var SwitchModel = require("job/src/1.0.0/models/switch-model-debug");
    var SwitchView = require("job/src/1.0.0/views/switch-view-debug");
    var util = require("job/src/1.0.0/common/util-debug");
    var JobInfoView = Backbone.View.extend({
        tagName: "div",
        className: "jobmessage mb15",
        templateId: "job-feed-tpl",
        events: {
            "click .j_expand": "showContent",
            "click .j_open": "hideContent"
        },
        initialize: function() {},
        render: function() {
            var self = this;
            this.$el.html(Templates.template(this.templateId, this.model.toJSON()));
            this.model.collection.viewContainer.append(this.$el);
            //加载推荐的人
            var contactCompany = new ContactCollection([], {
                jobId: this.model.get("jobInfoId"),
                recommendType: 1,
                companyName: this.model.get("companyName"),
                viewContainer: this.$("#recommend-company .ta_list ul")
            });
            //监听推荐的人获取数据之后
            contactCompany.on("reset", function() {
                //                seajs.log(contactCompany.length);
                self.showSwitcher(contactCompany.recommendType, contactCompany.length);
            }, contactCompany);
            //只展示4行，多的隐藏
            this.actHeight = this.$(".j_details").height();
            if (this.actHeight > 95) {
                this.$(".j_details").height(90);
                this.$(".j_details").css("overflow", "hidden");
                this.$(".msg").hide();
            } else {
                this.$(".f_btn").remove();
            }
        },
        /**
         * 获取推荐的人之后显示容器并且显示翻页
         * @param type 0: 公司, 1:职位
         * @param count 有多少条推荐的人
         */
        showSwitcher: function(type, count) {
            if (!count) return;
            var self = this;
            var containerId = "recommend-company";
            if (type) {
                $(".c_title em").html("&nbsp;<span>相关职位</span>");
            }
            self.$("#" + containerId).parent().show();
            self.$(".f_foot").fadeIn();
            var ul = self.$("#" + containerId + " ul.com_wrap");
            //显示页切换器
            if (count > 2) {
                //总共几页
                count = Math.ceil(count / 2);
                var switchModel = new SwitchModel({
                    count: count
                });
                var switcher = new SwitchView({
                    model: switchModel
                });
                self.$("#" + containerId + " .j_switch").show();
                self.$("#" + containerId + " .j_switch").html(switcher.render());
                this.listenTo(switcher, "pageChanged", function(param) {
                    //                    var left = ul.css("marginLeft");
                    //                    left = +left.split("px")[0];
                    var left = -16 + -param.current * 528;
                    ul.animate({
                        marginLeft: left
                    });
                });
            }
        },
        showContent: function() {
            window.buriedPoint(35506013);
            this.$(".j_expand").toggle();
            this.$(".j_open").toggle();
            this.$(".j_details").animate({
                height: this.actHeight
            });
        },
        hideContent: function() {
            buriedPoint(35506014);
            this.$(".j_details").animate({
                height: 90
            });
            util.restoreScroll({
                scrollHeight: $(document).scrollTop() - this.actHeight + 90
            });
            this.$(".j_expand").toggle();
            this.$(".j_open").toggle();
        }
    });
    module.exports = JobInfoView;
});

/*
 How to use
 ////////////////////////////////////////
 var Templates = require('template');
 Template.template(templateId, {name: 'moe'}));
 */
define("job/src/1.0.0/templates/templates_module-debug", [], function(require, exports, module) {
    var tmplStr = require("job/src/1.0.0/templates/templates-debug.html");
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

define("job/src/1.0.0/templates/templates-debug.html", [], '<!-- 搜索 -->\n<script type="text/template" id="search-job-tpl">\n    <input type="text" class="jobtxt" placeholder="搜索职位">\n    <a href="javascript:void(0)" class="jobbut" title="日志"></a>\n    <div class="job_list" style="top: 44px; left:-1px; width: 228px;"></div>\n</script>\n\n<!-- job-feed-template -->\n<script type="text/template" id="job-feed-tpl">\n    <div class="job_tit">\n        <h3><em>{{=positionName}}</em></h3>\n    </div>\n    <div class="job_con">\n        <div class="j_address">\n            <span class="j_at"><em></em>{{=companyName}}</span><i>|</i><span class="j_ad">{{=location}}</span>\n        </div>\n        <div class="j_details">\n            {{ if(description){ }}\n            <div class="explain">\n                <h5>职位描述：</h5>\n                <pre>{{=description}}</pre>\n            </div>\n            {{ } }}\n            {{ if(requirements){ }}\n            <div class="explain">\n                <h5>任职要求：</h5>\n                <pre>{{=requirements}}</pre>\n            </div>\n            {{ } }}\n            <div class="j_source clr">\n                <h5>来源：</h5>\n                {{ if(url){ }}\n                <a href="{{=url}}"><span>{{=source}}</span></a>\n                {{ }else{ }}\n                <span>{{=source}}</span>\n                {{ } }}\n            </div>\n        </div>\n        <div class="tra_btn">\n            <span class="j_expand">展开详情<i></i></span>\n            <span class="j_open" style="display:none;">收起<i></i></span>\n        </div>\n\n    </div>\n    <div class="job_foot2" style="display:none;">\n        <div id="recommend-company" class="f_content" style="z-index: 2;">\n            <div class="ta_top">\n                <h4 class="c_title">Ta们可以帮你引荐<em>到&nbsp;<span>这家公司</span></em> &nbsp;<strong>：</strong></h4>\n            </div>\n            <div class="job_main">\n                <div class="ta_list">\n                    <ul class="com_wrap">\n\n                    </ul>\n                </div>\n            </div>\n            <div class="j_switch" style="display:none;">\n            </div>\n        </div>\n    </div>\n</script>\n\n<!-- industry-feed-template -->\n<script type="text/template" id="industry-feed-tpl">\n    <div class="tra_con">\n        <h3>{{=title}}</h3>\n        <div class="explain">\n            <pre class="desc">{{=content}}</pre>\n        </div>\n        <div class="j_source clr">\n            <h5>来源：</h5>\n            {{ if(url){ }}\n            <a href="{{=url}}"><span>{{=source}}</span></a>\n            {{ }else{ }}\n            <span>{{=source}}</span>\n            {{ } }}\n        </div>\n        <div class="tra_btn">\n            <span class="j_expand">展开详情<i></i></span>\n            <span class="j_open" style="display:none;">收起<i></i></span>\n        </div>\n    </div>\n    {{if(tags && tags.length){ }}\n    <div class="tra_tag">\n        <i></i>\n        {{ for(var i=0; i < tags.length; i++){ }}\n        <span>{{=tags[i] }}</span>\n        {{ } }}\n    </div>\n    {{ } }}\n\n    <div id="recommend-browser" class="record clr" style="display:none;">\n        <div class="record_num"><span>Ta</span>们看过这条资讯</div>\n        <div class="record_user">\n            <ul class="user_wrap">\n\n            </ul>\n        </div>\n        <div class="j_switch">\n        </div>\n    </div>\n</script>\n\n<!-- 资讯浏览记录 -->\n<script type="text/template" id="recommend-browser-tpl">\n    <div class="user-flag">\n        <div class="user_pic">\n            <a href="javascript:void(0)"><img src="{{=portraitMiddle}}" onerror="this.src=\'{{=__resourceDomain}}/img/public/head180.jpg\'"></a>\n        </div>\n    </div>\n</script>\n\n<!-- 左右切换 -->\n<script type="text/template" id="c-switch-tpl">\n    <span class="j_c_l"></span>\n    <ul class="j_c_con clr">\n        {{ for(var i = 0; i < count; i++){ }}\n        {{ if(i==currentIdx){ }}\n        <li class="act" idx="{{=i}}"></li>\n        {{ } else { }}\n        <li idx="{{=i}}"></li>\n        {{ } }}\n        {{ } }}\n    </ul>\n    <span class="j_c_r jr_on"></span>\n</script>\n\n<!-- 推荐人列表项 -->\n<script type="text/template" id="recommend-person-tpl">\n    <div class="user-flag ta_con clr">\n        <div class="ta_con_l">\n            <a href="javascript:void(0)" class="ta_pic"><img src="{{=portraitMiddle}}" onerror="this.src=\'{{=__resourceDomain}}/img/public/head180.jpg\'"/>\n                <i class="p_bbg1"></i>\n            </a>\n            <a href="javascript:void(0)" class="touch">\n                {{ if(type==1){ }}联系Ta {{ }else{ }}加好友{{ } }}\n            </a>\n        </div>\n        <div class="ta_con_r">\n            <a href="javascript:void(0)" class="name" title="{{=showName}}">{{=showName}}</a>\n\n            <p class="data">\n                {{ if(company){ }}\n                <span class="con_tab" title="{{=company}}">\n                    <i class="con_ico"></i>{{=company}}\n                </span>\n                {{ } }}\n                {{ if(position){ }}\n                <span class="con_tab" title="{{=position}}">\n                    <i class="job_ico"></i>{{=position}}\n                </span>\n                {{ } }}\n            </p>\n            <!--{{ if(type==2){ }}-->\n            <!--<span class="p_msg"><span>{{=friendsCount}}</span>位认识Ta</span>-->\n            <!--{{ } }}-->\n        </div>\n        <div class="{{=friendClass}}"></div>\n    </div>\n</script>\n\n<!-- 推荐人卡片 -->\n<script type="text/template" id="person-card-tpl">\n    <i class="j_arrow" style="position: absolute; top:-6px; left: 44px;"></i>\n    {{ if(loading){ }}\n    <div class="j_pop_load"></div>\n    {{ } else { }}\n    <div class="{{=friendClass}}"></div>\n    <div class="pop_top clr">\n        <div class="p_l">\n            <span href="javascript:void(0)" class="p_pic" title="{{=showName}}"><img src="{{=portraitMiddle}}" onerror="this.src=\'{{=__resourceDomain}}/img/public/head180.jpg\'"/>\n                <i class="f_bg150"></i>\n            </span>\n            {{ if (type != 8) { }}\n            <a href="javascript:void(0)" class="add_f">\n                {{ if(type==1){ }}联系Ta {{ }else{ }}加好友{{ } }}\n            </a>\n            {{ } }}\n        </div>\n        <div class="p_r">\n            <span class="name" title="{{=showName}}">{{=showName}}</span>\n\n            <div class="P_r_con">\n                {{ if(sid){ }}\n                <span><i class="n_1"></i>{{=sid}}</span>\n                {{ } }}\n                <!--{{ if(mobileNo){ }}-->\n                <!--<span><i class="n_2"></i>{{=mobileNo}}</span>-->\n                <!--{{ } }}-->\n                {{ if(company){ }}\n                <span title="{{=company}}"><i class="n_3"></i>{{=company}}</span>\n                {{ } }}\n                {{ if(position){ }}\n                <span title="{{=position}}"><i class="n_4"></i>{{=position}}</span>\n                {{ } }}\n            </div>\n\n        </div>\n    </div>\n\n    <div class="pop_bot"></div>\n    {{ } }}\n</script>\n\n<!-- 标签 -->\n<script type="text/template" id="tag-tpl">\n<ul>\n    {{ for(var i=0; i < tags.length; i++){ }}\n    <li>\n        <a href="#" class="a1_l a_on"><span class="a1_r">{{=tags[i].text}}</span></a><i class="del" style="display:none;"></i>\n    </li>\n    {{ } }}\n</ul>\n</script>\n\n<!--感兴趣的职位推荐标签-->\n<script type="text/template" id="recommendations-tag-tpl">\n    {{ for(var i=0; i < positionTags.length; i++){ }}\n    {{ if(_.contains(tags,positionTags[i])){ }}\n    <li>\n        <a href="javascript:void(0)" class="a1_l b_on"><span class="a1_r">{{=positionTags[i]}}</span></a>\n    </li>\n    {{ }else{ }}\n    <li>\n        <a href="javascript:void(0)" class="a1_l"><span class="a1_r">{{=positionTags[i]}}</span></a>\n    </li>\n    {{ } }}\n    {{ } }}\n</script>\n\n<!-- 编辑职位标签 -->\n<script type="text/template" id="tag-edit-tpl">\n    <div class="j_edit">\n        {{ if(!tags.length){ }}\n            <div class="j_tit clr"><span>添加感兴趣的职位</span></div>\n        {{ }else{ }}\n            <div class="j_tit clr" style="display:none;"><span>添加感兴趣的职位</span></div>\n        {{ } }}\n        {{ if(tags){ }}\n            <div class="j_show clr">\n                <div></div>\n            </div>\n        {{ }else{ }}\n            <div class="j_show clr" style="display:none;">\n                <div></div>\n            </div>\n        {{ } }}\n        <div class="j_add clr" style="display:none;">\n            <div class="j_i">\n                <input id="addTagText" type="text" placeholder="输入感兴趣的职位" class="a_i_t"><a class="aj_btn" href="javascript:void(0)">添加</a>\n            </div>\n            <ul id="recommendations-tag">\n            </ul>\n        </div>\n        <a class="e_btn" href="javascript:void(0)">编辑</a>\n        <div class="e_btn" style="display:none;"><a class="e_sure" href="javascript:void(0)">确定</a>&nbsp;&nbsp;<a class="e_cancel" href="javascript:void(0)">取消</a></div>\n    </div>\n</script>\n\n<!-- 资讯标签 -->\n<script type="text/template" id="industry-tag-edit-tpl">\n        <div class="j_tit clr"><span>选择感兴趣的标签</span></div>\n        <div class="i_show clr">\n            <ul>\n                {{ for(var i=0; i < tags.length; i++){ }}\n                <li>\n                    {{ if(tags[i].state){ }}\n                    <a href="javascript:void(0);" class="a1_l a_on"><span class="a1_r">{{=tags[i].txt}}</span></a>\n                    {{ }else{ }}\n                    <a href="javascript:void(0);" class="a1_l"><span class="a1_r">{{=tags[i].txt}}</span></a>\n                    {{ } }}\n                </li>\n                {{ } }}\n            </ul>\n        </div>\n</script>\n\n<!-- 我的工作信息 -->\n<script type="text/template" id="my-job-tpl">\n    <h3 class="mj_title">我的工作{{ if(!hasNoJob){ }}<a class="d_edit" href="#">编辑</a>{{ } }}</h3>\n    <!--未填状态-->\n    {{ if(hasNoJob){ }}\n    <div class="unfilled clr">\n        <div class="u_l"></div>\n        <div class="u_r">\n            <span>完善工作信息&gt;&gt;</span>\n            <p>可获得更多职位推荐！</p>\n        </div>\n    </div>\n    {{ } }}\n    <!--未填状态 end-->\n    <!--编辑状态-->\n    <div class="filled clr" style="display:none;">\n        <div class="fill_i"><input id="myJob" type="text" placeholder="请输入职位名称" value="{{=position}}" class="d_i_t"></div>\n        <div class="fill_i"><input id="myCompany" type="text" placeholder="请输入公司名称" value="{{=company}}" class="d_i_t"></div>\n        <ul class="clr">\n            <li class="f_d_l fd_r">\n                <select class="fd_i" id="province"></select>\n            </li>\n            <li class="f_d_l">\n                <select class="fd_i" id="city"></select>\n            </li>\n        </ul>\n        <div class="f_button clr">\n            <span class="s_btn s_confirm fd_r">确定</span><span class="s_btn s_cancel">取消</span>\n        </div>\n    </div>\n    <!--编辑状态 end-->\n    <!--展示状态-->\n    {{ if(!hasNoJob){ }}\n    <div class="m_show">\n        <span><i class="m_s1"></i>职位：\n            {{ if(position){ }}\n            <em title="{{=position}}">{{=position}}</em>\n            {{ } else { }}\n            <em class="m_msg">未填写职位</em>\n            {{ } }}\n        </span>\n        <span><i class="m_s2"></i>公司：\n            {{ if(company){ }}\n                <em title="{{=company}}">{{=company}}</em>\n            {{ } else { }}\n                <em class="m_msg">未填写公司</em>\n            {{ } }}\n\n        </span>\n        <span><i class="m_s3"></i>城市：\n            {{ if(city){ }}\n            <em>{{=city}}</em>\n            {{ } else { }}\n             <em class="m_msg">未填写所在地</em>\n            {{ } }}\n        </span>\n    </div>\n    {{ } }}\n    <!--展示状态 end-->\n</script>\n\n<!-- 我关注的招聘 -->\n<script type="text/template" id="my-follow-tpl">\n    <a href="{{= url }}" target="_blank">\n        <em title="{{=company }}">\n            {{ if(company.length>6){ }}\n            {{=company.slice(0,6) }}\n            {{ } else { }}\n            {{=company }}\n            {{ } }}\n        </em>\n        <span> 招聘 </span>\n        <em title="{{=job }}">\n            {{ if(job.length>6){ }}\n            {{=job.slice(0,6) }}\n            {{ } else { }}\n            {{=job }}\n            {{ } }}\n        </em>\n    </a>\n</script>\n\n<!-- 对话框 -->\n<script type="text/template" id="dialog-tpl">\n    <div class="{{=size}} popup confirmation" style="position: fixed; z-index: 1001; left: 488px; top: 198px;">\n        <div class="bbox">\n            {{ if(title){ }}\n            <div class="ttop"><span>{{=title}}</span></div>\n            {{ } }}\n            <div class="themain"><p>{{=content}}</p>\n                {{ if(buttons){ }}\n                <div class="btnx rept">\n                    {{ if(buttons[\'OK\']){ }}\n                    <a href="javascript:void(0);" class="btn btnb" id="dialogOk">确定</a>\n                    {{ } }}\n                    {{ if(buttons[\'CANCEL\']){ }}\n                    <a href="javascript:void(0);" class="btn btng2" id="dialogCancel">取消</a>\n                    {{ } }}\n                </div>\n                {{ } }}\n            </div>\n        </div>\n    </div>\n    {{ if(modalDialog){ }}\n    <div class="photo_mask" style="z-index: 1000"></div>\n    {{ } }}\n</script>\n\n<!-- 发消息-->\n<script type="text/template" id="send-msg-tp1">\n    <div class="popupc phone clr">\n        <div class="box_t"><h3>发消息</h3></div>\n        <div class="box ">\n            <label class="t">好友：</label>\n\n            <div class="fribox clr">\n                <span id="{{=userid}}">{{=showName}}</span>\n            </div>\n        </div>\n        <div class="box txtbox">\n            <!--<p class="frinum"><span id="friendtip"></span></p>-->\n            <label class="t">内容：</label>\n\n            <p class="sendtxt">\n                <textarea name="" rows="" id="summary" cols=""></textarea>\n            </p>\n\n            <p class=""><span class="txtnum" id="summarytips"></span></p>\n        </div>\n        <div class="btnx">\n            <a href="javascript:void(0)" id="send" class="btn btn2b">发送</a>\n            <a href="javascript:void(0)" id="close" class="btn btng">取消</a>\n        </div>\n        <a id="popupClose" href="javascript:void(0);" class="ico m_close"></a>\n    </div>\n</script>\n\n<!-- 进入测试弹层 -->\n<script type="text/template" id="job-funnytest">\n    <div class="newpopbox"\n         style="width:507px; position:absolute; left:50%; top:235px; z-index:1001; margin-left:-253px;margin-top:-110px;">\n        <a href="javascript:void(0)" class="newclz"></a>\n        <h6></h6>\n\n        <div class="msg_con">\n            <div class="m_top clr">\n                <div class="m_t_l"></div>\n                <div class="m_t_r">请注意！一大波职位向你来袭。<br>\n                    快来检测一下你的跳槽成功率吧！\n                </div>\n            </div>\n            <div class="m_btn">\n                <a href="/contacts/job/sexytest" class="actico">开始</a><a href="javascript:void(0)" class="nexico">跳过</a>\n            </div>\n\n        </div>\n    </div>\n    <div class="photo_mask" style="z-index:1000"></div>\n</script>');

/**
 * 人脉collection
 */
define("job/src/1.0.0/collections/contact-collection-debug", [ "job/src/1.0.0/models/contact-model-debug", "job/src/1.0.0/common/util-debug", "job/src/1.0.0/views/contact-view-debug", "job/src/1.0.0/templates/templates_module-debug", "job/src/1.0.0/views/person-card-view-debug", "job/src/1.0.0/common/view-util-debug", "job/src/1.0.0/views/dialog-view-debug", "job/src/1.0.0/models/dialog-model-debug", "autocompleter-debug", "autocompleterStyle-debug", "job/src/1.0.0/views/message-view-debug", "job/src/1.0.0/views/browser-view-debug", "job/src/1.0.0/common/antiXSS-debug" ], function(require, exports, module) {
    var ContactModel = require("job/src/1.0.0/models/contact-model-debug");
    var ContactView = require("job/src/1.0.0/views/contact-view-debug");
    var BrowserView = require("job/src/1.0.0/views/browser-view-debug");
    var xssFilter = require("job/src/1.0.0/common/antiXSS-debug");
    var util = require("job/src/1.0.0/common/util-debug");
    var ContactCollection = Backbone.Collection.extend({
        model: ContactModel,
        url: "",
        /**
         * 标识自己
         */
        name: "ContactsCollection",
        key: "",
        initialize: function(data, opts) {
            //opts格式
            //            var opts = {
            //                jobId: 0,
            //                viewContainer: null,
            //                recommendType: 0,//0:company, 1:job ,2:industry
            //            };
            this.options = this.options || {};
            opts = opts || {};
            _.bindAll(this, "addContact");
            // 添加监听事件
            this.key = this.name + util.getCollectionInstanceIndex();
            $.extend(this.options, opts);
            // setting JobInfo event
            this.on("reset", this.resetContacts, this);
            this.on("add", this.addContact, this);
            this.initData();
        },
        /**
         * 清洗转化数据
         * @param response
         * @returns {*}
         */
        parse: function(response) {
            var re = /("broadid":)(\d+)/g;
            var result = String(response).replace(re, '$1"$2"');
            //过滤 cards中的id
            var re1 = /("id":)(\d+)/g;
            result = result.replace(re1, '$1"$2"');
            //过滤xss攻击
            result = xssFilter.filterHTMLTag(result);
            return $.parseJSON(result);
        },
        //		comparator: function(model){
        //			return -(model.get("time"));
        //		},
        populate: function(responseJSON, reset) {
            // populate collection
            var models = responseJSON.data;
            // 如果返回错误，什么也不执行
            if (!models) {
                return;
            }
            var contactsModels = [];
            for (var i = 0; i < models.length; i++) {
                var contactsModel = new ContactModel();
                contactsModel = contactsModel.set(contactsModel.parse(models[i]));
                contactsModel.set({
                    idx: i
                });
                contactsModels.push(contactsModel);
            }
            if (reset) {
                this.reset(contactsModels);
            } else {
                this.set(contactsModels, {
                    remove: false
                });
            }
        },
        initData: function() {
            this.getData({}, true);
        },
        getData: function(param, reset) {
            var self = this;
            //            param.count = 20;
            //追加公共参数
            $.extend(param, util.getAjaxCommonParam());
            var url = "";
            switch (+self.options.recommendType) {
              case 1:
                url = util.url.recommendJobInfo;
                param.jobInfoId = self.options.jobId;
                param.companyName = self.options.companyName;
                break;

              case 2:
                url = util.url.getBrowser;
                param.newsId = self.options.newsID;
                break;
            }
            $.ajax({
                url: url,
                type: "POST",
                dataType: "text text text",
                //                timeout: 10000,
                data: param,
                success: function(response) {
                    if (response) {
                        var responseJSON = self.parse(response);
                        self.recommendType = responseJSON.dataType;
                        if (responseJSON["returnCode"] == 200) {
                            self.populate(responseJSON, reset);
                        } else {
                            seajs.log(response);
                        }
                    }
                },
                error: function() {
                    seajs.log("JobInfo get more data from server failed");
                }
            });
        },
        // JobInfo section
        resetContacts: function() {
            seajs.log("invoked resetContacts");
            //职位信息容器
            this.options.viewContainer.html("");
            if (this.length) {
                this.each(this.addContact);
            }
        },
        addContact: function(model, models, opts) {
            switch (+this.options.recommendType) {
              case 1:
                var contactView = new ContactView({
                    model: model
                });
                this.options.viewContainer.append(contactView.render());
                break;

              case 2:
                var browserView = new BrowserView({
                    model: model
                });
                if (opts.prepend) {
                    this.options.viewContainer.prepend(browserView.render());
                } else {
                    this.options.viewContainer.append(browserView.render());
                }
            }
        }
    });
    module.exports = ContactCollection;
});

define("job/src/1.0.0/models/contact-model-debug", [ "job/src/1.0.0/common/util-debug" ], function(require, exports, module) {
    var util = require("job/src/1.0.0/common/util-debug");
    /**
     * @namespace
     * @name ContactModel
     * @type Object
     * @description
     */
    module.exports = Backbone.Model.extend({
        defaults: {
            userid: 100001,
            nickname: "pk之王",
            screenname: "pk之王",
            portraitMiddle: "",
            company: "",
            position: "",
            tags: [],
            //囧神,80后,傲娇
            friendsCount: 25,
            type: 8,
            //1:一度好友,2:二度好友,3:陌生人, 8:自己，空, 9:未知
            mobileNo: "",
            //用户电话
            sid: "",
            //用户飞信号
            //扩展字段
            friendClass: "",
            //根据联系人类型不同切换不同的样式
            loading: false,
            //是否正在加载，职场动态查看名片的时候用
            showName: "",
            //一度好友 优先显示备注名
            hasNoJob: "",
            //判断是否有个人职位信息
            opt: ""
        },
        parse: function(response) {
            switch (+response.type) {
              case 0:
                response.friendClass = "user_3";
                break;

              case 1:
                response.friendClass = "user_1";
                break;

              case 2:
                response.friendClass = "user_2";
                break;

              case 3:
                response.friendClass = "user_3";
                break;

              case 8:
                response.friendClass = "";
                break;

              default:
                response.friendClass = "";
                break;
            }
            //一度好友优先显示备注名
            response.showName = response.screenname ? response.screenname : response.nickname;
            response.portraitMiddle = response.portraitMiddle ? __portraitDomain + response.portraitMiddle : __resourceDomain + "/img/public/head180.jpg";
            response.hasNoJob = !response.company && !response.position;
            response.loading = false;
            if (!response.tags) {
                response.tags = [];
            }
            return response;
        }
    });
});

define("job/src/1.0.0/views/contact-view-debug", [ "job/src/1.0.0/templates/templates_module-debug", "job/src/1.0.0/views/person-card-view-debug", "job/src/1.0.0/models/contact-model-debug", "job/src/1.0.0/common/util-debug", "job/src/1.0.0/common/view-util-debug", "job/src/1.0.0/views/dialog-view-debug", "job/src/1.0.0/models/dialog-model-debug", "autocompleter-debug", "autocompleterStyle-debug", "job/src/1.0.0/views/message-view-debug", "job/src/1.0.0/views/message-view-debug" ], function(require, exports, module) {
    var Templates = require("job/src/1.0.0/templates/templates_module-debug");
    var cardView = require("job/src/1.0.0/views/person-card-view-debug");
    var viewUtil = require("job/src/1.0.0/common/view-util-debug");
    var messageView = require("job/src/1.0.0/views/message-view-debug");
    var ContactView = Backbone.View.extend({
        tagName: "li",
        templateId: "recommend-person-tpl",
        className: "ta_li",
        events: {
            "mouseenter .ta_pic": "showCard",
            "mouseleave .ta_con_l": "hideCard",
            "click .ta_con_l .touch": "contactOrAdd"
        },
        initialize: function() {},
        render: function() {
            this.$el.html(Templates.template(this.templateId, this.model.toJSON()));
            return this.$el;
        },
        /**
         * 显示名片
         */
        showCard: function() {
            var pos;
            if (this.model.get("idx") % 2) {
                pos = {
                    div: {
                        top: 64,
                        left: -108
                    },
                    i: {
                        top: -6,
                        left: 132
                    }
                };
            } else {
                pos = {
                    div: {
                        top: 64,
                        left: -20
                    },
                    i: {
                        top: -6,
                        left: 44
                    }
                };
            }
            cardView.showPersonCard(this.$(".ta_con_l"), this.model.attributes, pos);
        },
        /**
         * 隐藏名片
         */
        hideCard: function() {
            cardView.hidePersonCard();
        },
        /**
         * 添加或者联系好友
         */
        contactOrAdd: function() {
            if (this.model.get("type") == 1) {
                buriedPoint(35506019);
                messageView.render({
                    userid: this.model.get("userid"),
                    showName: this.model.get("showName")
                });
            } else {
                buriedPoint(35506020);
                viewUtil.addFriend(this.model.get("userid"));
            }
            return false;
        }
    });
    module.exports = ContactView;
});

define("job/src/1.0.0/views/person-card-view-debug", [ "job/src/1.0.0/templates/templates_module-debug", "job/src/1.0.0/models/contact-model-debug", "job/src/1.0.0/common/util-debug", "job/src/1.0.0/common/view-util-debug", "job/src/1.0.0/views/dialog-view-debug", "job/src/1.0.0/models/dialog-model-debug", "autocompleter-debug", "autocompleterStyle-debug", "job/src/1.0.0/views/message-view-debug" ], function(require, exports, module) {
    var Templates = require("job/src/1.0.0/templates/templates_module-debug");
    var ContactModel = require("job/src/1.0.0/models/contact-model-debug");
    var viewUtil = require("job/src/1.0.0/common/view-util-debug");
    var messageView = require("job/src/1.0.0/views/message-view-debug");
    var PersonCardView = Backbone.View.extend({
        tagName: "div",
        className: "j_pop_box",
        attributes: {
            style: "z-index:990;"
        },
        model: new ContactModel(),
        viewContainer: null,
        templateId: "person-card-tpl",
        //绑定事件
        events: {
            "click .p_l .add_f": "contactOrAdd"
        },
        initialize: function() {
            this.listenTo(this.model, "change", this.render);
        },
        render: function() {
            this.$el.html(Templates.template(this.templateId, this.model.toJSON()));
            var tags = this.model.get("tags");
        },
        /**
         * 显示名片
         * @param container 名片的存放容器
         * @param jsonData 名片里的数据
         * @param pos 名片的位置的偏移量 e.g. {div: {top: 0, left: 0}, i: {top: 0, left: 0}}
         */
        showPersonCard: function(container, jsonData, pos) {
            this.model.set(jsonData);
            if (pos) {
                this.$el.css(pos.div).css("position", "absolute");
                this.$(".j_arrow").css(pos.i).css("position", "absolute");
            }
            this.$el.parents(".user-flag").css({
                position: "",
                zIndex: ""
            });
            container.append(this.$el);
            container.parent(".user-flag").css({
                position: "absolute",
                zIndex: 99
            });
            this.$el.show();
        },
        /**
         * 隐藏卡片
         * @param pos 改变卡片的位置信息，下次动画的初始位置
         */
        hidePersonCard: function(pos) {
            this.$el.hide();
            this.$el.css(pos || {
                left: -50
            });
            this.$el.parents(".user-flag").css({
                position: "",
                zIndex: ""
            });
        },
        /**
         * 是否显示
         */
        isShow: function() {
            return this.$el.is(":visible");
        },
        /**
         * 更新数据
         */
        updateData: function(data) {
            this.model.set(data);
        },
        /**
         * 联系好友  或者 添加好友
         */
        contactOrAdd: function() {
            if (this.model.get("type") == 1) {
                buriedPoint(35506019);
                messageView.render({
                    userid: this.model.get("userid"),
                    showName: this.model.get("showName")
                });
            } else {
                buriedPoint(35506020);
                viewUtil.addFriend(this.model.get("userid"));
            }
            return false;
        }
    });
    module.exports = new PersonCardView();
});

/**
 * Created by wangyongchao on 2014/8/18.
 */
define("job/src/1.0.0/common/view-util-debug", [ "job/src/1.0.0/templates/templates_module-debug", "job/src/1.0.0/common/util-debug", "job/src/1.0.0/views/dialog-view-debug", "job/src/1.0.0/models/dialog-model-debug", "autocompleter-debug", "autocompleterStyle-debug" ], function(require, exports, module) {
    var Templates = require("job/src/1.0.0/templates/templates_module-debug");
    var util = require("job/src/1.0.0/common/util-debug");
    var DialogView = require("job/src/1.0.0/views/dialog-view-debug");
    var DialogModel = require("job/src/1.0.0/models/dialog-model-debug");
    //自动完成所需的样式和js,jquery插件
    require("autocompleter-debug");
    require("autocompleterStyle-debug");
    var ViewUtil = {
        /**
         * 渲染标签(感兴趣的职位)
         * @param tags
         * @param opts
         * @returns {*}
         */
        renderTags: function(tags, opts) {
            var jsonArray = [];
            tags = tags ? tags : [];
            for (var i = 0; i < tags.length; i++) {
                var prefix = opts.needRandom ? util.randomPrefix() : "a_";
                jsonArray[i] = {
                    classPrefix: prefix,
                    text: tags[i]
                };
            }
            return Templates.template("tag-tpl", {
                myjob: opts.myjob,
                tags: jsonArray
            });
        },
        /**
         * 绑定自动完成事件
         * @param param e.g.{input: el, targetWrapper: el}
         */
        bindAutoComplete: function(param) {
            try {
                param.targetWrapper.show();
                param.input.autocomplete({
                    lookup: util.jobs,
                    //                autoSelectFirst: true,
                    appendTo: param.targetWrapper,
                    maxHeight: 160,
                    width: "100%"
                });
            } catch (e) {
                seajs.log(e);
            }
        },
        /**
         * 添加好友
         * @param userId
         */
        addFriend: function(userId) {
            $.ajax({
                url: util.url.addFriend,
                type: "POST",
                async: false,
                dataType: "json",
                data: {
                    destUserid: userId
                },
                success: function(response) {
                    var model = new DialogModel({
                        title: "成功提示",
                        //提示
                        content: "申请已发出，等待对方批准",
                        //内容
                        buttons: {
                            OK: true
                        }
                    });
                    var dialog = new DialogView({
                        model: model
                    });
                    dialog.render();
                },
                error: function() {
                    seajs.log("JobInfo get more data from server failed");
                }
            });
        },
        /**
         * alert
         * @param text
         */
        alert: function(text) {
            var model = new DialogModel({
                content: text,
                duration: 1500,
                size: "small"
            });
            var dialog = new DialogView({
                model: model
            });
            dialog.render();
        }
    };
    module.exports = ViewUtil;
});

define("job/src/1.0.0/views/dialog-view-debug", [ "job/src/1.0.0/templates/templates_module-debug", "job/src/1.0.0/models/dialog-model-debug" ], function(require, exports, module) {
    var Templates = require("job/src/1.0.0/templates/templates_module-debug");
    var DialogModel = require("job/src/1.0.0/models/dialog-model-debug");
    var DialogView = Backbone.View.extend({
        tagName: "div",
        templateId: "dialog-tpl",
        model: DialogModel,
        viewContainer: null,
        events: {
            "click #dialogOk": "OK",
            "click #dialogCancel": "CANCEL"
        },
        initialize: function() {},
        render: function() {
            var self = this;
            this.viewContainer = this.model.get("targetWrapper");
            this.viewContainer = this.viewContainer ? this.viewContainer : $(document.body);
            this.$el.html(Templates.template(this.templateId, this.model.toJSON()));
            this.viewContainer.append(this.$el);
            //模式窗口显示背景层
            if (this.model.get("modalDialog")) {
                this.viewContainer.css({
                    overflow: "hidden"
                });
            }
            //定时关闭
            if (this.model.get("duration")) {
                setTimeout(function() {
                    self.close();
                }, this.model.get("duration"));
            }
        },
        /**
         * 点击ok
         * @constructor
         */
        OK: function() {
            //如果有回调函数则回调
            var callback = this.model.get("callback");
            if (callback && callback.OK) {
                callback.OK();
            }
            this.close();
        },
        /**
         * 取消按钮
         * @constructor
         */
        CANCEL: function() {
            var callback = this.model.get("callback");
            if (callback && callback.CANCEL) {
                callback.CANCEL();
            }
            this.close();
        },
        /**
         * 关闭对话框
         */
        close: function() {
            var self = this;
            if (self.model.get("modalDialog")) {
                self.$(".photo_mask").fadeOut();
                self.viewContainer.css({
                    overflow: "auto"
                });
            }
            self.$(".confirmation").slideUp(300, function() {
                self.$el.remove();
            });
        }
    });
    module.exports = DialogView;
});

define("job/src/1.0.0/models/dialog-model-debug", [], function(require, exports, module) {
    /**
     * @namespace
     * @name SwitchModel
     * @type Object
     * @description
     */
    module.exports = Backbone.Model.extend({
        defaults: {
            title: "",
            //提示
            content: "",
            //内容
            size: "medium",
            //small, medium, large
            duration: 0,
            //定时关闭
            modalDialog: false,
            //模式对话框
            targetWrapper: undefined,
            //容器
            buttons: {
                OK: false,
                CANCEL: false
            },
            callback: {
                OK: function() {},
                CANCEL: function() {}
            }
        }
    });
});

define("job/src/1.0.0/views/message-view-debug", [ "job/src/1.0.0/templates/templates_module-debug", "job/src/1.0.0/common/util-debug", "job/src/1.0.0/common/view-util-debug", "job/src/1.0.0/views/dialog-view-debug", "job/src/1.0.0/models/dialog-model-debug", "autocompleter-debug", "autocompleterStyle-debug" ], function(require, exports, module) {
    var Templates = require("job/src/1.0.0/templates/templates_module-debug");
    var util = require("job/src/1.0.0/common/util-debug");
    var viewUtil = require("job/src/1.0.0/common/view-util-debug");
    var MessageView = Backbone.View.extend({
        tagName: "div",
        templateId: "send-msg-tp1",
        className: "popup",
        attributes: {
            style: "width: 505px; left: 422px; top: 166px;position:fixed;"
        },
        //model: DialogModel,
        viewContainer: null,
        events: {
            "click #send": "OK",
            "click #close": "CANCEL",
            "click #popupClose": "close"
        },
        render: function(data) {
            this.userid = data.userid;
            this.$el.html(Templates.template(this.templateId, data));
            $(document.body).append(this.$el);
            this.$el.fadeIn();
            $("#summary").focus();
        },
        /**
         * 点击ok
         * @constructor
         */
        OK: function() {
            var self = this;
            var msgText = $("#summary").val();
            if (msgText) {
                $.ajax({
                    url: util.url.sendMessage,
                    type: "POST",
                    dataType: "json",
                    data: {
                        fid: self.userid,
                        summary: msgText
                    },
                    success: function(response) {
                        //seajs.log("ok");
                        viewUtil.alert("已发送");
                    },
                    error: function() {
                        seajs.log(" message  failed by post");
                    }
                });
                this.close();
            } else {
                $(".txtbox .sendtxt").addClass("e");
                $("#summarytips").text("忘记写内容了，说点什么吧");
            }
        },
        /**
         * 取消按钮
         * @constructor
         */
        CANCEL: function() {
            //            var callback = this.model.get("callback");
            //            if(callback && callback.CANCEL){
            //                callback.CANCEL();
            //            }
            this.close();
        },
        /**
         * 关闭对话框
         */
        close: function() {
            this.$el.fadeOut();
        }
    });
    module.exports = new MessageView();
});

define("job/src/1.0.0/views/browser-view-debug", [ "job/src/1.0.0/templates/templates_module-debug", "job/src/1.0.0/views/person-card-view-debug", "job/src/1.0.0/models/contact-model-debug", "job/src/1.0.0/common/util-debug", "job/src/1.0.0/common/view-util-debug", "job/src/1.0.0/views/dialog-view-debug", "job/src/1.0.0/models/dialog-model-debug", "autocompleter-debug", "autocompleterStyle-debug", "job/src/1.0.0/views/message-view-debug", "job/src/1.0.0/views/message-view-debug" ], function(require, exports, module) {
    var Templates = require("job/src/1.0.0/templates/templates_module-debug");
    var cardView = require("job/src/1.0.0/views/person-card-view-debug");
    var viewUtil = require("job/src/1.0.0/common/view-util-debug");
    var messageView = require("job/src/1.0.0/views/message-view-debug");
    var BrowserView = Backbone.View.extend({
        tagName: "li",
        templateId: "recommend-browser-tpl",
        className: "user_li",
        events: {
            "mouseenter .user_pic": "showCard",
            "mouseleave .user_pic": "hideCard"
        },
        initialize: function() {},
        render: function() {
            this.$el.html(Templates.template(this.templateId, this.model.toJSON()));
            return this.$el;
        },
        dynamicPeople: function() {},
        /**
         * 显示名片
         */
        showCard: function(e) {
            var self = this;
            e = e || window.event;
            var $target = $(e.target || e.srcElement);
            var pos = {
                div: {
                    top: 28,
                    left: -1
                },
                i: {
                    top: -6,
                    left: 10
                }
            };
            var uid = self.model.attributes.userid;
            var type = self.model.attributes.type;
            var isShowName = self.model.attributes.showName;
            if (!isShowName && !this.model.get("loading")) {
                self.model.set({
                    loading: true
                });
                var person = self.model;
                window.appView.ajaxGetPerson(person, {
                    uid: uid,
                    type: type,
                    container: $target.parents(".user_pic"),
                    callback: function() {
                        if (self.$el.find(".j_pop_box") && cardView.isShow()) {
                            self.model.set({
                                loading: false
                            });
                            cardView.showPersonCard(self.$(".user_pic"), self.model.attributes, pos);
                        }
                    }
                });
            }
            /**
             * 用于展示在网速不佳时，卡片数据加载的状态；
             * */
            cardView.showPersonCard(self.$(".user_pic"), self.model.attributes, pos);
        },
        /**
         * 隐藏名片
         */
        hideCard: function() {
            cardView.hidePersonCard();
        },
        /**
         * 添加或者联系好友
         */
        contactOrAdd: function() {
            if (this.model.get("type") == 1) {
                buriedPoint(35506019);
                messageView.render({
                    userid: this.model.get("userid"),
                    showName: this.model.get("showName")
                });
            } else {
                buriedPoint(35506020);
                viewUtil.addFriend(this.model.get("userid"));
            }
            return false;
        }
    });
    module.exports = BrowserView;
});

/**
 * Created by calngtuang on 3/28/14.
 */
define("job/src/1.0.0/common/antiXSS-debug", [], function(require, exports, module) {
    (function($) {
        $.xssScan = {
            scanOpenTag: function(plainText) {
                var regExp = /</gi;
                var result = plainText.replace(regExp, "&lt");
                //                seajs.log("result:", result);
                return result;
            },
            scanCloseTag: function(plainText) {
                var regExp = />/gi;
                var result = plainText.replace(regExp, "&gt");
                //                seajs.log("result:", result);
                return result;
            },
            filterHTMLTag: function(plainText) {
                return this.scanCloseTag(this.scanOpenTag(plainText));
            }
        };
    })(jQuery);
    module.exports = $.xssScan;
});

define("job/src/1.0.0/models/switch-model-debug", [], function(require, exports, module) {
    /**
     * @namespace
     * @name SwitchModel
     * @type Object
     * @description
     */
    module.exports = Backbone.Model.extend({
        defaults: {
            prevIdx: 0,
            currentIdx: 0,
            count: 0
        }
    });
});

define("job/src/1.0.0/views/switch-view-debug", [ "job/src/1.0.0/templates/templates_module-debug" ], function(require, exports, module) {
    var Templates = require("job/src/1.0.0/templates/templates_module-debug");
    var BroadcastView = Backbone.View.extend({
        tagName: "div",
        className: "jo_switch",
        templateId: "c-switch-tpl",
        //绑定事件
        events: {
            "click .j_c_l": "prevPage",
            "click .j_c_r": "nextPage",
            "click .j_c_con li": "clickLi"
        },
        initialize: function() {
            this.listenTo(this.model, "change", this.render);
        },
        render: function() {
            this.$el.html(Templates.template(this.templateId, this.model.toJSON()));
            return this.$el;
        },
        /**
         * 上一页
         */
        prevPage: function() {
            var current = this.model.get("currentIdx");
            if (current) {
                buriedPoint(35506021);
                this.model.set({
                    prevIdx: current,
                    currentIdx: current - 1
                });
                this.changePage();
            }
            return false;
        },
        /**
         * 下一页
         */
        nextPage: function() {
            buriedPoint(35506021);
            var current = this.model.get("currentIdx");
            if (current < this.model.get("count") - 1) {
                this.model.set({
                    prevIdx: current,
                    currentIdx: current + 1
                });
                this.changePage();
            }
            return false;
        },
        /**
         * 点击某一页
         */
        clickLi: function(e) {
            buriedPoint(35506021);
            var e = e || window.event;
            var index = +$(e.target || e.srcElement).attr("idx");
            var current = this.model.get("currentIdx");
            if (current != index) {
                this.model.set({
                    prevIdx: current,
                    currentIdx: index
                });
                this.changePage();
            }
        },
        /**
         * 触发翻页事件
         */
        changePage: function() {
            //            var changedIdx = this.model.get("currentIdx") - this.model.get("prevIdx");
            this.trigger("pageChanged", {
                //                offset: changedIdx,
                current: this.model.get("currentIdx")
            });
            switch (this.model.get("currentIdx") + 1) {
              case 1:
                this.$(".j_c_r").addClass("jr_on");
                this.$(".j_c_l").removeClass("jl_on");
                break;

              case this.model.get("count"):
                this.$(".j_c_l").addClass("jl_on");
                this.$(".j_c_r").removeClass("jr_on");
                break;

              default:
                this.$(".j_c_l").addClass("jl_on");
                this.$(".j_c_r").addClass("jr_on");
                break;
            }
        }
    });
    module.exports = BroadcastView;
});

define("job/src/1.0.0/models/industry-info-model-debug", [ "job/src/1.0.0/common/util-debug" ], function(require, exports, module) {
    var util = require("job/src/1.0.0/common/util-debug");
    /**
     * @namespace
     * @name JobInfoModel
     * @type Object
     * @description
     */
    module.exports = Backbone.Model.extend({
        defaults: {
            newsID: 1,
            //主键
            title: 2,
            //标题
            content: 3,
            //正文
            publicDate: "",
            //发布日期
            key1: 5,
            //关键字1
            key2: 6,
            //关键字2
            key3: 7,
            //关键字3
            sequence: 8,
            //序列
            source: "",
            //来源
            type: 2,
            // 1.招聘内容 2.行业资讯
            url: "",
            //来自的地址
            tags: []
        },
        parse: function(response) {
            response.tags = response.key1 ? response.key1.split("#") : [];
            return response;
        }
    });
});

define("job/src/1.0.0/views/industry-info-view-debug", [ "job/src/1.0.0/templates/templates_module-debug", "job/src/1.0.0/collections/contact-collection-debug", "job/src/1.0.0/models/contact-model-debug", "job/src/1.0.0/common/util-debug", "job/src/1.0.0/views/contact-view-debug", "job/src/1.0.0/views/person-card-view-debug", "job/src/1.0.0/common/view-util-debug", "job/src/1.0.0/views/dialog-view-debug", "job/src/1.0.0/models/dialog-model-debug", "autocompleter-debug", "autocompleterStyle-debug", "job/src/1.0.0/views/message-view-debug", "job/src/1.0.0/views/browser-view-debug", "job/src/1.0.0/common/antiXSS-debug", "job/src/1.0.0/models/switch-model-debug", "job/src/1.0.0/views/switch-view-debug" ], function(require, exports, module) {
    var Templates = require("job/src/1.0.0/templates/templates_module-debug");
    var ContactCollection = require("job/src/1.0.0/collections/contact-collection-debug");
    var SwitchModel = require("job/src/1.0.0/models/switch-model-debug");
    var ContactModel = require("job/src/1.0.0/models/contact-model-debug");
    var SwitchView = require("job/src/1.0.0/views/switch-view-debug");
    var util = require("job/src/1.0.0/common/util-debug");
    var IndustryInfoView = Backbone.View.extend({
        tagName: "div",
        className: "tradenews mb15",
        templateId: "industry-feed-tpl",
        events: {
            "click .j_expand": "showContent",
            "click .j_open": "hideContent",
            "click .j_source a": "countSourceClick",
            "click .user_pic a": "countHeadClick"
        },
        initialize: function() {},
        render: function() {
            var self = this;
            this.$el.html(Templates.template(this.templateId, this.model.toJSON()));
            this.model.collection.viewContainer.append(this.$el);
            //加载浏览过的人
            var browserViewers = new ContactCollection([], {
                newsID: this.model.get("newsID"),
                recommendType: 2,
                viewContainer: this.$("#recommend-browser ul.user_wrap")
            });
            //
            //            //监听推荐的人获取数据之后
            browserViewers.on("reset", function() {
                //                seajs.log(contactCompany.length);
                self.showSwitcher(0, browserViewers.length);
            }, browserViewers);
            self.browserViewers = browserViewers;
            //只展示4行，多的隐藏
            this.actHeight = this.$(".explain").height();
            if (this.actHeight > 120) {
                this.$(".explain").height(120);
                this.$(".explain").css("overflow", "hidden");
                this.$(".j_source").hide();
            } else {
                this.$(".tra_btn").remove();
            }
        },
        /**
         * 获取推荐的人之后显示容器并且显示翻页
         * @param type 0: 公司, 1:职位
         * @param count 有多少条推荐的人
         */
        showSwitcher: function(type, count) {
            if (!count) return;
            var self = this;
            var containerId = "recommend-browser";
            // type ? "recommend-job" :
            self.$("#" + containerId).show();
            self.$(".f_foot").fadeIn();
            var ul = self.$("#" + containerId + " ul.user_wrap");
            //显示页切换器
            if (count > 12) {
                //总共几页
                count = Math.ceil(count / 12);
                var switchModel = new SwitchModel({
                    count: count
                });
                var switcher = new SwitchView({
                    model: switchModel
                });
                self.$("#" + containerId + " .j_switch").html(switcher.render());
                this.listenTo(switcher, "pageChanged", function(param) {
                    //                    var left = ul.css("marginLeft");
                    //                    left = +left.split("px")[0];
                    var left = -10 + -param.current * 513;
                    ul.animate({
                        marginLeft: left
                    });
                });
            }
        },
        /**
         * 展开收起更多
         * @param e
         */
        showContent: function() {
            buriedPoint(35506046);
            this.$(".j_expand").toggle();
            this.$(".j_open").toggle();
            this.$(".j_source").show();
            this.$(".explain").animate({
                height: this.actHeight
            });
            this.markUser();
        },
        hideContent: function() {
            buriedPoint(35506047);
            this.$(".explain").animate({
                height: 120
            });
            this.$(".j_source").hide();
            util.restoreScroll({
                scrollHeight: $(document).scrollTop() - this.actHeight + 120
            });
            this.$(".j_expand").toggle();
            this.$(".j_open").toggle();
        },
        markUser: function() {
            var self = this;
            var musketeers = self.browserViewers.where({
                userid: window.PROFILE_DATA.profile.userId
            });
            if (musketeers.length > 0) {
                return;
            }
            var param;
            param = {
                newsId: this.model.get("newsID")
            };
            $.ajax({
                url: util.url.addBrowser,
                type: "POST",
                dataType: "json",
                //                timeout: 10000,
                data: param,
                success: function(response) {
                    if (response["returnCode"] == 200) {
                        var contact = new ContactModel();
                        var profile = window.PROFILE_DATA.profile;
                        contact.set(contact.parse({
                            userid: profile.userId,
                            nickname: profile.nickname,
                            portraitMiddle: profile.portraitMiddle,
                            company: window.myJobModel.get("company"),
                            position: window.myJobModel.get("position"),
                            type: 8,
                            //1:一度好友,2:二度好友,3:陌生人
                            mobileNo: profile.mobile,
                            //用户电话
                            sid: profile.fetionId
                        }));
                        //                        var musketeers = self.browserViewers.where("profile.userId");
                        //                        if(musketeers > 0){
                        //                            return;
                        //                        };
                        self.$("#recommend-browser").show();
                        self.browserViewers.add(contact, {
                            prepend: true
                        });
                    } else {
                        seajs.log(response);
                    }
                },
                error: function() {
                    seajs.log("JobInfo get more data from server failed");
                },
                complete: function() {
                    $(".aj_btn").removeAttr("disabled");
                }
            });
        },
        countSourceClick: function() {
            buriedPoint(35506048);
        },
        countHeadClick: function() {
            buriedPoint(35506049);
        }
    });
    module.exports = IndustryInfoView;
});

define("job/src/1.0.0/routers/subscribe_and_publish-debug", [], function(require, exports, module) {
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

define("job/src/1.0.0/views/my-job-view-debug", [ "job/src/1.0.0/templates/templates_module-debug", "job/src/1.0.0/common/util-debug", "job/src/1.0.0/common/view-util-debug", "job/src/1.0.0/views/dialog-view-debug", "job/src/1.0.0/models/dialog-model-debug", "autocompleter-debug", "autocompleterStyle-debug" ], function(require, exports, module) {
    var Templates = require("job/src/1.0.0/templates/templates_module-debug");
    var util = require("job/src/1.0.0/common/util-debug");
    var viewUtil = require("job/src/1.0.0/common/view-util-debug");
    var MyJobView = Backbone.View.extend({
        tagName: "div",
        templateId: "my-job-tpl",
        expandTop: false,
        //是否展开
        events: {
            "click .m_top .m_switch": "toggleMyJob",
            "click .datamsg .fill": "showAddMyJob",
            "click .s_confirm": "addMyJob",
            "click .s_cancel": "cancelEdit",
            "click .u_r span": "showAddMyJob",
            "click .mj_title .d_edit": "showAddMyJob",
            "change #province": "getCity"
        },
        initialize: function() {
            // bind all event to the this namespace
            //			_.bindAll(this, 'delOrReportBr','disposalBroadcast','addComment');
            this.listenTo(this.model, "change", function() {
                this.render();
                var myJobChange = _.keys(this.model.changed);
                this.model.set({
                    opt: ""
                }, {
                    silent: true
                });
                if (myJobChange.length > 1) {
                    var myJobInfo = _.omit(this.model.changed, "opt");
                    this.saveMyJob(myJobInfo);
                }
            });
        },
        render: function(container) {
            this.$el.html(Templates.template(this.templateId, this.model.toJSON()));
            //            this.renderMyTags();
            if (container) {
                container.html(this.$el);
            }
            if (!this.model.get("hasNoJob")) {} else {
                $(".m_top .edit").hide();
            }
        },
        /**
         * 显示添加信息页面
         */
        showAddMyJob: function() {
            $(".unfilled").hide();
            $(".filled").fadeIn();
            $(".m_show").hide();
            $(".d_edit").hide();
            buriedPoint(35506002);
            this.toggleTopBtn(true);
            this.fillProvince();
        },
        /**
         * 切换按钮显示隐藏
         * @param isEdit
         */
        toggleTopBtn: function(isEdit) {
            if (isEdit) {
                $(".m_top .edit").hide();
                $(".m_top .confirm").fadeIn();
                $(".m_top .cancel").fadeIn();
                this.$(".d_show").hide();
                this.$(".d_fill").fadeIn();
            } else {
                $(".m_top .confirm").hide();
                $(".m_top .cancel").hide();
                $(".m_top .edit").fadeIn();
                this.$(".d_fill").hide();
                this.$(".d_show").fadeIn();
            }
            this.expandTop = !this.expandTop;
        },
        /**
         * 添加信息页面
         */
        addMyJob: function() {
            buriedPoint(35506006);
            var self = this;
            var company = $.trim($("#myCompany").val());
            var job = $.trim($("#myJob").val());
            var length = util.getByteLength(job);
            var reg = /[`~!@#$%^&*_+<>{}\/'[\]]/gi;
            if (!job || !company) {
                $(".d_i_t").each(function(index) {
                    if ($(this).val() == "") {
                        $(this).addClass("d_not");
                    }
                });
                viewUtil.alert("公司和职位不能为空！");
                return;
            }
            if (length > 20) {
                viewUtil.alert("职位不能超过10个字");
                return;
            }
            length = util.getByteLength(company);
            if (length > 50) {
                viewUtil.alert("公司不能超过25个字");
                return;
            }
            if (reg.test(job) || job == $.trim($("#myJob").attr("placeholder"))) {
                viewUtil.alert("请输入正确的工作职位");
                return;
            }
            if (reg.test(company) || company == $.trim($("#myCompany").attr("placeholder"))) {
                viewUtil.alert("请输入正确的公司名称");
                return;
            }
            var option = $("#province :selected");
            var province = +option.val() ? option.text() : "";
            option = $("#city :selected");
            var city = +option.val() ? option.text() : "";
            //            this.model.set({opt:"ok"});
            var opt = "ok";
            var param = {
                company: company,
                position: job,
                province: province,
                city: city,
                opt: opt
            };
            param.hasNoJob = company == "" && job == "";
            this.model.set(param);
        },
        saveMyJob: function(param) {
            // 数据必须完整  PHP端才会接收更新
            var data = {};
            data.company = param.company ? param.company : this.model.get("company");
            data.position = param.position ? param.position : this.model.get("position");
            data.province = param.province ? param.province : this.model.get("province");
            data.city = param.city ? param.city : this.model.get("city");
            $.ajax({
                url: util.url.editWorkInfo,
                type: "POST",
                dataType: "json",
                //                timeout: 10000,
                data: data,
                success: function(response) {
                    if (response["returnCode"] == 200) {
                        appView.jobInfoCollection.initData();
                    } else {
                        seajs.log(response);
                    }
                },
                error: function() {
                    seajs.log("JobInfo get more data from server failed");
                }
            });
        },
        /**
         * 隐藏删除感兴趣的职位按钮
         * @param e
         */
        hideDelBtn: function(e) {
            e = e || window.event;
            var $target = $(e.target || e.srcElement);
            $target.find(".opeico").hide();
        },
        /**
         * 获取省份
         */
        fillProvince: function() {
            var province = $("#province");
            var city = $("#city");
            if (!province.children().length) {
                var provinces = util.getProvinces();
                province.append('<option value="0">请选择</option>');
                for (var i in provinces) {
                    province.append('<option value="' + provinces[i].Id + '">' + provinces[i].Name + "</option>");
                }
            }
            if (this.model.get("province")) {
                province.val(province.find("option:contains('" + this.model.get("province") + "')").val());
            }
            province.change();
        },
        /**
         * 获取城市
         */
        getCity: function() {
            var self = this;
            var provinceId = +$("#province").val();
            var city = $("#city");
            city.html("");
            if (util.isBigCites(provinceId)) {
                city.append($("#province option:selected").prop("outerHTML"));
                return;
            }
            city.append('<option value="0">请选择</option>');
            $.ajax({
                url: util.url.city,
                type: "POST",
                dataType: "json",
                //                timeout: 10000,
                data: {
                    proid: provinceId
                },
                success: function(response) {
                    var selected;
                    for (var i in response) {
                        selected = "";
                        if (self.model.get("city") == response[i].Name) {
                            selected = 'selected="selected"';
                        }
                        city.append("<option " + selected + ' value="' + response[i].Id + '">' + response[i].Name + "</option>");
                    }
                },
                error: function() {
                    seajs.log("JobInfo get more data from server failed");
                }
            });
        },
        /**
         * 取消编辑
         */
        cancelEdit: function() {
            buriedPoint(35506007);
            this.expandTop = false;
            this.render();
        }
    });
    module.exports = MyJobView;
});

define("job/src/1.0.0/views/my-tag-view-debug", [ "job/src/1.0.0/templates/templates_module-debug", "job/src/1.0.0/common/util-debug", "job/src/1.0.0/common/view-util-debug", "job/src/1.0.0/views/dialog-view-debug", "job/src/1.0.0/models/dialog-model-debug", "autocompleter-debug", "autocompleterStyle-debug" ], function(require, exports, module) {
    var Templates = require("job/src/1.0.0/templates/templates_module-debug");
    //    var ContactModel = require('../models/contact-model');
    var util = require("job/src/1.0.0/common/util-debug");
    var viewUtil = require("job/src/1.0.0/common/view-util-debug");
    var MyTagView = Backbone.View.extend({
        tagName: "div",
        templateId: "tag-edit-tpl",
        expandTop: false,
        //是否展开
        events: {
            "click .j_edit a.e_btn": "toggleAddTag",
            "click .j_edit .e_sure": "refreshJobInfo",
            "click .j_edit .e_cancel": "cancelEdit",
            "click .j_show .del": "delTag",
            "click .aj_btn": "addTag",
            "click #recommendations-tag a": "recommendationsTag"
        },
        initialize: function() {
            // bind all event to the this namespace
            //			_.bindAll(this, 'delOrReportBr','disposalBroadcast','addComment');
            //            this.model = new ContactModel();
            //            this.listenTo(this.model, 'change', function () {
            //                this.render();
            //
            //                var myTagChange = _.keys(this.model.changed);
            //                this.model.set({opt: ""}, {silent: true});
            //                if (myTagChange.length > 1) {
            //                    var myTagInfo = _.omit(this.model.changed, "opt");
            //                    this.addTag(myTagInfo);
            //                }
            //            });
            this.newTags = _.clone(this.model.get("tags"));
        },
        render: function(container) {
            this.$el.html(Templates.template(this.templateId, this.model.toJSON()));
            this.renderMyTags();
            this.renderRecommendationsTags();
            if (container) {
                container.html(this.$el);
            }
        },
        /**
         * 渲染我的感兴趣的工作
         * @param tags
         */
        renderMyTags: function(tags) {
            tags = tags || this.model.get("tags");
            this.$(".j_show div").html(viewUtil.renderTags(tags, {
                needRandom: undefined,
                myjob: true
            }));
        },
        /**
         *渲染推荐工作
         **/
        renderRecommendationsTags: function(tags) {
            tags = tags || this.model.get("tags");
            this.$("#recommendations-tag").html(Templates.template("recommendations-tag-tpl", {
                tags: tags,
                positionTags: positionTags
            }));
        },
        refreshData: function() {
            appView.initJobInfo({
                reset: true,
                url: util.url.jobInfo
            });
        },
        /**
         * 切换显示添加感兴趣的职位
         */
        toggleAddTag: function() {
            buriedPoint(35506008);
            $(".j_show").toggle();
            if (this.$(".j_show li").length > 0) {
                $(".j_show").show();
            }
            $(".j_add").toggle();
            $("a.e_btn").toggle();
            $("div.e_btn").toggle();
            $(".j_tit").toggle();
            if (this.$(".j_show li").length < 1) {
                $(".j_tit").show();
            }
            $(".j_show .del").toggle();
        },
        refreshJobInfo: function() {
            var self = this;
            var myOldTag = this.model.get("tags");
            var changed = this.validateChange(myOldTag, this.newTags);
            if (changed) {
                var myTags = this.newTags.join(",");
                var param = {
                    positions: myTags,
                    offset: 0
                };
                $(".aj_btn").attr("disabled", "disabled");
                $.ajax({
                    url: util.url.saveTag,
                    type: "POST",
                    dataType: "json",
                    //                timeout: 10000,
                    data: param
                }).done(function(response) {
                    if (response["returnCode"] == 200) {
                        $("#addTagText").val("");
                        self.model.set("tags", myTags ? myTags.split(",") : []);
                        //                        self.render();
                        self.toggleAddTag();
                        self.refreshData();
                    } else {
                        seajs.log(response);
                    }
                }).fail(function() {
                    seajs.log("JobInfo get more data from server failed");
                }).always(function() {
                    $(".aj_btn").removeAttr("disabled");
                });
            } else {
                this.render();
            }
        },
        validateChange: function(myOldTag, myNewTag) {
            return !_.isEqual(myNewTag, myOldTag);
        },
        /**
         * 添加感兴趣的职位
         */
        addTag: function(label) {
            buriedPoint(35506009);
            $(".j_show").show();
            if (this.$(".j_show li").length >= 3) {
                viewUtil.alert("最多只能添加3个感兴趣的职位!");
                return;
            }
            var label = $.trim($("#addTagText").val()) || label;
            if (!label || label == $.trim($("#addTagText").attr("placeholder"))) {
                viewUtil.alert("请输入职位名称");
                return;
            }
            if (_.contains(this.newTags, label)) {
                viewUtil.alert("您添加的职位已存在");
                return;
            }
            if (util.getByteLength(label) > 20) {
                viewUtil.alert("职位不能超过10个字");
                return;
            }
            if (!this.newTags.length) {
                //                this.$('.j_tit').hide();
                this.$(".j_show").show();
            }
            this.newTags.push(label);
            $("#addTagText").val("");
            this.renderMyTags(this.newTags);
            $(".j_show .del").show();
        },
        /**
         * 删除感兴趣的职位
         */
        delTag: function(e) {
            buriedPoint(35506010);
            var self = this;
            e = e || window.event;
            var $target = $(e.target || e.srcElement);
            var label = $target.siblings("a").children("span").text();
            this.newTags = _.without(this.newTags, label);
            $target.siblings("a").parent().remove();
            this.renderRecommendationsTags(this.newTags);
        },
        /**
         * 取消编辑
         */
        cancelEdit: function() {
            buriedPoint(35506007);
            this.newTags = _.clone(this.model.get("tags"));
            this.render();
        },
        /**
         * 添加删除推荐职位
         */
        recommendationsTag: function(e) {
            e = e || window.event;
            var $target = $(e.target || e.srcElement);
            if ($target.parent().hasClass("b_on")) {
                this.newTags = _.without(this.newTags, $target.text());
                this.renderMyTags(this.newTags);
                $(".j_show .del").toggle();
                $target.parent().removeClass("b_on");
            } else {
                this.addTag($target.text());
                this.renderRecommendationsTags(this.newTags);
            }
        }
    });
    module.exports = MyTagView;
});

define("job/src/1.0.0/views/industry-tag-view-debug", [ "job/src/1.0.0/templates/templates_module-debug", "job/src/1.0.0/common/util-debug" ], function(require, exports, module) {
    var Templates = require("job/src/1.0.0/templates/templates_module-debug");
    var util = require("job/src/1.0.0/common/util-debug");
    var IndustryTagView = Backbone.View.extend({
        tagName: "div",
        templateId: "industry-tag-edit-tpl",
        expandTop: false,
        //是否展开
        events: {
            "click .a1_l": "toggleAddTag"
        },
        initialize: function(opts) {
            // bind all event to the this namespace
            //			_.bindAll(this, 'delOrReportBr','disposalBroadcast','addComment');
            this.model = new Backbone.Model(opts.model);
            this.listenTo(this.model, "change", function() {
                this.render();
                var myTagChange = _.keys(this.model.changed);
                this.model.set({
                    opt: ""
                }, {
                    silent: true
                });
                if (myTagChange.length > 1) {
                    var myTagInfo = _.omit(this.model.changed, "opt");
                    this.addTag(myTagInfo);
                }
            });
        },
        render: function(container) {
            this.$el.html(Templates.template(this.templateId, this.model.toJSON()));
            //            this.renderMyTags();
            if (container) {
                container.html(this.$el);
            }
        },
        /**
         * 渲染我的感兴趣的资讯
         * @param refresh 是否刷新推荐列表
         */
        renderMyTags: function(refresh) {
            //            this.$(".j_show div").html(viewUtil.renderTags(this.model.get("tags"), {needRandom: undefined, myjob: true}));
            //            this.render();
            if (refresh) {
                appView.initJobInfo({
                    reset: true,
                    url: util.url.industryInfo
                });
            }
        },
        /**
         * 切换显示添加感兴趣的职位
         */
        toggleAddTag: function(e) {
            buriedPoint(35506045);
            var target = $(e.target);
            target = target.is("span") ? target.parent() : target;
            target.toggleClass("a_on");
            this.saveTag();
        },
        /**
        * 保存感兴趣的标签
        * */
        saveTag: function() {
            var self = this;
            var myTag = [];
            var tag = this.$(".a_on span");
            if (tag.length) {
                for (var i = 0; i < tag.length; i++) {
                    myTag.push(tag[i].innerText);
                }
            }
            var myTags = myTag.join(",");
            var param = {
                tags: myTags
            };
            $.ajax({
                url: util.url.myIndustryTag,
                type: "POST",
                dataType: "json",
                //                timeout: 10000,
                data: param,
                success: function(response) {
                    if (response["returnCode"] == 200) {
                        self.renderMyTags(true);
                    } else {
                        seajs.log(response);
                    }
                },
                error: function() {
                    seajs.log("JobInfo get more data from server failed");
                }
            });
        }
    });
    module.exports = IndustryTagView;
});

define("job/src/1.0.0/views/search-job-view-debug", [ "job/src/1.0.0/templates/templates_module-debug", "job/src/1.0.0/common/util-debug", "job/src/1.0.0/common/view-util-debug", "job/src/1.0.0/views/dialog-view-debug", "job/src/1.0.0/models/dialog-model-debug", "autocompleter-debug", "autocompleterStyle-debug" ], function(require, exports, module) {
    var Templates = require("job/src/1.0.0/templates/templates_module-debug");
    var util = require("job/src/1.0.0/common/util-debug");
    var viewUtil = require("job/src/1.0.0/common/view-util-debug");
    var SearchJobView = Backbone.View.extend({
        tagName: "form",
        templateId: "search-job-tpl",
        events: {
            "click .jobbut": "searchJob"
        },
        initialize: function() {},
        render: function() {
            var self = this;
            this.$el.html(Templates.template(this.templateId));
            $(".search_end").html('<span class="job"></span>&nbsp;' + '<span class="result">相关的搜索结果</span>');
            //绑定自动完成事件
            viewUtil.bindAutoComplete({
                input: this.$(".jobtxt"),
                targetWrapper: this.$(".job_list")
            });
            //拦截提交表单
            this.$el.submit(function() {
                self.searchJob();
                return false;
            });
            return this.$el;
        },
        searchJob: function() {
            var ipt = $(".jobsearch .jobtxt");
            //seajs.log(ipt.val());
            if (!ipt.val()) return false;
            if (ipt.val().length > 25) {
                viewUtil.alert("名字太长了");
                return false;
            }
            $(".search_end").fadeIn();
            appView.setSearchText(ipt.val());
            var param = {
                keyWords: ipt.val(),
                type: 2
            };
            appView.initJobInfo(param);
            return false;
        }
    });
    module.exports = new SearchJobView();
});
