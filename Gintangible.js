;(function ( window, undefined ) {//确保undefined是真的未定义，不同浏览器下undefined可能被重写

    var xQuery = ( function () {

        // xQuery对象不是通过 new xQuery 创建的，而是通过 new xQuery.fn.init 创建的
        //xQuery对象就是xQuery.fn.init对象
        //构造xQuery对象
        var xQuery = function ( selector, context ) {
            return new xQuery.fn.init( selector, context, rootxQuery );
        };
        
        //xQuery对象原型
        xQuery.fn = xQuery.prototype = {
            constructor: xQuery,
            init : function ( selector, context, rootxQuery ) {
                // selector有以下7种分支情况：
                // DOM元素
                // body（优化）
                // 字符串：HTML标签、HTML字符串、#id、选择器表达式
                // 函数（作为ready回调函数）
                // 最后返回伪数组
            }
        };


        // Give the init function the xQuery prototype for later instantiation
        xQuery.fn.init.prototype = xQuery.fn;


        // 合并内容到第一个参数中，后续大部分功能都通过该函数扩展
        // 通过xQuery.fn.extend扩展的函数，大部分都会调用通过xQuery.extend扩展的同名函数

        // 如果传入两个或多个对象，所有对象的属性会被添加到第一个对象target

        // 如果只传入一个对象，则将对象的属性添加到xQuery对象中。
        // 用这种方式，我们可以为xQuery命名空间增加新的方法。可以用于编写xQuery插件。
        // 如果不想改变传入的对象，可以传入一个空对象：G.extend({}, object1, object2);
        // 默认合并操作是不迭代的，即便target的某个属性是对象或属性，也会被完全覆盖而不是合并
        // 第一个参数是true，则会迭代合并
        // 从object原型继承的属性会被拷贝
        // undefined值不会被拷贝
        // 因为性能原因，JavaScript自带类型的属性不会合并

        // xQuery.extend( target, [ object1 ], [ objectN ] )
        // xQuery.extend( [ deep ], target, object1, [ objectN ] )
        xQuery.extend = xQuery.fn.extend = function () {
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            // 如果第一个参数是boolean型，可能是深度拷贝
            if( typeof target === 'boolean'){
                deep = target;
                target = arguments[1] || {};
                // skip the boolean and the target
                // 跳过boolean和target，从第3个开始
                i++;
            }

            // Handle case when target is a string or something (possible in deep copy)
            // target不是对象也不是函数，则强制设置为空对象
            if( typeof target !== 'object' && !xQuery.isFunction( target )){
                target = {};
            }

            // extend xQuery itself if only one argument is passed
            // 如果只传入一个参数，则认为是对xQuery扩展
            if( i === length ){
                target = this;
                --i;
            }

            for( ; i < length; i++ ){
                // Only deal with non-null/undefined values
                // 只处理非空参数
                if( (options = arguments[i]) != null ){
                    for( name in options ){
                        src = target[name];
                        copy = options[name];

                        // Prevent never-ending loop
                        // 避免循环引用
                        if( target === copy ){
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        // 深度拷贝且值是纯对象或数组，则递归
                        if( deep && copy && ( xQuery.isPlainObject(copy) || ( copyIsArray = xQuery.isArray(copy) ) ) ){
                            //如果copy是数组
                            if( copyIsArray ){
                                copyIsArray = false;
                                //clone为src的修正值
                                clone = src && xQuery.isArray( src ) ? src : [];
                            //如果copy是对象
                            }else{
                                //clone为src的修正值
                                clone = src && xQuery.isPlainObject( src ) ? src : {};
                            }

                            // Never move original objects, clone them
                            // 递归调用xQuery.extend
                            target[name] = xQuery.extend( deep, clone, copy );

                            // Don't bring in undefined values
                            // 不能拷贝空值
                        }else if( copy !== undefined ){
                            target[name] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            // 返回更改后的对象
            return target;
        };


        // 在xQuery上扩展静态方法
        xQuery.extend({
            // ready bindReady
            // isPlainObject isEmptyObject
            // parseJSON parseXML
            // globalEval
            // each makeArray inArray merge grep map
            // proxy
            // access
            // uaMatch
            // sub
            // browser
        });

        return xQuery;

    })();


    // 扩展工具函数 Utilities
    xQuery.extend({
        // http://www.w3school.com.cn/jquery/core_noconflict.asp
        // 释放G的 xQuery 控制权
        // 许多 JavaScript 库使用 $ 作为函数或变量名，xQuery 也一样。
        // 在 xQuery 中，$ 仅仅是 xQuery 的别名，因此即使不使用 $ 也能保证所有功能性。
        // 假如我们需要使用 xQuery 之外的另一 JavaScript 库，我们可以通过调用 $.noConflict() 向该库返回控制权。

        // 通过向该方法传递参数 true，我们可以将 $ 和 xQuery 的控制权都交还给另一JavaScript库。
        noConflict : function ( deep ) {
            //交出$的控制权
            if( window.$ === xQuery ){
                window.$ = _$;
            }
            //交出xQuery的控制权
            if( deep && window.xQuery === xQuery ){
                window.xQuery = _xQuery;
            }

            return xQuery;
        },

        // Is the DOM ready to be used? Set to true once it occurs.
        //ready 事件
        isReady : false,

        // A counter to track how many items to wait for before
        // the ready event fires. See #6781
        // 一个计数器，用于跟踪在ready事件出发前的等待次数
        readyWait : 1,


        // Hold (or release) the ready event
        // 继续等待或触发
        holdReady : function ( hold ) {
            if( hold ){
                xQuery.readyWait++;
            }else{
                xQuery.ready( true );
            }
        },

        // Handle when the DOM is ready
        //文档加载完毕句柄
        // http://www.cnblogs.com/fjzhou/archive/2011/05/31/jquery-source-4.html
        ready : function ( wait ) {
            // Either a released hold or an DOMready/load event and not yet ready
            //发布或Domready/加载事件尚未准备好
            if( ( wait === true && !--xQuery.readyWait ) || ( wait !== true && !xQuery.isReady )){

                // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                // 确保document.body存在
                if( !document.body ){
                    return setTimeout( xQuery.ready, 1 );
                }

                // Remember that the DOM is ready
                xQuery.isReady = true;

                // If a normal DOM Ready event fired, decrement, and wait if need be
                if( wait !== true && --xQuery.readyWait > 0 ){
                    return;
                }

                //If there are functions bound, to execute
                readyList.resolveWith( document, [xQuery] );

                // Trigger any bound ready events
                if( xQuery.fn.trigger ){
                    xQuery( document ).trigger( "ready" ).unbind( "ready" );
                }
            }
        },

        //初始化readyList事件处理函数队列
        //兼容不同浏览器对绑定事件的区别
        bindReady : function () {
            if( readList ){
                return;
            }

            readList = xQuery._Deferred();

            // Catch cases where $(document).ready() is called after the
            // browser event has already occurred.
            if( document.readyState === 'complete' ){
                // Handle it asynchronously to allow scripts the opportunity to delay ready
                return setTimeout( xQuery.ready, 1 );
            }

            // Mozilla, Opera and webkit nightlies currently support this event
            // 兼容事件，通过检测浏览器的功能特性，而非嗅探浏览器
            if ( document.addEventListener ) {
                // Use the handy event callback
                // 使用较快的加载完毕事件
                document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

                // A fallback to window.onload, that will always work
                // 注册window.onload回调函数
                window.addEventListener( "load", xQuery.ready, false );

                // If IE event model is used
            } else if ( document.attachEvent ) {
                // ensure firing before onload,
                // maybe late but safe also for iframes
                // 确保在onload之前触发onreadystatechange，可能慢一些但是对iframes更安全
                document.attachEvent( "onreadystatechange", DOMContentLoaded );

                // A fallback to window.onload, that will always work
                // 注册window.onload回调函数
                window.attachEvent( "onload", xQuery.ready );

                // If IE and not a frame
                // continually check to see if the document is ready
                var toplevel = false;

                try {
                    toplevel = window.frameElement == null;
                } catch(e) {}

                if ( document.documentElement.doScroll && toplevel ) {
                    doScrollCheck();
                }
            }

        },

        //是否是函数
        isFunction : function ( obj ) {
            return xQuery.type( obj ) === "function";
        },

        //是否是数组
        isArray : Array.isArray || function ( obj ) {
            return xQuery.type( obj ) === "array";
        },

        //简单判断（判断setInterval属性）是否是window 对象
        isWindow : function ( obj ) {
            return obj && typeof obj === 'object' && 'setInterval' in obj;
        },

        //是否是NaN
        isNaN : function ( obj ) {
            //等于null 或不是数字或调用window.isNaN 判断
            return obj === null || !rdigit.test( obj ) || isNaN( obj );
        },
        
        //获取对象的类型
        type : function ( obj ) {
            // 通过核心API创建一个对象，不需要new关键字
            // 普通函数不行
            // 调用Object.prototype.toString方法，生成 "[object Xxx]"格式的字符串
            // class2type[ "[object " + name + "]" ] = name.toLowerCase();
            return obj == null ?
                String( obj ) :
                class2type[ toString.call( obj ) ] || 'object';
        },


        // 检查obj是否是一个纯粹的对象（通过"{}" 或 "new Object"创建的对象）
        isPlainObject : function ( obj ) {
            if( !obj || xQuery.type( obj ) !== 'object' || obj.nodeType || xQuery.isWindow( obj ) ){
                return false;
            }

            // Not own constructor property must be Object
            // 测试constructor属性
            // 具有构造函数constructor，却不是自身的属性（即通过prototype继承的）
            if( obj.constructor && !hasOwn.call( obj, 'constructor' ) && !hasOwn.call( obj.constructor.prototype, 'isPrototypeOf' ) ){
                return false;
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.

            var key;
            for( key in obj ){}
            // key === undefined及不存在任何属性，认为是简单的纯对象
            // hasOwn.call( obj, key ) 属性key不为空，且属性key的对象自身的（即不是通过prototype继承的）
            return key === undefined || hasOwn.call( obj, key );
        },
        
        //是否是空对象
        isEmptyObject : function ( obj ) {
            for( var name in obj ){
                return false;
            }
            return true;
        },

        // 抛出一个异常
        error : function ( msg ) {
            throw msg;
        },

        // Cross-browser xml parsing
        // (xml & tmp used internally)
        // 解析XML 跨浏览器
        // parseXML函数也主要是标准API和IE的封装。
        // 标准API是DOMParser对象。
        // 而IE使用的是Microsoft.XMLDOM的 ActiveXObject对象。

        parseXML : function ( data ) {
            var xml;
            if( !data || typeof data !== 'string' ){
                return null;
            }

            // Support: IE 9 - 11 only
            // IE throws on parseFromString with invalid input.
            try {
                xml = ( new window.DOMParser() ).parseFromString( data, 'text/xml' );
            }catch ( e ){
                xml = undefined;
            }

            if( !xml || xml.getElementsByTagName( 'parsererror').length ){
                xQuery.error( "Invalid XML: " + data );
            }
            return xml;
        },

        //无操作函数
        noop : function () {},

        // Evaluates a script in a global context
        // Workarounds based on findings by Jim Driscoll
        // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
        // globalEval函数把一段脚本加载到全局context（window）中。
        // IE中可以使用window.execScript。
        // 其他浏览器 需要使用eval。
        // 因为整个xQuery代码都是一整个匿名函数，所以当前context是xQuery，如果要将上下文设置为window则需使用globalEval。
        globalEval : function ( data ) {
            //data 非空
            if( data && rnotWhite.test( data ) ){
                ( window.execScript || function ( data ) {
                    window[ "eval" ].call( window, data );
                })( data );
            }
        },

        //判断节点名称是否相同
        nodeName : function ( ele, name ) {
            //忽略大小写
            return ele.nodeName && ele.nodeName.toUpperCase() === name.toUpperCase();
         },

        // args is for internal usage only
        // 遍历对象或数组
        each : function ( object, callback, args ) {
            var name, i
        }

    });




    // 异步队列 Deferred
    // 浏览器测试 Support
    // 数据缓存 Data
    // 队列 queue
    // 属性操作 Attribute
    // 事件处理 Event
    // 选择器 Sizzle
    // DOM遍历
    // DOM操作
    // CSS操作
    // 异步请求 Ajax
    // 动画 FX
    // 坐标和大小

    window.xQuery = window.$ = window.G = xQuery;

})( window );