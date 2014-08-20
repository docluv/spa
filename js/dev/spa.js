/// <reference path="backack.js" />
/// <reference path="helper.extensions.js" />
;

(function (window, undefined) {

    "use strict";

    //    var _gaq = _gaq || undefined;

    // Define a local copy of deferred
    var SPA = function (customSettings) {

        var spa = new SPA.fn.init(),
            appName = "";

        spa.settings = $.extend({}, spa.settings, customSettings);

        if (spa.settings.AppContext) {
            spa.$context = spa.settings.AppContext;
        } else {

            var spaApp = document.querySelector("[spa-app]");

            if (spaApp) {

                appName = window[spaApp.getAttribute("spa-app")];

                if (typeof appName === "function") {
                    appName = appName();
                }

                spa.$context = appName;

            } else {
                console.error("Must have an application context defined");

                throw {
                    name: "SPA Error",
                    message: "Must have an application context defined"
                };
            }

        }

        spa.viewCache = spa.settings.viewCache || Backpack();

        spa.analytics = spa.settings.analytics;

        spa.titleElement = document.querySelector(spa.settings.titleSelector);

        if (spa.settings.parseDOM) {

            spa.setupRoutes(spa.settings.viewSelector);

        }

        window.addEventListener("hashchange", function () {

            spa.swapView();

        });

        if (spa.getParameterByName(spa.settings.forceReload)) {

            window.location.replace(window.location.href.split("?")[0] + "#!" +
                spa.getParameterByName(spa.settings.forceReload));
            return spa;

        } else if (spa.settings.initView) {
            spa.swapView();
        }

        /*

        //decided to shelve this for the time being. Will complete this functionality
        //after the book is published

        if (spa.settings.asyncUrl && typeof spa.settings.asyncUrl === "string") {

            document.addEventListener("DOMContentLoaded", function () {

                e.target.removeEventListener(e.type, arguments.callee);

                spa.loadAsyncContent.call(spa, spa.settings.asyncUrl);
            });
        }

        */

        return spa;

    };

    SPA.fn = SPA.prototype = {

        constructor: SPA,

        init: function () {
            return this;
        },

        version: "0.0.6",

        viewCache: undefined,


        //barrowing naming conventions from Angular
        //This is like renaming a brand with a bad reputation,
        //maintaining and using the context (this) properly
        //is confusing for many developers new to JavaScript.
        //Changing the name abstracts the mind from associating
        //the name to something they perceive as annoying.
        $context: undefined,
        $controller: undefined,
        $oldController: undefined,

        setupRoutes: function () {

            var spa = this,
                settings = spa.settings,
                routes = $.extend($.parseLocalStorage("routes") || {}, settings.routes),
                i = 0,
                rawPath, view, route, viewId,
                Views = document.querySelectorAll(settings.viewSelector);

            for (; i < Views.length; i++) {

                view = Views[i];

                if (view.hasAttributes() && view.hasAttribute("id")) {

                    viewId = view.getAttribute("id");
                    rawPath = (view.hasAttribute("spa-route") ? view.getAttribute("spa-route") : "");

                    route = spa.createRoute(viewId, rawPath, view);
                    routes[route.path] = route;

                }

            }

            spa.settings.routes = routes;

            localStorage.setItem("routes", JSON.stringify(routes));

            if (spa.viewCache && (spa.getParameterByName("_escaped_fragment_") === "")) {
                spa.viewCache.parseViews(settings.viewSelector);
            }

        },

        createRoute: function (viewId, rawPath, view) {

            //need to check for duplicate path
            return {
                viewId: viewId,
                viewModule: (view.hasAttribute("spa-module") ? view.getAttribute("spa-viewId") :
                    viewId),
                path: rawPath.split("\\:")[0],
                params: rawPath.split("\\:").slice(1),
                title: (view.hasAttribute("spa-title") ? view.getAttribute("spa-title") :
                    this.settings.defaultTitle),
                transition: (view.hasAttribute("spa-transition") ?
                    view.getAttribute("spa-transition") :
                    ""),
                paramValues: {},
                beforeonload: (view.hasAttribute("spa-beforeonload") ? view.getAttribute("spa-beforeonload") : undefined),
                onload: (view.hasAttribute("spa-onload") ? view.getAttribute("spa-onload") : undefined),
                afteronload: (view.hasAttribute("spa-afteronload") ? view.getAttribute("spa-afteronload") : undefined),
                beforeunload: (view.hasAttribute("spa-beforeunload") ? view.getAttribute("spa-beforeunload") : undefined),
                unload: (view.hasAttribute("spa-unload") ? view.getAttribute("spa-unload") : undefined),
                afterunload: (view.hasAttribute("spa-afterunload") ? view.getAttribute("spa-afterunload") : undefined)
            };

        },

        matchRouteByPath: function (path, routes) {

            if (!routes) {
                routes = this.settings.routes;
            }

            var key, route, params, i,
                paramValues = {},
                search;

            //routes is an object so we can match the path to the route as it will be a property name.
            if (routes.hasOwnProperty(path)) {
                return routes[path];
            }

            for (key in routes) {

                if (routes.hasOwnProperty(key)) {

                    route = routes[key];

                    search = new RegExp('\\b' + route.path + '\\b', 'gi');

                    if (route.path !== "" &&
                        path.search(search) === 0) {

                        params = path.replace(route.path, "")
                            .split("/")
                            .slice(1); //the first item will be empty

                        for (i = 0; i < params.length; i++) {
                            paramValues[route.params[i]] = params[i];
                        }

                        route.paramValues = paramValues;

                        break;
                    } else {
                        route = undefined;
                    }

                }

            }

            return route;
        },

        matchRouteById: function (id, routes) {

            if (!routes) {
                routes = this.settings.routes;
            }

            var route;

            for (route in routes) {
                if (routes[route].viewId === id) {
                    return routes[route];
                }
            }

        },

        //  newView: undefined, //placeholder for new view
        //  currentView: undefined, //placeholder for current view before a swap
        animation: undefined,

        getParameterByName: function (name) {

            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);

            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        },

        getVendorPropertyName: function (prop) {

            var prefixes = ['Moz', 'Webkit', 'O', 'ms'],
                vendorProp, i,
                prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

            if (prop in this.div.style) {
                return prop;
            }

            for (i = 0; i < prefixes.length; ++i) {

                vendorProp = prefixes[i] + prop_;

                if (vendorProp in this.div.style) {
                    return vendorProp;
                }

            }
        },

        transitionend: {
            'animation': 'animationend',
            'webkitAnimation': 'webkitAnimationEnd',
            'MozAnimation': 'animationend',
            'OAnimation': 'oAnimationEnd'
        },

        // repurposed helper
        cssPrefix: function (suffix) {

            if (!suffix) {
                return '';
            }

            var i, len, parts, prefixes,
                bodyStyle = document.body.style;

            if (suffix.indexOf('-') >= 0) {

                parts = ('' + suffix).split('-');

                for (i = 1, len = parts.length; i < len; i++) {
                    parts[i] = parts[i].substr(0, 1).toUpperCase() + parts[i].substr(1);
                }
                suffix = parts.join('');
            }

            if (suffix in bodyStyle) {
                return suffix;
            }

            suffix = suffix.substr(0, 1).toUpperCase() + suffix.substr(1);

            prefixes = ['webkit', 'Moz', 'ms', 'O'];

            for (i = 0, len = prefixes.length; i < len; i++) {
                if (prefixes[i] + suffix in bodyStyle) {
                    return prefixes[i] + suffix;
                }
            }

            return "";
        },

        removeExtraViews: function (currentView) {

            var length = currentView.length;

            while (length > 1) {

                length--;
                currentView[length]
                    .parentNode.removeChild(currentView[length]);
            }
        },

        pushView: function (path) {

            var spa = this;

            if (spa.analytics) {
                spa.analytics.pushView(['_trackPageview', path]);
            }

        },

        swapView: function () {

            var spa = this,
                settings = spa.settings,
                route, oldRoute, anim,
                hash = window.location.hash,
                newView,
                hasEscapeFragment = spa.getParameterByName("_escaped_fragment_"),
                hashFragment = (hash !== "#") ? hash.replace("#!", "") : "",
                path = hashFragment.split(":")[0],
                currentView = document.querySelectorAll("." + settings.currentClass);

            spa.$oldController = spa.$controller;

            if (currentView.length && currentView.length > 1) {
                //adding this because I found myself sometimes tapping items to launch a new view before the animation was complete.
                spa.removeExtraViews(currentView);
            }

            //convert nodelist to a single node
            currentView = currentView[0];

            if (currentView && currentView.id) {
                oldRoute = spa.matchRouteById(currentView.id);
            }

            route = spa.matchRouteByPath(path);

            if (route !== undefined) {

                if (spa.$context[route.viewId] &&
                    typeof spa.$context[route.viewId] === "function") {

                    spa.$controller = new spa.$context[route.viewId](spa.$context);

                } else if (spa.$context[route.viewId] &&
                    typeof spa.$context[route.viewId] === "object") {

                    spa.$controller = new spa.$context[route.viewId];

                } else {
                    return;
                }

                spa.pushView(path);

                spa.ensureViewAvailable(currentView, route.viewId);

                newView = document.getElementById(route.viewId);

                if (newView) {

                    if (currentView) {

                        //spa.makeViewCallback(oldRoute, "beforeunload");

                        spa.makeViewCallback1(spa.$oldController, "beforeunload");

                        if (spa.hasAnimations()) {

                            anim = spa.getAnimation(route);
                            spa.animation = anim;

                            if (anim) {

                                currentView.addEventListener(
                                    spa.transitionend[spa.cssPrefix("animation")], function (e) {
                                        spa.endSwapAnimation.call(spa, oldRoute, route);
                                        currentView = undefined;
                                    });

                                //modify once addClass supports array of classes
                                $(currentView).addClass("animated out " + anim)
                                    .removeClass("in");

                                $(newView).addClass(settings.currentClass +
                                    " animated " + anim + " in");

                            } else {

                                $(newView).addClass(settings.currentClass);
                                spa.endSwapAnimation.call(spa, oldRoute, route);
                            }

                        }

                    } else {

                        if (settings.intoAnimation) {

                            newView.addEventListener(
                                spa.transitionend[spa.cssPrefix("animation")], function (e) {
                                    spa.endSwapAnimation.call(spa, oldRoute, route);
                                    currentView = undefined;
                                });

                            $(newView).addClass(settings.currentClass +
                                " animated " + anim + " in");

                        } else {

                            $(newView).addClass(settings.currentClass);
                            spa.endSwapAnimation.call(spa, oldRoute, route);
                        }

                    }

                    spa.setDocumentTitle(route);

                    if (route) {

                        //spa.makeViewCallback(route, "beforeonload");
                        //spa.makeViewCallback(route, "onload");
                        //spa.makeViewCallback(route, "afteronload");

                        spa.makeViewCallback1(spa.$controller, "beforeonload", route.paramValues);
                        spa.makeViewCallback1(spa.$controller, "onload", route.paramValues);
                        spa.makeViewCallback1(spa.$controller, "afteronload", route.paramValues);
                    }

                }

            } else if (hasEscapeFragment === "") { //Goto 404 handler

                window.location.hash = "#!" + settings.NotFoundRoute;

            } else { //should only get here is this is an escapefragemented url for the spiders
                newView = $(settings.viewSelector).addClass(settings.currentClass);
            }

        },

        getAnimation: function (route) {

            if (!route) {
                return this.settings.viewTransition;
            }

            return this.animations[route.transition] || this.settings.viewTransition;

        },

        endSwapAnimation: function (route, newRoute) {
            //currentView, newView, 
            var spa = this,
                currentView = document.querySelector(".current.out"),
                newView = document.getElementById(newRoute.viewId),
                parent,
                anim = spa.animation;

            if (route) {
                spa.makeViewCallback1(spa.$oldController, "unload");
                spa.makeViewCallback1(spa.$oldController, "afterunload");
            }

            if (newView.classList.contains("in")) {
                newView.classList.remove("in");
                newView.classList.remove(anim);
            }

            if (currentView && spa.viewCache && currentView.parentNode) {

                parent = currentView.parentNode
                parent.removeChild(currentView);

            }

        },

        //make sure the view is actually available, this relies on backpack to supply the markup and inject it into the DOM
        ensureViewAvailable: function (currentView, newViewId) {
            //must have backpack or something similar spa implements its interface

            var spa = this,
                view,
                newView, loc;

            if (spa.viewCache) {

                view = spa.viewCache.getView(newViewId);

                if (view) {
                    newView = spa.createFragment(view);
                } else {
                    loc = window.location.href.split("#!");
                    window.location.replace(loc[0] + "?" +
                        spa.settings.forceReload + "=" + loc[1]);
                }

                if (currentView) {
                    currentView.parentNode
                        .insertBefore(newView, currentView);
                } else {
                    document.querySelector(spa.settings.mainWrappperSelector)
                        .appendChild(newView);
                }

            }
            //else assume the view is already in the markup

        },

        makeViewCallback1: function (controller, action, params) {

            if (controller && controller[action]) {
                controller[action].call(controller, params || {});
            }

        },

        makeViewCallback: function (route, action) {

            var spa = this,
                $context = spa.$context,
                settings = spa.settings,
                a, cbPaths, callback;

            if (action && !route[action]) {

                if ($context) {

                    if ($context[route.viewModule] && $context[route.viewModule][action]) {
                        $context[route.viewModule][action].call($context, route.paramValues || {});
                    }

                }

                return;
            }

            cbPaths = route[action].split(".");

            callback = window[cbPaths[0]];

            for (a = 1; a < cbPaths.length; a++) {

                if (a === 1) {
                    spa = callback;
                }

                callback = callback[cbPaths[a]];
            }

            if (callback) {
                callback.call(spa, route.paramValues || {});
            }

        },

        setDocumentTitle: function (route) {

            var title = route.title,
                i;

            if (title === "") {
                return;
            }

            for (i = 0; i < route.params.length; i++) {
                title = title.replace(":" +
                    route.params[i],
                    route.paramValues[route.params[i]]);
            }

            document.title = title;

        },

        createFragment: function (htmlStr) {

            var frag = document.createDocumentFragment(),
                temp = document.createElement("div");

            temp.innerHTML = htmlStr;

            while (temp.firstChild) {
                frag.appendChild(temp.firstChild);
            }

            return frag;
        },

        hasAnimations: function () {

            var animation = false,
                elm = document.createElement("div"),
                animationstring = 'animation',
                keyframeprefix = '',
                domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
                pfx = '',
                i = 0;

            if (elm.style.animationName) {
                animation = true;
            }

            if (animation === false) {
                for (i = 0; i < domPrefixes.length; i++) {
                    if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
                        pfx = domPrefixes[i];
                        animationstring = pfx + 'Animation';
                        keyframeprefix = '-' + pfx.toLowerCase() + '-';
                        animation = true;
                        break;
                    }
                }
            }

            return animation;

        },

        /*
        storeAsyncContent: function (content) {

            this.viewCache.updateViewsFromFragment(this.settings.viewSelector, content);
        },

        loadAsyncContent: function (url, callback) {

            callback = callback || this.storeAsyncContent;

            var oReq = new XMLHttpRequest();

            oReq.onload = callback;
            oReq.open("get", url, true);
            oReq.send();
        },
        */

        //array of animations. The names match the CSS class so make sure you have the CSS for this animation or you will be dissapointed.
        animations: {
            "slide": "slide",
            "fade": "fade",
            "flip": "flip"
        },

        settings: {
            routes: [],
            viewSelector: "script[type='text/x-mustache-template']",
            currentClass: "current",
            mainWrappperSelector: "main",
            NotFoundView: "nofoundView",
            NotFoundRoute: "404",
            defaultTitle: "A Single Page Application with Routes",
            titleSelector: ".view-title",
            forceReload: "_force_reload_",
            autoSetTitle: true,
            parseDOM: true,
            initView: true,
            intoAnimation: true,
            viewTransition: "slide",
            asyncUrl: undefined
        }

    };

    // Give the init function the spa prototype for later instantiation
    SPA.fn.init.prototype = SPA.fn;

    return (window.SPA = SPA);

})(window);