;( function ( global, factory ) {
    
    "use strict"; //严格模式

    //做cmd 挂载
    if( typeof module === "object" && typeof  module.exports === "object" ){
        module.exports = global.document ? factory( global, true ) :
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
                target = arguments[0] || {},
                i= 1,
                length = arguments.length,
                deep = false;

            //处理深拷贝情况
            if( typeof target === "boolean"){
                deep = target;
                target = arguments[i] || {};
                i++;
            }

            //target为字符串时（可能是深层copy）
            if( typeof target !== "object" && !jQuery.isFunction( target ) ){
                target ={};
            }

            //仅有一个参数时，扩展jQuery本身
            if( i === length ){
                target = this;
                i--;
            }

            for( ; i < length; i++ ){

                //只处理非空/未定义的值
                if( ( options = arguments[i]) != null ){

                    //扩展基础对象
                    for( name in options ){
                        src = target[name];
                        copy = options[name];

                        //防止无止境循环
                        if( target === copy ){
                            continue;
                        }

                        //如果合并普通对象或数组，进行递归
                        if( deep && copy && ( jQuery.isPlainObject( copy ) || ( copyIsArray = Array.isArray( copy ) ) ) ){
                            if( copyIsArray ){
                                copyIsArray = false;
                                clone = src && Array.isArray( src ) ? src : [];
                            } else {
                                clone = src && jQuery.isPlainObject( src ) ? src : {};
                            }

                            //克隆原始对象
                            target[name] = jQuery.extend( deep, clone, copy );

                        } else if ( copy !== undefined ){
                            target[name] = copy;
                        }

                    }

                }


            }


            //返回修改的对象
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
});
