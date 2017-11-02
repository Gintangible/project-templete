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
    // 核心方法// 回调系统// 异步队列// 数据缓存// 队列操作// 选择器// 属性操作// 节点遍历// 文档处理// 样式操作// 属性操作// 事件体系// AJAX交互// 动画引擎
    //给jquery添加一些变量和方法  (100-194)
    // 核心方法 (196-264)
    //扩展工具  (265-510)
    //sizzle: 复杂选择器 (539-2805)?
    //callback: 回调系统    (3275-3467)  函数统一管理
    //Deferred：(异步队列)延迟对象   (3510-3850) 对异步的统一管理
    //support 功能检测(?-?)
    //数据缓存 data()   (-4225)
    //队列操作 queue    (4356-)
    //事件体系 event (4972-5612)
    //样式操作
    //动画引擎
    //属性操作

    "use strict";

    var arr = [];

    var document = window.document;

    var getProto = Object.getPrototypeOf;

    var slice = arr.slice;

    var concat = arr.concat;

    var push = arr.push;

    var indexOf = arr.indexOf;

    var class2type = {};

    var toString = class2type.toString;

    var hasOwn = class2type.hasOwnProperty;

    var fnToString = hasOwn.toString;

    var ObjectFunctionString = fnToString.call( Object );

    var support = {};


        function DOMEval( code, doc ) {
            doc = doc || document;
            var script = doc.createElement("script");
            script.text = code;
            doc.head.appendChild( script ).parentNode.removeChild( script );
        }

    //全局符号
    //在 .eslintrc.json 中定义全局会造成全局危险
    //在其他情况是有问题的，对本模块来说，是安全的




    var version = '1.0.0',
        // jQuery对象不是通过 new jQuery 创建的，而是通过 new jQuery.fn.init 创建的
        //jQuery对象就是jQueryy.fn.init对象
        //构造jQuery对象
        jQuery = function ( selector, context ) {
            return new jQuery.fn.init( selector, context );
        },

        // Support: Android <=4.0 only
        // Make sure we trim BOM and NBSP
        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

        // Matches dashed string for camelizing
        rmsPrefix = /^-ms-/,
        rdashAlpha = /-([a-z])/g,

        // Used by jQuery.camelCase as callback to replace()
        fcamelCase = function( all, letter ) {
            return letter.toUpperCase();
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


        //jQuery 扩展工具
        jQuery.extend({

            noop : function () {},

            isFunction : function ( obj ) {
                return jQuery.type( obj ) === "function";
            },

            isWindow : function ( obj ) {
                return obj != null && obj === obj.window;
            },
            
            isNumeric : function ( obj ) {//number + string number
                var type = jQuery.type( obj );
                return ( type === "number" || type === "string" ) &&
                        !isNaN( obj - parseFloat( obj ) );
            },

            //基本对象检测
            isPlainObject : function ( obj ) {
                var proto, Ctor;
                // 使用 negatives 检测
                // 使用原始对象方法而不是jquery.type
                if( !obj || toString.call( obj ) !== "[object Object]"){
                    return false;
                }
                proto = getProto( obj );

                //没有原型的对象（例如，对象“创建（空）”）是普通的。??
                if( !proto ){
                    return true;
                }

                //具有原型的对象是基本对象，它们是由全局对象函数构造的。
                Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
                return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
            },

            isEmptyObject: function ( obj ) {
                var name;
                for( name in obj ){
                    return false;
                }
                return true;
            },

            type : function ( obj ) {
                if( obj == null ){
                    return obj + "";//返回成字符串undefined
                }

                // Support: Android <=2.3 only (functionish RegExp)
                //class2type[ toString.call( obj ) ] ??为啥不直接使用 typeof
                return typeof obj === "object" || typeof obj === "function" ?
                        class2type[ toString.call( obj ) ] || "object" :
                        typeof obj;
            },

            //在全局上下文中执行脚本，
            globalEval : function ( code ) {
                DOMEval( code );
            },

            //转换为camelCase;供 css 和数据模块使用
            // Support: IE <=9 - 11, Edge 12 - 13
            // Microsoft forgot to hump their vendor prefix (#9572)
            camelcase : function ( string ) {
              return string.replace( rmsPrefix, "ms-").replace( rdashAlpha, fcamelCase );
            },

            each : function ( obj, callback ) {
                var lenght, i = 0;

                if( isArrayLike( obj ) ){

                }
            },



        });

        //判断是否是数组/类数组
        // Support: real iOS 8.2 only (not reproducible in simulator)
        // `in` check used to prevent JIT error (gh-2145)
        // hasOwn isn't used here due to false negatives
        // regarding Nodelist length in IE
        function isArrayLike( obj ) {
            var length = !!obj && "length" in obj && obj.length,
                type = jQuery.type( obj );

            if( type === "function" || jQuery.isWindow( obj ) ){
                return false;
            }
            return type === "array" || length === 0 || //数组、
                    typeof length === "number" && length > 0 && ( length - 1 ) in obj;

        }




    window.jQuery = window.$ = jQuery;


    return jQuery;
});
