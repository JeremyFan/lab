/*
 * 说明：推荐的扎堆view
 * 作者：fanjzh
 * 创建日期：2014.11.26
 */

define(function (require, exports, module) {

  var ArticleView=require('./recommend-article-view'),
      TagModel=require('../../models/tag-model'),
      TagView=require('./tag-view');

  var RecommendGatherView=Backbone.View.extend({

    tagName:'article',

    className:'recommend-gather',

    templateId:'template-recommend-gather',

    initialize:function(){
      this.item=this.model.toJSON();
    },

    render:function(){
      this.$el.html(window.Template.template(this.templateId,this.item));

      this.$articleContainer=this.$('.article-list');
      this.renderArticleList();

      this.$tagContainer=this.$('.tag-list.recommend');
      this.renderTagList();

      return this.$el;
    },

    renderTagList:function(tags,$tagContainer){
      var view=this,
          tags=tags || this.item.tags,
          $tagContainer=$tagContainer||view.$tagContainer;

          

      $.each(tags,function(i,tag){
        var tagModel=new TagModel(tag),
            tagView=new TagView({model:tagModel});
        $tagContainer.append(tagView.render());
      })
    },

    renderArticleList:function(){
      var articles=this.item.articles,
          view=this;

      $.each(articles,function(i,article){
        var articleView=new ArticleView({model:article}),
            $article=articleView.render();
            $tagContainer=$article.find('.article-tag-list'),
            // 标签是字符串数组，转化成对象数组，方便tagView操作
            tags=$.map(article.tags,function(tag){
              return {name:tag};
            });
// debugger
        view.renderTagList(tags, $tagContainer);

        view.$articleContainer.append($article);
      })
    }

  })

  module.exports=RecommendGatherView;
})