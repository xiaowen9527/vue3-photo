// jsonp.js
function jsonp(url, options = {}) {
    return new Promise((resolve, reject) => {
        // 生成一个唯一的回调函数名
        const callbackName = `jsonp_callback_${Math.round(100000 * Math.random())}`;
        // 创建一个 script 标签
        const script = document.createElement('script');

        // 处理请求成功的情况
        window[callbackName] = function (data) {
            // 清除全局函数和 script 标签
            delete window[callbackName];
            document.body.removeChild(script);
            resolve(data);
        };

        // 处理请求失败的情况
        script.onerror = function () {
            // 清除全局函数和 script 标签
            delete window[callbackName];
            document.body.removeChild(script);
            reject(new Error('JSONP 请求失败'));
        };

        // 构建完整的请求 URL，添加回调函数名作为参数
        let queryString = '';
        if (options.params) {
            const params = [];
            for (const key in options.params) {
                if (options.params.hasOwnProperty(key)) {
                    params.push(`${encodeURIComponent(key)}=${encodeURIComponent(options.params[key])}`);
                }
            }
            queryString = params.length > 0 ? `&${params.join('&')}` : '';
        }
        script.src = `${url}?callback=${callbackName}${queryString}`;

        // 将 script 标签添加到页面中
        document.body.appendChild(script);
    });
}

export default jsonp;