;

(function () {

    "use strict";

    var View = Class.extend({

        init: function (rootScope) {

            if (!this.rootScope) {
                throw {
                    "Title": "Missing rootScope",
                    "Message": "The rootScope must be supplied to have a valid view"
                };
            }

            this.rootScope = rootScope;
        },

        rootScope:undefined,

        mergeData: function (targetSelector, templateName, data) {

            if (this.rootScope && this.rootScope.viewEngine) {
                this.rootScope.viewEngine.mergeData(targetSelector, templateName, data);
            } else {
                throw {
                    "Title": "Missing viewEngine",
                    "Message": "There is no accessible viewEngine"
                };
            }

        },

        version: "0.5.0",

        noResults: "<div class='no-results'>Sorry There are No Results Available</div>",

        mainTitle: document.querySelector(".view-title"),

        setMainTitle: function (title) {

            this.mainTitle.textContent = document.title = title.toLowerCase();
        }

    });

    return (window.View = View);

})();