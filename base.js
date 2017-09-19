var doc = document,

    isPC = function(){

            var ua = navigator.userAgent,

                Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"],

                len = Agents.length,

                flag = true,

                v = 0;

            for(; v < len; v++) {

                if (ua.indexOf(Agents[v]) > -1){

                    flag = false;

                    break;
                }
            }


            if(!flag) window.location.href = 'www.baidu.com';

    }(),

    query = {
            
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
        }()

    };
