/*
 * 说明：首页视图，用于组织首页各个模块
 * 作者：fanjzh
 * 创建日期：2014.11.24
 * todo：1.抽象标签页插件
 */

define(function (require, exports, module) {
  var RecommendGatherListView=require('../module/recommend-gather-list-view'),
      MyTagView=require('../module/mytag-view'),
      IScroll = require('iscroll');

  var TabPane={
    SquareId:'square',
    MeId:'me'
  }

  var HomeView=Backbone.View.extend({
    el:'.page-body',

    templateId:'template-home',

    events:{
      'tap .home-nav a':'changeTab'
    },

    initialize:function(){
      this.render();
    },

    render:function(){
      this.$el.append(window.Template.template(this.templateId));

      this.initScroll();
      // debugger
      // this.$('.btn-square').trigger('tap');
      this.changeTab({target:$('.btn-square')});
    },

    changeTab:function(e){
      var $this=$(e.target),
          selector=$this.attr('data-href'),
          $as=this.$('.home-nav a'),
          $tabpane=this.$(selector),
          $tabpanes=this.$('.tab-pane');

      if($tabpane.hasClass('active')) return;

      $as.removeClass('active');
      $this.addClass('active');

      $tabpanes.removeClass('active');
      $tabpane.addClass('active');
      
      if($tabpane.attr('id')===TabPane.SquareId){
        this.initRecommendGatherData();
        this.squareScroll.refresh();
      }
      else if($tabpane.attr('id')===TabPane.MeId){
        this.initMyTagData();
        // this.meScroll.refresh();
      }
      
    },

    initScroll:function(){
      var squareTabPane=this.$('#square')[0],
          meTabPane=this.$('#me')[0];

      param = {
          probeType: 3, 
          shrinkScrollbars: 'scale',
          fadeScrollbars: true
      };

      this.squareScroll=new IScroll(squareTabPane,param);
      // this.meScroll=new IScroll(meTabPane,param);
    },

    initRecommendGatherData:function(){
      var recommendGatherListView=new RecommendGatherListView();
      recommendGatherListView.render();
    },

    initMyTagData:function(){
      var myTagView=new MyTagView();
      myTagView.render();
    }

  })

  module.exports=HomeView;
})