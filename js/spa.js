;


(function(window, $, undefined) {

    // Define a local copy of deferred
    var spa = function(customSettings) {

        return new spa.fn.init(customSettings);
    };

    spa.fn = spa.prototype = {

        constructor: spa,

        init: function(customSettings) {

            this.settings = $.extend({}, this.settings, customSettings);

            return this;
        },

        version: "0.0.1",

        initState: function(){
            
            this.pushState({ "target": this.settings.defaultPage });

            return this;

        },

        swapView: function(viewId, viewTitle) {

            var dfd = $.Deferred();

            if(!viewId){
                return dfd.reject(this.errorMessages[2]);
            }

            viewId = viewId.replace("#", "");

            if(viewId != this.getState(this.settings.viewState)) {

                this.pushState({ "target": viewId });

                var $current = $(this.settings.currentViewSelector);

                if($current.length > 0) {

                    var that = this;

                    if($current[0].id === viewId) {

                        that.loadNewView(viewId, viewTitle)
                                .done(function(){

                                    that.closeOldView($current)
                                            .done(function(){
                                                dfd.resolve();
                                            })
                                            .fail(function(ret) {
                                                dfd.reject(ret);
                                            });

                                })
                                .fail(function(ret) {
                                    dfd.reject(ret);
                                });
                        
                    }

                } else {

                    this.loadNewView(viewId, viewTitle)
                                .done(function(){

                                    that.closeOldView($current)
                                            .done(function(){
                                                dfd.resolve();
                                            })
                                            .fail(function(ret) {
                                                dfd.reject(ret);
                                            });

                                })
                                .fail(function(ret) {
                                    dfd.reject(ret);
                                });

                    $(this.settings.viewSelector + ":hidden").remove();

                }
            }

            return dfd.promise();

        },

        loadNewView: function(viewId , viewTitle) {

            var dfd = $.Deferred();

            if(!viewId){
                return dfd.reject(this.errorMessages[0]);
            }

            viewId = viewId.replace("#", "");

            var viewData = window.localStorage[viewId];

            if(!viewData) {

                if($("#" + viewId).length > 0) {

                    this.saveContentToStorage($("#" + viewId), $("body"));
                    viewData = window.localStorage[viewId];

                    if(!viewData) {
                        return dfd.reject(this.errorMessages[0]);
                    }

                } else {
                    return dfd.reject(this.errorMessages[0]);
                }
            }

            var viewSelector = "#" + viewId,
                viewInfo = $.parseJSON(viewData),
                $wrapper = $(this.settings.viewWrapper);

            if(viewInfo) {

                if($(viewSelector).length === 0) {
                    $wrapper.append(unescape(viewInfo.content));
                }

                viewInfo.viewTitle = viewTitle || viewInfo.viewTitle;

                if(viewInfo.viewTitle) {
                    this.setViewTitle(viewInfo.viewTitle);
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
                return dfd.reject(this.errorMessages[1]);
            }

            return dfd.promise();

        },

        closeOldView: function($current){

            var dfd = $.Deferred();

            if(!$current){
                return dfd.reject(this.errorMessages[3]);
            }

            $current.fadeOut(function(e) {

                var $that = $(this),

                vId = $that.attr("id");

                that.unLoadExistingView(vId);

                that.loadNewView(viewId, viewTitle)
                        .done(function(){

                            that.closeOldView($current)
                                    .done(function(){
                                        dfd.resolve();
                                    })
                                    .fail(function(ret) {
                                        dfd.reject(ret);
                                    });

                        })
                        .fail(function(ret) {
                            dfd.reject(ret);
                        });

            });

            return dfd.promise();

        },

        setViewTitle: function(title) {

            if(title) {
                $(this.settings.viewTitle).text(title);
            }

        },

        unLoadExistingView: function(viewId) {

            viewId = viewId.replace("#", "");

            var viewData = window.localStorage[viewId];

            if(!viewData) {

                this.saveContentToStorage($("#" + viewId), $("body"));

            }

            var viewInfo = $.parseJSON(viewData),
                that = this;

            if(viewInfo) {

                var pageSelector = "#" + viewInfo.pageId,
                        $js = $(pageSelector + "-js"),
                        $css = $(pageSelector + "-css"),
                        $templates = $(pageSelector + "-templates"); //check to see if we can do this in memory

                //clean up our mess now that we are done.
                if($js.length > 0 && (!$js.attr("src") || $js.attr("src") === "")) {
                    $js.remove();
                }

                //may change this or make this an option
                //trying to decide if the css should be removed or just added and kept after the fact.
                //worried later styles might step on each other and I think it might be better
                //guidance to make this just for view/module specific styles only
                if($css.length > 0 && (!$css.attr("href") || $css.attr("href") != "")) {
                    $css.remove();
                }

                $(pageSelector).remove();

            }

        },


/*********/
        checkLastDeferredRequest: function(key) {

            return localStorage.getItem(key);

        },

        getDeferredContent: function(url) {

            if(url && url != "") { //no need to do anything if there is no page

                if(!this.checkLastDeferredRequest(url)) {

                    var that = this;

                    $.get(url).then(function(data) {

                        var $content = $(data),
                            $contents = $content.children(that.settings.viewSelector);

                        if($contents.length === 0) {
                            $contents = $content;
                        }

                        $.each($contents, function(j, w) {

                            that.saveContentToStorage($(w), $content);

                        });

                        localStorage.setItem(url, true);

                    }, function(e) {
                        console.log("Deferred content " + url + " failed to load. " + JSON.stringify(e));
                    });


                }

            }

        },

        saveContentToStorage: function($target, $content) {

            var id = $target.attr("id"),
                pageInfo =
                    {
                        pageId: id,
                        load: $target.data("load"),
                        unload: $target.data("unload"),
                        viewTitle: $target.data("viewtitle"),
                        content: $target[0].outerHTML
                    };

            this.storeViewInfo(pageInfo);

            localStorage.setItem(id + "-js", $content.children("#" + id + "-js").html());
            localStorage.setItem(id + "-css", $content.children("#" + id + "-css").html());

        },

        storeViewInfo: function(viewInfo) {

            viewInfo = $.extend({}, this.pageSettings, viewInfo);

            localStorage.setItem(viewInfo.pageId,
                            JSON.stringify(viewInfo));
        },

/*********/

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
            viewTitle: ".view-title",
            viewSelector: ".content-pane",
            deferredURL: window.location.protocol + "//" + window.location.host + "/" + "deferred"
        },

        pageSettings: {
            pageId: "",
            preload: $.noop,
            load: $.noop,
            postload: $.noop,
            preunload: $.noop,
            unload: $.noop,
            postunload: $.noop,
            url: "",
            css: undefined,
            js: undefined,
            templates: "",
            content: "",
            defaultTemplate: "#DefaultViewTemplate"

        },

        errorMessages: ["no view data",
                        "The requested Page Does Not Exist...show 404???",
                        "new viewId",
                        "missing element"]

    };

    // Give the init function the spa prototype for later instantiation
    spa.fn.init.prototype = spa.fn;

    return (window.spa = spa);

})(window, jQuery);
