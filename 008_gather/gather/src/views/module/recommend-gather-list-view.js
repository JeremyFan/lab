/*
 * 说明：推荐的扎堆列表view
 * 作者：fanjzh
 * 创建日期：2014.11.27
 */
 define(function (require, exports, module) {
  var RecommendGatherCollection=require('../../collections/recommend-gather-collection'),
      RecommendGatherView=require('../module/recommend-gather-view');

  var RecommendGatherListView=Backbone.View.extend({
    el:'.recommend-gather-list',

    initialize:function(){
      this.recommendGatherCollection=new RecommendGatherCollection();

      // this.listenTo(this.recommendGatherCollection,'add',this.addOne);
      this.listenTo(this.recommendGatherCollection,'reset',this.addAll);
    },

    render:function(){
      this.recommendGatherCollection.getData();
    },

    addOne:function(gather){
      var recommendGatherView=new RecommendGatherView({model:gather});
      this.$el.append(recommendGatherView.render());
    },

    addAll:function(){
      this.$el.empty();
      this.recommendGatherCollection.each(this.addOne,this);
    }

  })

  module.exports=RecommendGatherListView;
})