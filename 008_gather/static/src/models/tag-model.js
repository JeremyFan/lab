/*
 * 说明：标签model
 * 作者：fanjzh
 * 创建日期：2014.11.25
 */
 
define(function (require, exports, module) {
  var TagModel=Backbone.Model.extend({
    defaults:{
      id:1,
      // tag名
      name:'测试'
    }
  })

  module.exports=TagModel;
})