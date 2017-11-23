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
    //sizzle: 复杂选择器 (539-2793)
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
        // Matches dashed string for camelizing ie
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
                        continue;
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
    //jQuery 扩展函数end


    //jQuery 扩展工具 检测变量等
    jQuery.extend({

        //页面上的jQuery 副本都是唯一的 Unique for each copy of jQuery on the page
        expando : "jQuery" + ( version + Math.random() ).replace( /\D/g, "  "), //\D匹配一个非字数字符

        // 假设jqery ready 已加载完成
        isReady : true,

        error : function( msg ){
            throw new Error( msg );
        },

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
        // Support: IE <=9 - 11, Edge 12 - 13  ms->Ms 
        // Microsoft forgot to hump their vendor prefix (#9572)
        camelcase : function ( string ) {
            return string.replace( rmsPrefix, "ms-").replace( rdashAlpha, fcamelCase );
        },

        each : function ( obj, callback ) {
            var length, i = 0;

            if( isArrayLike( obj ) ){
                length = obj.length;
                for(; i < length; i++){
                    if( callback.call( obj[i], i, obj[i] ) === false ){
                        break;
                    }
                }
            }else{
                for( i in obj ){
                    if( callback.call( obj[i], i, obj[i] ) === false ){
                        break;
                    }
                }
            }

            return obj;
        },

        //support: Android <= 4.0 only
        trim : function( text ){
            return text === null ? "" : ( text + "").replace( rtrim, "" );
        },

        // results is for internal usage only 仅在内部使用
        makeArray : function( arr, results ){
            var ret = results || [];

            if( arr !== null ){
                if( isArrayLike( Object( arr ) ) ){
                    jQuery.merge( ret, typeof arr === "string" ? [arr] : arr );
                }else{
                    push.call( ret, arr );
                }
            }
            
            return ret;
        },

        inArray : function( elem, arr, i ){
            return arr == null ? -1 : indexOf.call( arr, elem, i );
        },

        // Support: Android <=4.0 only, PhantomJS 1 only
        // push.apply(_, arraylike) throws on ancient WebKit
        merge : function( first, second ){
            var len = +second.length,
                j = 0,
                i = first.length;
            for( ; j < len; j++ ){
                first[i++] = second[j];
            }

            first.length = i;

            return first;
        },



        grep : function( elems, callback, invert ){
            var callbackInverse,
                matches = [],
                i = 0,
                length = elems.length,
                callbackExpect = !invert;

            // Go through the array, only saving the items 通过数组，只保存条目
            // that pass the validator function 通过验证函数
            for( ; i < length; i++ ){
                callbackExpect = !callback( elems[i], i );
                if( callbackExpect !== callbackExpect ){
                    matches.push( elems[i] );
                }
            }
            return matches;
        },

        // arg is for internal usage only 仅内部使用
        map : function( elems, callback, arg ){
            var length, value,
                i = 0,
                ret = [];

            //arg
            if( isArrayLike( elems ) ){
                length = elems.length;
                for( ; i < length; i++ ){
                    value = callback( elems[i], i, arg );

                    if( value != null ){
                        ret.push( value );
                    }
                }
            }else{
                // object
                for( i in elems ){
                    value = callback( elems[i], i, arg );

                    if( value != null ){
                        ret.push( value );
                    }
                }
            }
            
            // Flatten any nested arrays 对任意嵌套数组进行扁平化
            return concat.apply( [], ret );
        },

        

        // A global GUID counter for objects    对象的全局GUID计数器
        guid: 1,
        // Bind a function to a context, optionally partially applying any 将函数绑定到上下文，可以部分地应用任何
        // arguments.
        proxy : function( fn, context ){
            var tmp, args, proxy;
            
            if( typeof context === "string" ){
                tmp = fn[context];
                context = fn;
                fn = tmp;
            }


            // Quick check to determine if target is callable, in the spec 快速检查以确定目标是否可调用，在规范中
            // this throws a TypeError, but we will just return undefined. 该抛出TypeError，但我们只会返回未定义。
            if( !jQuery.isFunction( fn ) ){
                return undefined;
            }

            // Simulated bind
            args = slice.call( arguments, 2 );
            proxy = function(){
                return fn.apply( context || this, args.concat( slice.call( arguments )) );
            };

            //Set the guid of unique handler to the same of original handler, so it can be remove 局部计数，故可删除
            proxy.guid = fn.guid = fn.guid || jQuery.guid++;

            return proxy;

        },

        now : Date.now,

        // jQuery.support is not used in Core but other projects attach their jquery.support不用于其他项目的核心但重视他们
        // properties to it so it needs to exist.  属性，所以它需要存在
        support: support

    });
         //jQuery 扩展工具end

        //?? 作用不明
        if( typeof Symbol === "function" ){
            jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
        }

        // 扩展class2type
        jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function( i, name ){
            class2type["[Object " + name + "]"] = name.toLowerCase();
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
    };


    //sizzle: 复杂选择器
    //可取出
    var Sizzle = (function( window ){
            var i, 
                support,
                Expr,
                getText,
                isXML,
                tokenize,
                compile,
                select,
                outermostContext,
                sortInput,
                hasDuplicate,

                //本地变量
                setDocument,
                documend,
                docElem,
                documentIsHTML,
                rbuggyQSA,
                rbuggyMatches,
                matches,
                contains,

            	// Instance-specific data
                expando = "sizzle" + 1 * new Date(),
                preferredDoc = window.document,
                dirruns = 0, 
                done = 0,
                classCache = createCache(),
                tokenCache = createCache(),
                compilerCache = createCache(),
                sortOrder = function( a, b ){
                    if( a === b ){
                        hasDuplicate = true;
                    }
                    return 0;
                },


                // Instance methods
                hasOwn = ({}).hasOwnProperty,
                arr = [],
                pop = arr.pop,
                push_native = arr.push,
                push = arr.push,
                slice = arr.slice,

                //使用一个精简的 idnexOf 比其原生速度快
                indexOf = function( list, elem ){
                    var i = 0,
                        len = list.length;
                
                    for( ; i < len; i++ ){
                        if( list[i] === elem ){
                            return i;
                        }
                    }
                    return -1;
                },

                
                booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

                //RegExp
                whitespace = "[\\x20\\t\\r\\n\\f]",

                identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])",

                // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
                attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
                    // Operator (capture 2)
                    "*([*^$|!~]?=)" + whitespace +
                    // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
                    "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
                    "*\\]",

                    pseudos = ":(" + identifier + ")(?:\\((" +
                        // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
                        // 1. quoted (capture 3; capture 4 or capture 5)
                        "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
                        // 2. simple (capture 6)
                        "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
                        // 3. anything else (capture 2)
                        ".*" +
                        ")\\)|)",

                    // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
                    rwhitespace = new RegExp( whitespace + "+", "g" ),
                    rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

                    rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
                    rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

                    rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

                    rpseudo = new RegExp( pseudos ),
                    ridentifier = new RegExp( "^" + identifier + "$" );







        return Sizzle;
    })( window );
    // sizzle end 



    window.jQuery = window.G = jQuery;


    return jQuery;
});
