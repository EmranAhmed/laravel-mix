# Basic Example

Laravel Mix is a clean layer on top of webpack to make the 80% use case laughably simple to execute. Most would agree that, though incredibly powerful, webpack ships with a steep learning curve. But what if you didn't have to worry about that?

Have a look at a basic `webpack.mix.js` file. Let's imagine that we only desire JavaScript \(ES2015 with modules\), and Sass compilation:

```js
const mix      = require('laravel-mix');

const min      = Mix.inProduction() ? '.min' : '';

if (Mix.inProduction()) {
    mix.generatePot({
        package        : 'ultimate-page-builder',
        bugReport      : 'https://github.com/EmranAhmed/ultimate-page-builder/issues',
        lastTranslator : 'Emran Ahmed <emran.bd.08@gmail.com>',
        team           : 'ThemeHippo <themehippo@gmail.com>',
        src            : '*.php',
        domain         : 'ultimate-page-builder',
        destFile       : `languages/ultimate-page-builder.pot`
    });
}

mix.options({
    extractVueStyles : `assets/css/upb-style${min}.css`
});

mix.setCommonChunkFileName('upb-common');

mix.banner({
    'banner': "Ultimate Page Builder v1.0.0 \n\nAuthor: Emran Ahmed ( https://themehippo.com/ ) \nDate: " + new Date().toLocaleString() + "\nReleased under the MIT license."
});

mix.autoload({
        vue : ['window.Vue', 'Vue']
});

mix.sass('src/scss/app.sass', 'assets/css')
   .js('src/js/app.js', 'assets/js');


mix.extract(['vue', 'vue-router', 'extend', 'sprintf-js', 'sanitize-html', 'copy-to-clipboard'], `assets/js/upb-vendor${min}.js`);

['select2', 'upb-boilerplate', 'upb-scoped-polyfill', 'wp-color-picker-alpha'].map((name) => mix.babel(`src/js/${name}.js`, `assets/js/${name}${min}.js`));
```

Done. Simple, right?

1. Compile the Sass file, `./src/app.sass`, to `./dist/app.css`
2. Bundle all JavaScript \(and any required modules\) at `./src/app.js` to `./dist/app.js`.

With this configuration in place, we may trigger webpack from the command line: `node_modules/.bin/webpack`.

During development, it's unnecessary to minify the output, however, this will be performed automatically when you trigger webpack within a production environment: `export NODE_ENV=production webpack`.

### Less?

But what if you prefer Less compilation instead? No problem. Just swap `mix.sass()` with `mix.less()`, and you're done!

You'll find that most common webpack tasks become a cinch with Laravel Mix.

