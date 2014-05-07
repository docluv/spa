
;

//sauna is TBD
(function(window, $, undefined) {

    var sauna = function(customSettings) {

        return new sauna.fn.init(customSettings);
    };

    sauna.fn = sauna.prototype = {
        
        constructor: sauna,

        init: function(customSettings) {

            this.settings = $.extend({}, this.settings, customSettings);

            return this;
        },

        version: "0.0.1",


        hasLocalStorage: window.localStorage ? true : false,

        /**
        * Return the data from the cache or execute the create callback and store it in the cache.
        * @param {key} the cache key 
        * @param {lifetime} the lifetime that will be used when creating a new entry in the cache.
        * @param {create} the factory for the cache item. The create function should return a deferred.
        *
        */
        tryGet: function(key, lifetime, create) {

            var dfd = $.Deferred(),
                valueFromCache = this.get(key);

            if(valueFromCache) {

                dfd.resolve(valueFromCache);

            } else {

                create().done(function(data) {

                    this.set(key, data, lifetime);
                    dfd.resolve(data);

                }).fail(dfd.reject);

            }

            return dfd.promise();

        },

        get: function(key) {

            if(this.hasLocalStorage) {

                var ls = window.localStorage,
                    time = new Date(),
                    ct = ls.getItem('meta_ct_' + key),
                    lt = ls.getItem('meta_lt_' + key);

                if(ct !== undefined && lt !== undefined && time.getTime() - ct > lt) {
                    //The data has expired, so flush it and return false.
                    this.del(key);
                    return false;
                }

                try {
                    return $.parseJSON(ls.getItem(key));
                }
                catch(err) {
                    return ls.getItem(key);
                }

            }
            else {
                return null;
            }
        },
         
        set: function(key, value, lifetime) {

            if(this.hasLocalStorage) {

                if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
                    this.del(key);
                }

                if(typeof lifetime === 'undefined') {
                    lifetime = this.defaultLifetime; //TODO replace with a setting value here
                    //one hour
                }

                var time = new Date();

                this.trySetItem(key, JSON.stringify(value));

                if(lifetime > 0) {

                    this.trySetItem('meta_ct_' + key, time.getTime());
                    this.trySetItem('meta_lt_' + key, lifetime);

                }

            }

            return;
        },

        //fix for bug is some versions of Safari and older browsers
        trySetItem: function(key, value) {

            var ls = window.localStorage

            try {
                ls.setItem(key, value);
            } catch(err) {
                if((err.name).toUpperCase() == 'QUOTA_EXCEEDED_ERR') {
                    ls.removeItem(key);
                    ls.setItem(key, value);
                }
            }

        },

        del: function(key) {
            if(this.hasLocalStorage) {
                window.localStorage.removeItem('meta_ct_' + key);
                window.localStorage.removeItem('meta_lt_' + key);
                window.localStorage.removeItem(key);
            }

            return;
        },

        flush: function() {
            if(this.hasLocalStorage) {
                window.localStorage.clear();
            }

            return;
        },

        defaultLifetime: 3600000

    };

    // Give the init function the sauna prototype for later instantiation
    sauna.fn.init.prototype = sauna.fn;

    return (window.sauna = sauna);

})(window, jQuery);


