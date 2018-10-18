const gulp = require('gulp');
const runSequence = require('run-sequence'); //run-sequence  逐步执行任务
const del = require('del');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const plugins = require('gulp-load-plugins')(); //for gulp
const spritesmith = require('gulp.spritesmith');
/* plugins :{
 *   sass:                 ： 
 *   gulp-imagemin         ：  压缩img
 *   gulp-if               ：  if
 *   gulp-clean-css        ：  压缩css
 *   gulp-jshint           :   js检查 
 *   gulp-uglify           ：  压缩js
 *   gulp-connect          ：  开启服务器
 *   gulp-autoprefixer     :   处理css中浏览器兼容的前缀
 *   gulp-rename           :   命名  
 * }
 */
var env = process.env.GULP_ENV && process.env.GULP_ENV.replace(/(\s*$)|(^\s*)/ig, '');
var prod = true;
const src = 'src/';
const dist = 'dist/';
const paths = {
    html: {
        src: src + '*.html',
        dist: dist + ''
    },
    sass: {
        src: src + 'sass/*.scss',
        dist: dist + 'css/'
    },
    images: {
        src: src + 'images/*.*',
        dist: dist + 'images/'
    },
    temp: {
        src: src + 'temp/*.*',
        dist: dist + 'temp/'
    },
    js: {
        src: src + 'js/*.js',
        dist: dist + 'js/'
    },
    minImg: {
        src: src + 'images/',
        outSrc: 'images/',
        outCss: 'css/'
    }
};

// 合并js
const taskSrc = {
    // ab: ['a.js', 'b.js']
}

for (let pro in taskSrc) {
    gulp.task(pro, () => {
        return gulp.src(taskSrc[pro].map(item => paths.js.src + item))
            .pipe(plugins.concat(pro + '.js'))
            .pipe(plugins.if(prod, plugins.uglify()))
            .pipe(gulp.dest(paths.js.dist))
            .pipe(plugins.connect.reload());
    })
}

// 图片雪碧图 + css
function getFolders(dir) { //获取文件目录
    return fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}


const imageSpirt = getFolders(src + paths.minImg.src);
imageSpirt.length && imageSpirt.forEach(
    icon => {
        gulp.task(icon, function () {
            gulp.src(paths.minImg.src + icon + '/*.png')
                .pipe(spritesmith({
                    imgName: paths.minImg.outSrc + icon + '.png', //保存合并后的名称
                    cssName: paths.minImg.outCss + icon + '.css', //保存合并后css样式的地址
                    padding: 10, //合并时两个图片的间距
                    algorithm: 'binary-tree', //注释1
                    //cssTemplate:'css/handlebarsStr.css'    //注释2
                    cssTemplate: function (data) { //如果是函数的话，这可以这样写
                        var arr = [];
                        data.sprites.forEach(function (sprite) {
                            arr.push("." + icon + "-" + sprite.name +
                                "{" +
                                "background-image: url('" + sprite.escaped_image + "');" +
                                "background-repeat: no-repeat;" +
                                "background-position: " + sprite.px.offset_x + " " + sprite.px.offset_y + ";" +
                                "background-size: " + sprite.px.width + " " + sprite.px.height + ";" +
                                "width: " + sprite.px.width + ";" +
                                "height: " + sprite.px.height + ";" +
                                "}\n");
                        });
                        return arr.join("");
                    }
                }))
                .pipe(gulp.dest(dist)); //输出目录
        });
    }
);

gulp.task('html', () => {
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dist))
        .pipe(plugins.connect.reload());
});


// 编译Sass
gulp.task('sass', () => {
    return gulp.src(paths.sass.src)
        .pipe(plugins.sass().on('error', plugins.sass.logError)) //watch 不会中断
        .pipe(plugins.autoprefixer({
            browsers: ['last 4 version']
        }))
        .pipe(plugins.if(prod, plugins.cleanCss({
            keepBreaks: false,
            compatibility: 'ie8',
            keepSpecialComments: '*'
        })))
        .pipe(gulp.dest(paths.sass.dist))
        .pipe(plugins.connect.reload());
});



gulp.task('image', () => {
    return gulp.src(paths.images.src)
        .pipe(plugins.if(prod, plugins.imagemin()))
        .pipe(gulp.dest(paths.images.dist))
        .pipe(plugins.connect.reload());
});

gulp.task('temp', () => {
    return gulp.src(paths.temp.src)
        .pipe(plugins.if(prod, plugins.imagemin()))
        .pipe(gulp.dest(paths.temp.dist))
        .pipe(plugins.connect.reload());
});


gulp.task('js', () => {
    return gulp.src(paths.js.src)
        .pipe(plugins.jshint())
        // .pipe(plugins.if(prod, plugins.uglify()))
        .pipe(gulp.dest(paths.js.dist))
        .pipe(plugins.connect.reload());
});

// zip
gulp.task('zip', function () {
    del('*.zip');
    const dir = __dirname.split('\\');
    const name = dir[dir.length - 1];
    const time = moment(new Date).format('YYYY-MM-DD');
    return gulp.src(dist + '**')
        // return gulp.src('**')
        .pipe(plugins.zip(name + time + '.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task('server', () => {
    plugins.connect.server({
        root: dist,
        host: '0.0.0.0',
        port: 80,
        livereload: true
    });
});

gulp.task('watch', ['server'], function () {
    paths.html.src && gulp.watch(paths.html.src, ['html']);
    paths.sass.src && gulp.watch(paths.sass.src, ['sass']);
    paths.images.src && gulp.watch(paths.images.src, ['image']);
    paths.temp.src && gulp.watch(paths.temp.src, ['temp']);

    if (taskSrc.length) {
        paths.js.src && gulp.watch(paths.js.src, [...Object.keys(taskSrc)]);
    } else {
        paths.js.src && gulp.watch(paths.js.src, ['js']);
    }

    if (imageSpirt.length) {
        imageSpirt.forEach(img => {
            paths.minImg.src + img && gulp.watch(paths.minImg.src + img, [...imageSpirt]);
        })
    }

});

gulp.task('default', () => {

    if (taskSrc.length) {
        paths.js.src && gulp.watch(paths.js.src, [...Object.keys(taskSrc)]);
    } else {
        runSequence(['sass', 'html', 'image', 'temp', 'js'], 'watch');
    }

    // runSequence(['sass', 'html', 'image', 'temp', 'js', ...imageSpirt], 'watch');
});

gulp.task('clean', callback => {
    del('*.zip');
    del('dist').then(paths => callback());
});

gulp.task('build', ['clean'], function (callback) {
    prod = true;
    runSequence(['sass', 'html', 'image', 'temp', 'js']);
});

gulp.task('cleanModule', callback => {
    del('node_modules').then(paths => callback());
});