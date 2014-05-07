module.exports = function (grunt) {

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
            files: ['js/dev/*.js'],
            tasks: ['uglify'],
            options: {
              spawn: false,
            }
          }
        },
        uglify: {
            options: {
                compress: true
            },
            spa: {
                src: ['js/dev/spa.js'],
                dest: 'js/spa.min.js'
            }
        }
    });

    // Default task.
    grunt.registerTask('default', [/*'jshint', 'qunit', */'uglify' /*, 'cssmin'*/]);

};