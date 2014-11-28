/*
 * 说明：推荐扎堆model
 * 作者：fanjzh
 * 创建日期：2014.11.26
 */

define(function (require, exports, module) {
  var RecommendGatherModel=Backbone.Model.extend({
    defaults:{
      name:'测试扎堆',
      articles:[
        {
          id:1,
          title:'测试文章1',
          thumbnailUrl:'',
          tags:['标签1','tag2'],
          readCount:216
        },
        {
          id:2,
          title:'测试文章2',
          thumbnailUrl:'',
          tags:['标签1','tag2'],
          readCount:900
        }
      ],
      tags:[
        {
          id:1,
          name:'推荐标签'
        },
        {
          id:2,
          name:'推荐标签'
        },
        {
          id:3,
          name:'推荐标签'
        },
        {
          id:4,
          name:'推荐标签'
        }
      ]
    }
  })
  module.exports=RecommendGatherModel;
})