/*
 * 说明：配置路由
 * 作者：fanjzh
 * 创建日期：2014.11.21
 */

define(function (require, exports, module){
  var PageView=require('../views/page/page-view'),
      HomeView=require('../views/page/home-view'),
      TagPageView=require('../views/page/tagpage-view');

  var WorkSpace=Backbone.Router.extend({
    routes:{
      '':'home',
      'tag/:tagId':'tag',
      'tag/:tagId/article/:articleId':'article',
      'group/:groupId/':'group',
      'group/:groupId/topic/:topicId':'topic'
    },

    initialize:function(){},

    /// 首页
    home:function(){
      var homePage=new PageView({
        title:'扎堆'
      });
      
      new HomeView;
    },

    /// 扎堆页
    tag:function(tagId){
      var tagPage=new PageView({
        title:'文章列表'
      });

      new TagPageView;
    },

    /// 扎堆文章
    article:function(id){
      var articlePage=new PageView({
        title:'文章'
      });
    },

    /// 聊吧页
    group:function(){
      var groupPage=new PageView({
        title:'聊吧'
      });
    },

    /// 话题详情
    topic:function(id){
      var topicPage=new PageView({
        title:'帖子'
      });
    }
  })

  module.exports = WorkSpace;
})