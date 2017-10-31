;( function ( global, factory ) {
    
    "use strict"; //严格模式

    //支持cmd and amd
    if( typeof module === "object" && typeof  module.exports === "object" ){
        module.exports = global.document ?
            factory( global, true ) :
            function ( w ) {
                if( !w.document ){
                    throw new Error("jQuery requires a window with a document");
                }else{
                    return factory( w );
                }
            };
    }else{
        factory( global );
    }
    
})( typeof window !== "undefined" ? window : this, function ( window, noGlobal ) {

    //jQuery的13大模块
    // 核心方法
    // 回调系统
    // 异步队列
    // 数据缓存
    // 队列操作
    // 选择器引
    // 属性操作
    // 节点遍历
    // 文档处理
    // 样式操作
    // 属性操作
    // 事件体系
    // AJAX交互
    // 动画引擎

    "use strict";

    var arr = [];

    var document = window.document;

    var getProto = Object.getPrototypeOf;

    var slice = arr.slice;

    var concat = arr.concat;

    var push = arr.push;

    var indexOf = arr.indexOf;


    var version = '1.0.0',
        // jQuery对象不是通过 new jQuery 创建的，而是通过 new jQuery.fn.init 创建的
        //jQuery对象就是jQueryy.fn.init对象
        //构造jQuery对象
        jQuery = function ( selector, context ) {
            return new jQuery.fn.init( selector, context );
        };

        //jQuery 数组方法
        jQuery.fn = jQuery.prototype = {

            jquery : version,

            constructor: jQuery,

            //jQuery对象默认长度为0
            length: 0,

            //将类数组转换为数组
            toArray : function () {
                return slice.call( this );
            },

            //同上
            get : function ( num ) {

                if( num == null ){//undefined ==  null true
                    return slice.call( this );
                }
                //返回某一具体元素
                return num < 0 ? this[ num + this.length ] : this[ num ];
            },

            //把数组中的元素，把它推到堆栈
            //（返回新的元素集）
            pushStack : function ( elems ) {
                //建立新的匹配的元素
                var ret = jQuery.merge( this.constructor(), elems );

                ret.prevObject = this;

                return ret;
            },

            //对匹配集合中的每个元素执行回调。
            each : function ( callback ) {
                return jQuery.each( this, callback );
            },

            map : function () {
                return this.pushStack( jQuery.map( this, function ( elem, i ) {
                    return callback.call( elem, i, elem );
                } ) );
            },

            slice : function () {
                return this.pushStack( slice.apply( this, arguments ) )
            },

            first : function () {
                return this.eq( 0 );
            },

            last : function () {
                return this.eq( -1 );
            },

            eq : function ( i ) {
                var len = this.length,
                    j = + i + ( i < 0 ? len : 0 );
                return this.pushStack( j >= 0 && j < len ? [ this[j] ] : []  );
            },

            end : function () {
              return this.prevObject || this.constructor();
            },

            // 内部调用，表现为原声，而不是jQuery method
            push: push,
            sort: arr.sort,
            splice: arr.splice
        };

        //jQuery 扩展函数
        jQuery.extend = jQuery.fn.extend = function () {
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},// 常见用法 jQuery.extend( obj1, obj2 )，此时，target为arguments[0]
                i= 1,
                length = arguments.length,//arguments对象的长度是由实参个数而不是形参个数决定的。
                deep = false;

            //处理深拷贝情况
            if( typeof target === "boolean"){// 如果第一个参数为true，即 jQuery.extend( true, obj1, obj2 ); 的情况
                deep = target;// 此时target是true
                target = arguments[i] || {};//target 改为 obj1， i = 1
                i++; //i = 2
            }

            //target为字符串时（可能是深层copy）
            if( typeof target !== "object" && !jQuery.isFunction( target ) ){ // 处理奇怪的情况，比如 jQuery.extend( 'hello' , {nick: 'casper})
                target ={};
            }

            //仅有一个参数时，扩展jQuery本身
            if( i === length ){// 处理这种情况 jQuery.extend(obj)，或 jQuery.fn.extend( obj )
                target = this; // jQuery.extend时，this指的是jQuery；jQuery.fn.extend时，this指的是jQuery.fn
                i--;
            }

            for( ; i < length; i++ ){

                //只处理非空/未定义的值
                if( ( options = arguments[i]) != null ){ // 比如 jQuery.extend( obj1, obj2, obj3, ojb4 )，options则为 obj2、obj3...

                    //扩展基础对象
                    for( name in options ){
                        src = target[name];
                        copy = options[name];

                        if( target === copy ){// 防止自引用
                            continue;s
                        }

                        // 如果是深拷贝，且被拷贝的属性值本身是个对象
                        if( deep && copy && ( jQuery.isPlainObject( copy ) || ( copyIsArray = Array.isArray( copy ) ) ) ){
                            if( copyIsArray ){// 被拷贝的属性值是个数组
                                // 将copyIsArray重新设置为false，为下次遍历做准备。
                                copyIsArray = false;
                                clone = src && Array.isArray( src ) ? src : [];
                            } else { //被拷贝的属性值是个plainObject，比如{ nick: 'casper' }
                                clone = src && jQuery.isPlainObject( src ) ? src : {};
                            }

                            target[name] = jQuery.extend( deep, clone, copy );// 递归~

                        } else if ( copy !== undefined ){// 浅拷贝，则直接把copy（第i个被扩展对象中被遍历的那个键的值）
                            target[name] = copy;
                        }

                    }

                }
            }

            // 原对象被改变，因此如果不想改变原对象，target可传入{}
            return target;

        };


        //jQuery 类型检测
        jQuery.extend({

            noop : function () {},

            isFunction : function ( obj ) {
                return jQuery.type( obj ) === "function";
            },

            isWindow : function ( obj ) {
                return obj != null && obj === obj.window;
            }
        })




    window.jQuery = window.$ = jQuery;


    return jQuery;
});
