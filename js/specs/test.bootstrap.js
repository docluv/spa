var rivetsVE = RivetsViewEngine({ "appName": "spa-test" }),
        _spa,
        testApp = new function () { };

testApp.childView1 = Controller.extend({

    init: function (rootScope) {

        this._super(rootScope);

    },

    onload: function (params) {

    }


});

testApp.childView2 = Controller.extend({

    init: function (rootScope) {

        this._super(rootScope);

    },

    onload: function (params) {

    }


});

testApp.childView3 = Controller.extend({

    init: function (rootScope) {

        this._super(rootScope);

    },

    onload: function (params) {

    }


});

testApp.childView4 = Controller.extend({

    init: function (rootScope) {

        this._super(rootScope);

    },

    onload: function (params) {

    }


});

testApp.simpleview1 = Controller.extend({

    init: function (rootScope) {

        this._super(rootScope);

    },

    onload: function (params) {

    }


});


testApp.simpleview2 = Controller.extend({

    init: function (rootScope) {

        this._super(rootScope);

    },

    onload: function (params) {

    }


});




_spa = SPA({
        "AppContext": testApp,
        "viewEngine": rivetsVE,
        "defaultPage": "simpleView1",
        "viewWrapper": "#main",
        "analytics": undefined,
        "viewTransition": "slide",
        "defaultTitle": "SPA Test"
    });

