;

(function () {

    "use strict";

    var testApp = Class.extend({

        init: function () {

        },

        version: "0.2.0",

        services: {},

        parseServices: function (services) {

            for (var service in services) {

                if (typeof services[service] === "function") {
                    this.services[service] = new services[service]();
                } else {
                    this.services[service] = services[service];
                }

            }

        },

        fn : this.prototype


    });

    return (window.testApp = testApp);

})();