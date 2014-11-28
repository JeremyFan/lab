/*
 * 说明：我关注的标签
 * 作者：fanjzh
 * 创建日期：2014.11.25
 */
define(function (require, exports, module) {
  var TagModel = require('../models/tag-model'),
      LocalStorage=require('local-storage');

  var MyTagCollection = Backbone.Collection.extend({

    model: TagModel,

    localStorage:new Backbone.LocalStorage("mytag-list"),

    initialize: function() {
    },

    /*
    fill:function(data){
      var tagList=[];
      $.each(data,function(i,item){
        var tagModel=new TagModel(item);
        tagList.push(tagModel);
      })
      this.reset(tagList);
    },

    getTagList: function() {
      var list= [
        {id:1,name:'足球'}, 
        {id:2,name:'C罗'}, 
        {id:3,name:'黄金时代'}, 
        {id:4,name:'王小波'}, 
        {id:5,name:'北京'}, 
        {id:6,name:'摇滚乐'}, 
        {id:7,name:'谢天笑与冷血动物'}, 
        {id:8,name:'高圆圆'}, 
        {id:9,name:'Oasis'}, 
        {id:10,name:'电影原声'}, 
      ];

      this.fill(list);
    }

    */
  })

  module.exports=MyTagCollection;
})