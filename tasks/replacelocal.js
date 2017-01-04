/*
 * grunt-replace-pas
 * https://github.com/Laisly/grunt-replacelocal-pas
 *
 * Copyright (c) 2016 liuyongming
 * Licensed under the MIT license.
 */
/*jshint node:true*/
module.exports = function(grunt) {
  var _ = grunt.util._;

  // start build pattern --> <!-- ref:[target] output -->
  var htmlRegStrart = /<!--\s*localref:(\w+)\s*(.+)\s*-->/;

  // end build pattern -- <!-- endref -->
  var htmlRegEnd = /<!--\s*endlocalref\s*-->/;

  // <script> template
  var scriptTemplate = '<script type="text/javascript" <%= dest %>></script>';
  //完整替换
  var fullreplaceTemplate = '<%= dest %>';

  var seajsscriptTemplate = '<script type="text/javascript" <%= dest %>></script>';
  // stylesheet template
  var stylesheetTemplate = '<link rel="stylesheet" href="<%= dest %>">';

  // inlineCSS template
  var inlineCSSTemplate = '<style><%= dest %></style>';

  grunt.registerMultiTask('replace', 'replace all by template', function() {
    var options = this.options({
      pkg: {},
      includes: {}
    });


    //grunt.log.warn('this.options ' + JSON.stringify(this));
    //grunt.log.warn('options ' + JSON.stringify(options));
    /*
    注释by lym 不做多html合并
    this.files.forEach(function(file) {
      grunt.log.warn('file ' + file);
      var blocks,
        content,
        lf;

      content = file.src.filter(function(filepath) {
        // Remove nonexistent files (it's up to you to filter or warn here).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
        grunt.log.warn('filepath ' + filepath);
      }).map(function(filepath) {
        // Read and return the file's source.
        grunt.log.warn('filepath ' + filepath);
        return grunt.file.read(filepath);
      }).join('\n');
      //grunt.log.warn('content' + content);

      blocks = getBlocks(content);
      //grunt.log.warn('blocks ' + JSON.stringify(blocks));
      // Determine the linefeed from the content
      lf = /\r\n/g.test(content) ? '\r\n' : '\n';

      blocks.forEach(function(block) {
        // Determine the indent from the content
        var raw = block.raw.join(lf);
        var opts = _.extend({}, block, options);

        var replacement = htmlrefsTemplate[block.type](opts, lf, options.includes);
        content = content.replace(raw, replacement);
      });

      // write the contents to destination
      //grunt.log.warn('content ' + content);
      grunt.log.warn('file.dest ' + file.dest);
      grunt.file.write(file.dest, content);

    });*/



    /*单个html文件保存和打开*/
    this.files.forEach(function(file) {
      //grunt.log.warn('file ' + JSON.stringify(file));
      var blocks,
        content,
        lf;

      file.src.filter(function(filepath) {
        // Remove nonexistent files (it's up to you to filter or warn here).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
        //grunt.log.warn('filepath ' + filepath);
      }).map(function(filepath) {
        // Read and return the file's source.

        content = grunt.file.read(filepath);
        //grunt.log.warn('content ' + content);

        blocks = getBlocks(content,options.type);
        //grunt.log.warn('blocks ' + JSON.stringify(blocks));
        //grunt.log.warn('options ' + JSON.stringify(options));
        // Determine the linefeed from the content
        lf = /\r\n/g.test(content) ? '\r\n' : '\n';


        //grunt.log.warn('blocks length ' + blocks.length);


        blocks.forEach(function(block) {
          // Determine the indent from the content
          var raw = block.raw.join(lf);
          var opts = _.extend({}, block, options);



          var replacement = htmlrefsTemplate[block.type](opts, lf, options.includes);
          content = content.replace(raw, replacement);
        });

        // write the contents to destination
        //grunt.log.warn('content ' + content);
        //grunt.log.warn('file.dest ' + file.dest);
        var fileName = filepath.match(/[^\/]*$/)[0];//移除目录级别，只保留文件名和后缀
        if(typeof(file.namesuffix)!="undefined")
        {
            fileName = fileName.replace(".",file.namesuffix+".");
        }
        else
        {
            fileName = fileName.replace(".","_publish.");//将原有的test.html替换为test_publish.html
        }


        grunt.file.write(file.dest+fileName, content);
        grunt.log.writeln('成功写入文件' + file.dest+fileName);

      });
      //grunt.log.warn('content' + content);



    });
  });

  var htmlrefsTemplate = {
    js: function(block) {
      var indent = (block.raw[0].match(/^\s*/) || [])[0];
      return indent + grunt.template.process(scriptTemplate, {
        data: block
      });
    },
    fullreplace:function(block){
      //grunt.log.warn('fullreplace');
      //grunt.log.warn('block'+JSON.stringify(block));
      return grunt.template.process(fullreplaceTemplate, {
        data: block
      });
    },
    seajs:function(block) {
      var indent = (block.raw[0].match(/^\s*/) || [])[0];
      //grunt.log.warn('indent' + indent);
      return indent + grunt.template.process(seajsscriptTemplate, {
        data: block
      });
    },
    css: function(block) {
      var indent = (block.raw[0].match(/^\s*/) || [])[0];
      return indent + grunt.template.process(stylesheetTemplate, {
        data: block
      });
    },
    inlinecss: function(block) {
      var indent = (block.raw[0].match(/^\s*/) || [])[0];
      var lines = grunt.file.read(block.dest).replace(/\r\n/g, '\n').split(/\n/).map(function(l) {
        return indent + l;
      });
      return indent + grunt.template.process(inlineCSSTemplate, {
        data: {
          dest: lines
        }
      });
    },
    include: function(block, lf, includes) {
      // let's see if we have that include listed
      if (!includes[block.dest]) {
        return '';
      }

      var indent = (block.raw[0].match(/^\s*/) || [])[0];
      var lines = grunt.file.read(includes[block.dest]).replace(/\r\n/g, '\n').split(/\n/).map(function(l) {
        return indent + l;
      });

      return lines.join(lf);
    },
    remove: function( /*block*/ ) {
      return ''; // removes replaces with nothing
    }
  };
  //通过类型返回不同的正则表达式，原因是不同文件类型 注释标签不同
  function getReg(type)
  {
    var ret = {};
    switch(type)
    {
      case "javascript":
      case "css":
        ret.regStrart = /\*\s*localref:(\w+)\s*(.+)\s*\*/;
        ret.regEnd = /\*\s*endlocalref\s*\*/;
        break;
      default:
        ret.regStrart = /<!--\s*localref:(\w+)\s*(.+)\s*-->/;
        ret.regEnd = /<!--\s*endlocalref\s*-->/;
        break;
    }
    return ret;
  }

  function getBlocks(body,type) {
    var lines = body.replace(/\r\n/g, '\n').split(/\n/),
      block = false,
      sections = {},
      last;

    var i=0;
    lines.forEach(function(l) {
      //grunt.log.warn('htmlRegStrart' + htmlRegStrart);
      //grunt.log.warn('getRegStart' + JSON.stringify(getReg(type)));
      var reg = getReg(type);
      //grunt.log.warn('l' + l);
      var build = l.match(reg.regStrart),
        endbuild = reg.regEnd.test(l);

      if (build) {
        i++;
        //grunt.log.warn('i:' + i);
        block = true;
        // create a random key to support multiple removes
        var key = build[2].length > 1 ? build[2]+"$$"+(Math.random(1, 2) * Math.random(0, 1)) : (Math.random(1, 2) * Math.random(0, 1));
        /*var key = Math.random(1, 2) * Math.random(0, 1);*/
        //grunt.log.writeln('key:' + key);
        sections[[build[1], key.toString().trim()].join(':')] = last = [];
        //grunt.log.writeln('last:' + JSON.stringify(last));
        //grunt.log.writeln('build:' + JSON.stringify(build));
        //grunt.log.writeln('key.toString().trim():' + key.toString().trim());
      }

      // switch back block flag when endbuild
      if (block && endbuild) {
        last.push(l);
        block = false;
      }

      if (block && last) {
        last.push(l);
      }
    });

    //grunt.log.writeln('sections:' + JSON.stringify(sections));

    var blocks = [];

    for (var s in sections) {
      blocks.push(fromSectionToBlock(s, sections[s]));
    }

    return blocks;
  }

  function fromSectionToBlock(key, section) {

    var chunks = key.split('$$')[0].match(/^([^:]+):(.*)/);

    return {
      type: chunks[1],
      dest: chunks[2],
      raw: section
    };
  }
};