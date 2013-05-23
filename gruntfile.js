/*global module */
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
        options: {
          // define a string to put between each file in the concatenated output
          separator: '\n\n',
          stripBanners: true,
          banner: '/*!\n'+
            ' * <%= pkg.name %> v<%= pkg.version %>\n'+
            ' * https://github.com/Xiphe/init.js\n'+
            ' *\n'+
            ' * Basic js functions for namespacing, loose / asynchronous dependencies, and jQuery plugins.\n'+
            ' *\n'+
            ' * Copyright 2013, Hannes Diercks <info@xiphe.net>\n'+
            ' * Released under the MIT license\n'+
            ' * https://github.com/Xiphe/init.js/blob/master/MIT-LICENSE.txt\n'+
            ' */\n'+
            '(function(){\n',
          footer: '\n}).call(this);'
        },
        all: {
          dest: 'build/<%= pkg.slug %>.js',
          src: [
            'src/namespace.js',
            'src/waituntil.js',
            'src/loaded.js',
            'src/ready.js',
            'src/bridge.js'
          ]
        },
        nojquery: {
          options: {
            banner: '/*!\n'+
              ' * <%= pkg.name %> v<%= pkg.version %> without jQuery\n'+
              ' * https://github.com/Xiphe/init.js\n'+
              ' *\n'+
              ' * Basic js functions for namespacing and loose / asynchronous dependencies.\n'+
              ' *\n'+
              ' * Copyright 2013, Hannes Diercks <info@xiphe.net>\n'+
              ' * Released under the MIT license\n'+
              ' * https://github.com/Xiphe/init.js/blob/master/MIT-LICENSE.txt\n'+
              ' */\n'+
              '(function(){\n'
          },
          dest: 'build/<%= pkg.slug %>-nojq.js',
          src: [
            'src/namespace.js',
            'src/waituntil.js'
          ]
        }
    },

    uglify: {
        options: {
          banner: '/*! <%= pkg.name %> v<%= pkg.version %> | MIT license | made with <3 by Hannes Diercks <info@xiphe.net> */\n'
        },
        all: {
          files: {
            'build/<%= pkg.slug %>.min.js': ['<%= concat.all.dest %>']
          }
        },
        nojquery: {
          options: {
            banner: '/*! <%= pkg.name %> v<%= pkg.version %> without jQuery | MIT license | made with <3 by Hannes Diercks <info@xiphe.net> */\n'
          },
          files: {
            'build/<%= pkg.slug %>-nojq.min.js': ['<%= concat.nojquery.dest %>']
          }
        }
    },

    qunit: {
      files: ['test/**/*.html']
    },

    jshint: {
      files: ['gruntfile.js', 'src/**/*.js', 'test/tests.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

  grunt.registerTask('build', ['concat', 'uglify']);

};