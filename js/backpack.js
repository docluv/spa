;

//Backpack is a deferred content managment library with singple page and mobile applications in mind
(function(window, $, undefined) {

    var backpack = function(customSettings) {

        return new backpack.fn.init(customSettings);
    };

    backpack.fn = backpack.prototype = {
        
        constructor: backpack,

        init: function(customSettings) {

            this.settings = $.extend({}, this.settings, customSettings);

            return this;
        },

        version: "0.0.1",

/*********/

        getDeferredContent: function(url) {

            return deferred(function(dfd){

                if(url && url != "") { //no need to do anything if there is no page

                    if(!this.checkLastDeferredRequest(url)) {

                        var that = this;

                        $.get(url).done(function(data) {

                            var $content = $(data),
                                $contents = $content.children(that.settings.viewSelector);

                            if($contents.length === 0) {
                                $contents = $content;
                            }

                            $.each($contents, function(j, w) {

                                that.saveContentToStorage($(w), $content);

                            });

                            localStorage.setItem(url, true);

                        })
                        .fail(function(e) {
                            dfd.reject("Deferred content " + url + " failed to load. " + JSON.stringify(e));
                        });

                    }

                }

            }).promise();

        },

        checkLastDeferredRequest: function(key) {

            return localStorage.getItem(key);

        },

        saveContentToStorage: function($target, $content) {

            if(!$target || !$content){
                return dfd.reject(errMsg.missingElem);
            }

            var id = $target.attr("id"),
                pageInfo =
                    {
                        pageId: id,
                        viewTitle: $target.data("viewtitle"),
                        content: $target[0].outerHTML
                    };

            this.storeViewInfo(pageInfo);

            localStorage.setItem(id + "-js", $content.children("#" + id + "-js").html());
            localStorage.setItem(id + "-css", $content.children("#" + id + "-css").html());

        },

        storeViewInfo: function(viewInfo) {

            viewInfo = $.extend({}, this.pageSettings, viewInfo);

            localStorage.setItem(viewInfo.pageId,
                            JSON.stringify(viewInfo));
        },

        getViewData: function(viewId){
            
            var viewData = window.localStorage[viewId];

            if(!viewData) {

                if($("#" + viewId).length > 0) {

                    this.saveContentToStorage($("#" + viewId), $("body"));
                    viewData = window.localStorage[viewId];
                }
            }

            return viewData;

        },

/*********/

        //http://www.w3schools.com/js/js_cookies.asp
        setCookie: function(c_name,value,exdays)
        {
            exdays = exdays || 1;

            var exdate=new Date();
            exdate.setDate(exdate.getDate() + exdays);

            var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
            document.cookie=c_name + "=" + c_value;

        },

        settings: {},

        pageSettings: {
            pageId: "",
            url: "",
            css: undefined,
            js: undefined,
            templates: "",
            content: "",
            defaultTemplate: "#DefaultViewTemplate"

        }

    };

    // Give the init function the backpack prototype for later instantiation
    backpack.fn.init.prototype = backpack.fn;

    return (window.backpack = backpack);

})(window, jQuery);


