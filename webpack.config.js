const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const 
config = {
    mode:"production",
    target:"web",
    entry:{
        index: ["./src/js/index.js"],
    },
    output:{
        filename: "[name].js",
        path: path.resolve(__dirname, "dist")
    },
    optimization:{
            minimize: false,
            minimizer: [
                new UglifyJsPlugin({
                    parallel: true,  // Webpack default
                    cache: true,      // Webpack default
                    uglifyOptions: {
                        /*
                            inlining is broken sometimes where inlined function uses the same variable name as inlining function.
                            See https://github.com/mishoo/UglifyJS2/issues/2842, https://github.com/mishoo/UglifyJS2/issues/2843
                         */
                        compress: { inline:false },

                    },
                })
            ]}
    ,
    module:{
        noParse:/mapbox|leaflet/,
        rules:[
            {
                test: /\.js$/,
                exclude: (/node_modules/),
                use:{
                    loader: "babel-loader",
                    options:{
                        presets:["@babel/preset-env"]
                    }
                }
            },
        ]
    }
}

module.exports = config;