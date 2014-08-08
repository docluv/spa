(function() {

    var formView = Controller.extend({

        init: function(rootScope) {
            this._super(rootScope);
        },


        loadModel: function(id) {

            console.log("loading model");

            return {};

        },

        saveModel: function(model) {

            console.log("saving model");

            return;

        }

    });


    return (window.formView = formView);

})();