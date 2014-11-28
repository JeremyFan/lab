/*
 * 说明：seajs配置&加载main.js
 * 作者：fanjzh
 * 创建日期：2014.11.21
 */

(function() {
  seajs.config({
    base: '../sea-modules/',
    alias: {
      '$': 'crossjs/zepto/1.1.2/zepto.js',
      'underscore': 'gallery/underscore/1.7.0/underscore-min.js',
      'backbone': 'gallery/backbone/1.1.2/backbone-min.js',
      'local-storage':'gallery/backbone/plugins/backbone.localStorage/backbone.localStorage-min.js',
      'iscroll': 'bustling/iscroll/5.1.1/js/iscroll.js',
      'plugin-text': 'seajs/seajs-text/1.0.2/seajs-text.js'
    },
    preload: ['plugin-text', '$', 'underscore']
  });

  seajs.use('../static/src/main');
})()