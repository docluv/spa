module.exports = function(grunt) {
    // Force use of Unix newlines
    grunt.util.linefeed = '\n';

    RegExp.quote = function(string) {
        return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    var fs = require('fs');
    var path = require('path');

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2013-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
            ' */\n',
        qunit: {
            all: ['js/specs/**/*.html']
        },
        jshint: {
            options: {
                browser: true
            },
            files: ['Gruntfile.js', 'js/dev/*.js']
        },
        watch: {
            scripts: {
                files: ['**/js/dev/*.js'],
                tasks: ['uglify'],
                options: {
                    spawn: false,
                }
            }
        },
        uglify: {
            options: {
                compress: true,
                banner: '<%= banner %>'
            },
            spa: {
                src: [
                    'js/dev/controllers/class.js',
                    'js/dev/controllers/controller.js',
                    //                  'js/dev/views/formView.js',
                    //                'js/dev/views/listView.js',
                    //         'js/dev/app/spaApp.js',
                    'js/dev/spa.js'
                ],
                dest: 'js/spa.min.js'
            },
            backpack: {
                src: [
                    'js/libs/backpack.js'
                ],
                dest: 'js/backpack.min.js'
            },
            googleAnalytics: {
                src: [
                    'js/libs/google-analytics.js'
                ],
                dest: 'js/google-analytics.min.js'
            }

        }
    });

    // Default task.
    grunt.registerTask('default', [ /*'jshint', 'qunit', */ 'uglify']);

};