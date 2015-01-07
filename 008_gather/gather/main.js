/*
 * 说明：seajs配置
 * 作者：fanjzh
 * 创建日期：2014.11.21
 */
define(function (require, exports, module) {
  require('backbone');
  var Router = require('../gather/src/routers/router');
  window.workSpace = new Router();
  window.Template=require('../gather/src/templates/templates_module');

  window.document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

  Backbone.history.start();


})