/*
 * 说明：文章列表
 * 作者：fanjzh
 * 创建日期：2014.11.26
 */
define(function (require, exports, module) {
  var ArticleModel=require('../models/article-model');
  
  var ArticleCollection=Backbone.Collection.extend({

    model:ArticleModel,

    initialize:function(){},
  })
})