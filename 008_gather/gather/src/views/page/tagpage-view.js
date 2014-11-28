/*
 * 说明：标签列表页view
 * 作者：fanjzh
 * 创建日期：2014.11.26
 */

define(function (require, exports, module) {
  var GroupInfoView=require('../module/groupinfo-view'),
      ArticleListView=require('../module/article-list-view');

  var TagPageView=Backbone.View.extend({
    el:'.page-body',

    templateId:'template-tagpage',

    initialize:function(){
      this.render();
    },

    render:function(){
      this.$el.empty().html(window.Template.template(this.templateId))

    }

  })

  module.exports=TagPageView;
})