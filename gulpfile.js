const gulp = require("gulp");
const del = require("del");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const browserSync = require("browser-sync").create();
const config = require("./webpack.config.js");
const inject = require("gulp-inject");
const babel = require("gulp-babel")
const paths = {
    originals:"./originals/**/*",
    src: "./src",
    srcCSS: "./src/**/*.css",
    srcJS: "./src/**/*.js",
    srcHTML: "./src/*.html",
    srcImages: "./src/images/*.jpg",
    nodeModules: "/**/node_modules/**/",
    keys: "./src/config.js",

    tmp: "./tmp",
    tmpJS: "./tmp/js/",
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
    return gulp.src([paths.srcJS, "./src/manifest.json",excludeDirectory("js"),"!./src/js/index.js","!./src/gulpfile.js"])
        .pipe(gulp.dest(paths.tmp))
});

gulp.task("bundle",function(){
    return gulp.src("./src/js/index.js")
    .pipe(webpackStream(config,webpack))
    .pipe(gulp.dest(paths.tmp))
})
gulp.task("images",function(){
    return gulp.src([paths.srcImages,"./src/images/*.png"])
        .pipe(gulp.dest([paths.tmp+"/images"]))
})

/*end of copying modules*/

gulp.task("clean:tmp", function(){
    return del([[paths.tmp+"**/*"].toString(),excludeDirectory("tmp")])
});

gulp.task("browser-sync",function(){
    browserSync.init({
        server: paths.tmp,
    })
});

gulp.task("clean:src",function(){
    return del([[paths.src+"**/*"].toString(), excludeDirectory("src")])
})

gulp.task("copy:src",function(){
    return gulp.src([paths.originals, excludeDirectory("originals"), excludeDirectory("data"), excludeDirectory("img")])
        .pipe(gulp.dest(paths.src))
})

gulp.task("copy:tmp:data", function(){
    return gulp.src(["./src/data/restaurants.json"])
        .pipe(gulp.dest([paths.tmp+"/data"]))
})

gulp.task("copy",gulp.series("html","css","bundle","js","copy:tmp:data", "images", "inject"));

const build = gulp.series("clean:tmp","copy")

gulp.watch([paths.src+"/**/*"], build)

gulp.task("default", build)

gulp.task("dist",function(){
    return gulp.src(["./tmp/**/*"])
        .pipe(gulp.dest([paths.dist]))
})