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
            files: ['Gruntfile.js', 'js/spa.js']
        },
        watch: {
          scripts: {
            files: ['js/spa.js'],
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
                src: ['js/spa.js'],
                dest: 'js/spa.min.js'
            }
        }
    });

    // Default task.
    grunt.registerTask('default', [/*'jshint', 'qunit', */'uglify' /*, 'cssmin'*/]);

};