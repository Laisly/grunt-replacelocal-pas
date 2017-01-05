# grunt-replacelocal-pas

> replace all by template localrefs

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-replacelocal-pas --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-replacelocal-pas');
```

## The "replacelocal" task

### Overview
In your project's Gruntfile, add a section named `replacelocal` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
 replacelocal: {
            html: {
                /** @required  - string including grunt glob variables */
                //src: '*.html',
                src: ['index.html','modifyPwd.html'],
                /** @optional  - string directory name*/
                dest: './',
                /** @optional  - references external files to be included */
                /*includes: {
                    analytics: './ga.inc' // in this case it's google analytics (see sample below)
                },*/
                /** any other parameter included on the options will be passed for template evaluation */
                options: {
                  buildNumber: buildVersion,
                  type:"html"
                }
            },
            config: {
                src: ['js/config.js'],
                dest: 'build/js/',
                namesuffix: "",//不加后缀
                options: {
                  buildNumber: buildVersion,
                  type:"javascript"
                }
            },
            javascript: {
                src: ['js/index.js'],
                dest: 'js/',
                namesuffix: javascript_namesuffix,
                options: {
                  buildNumber: buildVersion,
                  type:"javascript"
                }
            },
            css: {
                src: ['css/main.css','../css/comm.css'],
                dest: '.build/',
                options: {
                  buildNumber: buildVersion,
                  type:"css"
                }
            }
        },
});
```

### Options

#### options.separator
Type: `String`
Default value: `',  '`

A string value that is used to do something with whatever.

#### options.punctuation
Type: `String`
Default value: `'.'`

A string value that is used to do something else with whatever else.

### Usage Examples

#### Default Options

grunt.initConfig({
  replacelocal: {
            html: {
                /** @required  - string including grunt glob variables */
                //src: '*.html',
                src: ['index.html','modifyPwd.html'],
                /** @optional  - string directory name*/
                dest: './',
                /** @optional  - references external files to be included */
                /*includes: {
                    analytics: './ga.inc' // in this case it's google analytics (see sample below)
                },*/
                /** any other parameter included on the options will be passed for template evaluation */
                options: {
                  buildNumber: buildVersion,
                  type:"html"
                }
            },
            config: {
                src: ['js/config.js'],
                dest: 'build/js/',
                namesuffix: "",//不加后缀
                options: {
                  buildNumber: buildVersion,
                  type:"javascript"
                }
            },
            javascript: {
                src: ['js/index.js'],
                dest: 'js/',
                namesuffix: javascript_namesuffix,
                options: {
                  buildNumber: buildVersion,
                  type:"javascript"
                }
            },
            css: {
                src: ['css/main.css','../css/comm.css'],
                dest: '.build/',
                options: {
                  buildNumber: buildVersion,
                  type:"css"
                }
            }
        },
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  Replacebyrefs: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
