let proxyObj={}

proxyObj['/']={
    //websocket
    ws:false,
    //目标地址
    target:'http://localhost:8081',
    //发送请求host会被设置target
    changeOrigin:true,
    //不重写请求地址
    pathRewrite:{
        '^/':'/'
    }
};

proxyObj['/websocket']={
    ws: true,
    target: 'ws://localhost:8081'
    // changeOrigin: true,
    // pathRewrite: {
    //     '^/ws':'/'
    // }
};

module.exports={
    devServer:{
        host:'localhost',
        port:8080,
        proxy:proxyObj
    }
}
