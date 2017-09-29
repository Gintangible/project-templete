/**
 * 纯JS焦点图
 * options : {
 * 		element : 滑动图DOM，
 * 		speed : 滑动的速度
 * 		interval : 自动滑动的间隔时间，如果为0，那么禁用自动滑动
 *   	transition : 是否启用CSS3过渡动画
 * }
 *
 * DOM结构
 * <div class="slider" data-options="button:true,arrow:true,interval:5000">
 * 		<div class="s_view">
 * 			<ul>
 * 				<li></li>
 * 			</ul>
 * 		</div>
 * 	</div>
 *
 * @example
 * <div class="slider" data-options="button:true,arrow:true,interval:5000">
 * 		<div class="s_view">
 * 			<ul>
 * 				<!-- 从第二张图片开始，src属性都为data-src -->
 * 				<li><a href="">
 * 						<img src="temp/temp06.jpg" alt="中联办官员：现有15香港议员宣誓时表演羞辱国家">
 * 						<h3>1中联办官员：现有15香港议员宣誓时表演羞辱国家</h3>
 * 					</a></li>
 * 				<li><a href="">
 * 						<img src="temp/temp06.jpg" alt="中联办官员：现有15香港议员宣誓时表演羞辱国家">
 * 						<h3>2中联办官员：现有15香港议员宣誓时表演羞辱国家</h3>
 * 					</a></li>
 * 				<li><a href="">
 * 						<img src="temp/temp06.jpg" alt="中联办官员：现有15香港议员宣誓时表演羞辱国家">
 * 						<h3>3中联办官员：现有15香港议员宣誓时表演羞辱国家</h3>
 * 					</a></li>
 * 			</ul>
 * 		</div>
 * </div>
 */


var Slider = function ( element ) {
    this.element = element;

    //解析配置
    var options = this.parseOptions( element );

    this.speed = options.speed || 500; //滑动的速度；
    this.interval = options.interval || 2000; //自动滑动的间隔时间，如果为0，那么禁止自动滑动
    this.transaction = options.transition === true; //是否启用CSS3过渡效果
    this.sport = null;
    this.items = [];
    this.length = 0;
    this.distance = 0;
    this.animated = true;
    this.tID = -1;
    this.current = 0; //开始的位置

    this.create();
}

Slider.prototype = {
    constructor : Slider,

    getElementChildren : function(parent){
        var childNodes = parent.childNodes || [],
            doms = [], i, l;
        for(i = 0, l = childNodes.length; i < l; i++){
            childNodes[i].nodeType === 1 && doms.push(childNodes[i]);
        }
        return doms;
    },
    getBoundingClientRect : function(element){
        var rect = element.getBoundingClientRect(),
            top = document.documentElement.clientTop,
            left = document.documentElement.clientLeft;
        return {
            top : rect.top - top,
            bottom : rect.bottom - top,
            left : rect.left - left,
            right : rect.right - left,
            width : rect.right - rect.left,
            height : rect.bottom - rect.top
        };
    },
    on : function(element, event, handle){
        if (element.addEventListener) {
            element.addEventListener(event, handle, false);
        } else {
            element.attachEvent('on'+event, handle);
        }
    },

    parseOptions : function ( element ) {
        var config = {},
            options = element.getAttribute('data-options'),
            splits, parts, i, len;
        //解析配置
        if( typeof options == 'string' ){
            splits = options.split(',');
            for( i = 0, len = splits.length; i < len; i++ ){
                parts = splits.split(':');
                if( parts[0] && parts[1] ){
                    parts[1].replace(/^\s*\b(true|false)\b\s*$/ig, function (_, kw) {
                        var ret = false;
                        if (kw === 'true') {
                            ret = true;
                        }
                        parts[1] = ret;

                    })
                    config[parts[0]] = parts[1];
                }
            }

        }
        return config;
    },

    create : function () {
        var element = this.element,
            sport = this.sport = element.getElementsByTagName('ul')[0],
            items = this.items = this.getElementChildren( sport ),
            length  = this.length = items.length,
            i, len;

        //复制
        for( i = 0; i < length; i ++){
            sport.appendChild( items[i].cloneNode( true) );
        }
        items = this.items = this.getElementChildren( sport );
        //获取移动的距离
        this.distance = this.getBoundingClientRect( items[0].width );
        sport.style.width = this.distance * length * 2 + 'px';
        //设置开始位置
        this.current = +this.current;
        //创建箭头按钮
        this.createDirect();
    },

    createDirect : function () {
        var self = this,
            div = document.createElement('div'),
            prev = document.createElemnt('span'),
            next= document.createElemnt('span');
        prev.className = 's-prev';
        this.on( prev, 'click',function () {
            self.prev();
        });
        next.className = 's-next';
        this.on( next, 'click',function () {
            self.next();
        });
        div.className = 's-direct';
        div.appendChild(prev);
        div.appendChild(next);
        this.element.appendChild(div);
    },
    
    prev : function () {
        this.move( this.current - 1 );
    },

    next : function () {
        this.move( this.current + 1 );
    },

    move : function ( index ) {
        if( !this.animated ) return;
        var self = this,
            current = this.current,
            items = this.items,
            length = this.length,
            delay = 0;
        
        if( index < 0 ){
            index = length - 1;
            this.animate( -length * this.distance, 0 );
        }
        setTimeout( function () {// setTimeout的作用是等待上面的animate中的transform渲染完成
            self.animate( -index * self.distance, self.speed, function () {
                if( index >= length ){
                    index = 0;
                    self.animate( 0, 0 );
                }
                self.current = index;
            })
        },delay);
    },

    animate : function ( pos, speed, callback ) {
        var done = function () {
            this.animated = true;
            typeof  callback === 'function' && callback.apply( this, arguments );
        };
        this.animated = false;
        
        if( this.isSupportTransform() && this.transition ){
            this.animationCss3( pos, speed, done );
        }else{
            this.animationNormal( pos, speed, done );
        }
    },
    
    animationNormal : function ( pos, speed, callback ) {
        var self = this,
            sport = this.sport,
            style = parseInt( style.left ),
            easeIn = function ( t, b, c, d ) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                return - c / 2 * ((t -= 2) * t * t * t - 2) + b;
            },
            interval = 25,
            d = Math.floor( speed / interval ),
            t = 0;
        isNaN( left ) && (left = 0);
        if( speed === 0 ){
            style.left = pos + 'px';
            callback.call( self );
        }else{
            setTimeout(function(){
                if (t >= d) {
                    style.left = pos + 'px';
                    callback.call(self);
                } else {
                    var l = style.left = easeIn(t++, left, pos - left, d) + 'px';
                    setTimeout(arguments.callee, interval);
                }
            }, interval);
        }
    },

    isSupportTransform : function(){
        var transformNames = [
                'transform',
                'webkitTransform',
                'msTransform',
                'MozTransform',
                'OTransform'
            ],
            style = document.body.style,
            i, l;
        for(i = 0, l = transformNames.length; i < l; i++){
            if (style[transformNames[i]] !== undefined) {
                return true;
            }
        }
        return false;
    },
    animationCss3 : function(pos, speed, callback){
        var self = this,
            sport = this.sport,
            style = sport.style,
            handle = function(){
                sport.removeEventListener('webkitTransitionEnd', handle, false);
                sport.removeEventListener('msTransitionEnd', handle, false);
                sport.removeEventListener('oTransitionEnd', handle, false);
                sport.removeEventListener('otransitionend', handle, false);
                sport.removeEventListener('transitionend', handle, false);
                // 回调
                callback.call(self);
            };
        if (speed !== 0) {
            sport.addEventListener('webkitTransitionEnd', handle, false);
            sport.addEventListener('msTransitionEnd', handle, false);
            sport.addEventListener('oTransitionEnd', handle, false);
            sport.addEventListener('otransitionend', handle, false);
            sport.addEventListener('transitionend', handle, false);
        }
        // 速度
        style.webkitTransitionDuration =
            style.MozTransitionDuration =
                style.msTransitionDuration =
                    style.OTransitionDuration =
                        style.transitionDuration = speed + 'ms';
        // 位置
        style.webkitTransform = 'translate(' + pos + 'px,0)' + 'translateZ(0)';
        style.msTransform =
            style.MozTransform =
                style.OTransform
        style.transform = 'translateX(' + pos + 'px)';

        if (speed === 0) {
            callback.call(self);
        }
    }

}





























