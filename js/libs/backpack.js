;
//Backpack is a deferred content managment library with single page and mobile applications in mind
(function(window, undefined) {

    "use strict";

    var backpack = function(customSettings) {

        var that = new backpack.fn.init(customSettings);

        that.settings = $.extend({}, that.settings, customSettings);

        return that;
    };

    backpack.fn = backpack.prototype = {

        constructor: backpack,

        init: function() {

            return this;
        },

        version: "0.0.3",


        //keep
        updateViews: function(selector) {

            var i, views = document.querySelectorAll(selector);

            for (i = 0; i < views.length; i++) {
                this.saveViewToStorage(views[i]);
            }

        },

        //keep, but modify the promise stuff, take it out 4 now
        saveViewToStorage: function(e) {

            if (typeof e === "string") { //assume this is the element id
                e = document.getElementById(e);
            }

            if (e) {

                this.storeViewInfo(this.parseViewInfo(e));

                if (e.parentNode && !(e.className.search(this.settings.currentClass) > -1)) {
                    e.parentNode.removeChild(e);
                }

                e = undefined;
            }

        },

        //keep, but update
        parseViewInfo: function(ve) {

            return {
                pageId: ve.id,
                viewTitle: (ve.hasAttribute("spa-title") ?
                    ve.getAttribute("spa-title") :
                    this.settings.defaultTitle),
                tranistion: (ve.hasAttribute("spa-transition") ?
                    ve.getAttribute("spa-transition") :
                    ""), //need a nice way to define the default animation
                content: ve.outerHTML
            };

        },

        //keep
        storeViewInfo: function(viewInfo) {

            viewInfo = $.extend({}, this.pageSettings, viewInfo);

            localStorage.setItem(this.settings.appName + "-" + viewInfo.pageId,
                JSON.stringify(viewInfo));

        },

        //keep
        getViewInfo: function(viewId) {

            var viewData = localStorage[this.settings.appName + "-" + viewId],
                view;

            if (!viewData) {

                view = document.getElementById(viewId);

                if (view) {

                    this.saveViewToStorage(view);
                    viewData = window.localStorage[this.settings.appName + "-" + viewId];
                }
            }

            if (viewData) {
                return JSON.parse(viewData);
            }

        },

        settings: {
            viewSelector: ".spa-view",
            defaultTitle: "A Really Cool SPA App",
            deferredTimeKey: "lastDeferredTime",
            templateType: "text/x-mustache-template",
            currentClass: "current",
            appName: "AppX"
        },

        pageSettings: {
            pageId: "",
            content: ""
        }

    };

    // Give the init function the backpack prototype for later instantiation
    backpack.fn.init.prototype = backpack.fn;

    return (window.backpack = backpack);

})(window);