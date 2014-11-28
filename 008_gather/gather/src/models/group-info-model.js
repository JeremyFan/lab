/*
 * 说明：聊吧信息model
 * 作者：fanjzh
 * 创建日期：2014.11.26
 */
define(function (require, exports, module) {
  var GroupInfoModel=Backbone.Model.extend({
    defaults:{
      id:1,
      // 聊吧名
      name:'测试聊吧',
      // 聊吧缩略图
      thumbnailUrl:'',
      // 关注数
      followerCount:452,
      // 帖子数
      topicCount:7777
    }
  })

  module.exports=GroupInfoModel;
})