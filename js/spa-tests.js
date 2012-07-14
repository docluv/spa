
module("SPA Tests",{
    setup: function(){

        $.mockjaxSettings = {
          status:        200,
          statusText:     'OK',
          responseTime:  0,
          isTimeout:     false,
          contentType:   'text/plain',
          response:      '',
          responseText:  '',
          responseXML:   '',
          proxy:         '',
          lastModified:  null,
          etag:          ''
        };
        
        $.mockjaxClear();                               //clear mockjax
        
    },
    teardown: function(){

    }
});

test("SPA should create a new object when called", function(){

     var obj = spa();

     ok(obj === Object(obj), "should be an object");

     //basic sainty assertions to know members are present
     ok(obj.version, " should be present");
     ok(obj.swapView, " should be present");
     ok(obj.loadNewView, "rootUrl should be present");
     ok(obj.setViewTitle, "rootUrl should be present");
     ok(obj.unLoadExistingView, "rootUrl should be present");
     ok(obj.getState, "rootUrl should be present");
     ok(obj.pushState, "rootUrl should be present");
     ok(obj.setHash, "rootUrl should be present");
     ok(obj.settings, "rootUrl should be present");
     ok(obj.pageSettings, "rootUrl should be present");

});


test("check version #", function() {

    equal(spa().version, "0.0.1");

});

test("Create a new instance of spa, settings should be default", function() {

    var newDefaultPage = "home",
        obj = spa({defaultPage: newDefaultPage});

    equal(obj.settings.defaultPage, newDefaultPage, "should be home");

});

test("Call setViewTitle - should change settings.viewTitle to desired value", function() {

    var newTitle = "test title",
        obj = spa();

    $("<h1 class='view-title'>old title</h1>").appendTo("body");

    obj.setViewTitle(newTitle);

    equal($(".view-title").text(), newTitle, "should be " + newTitle);

    $(".view-title").remove();

});

test("setHash should place known value after #!", function() {

    var hashValue = "newHash",
        obj = spa();

    obj.setHash(hashValue);

    equal(window.location.hash, "#!" + hashValue, "new url hash value should be !" + hashValue);

});

test("pass a JSON object to pushState, should place query string after #!", function() {

    var newObject = {
                        "foo": "bar",
                        "param": "value"
                    },
        obj = spa();

    obj.pushState(newObject);

    equal(window.location.hash, "#!foo=bar&param=value", "new url hash should be known");

});

test("call pushState passing a new Title, should change the document title to match", function() {

    var newTitle = "test title",
        obj = spa();

    obj.pushState({}, newTitle);

    equal(document.title, newTitle, newTitle);

});

test("call pushState passing JSON object and a new Title, should change the document title and set #! values", function() {

    var newTitle = "test title",
        obj = spa();

    obj.pushState({
                        "foo": "bar",
                        "param": "value"
                    }, newTitle);

    equal(document.title, newTitle, newTitle);
    equal(window.location.hash, "#!foo=bar&param=value", "new url hash should be known");

});

test("call initState should set the hash to taget of defaultPage", function() {

    var obj = spa();

    obj.initState();

    equal(window.location.hash, "#!target=" + obj.settings.defaultPage, "should be target=" + obj.settings.defaultPage);

});

test("loadNewView without viewId should simply return; should throw an error if goes past the viewId check", function() {

    var obj = spa();

    obj.loadNewView();


});

test("loadNewView with viewId and no viewData in localStorage or existing DOM element should just return", function() {

    var obj = spa();

    obj.loadNewView("noViewData");


});

test("loadNewView with viewId, no viewData in localStorage with existing DOM element should just return", function() {

    var obj = spa(),
        viewId = "newViewData",
        newTitle = "new title",
        viewInfo = {
            pageId: viewId,
            load: "loadfunc",
            unload: "",
            viewTitle: "viewtitle",
            content: "<div id='" + viewId + "'>some markup goes here</div>"
        };

    spa.saveContentToStorage = function(val1, val2){
        
        localStorage.setItem(viewId, JSON.stringify(viewInfo));

    };

    obj.loadNewView("newViewData", newTitle);



});




