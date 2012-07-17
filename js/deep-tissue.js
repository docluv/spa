//touch/pointer library

;

//deep tissue is a multiplatform touch gesture library
(function(window, $, undefined) {

    var deetissue = function(customSettings) {

        return new deetissue.fn.init(customSettings);
    };

    deetissue.fn = deetissue.prototype = {
        
        constructor: deetissue,

        init: function(customSettings) {

            this.settings = $.extend({}, this.settings, customSettings);

            return this;
        },

        version: "0.0.1",


        //methods go here


        settings: {}

    };

    // Give the init function the deetissue prototype for later instantiation
    deetissue.fn.init.prototype = deetissue.fn;

    return (window.deetissue = deetissue);

})(window, jQuery);


