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
    "dev"            : "npm run webpack -- --watch",
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
// See Example: https://github.com/EmranAhmed/ultimate-page-builder

if (Mix.inProduction()) {
    mix.generatePot({
        package   : 'ultimate-page-builder',
        bugReport : 'https://github.com/EmranAhmed/ultimate-page-builder/issues',
        src       : '*.php',
        domain    : 'ultimate-page-builder',
        destFile  : `languages/ultimate-page-builder.pot`
    });
}

// Autoload
mix.autoload({
    tether : ['tether', 'window.Tether', 'Tether'],
    vue : ['window.Vue', 'Vue']
});

// OR ProvidePlugin Style Autoload, 
// See: https://getbootstrap.com/docs/4.0/getting-started/webpack/#importing-javascript

mix.autoload({
     Popper: ['popper.js', 'default'],
     Util: "exports-loader?Util!bootstrap/js/dist/util",
}, true);

// Enable gzCompression, gzCompression on production mode
mix.gzCompression();


// Image Loader Options
mix.imageLoaderOptions({
    mozjpeg  : {
        progressive: true,
    }
});



// Enable sourceMap
mix.sourceMaps();

// Compile JS
mix.js('src/js/script.js', 'assets/js');

mix.babel('src/js/babel-code.js', 'assets/js');

// Compile SCSS
mix.sass('src/sass/style.scss', 'assets/css');

mix.setCommonChunkFileName('commons'); // Common Chunk File Name

mix.extract(['vue', 'vue-router', 'extend'], `assets/js/vendor${min}.js`);
```


You may review the initial documentation here [on GitHub](https://github.com/EmranAhmed/wp-mix/tree/master/docs#readme)

## License

WP Mix is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
