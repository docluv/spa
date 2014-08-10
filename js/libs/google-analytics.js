;

(function (undefined) {

    "use strict";

    var GA = {

        pushView: function (path) {

            //if Google Analytics available, then push the path
            if (typeof _gaq !== undefined) {
                _gaq.push(['_trackPageview', path]);
            }

        }

    };

    return (window.GA = GA);

})();