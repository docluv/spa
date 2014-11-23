//Mock View Engine to test spa library

;

(function (window, undefined) {

    "use strict";

    var MockViewEngine = function () {

        return new MockViewEngine.fn.init();

    };

    MockViewEngine.fn = MockViewEngine.prototype = {

        constructor: MockViewEngine,

        init: function () {

            return this;
        },

        version: "0.0.1",

        eventPrefix: "spa-",
        templateType: "[type='text/x-Mock-template']",
        appPrefix: "MockApp-",

        views: {},

        parseViews: function (remove) {

            console.log("parseView called, remove = " + remove);

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

            var mockViewEngine = this,
                view;

            for (view in views) {
                mockViewEngine.setView(view, views[view]);
            }

        },

        addViews: function (views) {

            var mockViewEngine = this,
                name, copy;

            for (name in views) {

                copy = views[name];

                // Prevent never-ending loop
                if (mockViewEngine.views === copy) {
                    continue;
                }

                if (copy !== undefined) {
                    mockViewEngine.views[name] = copy;
                }
            }

            mockViewEngine.saveViews();

        },

        saveViews: function () {

            var mockViewEngine = this;

            localStorage.setItem(mockViewEngine.appPrefix + "views", JSON.stringify(mockViewEngine.views));

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
                    Name: "MockViewEngine Error",
                    Description: "missing argument in mergeData"
                }

                return;
            }

            var mockViewEngine = this;

            if (mockViewEngine.views[templateName]) {

                console.log("we have a match to the view");

            } else {

                console.error("we do not have a view match");

            }

        }

    };

    // Give the init function the mockViewEngine prototype for later instantiation
    mockViewEngine.fn.init.prototype = MockViewEngine.fn;

    return (window.MockViewEngine = MockViewEngine);

})(window);
