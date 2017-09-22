var query = {
            
        add : function(){
            var isEvent = 'addEventListener' in document;
            return isEvent ? function(ele,type,handler){
                ele.addEventListener(type, handler, false);
            } : function(ele,type,handler){
                ele.attachEvent('on' + type,handler);
            };
        }(),

        remove : function(){
            var isEvent = 'addEventListener' in document;
            return isEvent ? function(ele,type,handler){
                ele.removeEventListener(type, handler, false);
            } : function(ele,type,handler){
                ele.detachEvent('on' + type,handler);
            };
        }(),
                
        getEvent : function(event){
            return event || window.event;
        },

        getTarget : function(event){
            var e  = query.getEvent(event);
            return e.target || e.srcElement;
        },

        preventDefault : function(event){
            var e  = query.getEvent(event);
            if(e.preventDefault){
                    e.preventDefault();
            }else{
                    e.returnValue = false;
            }
        },

        stopPropagation: function(event){
            var e  = query.getEvent(event);
            if(e.stopPropagation){
                    e.stopPropagation();
            }else{
                    e.cancelBubble = true;
            }
        },

        addClass : function(node,classname){
            if(node.classList){
                node.classList.add(classname);
            }else{
                if(node.className.indexOf(classname) == -1 ) node.className += ' ' + classname;
            }
        },

        removeClass : function(node,classname){
            if(node.classList){
                node.classList.remove(classname);
            }else{
                var reg = eval("/\\s*"+ classname +"/ig");
                node.className = node.className.replace(reg,'');
            }
        },

        getByClass : function(Classname,ele){
            var ele = ele ? ele : document;
            return ele.querySelectorAll ? ele.querySelectorAll('.'+Classname) : (function(ele){
                var ele = ele.getElementsByTagName('*'),
                    Result = [],
                    re = new RegExp('\\b'+Classname+'\\b','i'),
                    i = 0;
                    for(;i < ele.length;i++){
                        if(re.test(ele[i].className)){
                            Result.push(ele[i]);
                        }
                    }
                return Result;
            }(ele));
        },

        toArray:function(arr){
            var reduced = [];
            try{
                reduced = Array.prototype.slice.call(arr,0);
            }catch(ex){
                for (var i = 0,len = arr.length; i < len; i++){
                    reduced[i] = arr[i];
                }
            }
            return reduced;
        },

        forEach : function(){
            return  function(ary,callback){
                if(typeof Array.prototype.forEach == "function"){
                    ary.forEach(function(value,index,a){
                        callback.call(ary,value,index,a);
                    });
                }else{// 对于古董浏览器，如IE6-IE8
                    for(var k = 0, length = ary.length; k < length; k++) {
                        callback.call(ary,ary[k],k,ary);
                    }
                }
            };
        }(),

        getElementChildren : function(parent){//获取子元素
            var childNodes = parent.childNodes || [],
                doms = [], i, l;
            for(i = 0, l = childNodes.length; i < l; i++){
                childNodes[i].nodeType === 1 && doms.push(childNodes[i]);
            }
            return doms;
        },

        getBoundingClientRect : function( ele ){//元素left、right、top、bottom
            var rect = ele.getBoundingClientRect(),
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


        copyToClipboard : function (txt) {//复制
            if (window.clipboardData) {
                window.clipboardData.clearData();
                window.clipboardData.setData("Text", txt);
                alert("复制成功！")
            } else {
                alert("Copy to clipboard: Ctrl+C！");
            }

        },
        /**
         * set cookie
         * @param {String} name    [name]
         * @param {String} val    [value]
         * @param {number} days   [days]
         */
        setCookie : function ( name, value, days ) {
            var exdata = new Date();
            exdata.setDate( exdata.getDate() + ( days ? days : 30 ) );//默认一个月
            // exdata.setTime( exdata.getTime() + (expiredays * 24*60*60*1000) )
            //encodeURI 代替 escape
            document.cookie = name + '=' + encodeURI(value) +  ';expires=' + exdata.toGMTString();
        },

        /**
         * get cookie
         * @param  {String} name  [name]
         */
        getCookie : function ( name ) {
            if( document.cookie.length > 0 ){
                offset = document.cookie.indexOf( name + '=');
                if( offset != -1 ){
                    offset += name.length + 1;
                    end = document.cookie.indexOf( ';', offset );
                    if( end == -1 ) end = document.cookie.length;
                    //decodeURI 代替 unescape
                    return decodeURI( document.cookie.substring(offset, end) )
                }
                return '';
            }

            //方法二
            /*var arr,reg=new RegExp("(^| )"+ name + "=([^;]*)(;|$)");
            if( arr = document.cookie.match(reg) ){
                return decodeURI(arr[2]);
            }
             return null;*/
        },

        /**
         * del cookie
         * @param  {String} name  [name]
         */
        delCookie : function( name ){
            query.setCookie( name, "", -1) ;
        },

    },

    isPC = function(){

        var ua = navigator.userAgent,

            Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"],

            len = Agents.length,

            flag = true,

            i = 0;

        for(; i < len; i++) {

            if (ua.indexOf(Agents[i]) > -1){

                flag = false;

                break;
            }
        }


        if(!flag) window.location.href = 'www.baidu.com';

    };

