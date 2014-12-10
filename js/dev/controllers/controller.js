;

(function() {

    "use strict";

    var Controller = Class.extend({


        //TODO: Change this to accept a services object and the view engine
        init: function(rootScope) {

            if (!rootScope) {
                throw {
                    "Title": "Missing rootScope",
                    "Message": "The rootScope must be supplied to have a valid view"
                };
            }

            this.rootScope = rootScope;
        },

        rootScope: undefined,

        bind: function(targetSelector, templateName, data) {

            var controller = this;

            if (controller.rootScope && controller.rootScope.viewEngine) {
                controller.rootScope.viewEngine.bind(targetSelector, templateName, data);
            } else {
                throw {
                    "Title": "Missing viewEngine",
                    "Message": "There is no accessible viewEngine"
                };
            }

        },

        version: "0.5.0"

        //,

//        noResults: "<div class='no-results'>Sorry There are No Results Available</div>",

        //mainTitle: document.querySelector(".view-title"),

        //setMainTitle: function(title) {

        //    this.mainTitle.textContent = document.title = title.toLowerCase();
        //}

    });

    return (window.Controller = Controller);

})();