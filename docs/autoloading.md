# Autoloading

```js
mix.autoload({
   jquery: ['$', 'window.jQuery']
});
```
- Example for bootstrap `http://getbootstrap.com/docs/4.0/getting-started/webpack/`
```
mix.autoload({
    Popper : ['popper.js', 'default'],
    // In case you imported plugins individually, you must also require them here:
    Util   : "exports-loader?Util!bootstrap/js/dist/util",
}, true)
```
Webpack offers the necessary facilities to make a module available as a variable in every other module required by webpack. If you're working with a particular plugin or library that depends upon a global variable, such as jQuery, `mix.autoload()` may prove useful to you.

Consider the following example:

```js
mix.autoload({
   jquery: ['$', 'window.jQuery']
});
```

This snippet specifies that webpack should prepend `var $ = require('jquery')` to every location that it encounters either the global `$` identifier, or `window.jQuery`. Nifty!

