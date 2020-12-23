/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};
this.i18n = (window.parent.ckan && window.parent.ckan.i18n && window.parent.ckan.i18n._) || function(s) {return s};

(function($, my) {
  "use strict";

my.RecordCount = Backbone.View.extend({
  className: 'recline-record-count',
  template: ' \
    <span class="count">{{recordCount}}</span> ' + this.i18n('records') + ' \
  ',

  initialize: function() {
    _.bindAll(this, 'render');
    this.model.bind('query:done', this.render);
    this.render();
  },

  render: function() {
    var tmplData = this.model.toTemplateJSON();
    tmplData.recordCount = tmplData.recordCount || this.i18n('Unknown number of');
    var templated = Mustache.render(this.template, tmplData);
    this.$el.html(templated);
  }
});

})(jQuery, recline.View);
