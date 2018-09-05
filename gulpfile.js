const gulp = require("gulp");
const del = require("del");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const browserSync = require("browser-sync").create();
const config = require("./webpack.config.js");
const inject = require("gulp-inject");
const paths = {
    src: "./src",
    srcCSS: "./src/**/*.css",
    srcJS: "./src/**/*.js",
    srcHTML: "./src/*.html",
    srcImages: "./src/images",
    nodeModules: "/**/node_modules/**/",
    keys: "./src/config.js",

    tmp: "./tmp",
    tmpJS: "./tmp/main.bundle.js",
    dist: "./dist",
}
const excludeNodeModules = function(extension){
    return ["!" + paths.nodeModules + "*." + extension].toString(); 
}

const excludeDirectory = function(directory){
    return ["!" + directory + "/"].toString();
}

gulp.task("inject", function(){
    let target = gulp.src([paths.srcHTML]);
    let sources = gulp.src([paths.tmpJS]);
    return target.pipe(inject(sources,{ignorePath:"tmp"}))
        .pipe(gulp.dest(paths.tmp))
});
/*copying modules*/
gulp.task("html", function(){
    return gulp.src([paths.srcHTML, excludeNodeModules("html")])
        .pipe(gulp.dest(paths.tmp))
});

gulp.task("css", function(){
    return gulp.src([paths.srcCSS, excludeNodeModules("css")])
        .pipe(gulp.dest(paths.tmp))
});

gulp.task("js", function(){
    return gulp.src([paths.srcJS, excludeNodeModules("js")])
        .pipe(webpackStream(config, webpack))
        .pipe(gulp.dest(paths.tmp))
});

gulp.task("copy",gulp.series("html","css","js","inject"));
/*end of copying modules*/

gulp.task("clean:tmp", function(){
    return del([[paths.tmp+"**/*"].toString(),excludeDirectory("tmp")])
});

gulp.task("browser-sync",function(){
    browserSync.init({
        server: paths.tmp,
    })
});

