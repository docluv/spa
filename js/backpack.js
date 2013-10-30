;
//Backpack is a deferred content managment library with single page and mobile applications in mind
(function (window, $, undefined) {

    "use strict";

    var backpack = function (customSettings) {

        if (!window.localStorage) {
            console.error("this browser does not support localStorage, therefore markup cannot be stored using backpack.");
        }

        var that = new backpack.fn.init();

        that.settings = $.extend({}, that.settings, customSettings);

        return that;
    };

    backpack.fn = backpack.prototype = {

        constructor: backpack,

        init: function () {
            return this;
        },

        version: "0.0.2",

        getTemplates: function (remove) {

            var i, temp,
                t = document.querySelectorAll("script[type='" + this.settings.templateType + "']"),
                templates = $.parseLocalStorage("templates");

            for (i = 0; i < t.length; i++) {

                temp = t[i];

                //uses an associative array (object) to store, so the id is usnique.
                templates[temp.id] = temp.innerHTML.replace(/(\r\n|\n|\r)/gm, "");

                if (remove) {

                    if (temp.parentNode) {
                        temp.parentNode.removeChild(temp);
                    }
                }

            }

            //can store all of them because they get compiled and therefor are just sitting in memory during runtime
            localStorage.setItem("templates", JSON.stringify(templates));

            return templates;

        },

        //keep
        updateViews: function (selector, ele) {

            ele = ele || document;

            var i, views = ele.querySelectorAll(selector);

            for (i = 0; i < views.length; i++) {
                this.saveViewToStorage(views[i]);
            }

        },

        updateViewsFromFragment: function (selector, fragment) {

            var div = document.createElement('div');
            div.innerHTML = fragment;

            this.updateViews(selector, div);
        },

        //keep, but modify the promise stuff, take it out 4 now
        saveViewToStorage: function (e) {

            if (typeof e === "string") { //assume this is the element id
                e = document.getElementById(e);
            }

            if (e) {

                this.storeViewInfo(this.parseViewInfo(e));

                if (e.parentNode && !(e.className.search("current") > -1)) {
                    e.parentNode.removeChild(e);
                }

            }

        },

        //keep, but update
        parseViewInfo: function (view) {

            return {
                pageId: view.id,
                viewTitle: (view.hasAttribute("data-title") ?
                                view.getAttribute("data-title") :
                                this.settings.defaultTitle),
                tranistion: (view.hasAttribute("data-transition") ?
                                view.getAttribute("data-transition") :
                                ""), //need a nice way to define the default animation
                content: view.outerHTML
            };

        },

        //keep
        storeViewInfo: function (viewInfo) {

            viewInfo = $.extend({}, this.pageSettings, viewInfo);

            localStorage.setItem(viewInfo.pageId,
                            JSON.stringify(viewInfo));

        },

        //keep
        getViewData: function (viewId) {

            var viewData = localStorage[viewId],
                view;

            if (!viewData) {

                view = document.getElementById(viewId);

                if (view) {

                    this.saveViewToStorage(view);
                    viewData = window.localStorage[viewId];
                }
            }

            if (viewData) {
                return JSON.parse(viewData);
            }

        },

        settings: {
            viewSelector: ".content-pane",
            defaultTitle: "A Really Cool SPA App",
            deferredTimeKey: "lastDeferredTime",
            templateType: "text/x-handlebars-template"
        },

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

})(window, $);


