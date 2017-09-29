/*
 * 调用:
 *    lazyload({
 *        elem : [Y.$id(xx).getElementsByTagName('img'),Y.$id(xx2).getElementsByTagName('img')],
 *        original : 'data-original',
 *        container : 'document',
 *        event : 'scroll',
 *        fadeIn : true
 *    });
 */
lazyload = function( config ){
   // var config = {
   //      ele        :   obj.ele,
   //      original    :  obj.original || 'data-src', // String          存放图片真实地址的属性
   //      container   :   ( config.container ? config.container : (document.body || document.documentElement) ),        // DOM / Selector 默认的容器为document，可自定义容器
   //      event       :   'scroll',   // String            触发事件类型，默认为window.onscroll事件
   //      animate      :   animate,      // Boolean        是否使用fadeIn效果来显示
   //  };

   var ele = config.ele,//lazy加载父级容器
       imgAry = [], //lazy元素数组
       original = config.original || 'data-src',
       doc = document.body || document.documentElement,
       lazyNum = 0, //已加载的数量
       loadObj = {},
       distance = config.distance || 200,//lazy加载距离
       animate = config.animate;

   function initElementMap() { //遍历获取图片集合
       var imgs = ele.querySelectorAll(ele + '[' + original +']'),
           i, j, len, lylen;

       //将需要lazy加载的图片放入一个数组
       for(i = 0; len = imgs.length; i < len; i++){
           imgAry.push( imgs[i] );
       }

       //获取lazy图片的scrollTop
       for( j = 0, lylen = imgAry.length; j < lylen; j++){
            var oImg = imgAry[j],
                eleTop = getEleTop(oImg);

            if( loadObj[eleTop] ){
                loadObj[eleTop].push( j );
            }else{
                //+++
                var topAry = [];
                topAry[0] = j;
                loadObj[eleTop] = topAry;
                lazyNum ++;
            }
       }
   }
   
   function loader() {
        if( !lazyNum ) return;//无lazy图
        var getScrollTop = doc.scrollTop,
            height = doc.clientHeight,//显示窗口页面高度
            downTop = getScrollTop + height;





       
   }

   function getEleTop( element ) {//获取元素到页面顶部距离
        if( arguments.length != 1 || element == null ){
            return null;
        }
        var offsetTop = element.offsetTop,
            parent = element.offsetParent;
        while( parnet !== null ){
            offsetTop += parent.offsetTop;
            parent = parent.offsetParent;
        }
        return offsetTop;
   }





    function init() {
        initElementMap();
        loader();
    }

    init();


};