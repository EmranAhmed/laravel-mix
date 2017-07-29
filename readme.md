<p align="center">
<a href="https://www.npmjs.com/package/wp-mix"><img src="https://img.shields.io/npm/v/wp-mix.svg" alt="NPM"></a>
<a href="https://www.npmjs.com/package/wp-mix"><img src="https://img.shields.io/npm/dt/wp-mix.svg" alt="NPM"></a>
<a href="https://www.npmjs.com/package/wp-mix"><img src="https://img.shields.io/npm/l/wp-mix.svg" alt="NPM"></a>
</p>

## Introduction

WP Mix is a fork of Laravel Mix which provides a clean, fluent API for defining basic [webpack](http://github.com/webpack/webpack) build steps for your WP application. Mix supports several common CSS and JavaScript pre-processors.

If you've ever been confused about how to get started with module bundling and asset compilation, you will love WP Mix!

## Documentation
### Example: `package.json`
```js
{
"scripts": {
    "webpack"        : "cross-env NODE_ENV=development node_modules/.bin/webpack --progress --hide-modules --config=node_modules/wp-mix/setup/webpack.config.js",
    "dev"            : "cross-env NODE_ENV=development node_modules/.bin/webpack --watch --progress --hide-modules --config=node_modules/wp-mix/setup/webpack.config.js",
    "build"          : "cross-env NODE_ENV=production node_modules/.bin/webpack --progress --hide-modules --config=node_modules/wp-mix/setup/webpack.config.js",
    "bundle"         : "npm run webpack && npm run build",
    "package:bundle" : "cross-env NODE_ENV=package node_modules/.bin/webpack --progress --hide-modules --config=node_modules/wp-mix/setup/webpack.config.js",
    "package"        : "npm run bundle && npm run package:bundle"
  }
}
```
### Example: `webpack.mix.js`

```js
const mix = require('wp-mix');
const min = Mix.inProduction() ? '.min' : '';

// Build Custom Modernizr
mix.modernizr({}); // https://www.npmjs.com/package/modernizr-webpack-plugin

// Make Banner
mix.banner({
    banner : "Ultimate Page Builder v1.0.0 \n\nAuthor: Emran Ahmed ( https://themehippo.com/ ) \nDate: " + new Date().toLocaleString() + "\nReleased under the MIT license."
});

// Notification Settings
mix.notification({
    title        : 'FashionStore',
    contentImage : Mix.paths.root('images/favicon.png')
});

// POT File generate

if (Mix.inProduction()) {
    mix.generatePot({
        package   : 'FashionStore',
        bugReport : 'https://themehippo.com/contact/',
        src       : '*.php',
        domain    : 'fashionstore',
        destFile  : `languages/fashionstore.pot`
    });
}

// for bootstrap support 
mix.webpackConfig({
    externals : {
        Tether          : 'tether',
        'window.Tether' : 'tether'
    }
});

// Autoload
mix.autoload({
    tether : ['tether', 'window.Tether', 'Tether'],
    vue : ['window.Vue', 'Vue']
});

mix.sourceMaps();

mix.js('src/js/script.js', 'assets/js');

mix.babel('src/js/babel-code.js', 'assets/js');

mix.sass('src/sass/style.scss', 'assets/css');

mix.setCommonChunkFileName('commons'); // manifest file

mix.sassAutoload(['src/sass/variables.scss', 'src/sass/mixins.scss']);

mix.extract(['vue', 'vue-router', 'extend'], `assets/js/vendor${min}.js`);
```


You may review the initial documentation here [on GitHub](https://github.com/EmranAhmed/wp-mix/tree/master/docs#readme)

## License

WP Mix is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
