const path = require("path");
const 
config = {
    devtool: "cheap-eval-source-map",
    mode: "development",
    entry: ["./src/js/main.js", "./src/js/dbhelper.js","./src/js/restaurant_info.js","./src/index.js","./src/js/config.js"],
    output:{
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    module:{
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
            }
        ]
    }
}

module.exports = config;