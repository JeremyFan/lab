/*
 * 说明：我关注的标签view，用于组织标签形成列表
 * 作者：fanjzh
 * 创建日期：2014.11.25
 */
define(function (require, exports, module) {
  var MyTagCollection=require('../../collections/mytag-collection'),
      TagView=require('../../views/module/tag-view');

  var MyTagView=Backbone.View.extend({
    
    el:'.tag-list.mytag',

    initialize:function(){
      this.myTagCollection=new MyTagCollection();

      // this.listenTo(this.myTagCollection,'add',this.addOne);
      this.listenTo(this.myTagCollection,'reset',this.addAll);

    },

    render:function(){
      this.myTagCollection.fetch({reset:true}); // 获取数据

      if(!this.myTagCollection.length){
        this.myTagCollection.create({id:1,name:'吸星大法'});
        this.myTagCollection.create({id:1,name:'吸星大法'});
        this.myTagCollection.create({id:1,name:'吸星大法大法'});
        this.myTagCollection.create({id:1,name:'吸星大法大法'});
        this.myTagCollection.create({id:1,name:'吸星大法'});
        this.myTagCollection.create({id:1,name:'吸星大法'});
        this.myTagCollection.create({id:1,name:'吸星大法'});
        this.myTagCollection.create({id:1,name:'吸星大法大法'});
        this.myTagCollection.create({id:1,name:'吸星大法大法'});
        this.myTagCollection.create({id:1,name:'吸星大法'});
      }
    },

    addOne:function(tag){
      var tagView=new TagView({model:tag});
      this.$el.append(tagView.render());
    },

    addAll:function(){
      this.$el.empty();
      this.myTagCollection.each(this.addOne,this);
    }

  })

  module.exports=MyTagView;
})