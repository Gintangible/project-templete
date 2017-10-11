;( function ( global, factory ) {
    
    "use strict"; //严格模式

    //做cmd 挂载
    if( typeof module === "object" && typeof  module.exports === "object" ){
        module.exports = global.document ? factory( global, true ) :
            function ( w ) {
                if( !w.document ){
                    throw new Error("xQuery requires a window with a document");
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
        // xQuery对象不是通过 new xQuery 创建的，而是通过 new xQuery.fn.init 创建的
        //xQuery对象就是xQuery.fn.init对象
        //构造xQuery对象
        xQuery = function ( selector, context ) {
            return new xQuery.fn.init( selector, context );
        };



        //xQuery对象原型
        xQuery.fn = xQuery.prototype = {

            xquery : version,

            constructor: xQuery,

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
                var ret = xQuery.merge( this.constructor(), elems );

                ret.prevObject = this;

                return ret;
            },

            //对匹配集合中的每个元素执行回调。
            each : function ( callback ) {
                return xQuery.each( this, callback );
            },

            map : function () {
                return this.pushStack( xQuery.map( this, function ( elem, i ) {
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

            // 内部调用，表现为原声，而不是xQuery method
            push: push,
            sort: arr.sort,
            splice: arr.splice
        };
});
