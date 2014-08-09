;
//Backpack is a deferred content managment library with single page and mobile applications in mind
(function (window, undefined) {

    "use strict";

    var Backpack = function (customSettings) {

        var backpack = new Backpack.fn.init();

        backpack.settings = $.extend({}, backpack.settings, customSettings);

        return backpack;
    };

    Backpack.fn = Backpack.prototype = {

        constructor: Backpack,

        init: function () {

            return this;
        },


        version: "0.0.4",


        updateViews: function (selector) {

            var backpack = this,
                views = document.querySelectorAll(selector);

            [].forEach.call(views, function (view) {
                backpack.saveViewToStorage(view);
            });

        },

        saveViewToStorage: function (view) {

            var backpack = this;

            //assume this is the element id if view is a string
            if (typeof view === "string") {
                view = document.getElementById(view);
            }

            if (view) {

                backpack.storeViewInfo(backpack.parseViewInfo(view));

                if (view.parentNode && !(view.className.search(backpack.settings.currentClass) > -1)) {
                    view.parentNode.removeChild(view);
                }

                view = undefined;
            }

        },

        parseViewInfo: function (view) {

            if (typeof view === "string") {
                view = document.getElementById(view);
            }

            if (typeof view === undefined || view === null) {
                return;
            }

            return {
                pageId: view.id,
                viewTitle: (view.hasAttribute("spa-title") ? view.getAttribute("spa-title") :
                    this.settings.defaultTitle),
                //need a nice way to define the default animation
                tranistion: (view.hasAttribute("spa-transition") ? view.getAttribute("spa-transition") : ""),
                content: view.outerHTML
            };

        },

        storeViewInfo: function (viewInfo) {

            var backpack = this;

            viewInfo = $.extend({}, backpack.pageSettings, viewInfo);

            localStorage.setItem(backpack.settings.appName + "-" + viewInfo.pageId,
                JSON.stringify(viewInfo));

        },

        getViewInfo: function (viewId) {

            var backpack = this,
                viewData = localStorage[this.settings.appName + "-" + viewId],
                view;

            if (!viewData) {

                //The view did not exist in storage so let's see if it is in the DOM
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

    // Give the init function the Backpack prototype for later instantiation
    Backpack.fn.init.prototype = Backpack.fn;

    return (window.Backpack = Backpack);

})(window);