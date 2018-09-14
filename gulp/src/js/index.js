var div = document.createElement('div');

div.innerHTML = 'appendChild';
div.className = 'append';

document.body.appendChild(div);


! function() {
    /**
     * 判断浏览器是否支持user-select样式
     */
    var supportUserSelect = function() {
        var style = document.body.style,
            props = ['userSelect', 'msUserSelect'],
            i, l, ret = false;
        for (i = 0, l = props.length; i < l; i++) {
            if (style[props[i]] !== undefined) {
                ret = true;
                break;
            }
        }
        return ret;
    };
    // 如果用户不支持user-select那么就做兼容处理
    if (!supportUserSelect()) {
        document.body.onselectstart = function() {
            return false;
        };
    }
}();
