/*
 * 说明：单个标签view
 * 作者：fanjzh
 * 创建日期：2014.11.25
 */
define(function (require, exports, module) {
  var TagView=Backbone.View.extend({

    templateId:'template-tag',

    tagName:'li',

    events:{
      'tap .tag-list .tag':'enterTag'
    },

    initialize:function(){
      
    },

    render: function() {
      this.$el.html(window.Template.template(this.templateId,this.model.toJSON()));
      this.colorize();
      return this.$el;
    },

    enterTag:function(){
      window.workSpace.navigate('/tag/' + this.model.get('id'), {
        trigger: true
      });
    },

    /// 给标签上色，写着玩的
    colorize:function(){
      var color=['#32c32a','#32b8eb','#e400cc','#4593e4','#ffc600','#ef673e'],
          i=Math.floor(Math.random()*6);
      this.$('span').css('background',color[i]);
    }
  })

  module.exports=TagView;
})