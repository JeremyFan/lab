/*
 * 说明：推荐扎堆的文章，无对应model
 * 作者：fanjzh
 * 创建日期：2014.11.26
 */

define(function (require, exports, module) {
  var RecommendArticleView=Backbone.View.extend({

    templateId:'template-recommend-article',

    tagName:'div',

    className:'recommend-article',

    initialize:function(){},

    render:function(){
      this.$el.html(window.Template.template(this.templateId,this.model));

      return this.$el;
    }

  })

  module.exports=RecommendArticleView;
})