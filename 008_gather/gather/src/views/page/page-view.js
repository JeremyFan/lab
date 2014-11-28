/*
 * 说明：页面视图，扎堆的每个页面都应是一个PageView的实例。
 * 作者：fanjzh
 * 创建日期：2014.11.24
 */
define(function (require, exports, module) {
  var PageView=Backbone.View.extend({
    templateId:'template-page',
    el:'body',
    option:{},

    initialize:function(option){
      this.option=option||{};
      this.render();
    },

    render:function(){
      this.$el.html(window.Template.template(this.templateId, this.option));
    },


  })

  module.exports=PageView;
})