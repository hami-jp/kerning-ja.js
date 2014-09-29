module.exports = (grunt)->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    banner: '/*! <%= pkg.name || pkg.title %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> Karappo Inc;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n'

    qunit:
      files: 'test/**/*.html'
    concat:
      options:
        banner: '<%= banner %>'
        stripBanners: true
      dist:
        src: 'src/kerning-ja.js'
        dest: 'dist/kerning-ja.js'
    uglify:
      options:
        banner: '<%= banner %>'
      dist:
        src: '<%= concat.dist.dest %>'
        dest: 'dist/kerning-ja.min.js'
    clean:
      files: 'dist'
    watch:
      files: ['**/*.js','**/*.html']
      tasks: ['clean','concat','uglify']
      options:
        livereload: true
    connect:
      site: {}
      # site:
      #   options:
      #     port: 3000
      #     keepalive: true
      #     hostname: 'localhost'

  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-qunit'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-connect'

  grunt.registerTask 'default', ['connect','watch']
  grunt.registerTask 'build', ['qunit','clean','concat','uglify']
  # grunt.registerTask 'default', ['jshint','clean','concat','uglify']