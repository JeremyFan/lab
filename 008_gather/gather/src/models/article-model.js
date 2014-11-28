/*
 * 说明：文章model
 * 作者：fanjzh
 * 创建日期：2014.11.26
 */
define(function (require, exports, module) {
  var ArticleModel=Backbone.Model.extend({
    defaults:{
      id:1,
      // 文章标题
      title:'测试标题',
      // 缩略图链接
      thumbnailUrl:'',
      // 分享数
      shareCount:14,
      // 评论数
      commentCount:5
    }
  })

  module.exports=ArticleModel;
})