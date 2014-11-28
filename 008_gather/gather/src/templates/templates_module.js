/*
 How to use
 ////////////////////////////////////////
 var Templates = require('template');
 Template.template(templateId, {name: 'moe'}));
 */

define(function (require, exports, module) {
    var tmplStr = require("./templates.html");
    _.templateSettings = {
        interpolate: /\{\{=(.+?)\}\}/g,
        evaluate: /\{\{(.+?)\}\}/g
    };

    var templateFuncs = {};

    $(tmplStr).filter("script").each(function(){
        var $el = $(this);
        templateFuncs[this.id] = _.template($el.html());
    });

    var Template = {
        template: function(templateId, json){
            json = json || {};
            return templateFuncs[templateId](json);
        }
    };

    module.exports = Template;
});