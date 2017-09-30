/*
 * 调用:
 *    lazyload({
 *        elem : [Y.$id(xx).getElementsByTagName('img'),Y.$id(xx2).getElementsByTagName('img')],
 *        original : 'data-original',
 *
 *    });
 */
lazyload = function( config ){
   // var config = {
   //      ele        :   obj.ele,
   //      original    :  obj.original || 'data-src', // String          存放图片真实地址的属性
   //      animate      :   animate,      // Boolean        是否使用fadeIn效果来显示
   //  };

   var doc = document,
       doc_body = doc.body || doc.documentElement,
       ele = config.ele || doc,//lazy加载父级容器
       imgAry = [], //lazy元素数组
       original = config.original || 'data-src',
       lazyNum = 0, //已加载的数量
       heightAry = [],//图片高度的数组集合
       distance = config.distance || 200,//lazy加载距离
       animate = config.animate;

   function initElementMap() { //遍历获取图片集合
       var imgs = ele.querySelectorAll('img[' + original +']'),
           i, j, len, lylen;
       //获取lazy图数组
       for(i = 0, len = imgs.length; i < len; i++){
           imgAry.push( imgs[i] );
       }

       //获取lazy图片的scrollTop数组集合
       for( j = 0, lylen = imgAry.length; j < lylen; j++){
            heightAry.push( getEleTop(imgAry[j]) );
            lazyNum++;
       }
   }
   
   function loader() {
        if( !lazyNum ) return;//无lazy图
        var getScrollTop = doc_body.scrollTop,
            height = doc_body.clientHeight,//显示窗口页面高度
            downScrollTop = getScrollTop + height,//页面底部到页面顶部的距离
            imgShowHeight = distance + downScrollTop,//图片显示的高度
            l,len;

        for( l = 0, len = imgAry.length; l < len; l++){
            if( imgShowHeight > heightAry[l]){
                imgAry[l].src = imgAry[l].getAttribute(original);
                imgAry[l].removeAttribute(original);
                lazyNum --;
            }
       }
       
   }

   function getEleTop( element ) {//获取元素到页面顶部距离
        if( arguments.length != 1 || element == null ){
            return null;
        }
        var offsetTop = element.offsetTop,
            parent = element.offsetParent;
        while( parent !== null ){
            offsetTop += parent.offsetTop;
            parent = parent.offsetParent;
        }
        return offsetTop;
   }


    function init() {
        initElementMap();
        loader();
    }

    //绑定事件,依赖base
    query.add(window,'scroll', init);

};