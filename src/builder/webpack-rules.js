let webpack           = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function () {
    let rules          = [];
    let extractPlugins = [];

    // Babel Compilation.
    rules.push({
        test    : /\.jsx?$/,
        exclude : /(node_modules|bower_components|assets)/,
        use     : [
            {
                loader  : 'babel-loader',
                options : Config.babel()
            }
        ]
    });

    // TypeScript Compilation.
    if (Mix.isUsing('typeScript')) {
        rules.push({
            test    : /\.tsx?$/,
            loader  : 'ts-loader',
            exclude : /node_modules/,
            options : {
                appendTsSuffixTo : [/\.vue$/],
            }
        });
    }

    // CSS Compilation.
    rules.push({
        test    : /\.css$/,
        exclude : /assets/,
        loaders : ['style-loader', 'css-loader']
    });

    // Recognize .scss Imports.
    rules.push({
        test    : /\.s[ac]ss$/,
        exclude : Config.preprocessors.sass ? Config.preprocessors.sass.map(sass => sass.src.path()) : [],
        loaders : ['style-loader', 'css-loader', 'sass-loader']
    });

    // Recognize .less Imports.
    rules.push({
        test    : /\.less$/,
        exclude : Config.preprocessors.less ? Config.preprocessors.less.map(less => less.src.path()) : [],
        loaders : ['style-loader', 'css-loader', 'less-loader']
    });

    // Add support for loading HTML files.
    rules.push({
        test    : /\.html$/,
        loaders : ['html-loader']
    });

    // Add support for loading images.
    rules.push({
        test    : /\.(png|jpe?g|gif)$/,
        exclude : Mix.paths.root('images'),
        loaders : [
            {
                loader  : 'file-loader',
                options : {
                    name       : path => {
                        if (!/node_modules|bower_components/.test(path)) {
                            return 'images/[name].[ext]?[hash]';
                        }

                        return 'images/' + path
                                .replace(/\\/g, '/')
                                .replace(
                                    /((.*(node_modules|bower_components))|images|image|img|assets|src)\//g, ''
                                ) + '?[hash]';
                    },
                    //publicPath: Config.resourceRoot
                    publicPath : Config.assetPublicPath
                }
            },

            {
                loader  : 'img-loader',
                options : Config.imgLoaderOptions
            }
        ]
    });

    // Add support for loading images local.

    rules.push({
        test    : /\.(png|jpe?g|gif)$/,
        include : Mix.paths.root('images'),
        loaders : [
            {
                loader  : 'ignore-files-loader',
                options : {

                    name       : path => {
                        return 'images/[name].[ext]?[hash]';
                    },
                    //publicPath: Config.resourceRoot
                    publicPath : Config.assetPublicPath
                }
            },

            {
                loader  : 'img-loader',
                options : Config.imgLoaderOptions
            }
        ]
    });

    // Add support for loading fonts.
    rules.push({
        test    : /\.(woff2?|ttf|eot|svg|otf)$/,
        loader  : 'file-loader',
        options : {
            name       : path => {
                if (!/node_modules|bower_components/.test(path)) {
                    return 'fonts/[name].[ext]?[hash]';
                }

                return 'fonts/' + path
                        .replace(/\\/g, '/')
                        .replace(
                            /((.*(node_modules|bower_components))|fonts|font|assets|src)\//g, ''
                        ) + '?[hash]';
            },
            //publicPath: Config.resourceRoot,
            publicPath : Config.assetPublicPath
        }
    });

    // Add support for loading cursor files.
    rules.push({
        test    : /\.(cur|ani)$/,
        loader  : 'file-loader',
        options : {
            name       : '[name].[ext]?[hash]',
            //publicPath : Config.resourceRoot
            publicPath : Config.assetPublicPath
        }
    });

    // Here, we'll filter through all CSS preprocessors that the user has requested.
    // For each one, we'll add a new Webpack rule and then prepare the necessary
    // extract plugin to extract the CSS into its file.
    Object.keys(Config.preprocessors).forEach(type => {
        if (type === 'fastSass') return;

        Config.preprocessors[type].forEach(preprocessor => {
            let outputPath = preprocessor.output.filePath.replace(Config.publicPath + path.sep, path.sep);

            tap(new ExtractTextPlugin(outputPath), extractPlugin => {
                let loaders = [
                    {
                        loader  : 'css-loader',
                        options : {
                            url           : Config.processCssUrls,
                            sourceMap     : Mix.isUsing('sourcemaps'),
                            importLoaders : 1
                        }
                    },

                    {
                        loader  : 'postcss-loader',
                        options : {
                            sourceMap : (type === 'sass' && Config.processCssUrls) ? true : Mix.isUsing('sourcemaps'),
                            ident     : 'postcss',
                            /*plugins   : [
                             require('autoprefixer')
                             ].concat(Config.postCss)*/

                            plugins : Config.postCss
                        }
                    },
                ];

                if (type === 'sass' && Config.processCssUrls) {
                    loaders.push({
                        loader  : 'resolve-url-loader',
                        options : {
                            sourceMap : true,
                            root      : Mix.paths.root('node_modules')
                        }
                    });
                }

                loaders.push({
                    loader  : `${type}-loader`,
                    options : Object.assign(
                        preprocessor.pluginOptions,
                        {sourceMap : (type === 'sass' && Config.processCssUrls) ? true : Mix.isUsing('sourcemaps')}
                    )
                });

                rules.push({
                    test : preprocessor.src.path(),
                    use  : extractPlugin.extract({fallback : 'style-loader', use : loaders})
                });

                extractPlugins.push(extractPlugin);
            });
        });
    });

    // Vue Compilation.
    let vueExtractPlugin;

    if (Config.extractVueStyles) {
        vueExtractPlugin = typeof(Config.extractVueStyles) === "boolean" ? new ExtractTextPlugin('vue-styles.css') : new ExtractTextPlugin(Config.extractVueStyles);
    }

    rules.push({
        test    : /\.vue$/,
        loader  : 'vue-loader',
        exclude : /bower_components/,
        options : {
            // extractCSS: Config.extractVueStyles,
            loaders     : Config.extractVueStyles ? {
                js : {
                    loader  : 'babel-loader',
                    options : Config.babel()
                },

                scss : vueExtractPlugin.extract({
                    use      : 'css-loader!sass-loader',
                    fallback : 'vue-style-loader'
                }),

                sass : vueExtractPlugin.extract({
                    use      : 'css-loader!sass-loader?indentedSyntax',
                    fallback : 'vue-style-loader'
                }),

                css : vueExtractPlugin.extract({
                    use      : 'css-loader',
                    fallback : 'vue-style-loader'
                }),

                stylus : vueExtractPlugin.extract({
                    use      : 'css-loader!stylus-loader?paths[]=node_modules',
                    fallback : 'vue-style-loader'
                }),

                less : vueExtractPlugin.extract({
                    use      : 'css-loader!less-loader',
                    fallback : 'vue-style-loader'
                }),
            } : {
                js : {
                    loader  : 'babel-loader',
                    options : Config.babel()
                }
            },
            postcss     : Config.postCss,
            preLoaders  : Config.vue.preLoaders,
            postLoaders : Config.vue.postLoaders
        }
    });

    // If there were no existing extract text plugins to add our
    // Vue styles extraction too, we'll push a new one in.
    if (Config.extractVueStyles) {
        extractPlugins.push(vueExtractPlugin);
    }

    return {rules, extractPlugins};
}
