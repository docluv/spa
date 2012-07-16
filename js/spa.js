;


(function(window, $, backpack, undefined) {

    // Define a local copy of deferred
    var spa = function(customSettings) {

        return new spa.fn.init(customSettings);
    };

    spa.fn = spa.prototype = {

        constructor: spa,

        init: function(customSettings) {

            this.settings = $.extend({}, this.settings, customSettings);

            errMsg.noViewData = "no view data";
            errMsg.noViewInfo = "no view Info";
            errMsg.viewDoesNotExist = "The requested View Does Not Exist";
            errMsg.noViewId = "new viewId";
            errMsg.missingElem = "missing element";

            this.bp = backpack();

            return this;
        },

        version: "0.0.1",

        bp: undefined,

        initState: function(){
            
            this.pushState({ "target": this.settings.defaultPage });

            return this;

        },

        swapView: function(viewId) {

            var that = this;

            return deferred(function(dfd){
                
                if(!viewId){
                    viewId = that.getState(that.settings.viewState);
                }

                viewId = viewId.replace("#", "");

                if(viewId === that.settings.currentViewState){
                    dfd.resolve();
                }

                var $oldView;
                
                if(that.settings.currentViewState != ""){
                    $oldView = $(that.settings.viewSelector).not(".permanent");
                }

                if($oldView){

                    that.closeOldView($oldView)
                        .done(function(){

                            that.loadNewView(viewId)
                                .done(function(){
                                    that.settings.currentViewState = viewId;
                                    dfd.resolve(viewId);
                                 });

                        })
                        .fail(function(ret) {
                            dfd.reject(ret);
                        });

                }else{

                    that.loadNewView(viewId)
                        .done(function(){
                            that.settings.currentViewState = viewId;
                            dfd.resolve(viewId);
                        });
                    
                }

            }).promise();
                
        },

        loadNewView: function(viewId) {

            var that = this;

            return deferred(function(dfd){

                if(!viewId){
                    return dfd.reject(errMsg.noViewId);
                }

                viewId = viewId.replace("#", "");

                var viewData = that.bp.getViewData(viewId);

                if(!viewData) {
                    return dfd.reject(errMsg.noViewData);
                }

                var viewSelector = "#" + viewId,
                    viewInfo = $.parseJSON(viewData),
                    $wrapper = $(that.settings.viewWrapper);

                if(viewInfo) {

                    if($(viewSelector).length === 0) {
                        $wrapper.append(unescape(viewInfo.content));
                    }

                    var templates = window.localStorage[viewId + "-templates"],
                        js = window.localStorage[viewId + "-js"];

                    if(templates && templates != "") {
                        $(unescape(templates)).appendTo("html");
                    }

                    if($("#" + viewId + "-js").length === 0) {

                        if($(viewSelector + "-js").length === 0 && (js && js != "")) {
                            //need to account for both content and url reference
                            //need a helper method, isURL to determine if js is a url or is the actual script
                            $("<script type='text/javascript' id='" + viewId + "-js'>" + js + "</script>").appendTo("body");
                            //or
                            //$('<script id="' + viewId + '-js" src="' + viewInfo.js + '" type="text/javascript"></script>').appendTo("body");

                        }

                    }

                    if($("#" + viewId + "-css").length === 0) {

                        if($(viewSelector + "-css").length === 0 && (viewInfo.css && viewInfo.css != "")) {

                            //need to account for both content and url reference
                            //need a helper method, isURL to determine if css is a url or is the actual script
                            $('<link href="' + viewInfo.css + '" rel="stylesheet" type="text/css" id="' + viewId + '-css" />').appendTo("head");
                        }

                    }

                    //need to change this to a generic transition method
                    $(viewSelector).fadeIn(500, function(e) {
                        $(this).addClass("current");
                        dfd.resolve();
                    });

                } else {
                    return dfd.reject(errMsg.noViewInfo);
                }

            }).promise();

        },

        closeOldView: function($current){

            return deferred(function(dfd){

                if(!$current || $current.length === 0){
                    return dfd.resolve();
                }
                
                $current.fadeOut(function(e) {
                    $(this).remove();
                    dfd.resolve();
                });

            }).promise();

        },

        //may remove this from the library
        setViewTitle: function(title) {

            if(title) {
                $(this.settings.viewTitle).text(title);
            }

        },

        getState: function(key, _default) {

            if(!_default) {
                _default = "";
            }

            var vals = {},
                n = window.location.hash.replace("#!", "").split("&");

            for(j = 0; j < n.length; j++) {
                var pairs = n[j].split("=");

                vals[pairs[0]] = pairs[1];
            }

            return vals[key] || _default;
        }, //should be just state

        pushState: function(state, title) {

            if(typeof state != "object"){
                this.setHash(state);
                return;
            }

            document.title = title || this.settings.defaultTitle;

            var props = "";

            for(var prop in state) {

                if(props != "") {
                    props = props + "&" + prop + "=" + state[prop];
                } else {
                    props = props + prop + "=" + state[prop];
                }

            }

            this.setHash(props);
        },

        setHash: function(props) {
            window.location.hash = "!" + props; // + "&time=" + new Date().getTime();
        },

        settings: {
            defaultPage: "homepage",
            defaultTitle: "Default Title",
            activePageTransition: "swing",
            targetPageTransistion: "swing",
            viewWrapper: "#wrapper",
            currentViewSelector: ".current",
            viewState: "target",
            currentViewState: "",
            viewTitle: ".view-title",
            viewSelector: ".content-pane",
            deferredURL: window.location.protocol + "//" + window.location.host + "/" + "deferred"
        }

    };

    // Give the init function the spa prototype for later instantiation
    spa.fn.init.prototype = spa.fn;

    return (window.spa = spa);

})(window, jQuery, backpack);
