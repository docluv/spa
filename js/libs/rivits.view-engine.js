/// <reference path="rivits.min.js" />


;
//RivitsViewEngine is a deferred content managment library with single page and mobile applications in mind
(function (window, undefined) {

    "use strict";

    var RivitsViewEngine = function (settings) {

        var rivitsViewEngine = new RivitsViewEngine.fn.init();


        return rivitsViewEngine;
    };

    RivitsViewEngine.fn = RivitsViewEngine.prototype = {

        constructor: RivitsViewEngine,

        init: function () {

            return this;
        },

        version: "0.0.1",

//        viewCache: undefined,
        eventPrefix: "spa-",
        $rootScope: undefined,
        templateService: undefined,
        templateType: "[type='text/x-Rivits-template']",
        appPrefix: "RivitsApp-",

        views: {},

        parseViews: function (remove) {

            var rivitsViewEngine = this,
                i, temp, viewMarkup,
                views = $.parseLocalStorage(rivitsViewEngine.appPrefix + "views"),
                t = document.querySelectorAll(rivitsViewEngine.templateType);

            if (remove === undefined) {
                remove = true; //default setting
            }

            for (i = 0; i < t.length; i++) {

                temp = t[i];
                viewMarkup = temp.outerHTML.replace(/(\r\n|\n|\r)/gm, "");

                views[temp.id] = viewMarkup;

                if (remove) {

                    if (temp.parentNode) {
                        temp.parentNode.removeChild(temp);
                    }
                }

            }

            rivitsViewEngine.setViews(views);

        },

        getView: function (viewId) {
            return this.views[viewId];
        },

        getViews: function () {
            return this.views
        },

        setView: function (viewId, view) {

            if (typeof view === "string") {

                this.views[viewId] = view;
                this.saveViews();

            }

        },

        setViews: function (views) {

            var rivitsViewEngine = this,
                view;

            for (view in views) {
                rivitsViewEngine.setView(view, views[view]);
            }

        },

        addViews: function (views) {

            var rivitsViewEngine = this,
                name, copy;

            for (name in views) {
                //  src = target[name];
                copy = views[name];

                // Prevent never-ending loop
                if (rivitsViewEngine.views === copy) {
                    continue;
                }

                if (copy !== undefined) {
                    rivitsViewEngine.views[name] = copy;
                }
            }

            rivitsViewEngine.saveViews();

        },

        saveViews: function () {

            var rivitsViewEngine = this;

            localStorage.setItem(rivitsViewEngine.appPrefix + "views", JSON.stringify(rivitsViewEngine.views));

        },

        removeView: function (key) {

            delete this.views[key];
            this.saveViews();


        },

        bind: function (targetSelector, templateName, model) {

            if ((typeof targetSelector !== "string") ||
               (typeof templateName !== "string") ||
                model === undefined) {

                throw {
                    Name: "RivitsViewEngine Error",
                    Description: "missing argument in mergeData"
                }

                return;
            }

            var rivitsViewEngine = this,
                t = document.querySelector(targetSelector);

            //verify it is a single node.
            if (t.length && t.length > 0) {
                t = t[0];
            }

            if (rivitsViewEngine.views[templateName]) {

                t.innerHTML = rivitsViewEngine.views[templateName];
                rivits.bind(t.firstChild, model);

            }

        }

    };

    // Give the init function the RivitsViewEngine prototype for later instantiation
    RivitsViewEngine.fn.init.prototype = RivitsViewEngine.fn;

    return (window.RivitsViewEngine = RivitsViewEngine);

})(window);
