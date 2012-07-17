//IndexDB data persistance library


;

//mudbath is a library to abstract IndexDB as a data persistance layer
(function(window, $, undefined) {

    var mudbath = function(customSettings) {

        return new mudbath.fn.init(customSettings);
    };

    mudbath.fn = mudbath.prototype = {
        
        constructor: mudbath,

        init: function(customSettings) {

            this.settings = $.extend({}, this.settings, customSettings);

            return this;
        },

        version: "0.0.1",


        //methods go here


        settings: {}

    };

    // Give the init function the mudbath prototype for later instantiation
    mudbath.fn.init.prototype = mudbath.fn;

    return (window.mudbath = mudbath);

})(window, jQuery);


