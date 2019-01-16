const gulp = require('gulp');
const runSequence = require('run-sequence'); //run-sequence  逐步执行任务
const del = require('del');
const fs = require('fs');
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
    sprites: {
        src: src + 'sprites',
        dist: src,
        dist2: dist + 'sprites' //导出一份雪碧图的文件
    }
};

// 合并js
const taskSrc = {
    // ab: ['a.js', 'b.js','c.js']
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
let spritesTask = []; // 用于 gulp task
let spritesFiles = []; // 用于watch

imageSpirt.length && imageSpirt.forEach(function (icon, index) {
    // 雪碧图标识
    spritesTask.push(icon + "sprite");
    spritesFiles.push(paths.sprites.src + '/' + icon + "/**");
    gulp.task(icon + "sprite", () => {
        return gulp.src(paths.sprites.src + '/' + icon + "/*.png")
            .pipe(spritesmith({
                imgName: 'images/' + icon + '_sprite.png', //合并后大图的名称
                cssName: 'sass/_' + icon + 'sprite.scss',
                padding: 10, // 每个图片之间的间距，默认为0px
                cssTemplate: (data) => {
                    // data为对象，保存合成前小图和合成打大图的信息包括小图在大图之中的信息
                    let arr = [],
                        width = data.spritesheet.px.width,
                        height = data.spritesheet.px.height,
                        url = data.spritesheet.image
                    // console.log(data)
                    data.sprites.forEach(function (sprite) {
                        arr.push(
                            "." + icon + "_" + sprite.name +
                            "{" +
                            "background: url('" + url + "') " +
                            "no-repeat " +
                            sprite.px.offset_x + " " + sprite.px.offset_y + ";" +
                            "background-size: " + width + " " + height + ";" +
                            "width: " + sprite.px.width + ";" +
                            "height: " + sprite.px.height + ";" +
                            "}\n"
                        )
                    });
                    return arr.join("")
                }
            }))
            .pipe(gulp.dest(paths.sprites.dist)) // 保存到src下，供scss引入
            .pipe(gulp.dest(paths.sprites.dist2)) // 生成到dist下，备份
            .pipe(plugins.connect.reload());
    })
});

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


// 压缩图片
gulp.task('image', () => {
    return gulp.src(paths.images.src)
        .pipe(plugins.if(prod, plugins.imagemin()))
        .pipe(gulp.dest(paths.images.dist))
        .pipe(plugins.connect.reload());
});

// 压缩temp图片
gulp.task('temp', () => {
    return gulp.src(paths.temp.src)
        .pipe(plugins.if(prod, plugins.imagemin()))
        .pipe(gulp.dest(paths.temp.dist))
        .pipe(plugins.connect.reload());
});

// 压缩js
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

// 打开服务器
gulp.task('server', () => {
    plugins.connect.server({
        root: dist,
        host: '0.0.0.0',
        port: 80,
        livereload: true
    });
});

// watch
gulp.task('watch', ['server'], function () {

    // 检测压缩图片
    if (paths.sprites.src) {
        spritesFiles.length && spritesFiles.forEach((file, index) => {
            gulp.watch(file, [spritesTask[index]]);
        })
    }

    paths.html.src && gulp.watch(paths.html.src, ['html']);
    paths.sass.src && gulp.watch(paths.sass.src, ['sass']);
    paths.images.src && gulp.watch(paths.images.src, ['image']);
    paths.temp.src && gulp.watch(paths.temp.src, ['temp']);

    if (taskSrc.length) {
        paths.js.src && gulp.watch(paths.js.src, [...Object.keys(taskSrc)]);
    } else {
        paths.js.src && gulp.watch(paths.js.src, ['js']);
    }
});

gulp.task('default', () => {
    // 是否有雪碧图
    // images sass 放最后
    runSequence([...spritesTask, 'vendor', 'html', 'temp', 'js', 'image', 'sass'], 'watch');

    // paths.js.src && gulp.watch(paths.js.src, [...Object.keys(taskSrc)]);
});

// 清空文件夹及zip文件
gulp.task('clean', callback => {
    del('*.zip');
    del('dist').then(paths => callback());
});

// 打包
gulp.task('build', ['clean'], function (callback) {
    prod = true;
    runSequence([...spritesTask, 'vendor', 'html', 'temp', 'js', 'image', 'sass']);
});

// 清理node——modules
gulp.task('cleanModule', callback => {
    del('node_modules').then(paths => callback());
});
