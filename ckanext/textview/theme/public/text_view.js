ckan.module('text_view', function (jQuery) {
  return {
    options: {
      parameters: {
        json: {
          contentType: 'application/json',
          dataType: 'json',
          dataConverter: function (data) { return JSON.stringify(data, null, 2); },
          language: 'json'
        },
        jsonp: {
          contentType: 'application/javascript',
          dataType: 'jsonp',
          dataConverter: function (data) { return JSON.stringify(data, null, 2); },
          language: 'json'
        },
        xml: {
          contentType: 'text/xml',
          dataType: 'text',
          language: 'xml'
        },
        text: {
          contentType: 'text/plain',
          dataType: 'text',
          language: ''
        }
      }
    },
    initialize: function () {
      var self = this;
      var format = preload_resource['format'].toLowerCase();

      var TEXT_FORMATS = preview_metadata['text_formats'];
      var XML_FORMATS = preview_metadata['xml_formats'];
      var JSON_FORMATS = preview_metadata['json_formats'];
      var JSONP_FORMATS = preview_metadata['jsonp_formats'];

      var p;

      if (JSON_FORMATS.indexOf(format) !== -1) {
        p = this.options.parameters.json;
      } else if (JSONP_FORMATS.indexOf(format) !== -1) {
        p = this.options.parameters.jsonp;
      } else if(XML_FORMATS.indexOf(format) !== -1) {
        p = this.options.parameters.xml;
      } else {
        p = this.options.parameters.text;
      }

      var error = undefined;
      jQuery.ajax(resource_url, {
        xhr: function() {
          var xhr = new window.XMLHttpRequest();
          // Download progress
          xhr.addEventListener("progress", function(evt){
            if (evt.lengthComputable) {
              if (evt.total > 20000000 || evt.loaded > 20000000) {
                error = "Data too large for preview";
                xhr.abort();
              }
            }
          }, false);
          return xhr;
        },
        type: 'GET',
        contentType: p.contentType,
        dataType: p.dataType,
        success: function(data, textStatus, jqXHR) {
          data = p.dataConverter ? p.dataConverter(data) : data;
          var highlighted;

          if (p.language) {
            highlighted = hljs.highlight(p.language, data, true).value;
          } else {
            highlighted = '<pre>' + data + '</pre>';
          }

          self.el[0].innerHTML = highlighted;
        },
        error: function(jqXHR, textStatus, errorThrown) {
          if (textStatus === 'error' && jqXHR.responseText) {
            self.el.html(jqXHR.responseText);
          } else {
            if (error) {
              self.el.html(self._(
                error)
              );
            } else {
              self.el.html(self._(
                'An error occured during AJAX request. Could not load view.')
              );
            }
          }
        }
      });
    }
  };
});
