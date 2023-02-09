import Vue from 'vue'
import store from './store'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import {postRequest} from "@/utils/api";
import {putRequest} from "@/utils/api";
import {getRequest} from "@/utils/api";
import {deleteRequest} from "@/utils/api";
import {uploadImgRequest} from "@/utils/api";
import 'font-awesome/css/font-awesome.css';
import {downLoadRequest} from "@/utils/download";
import {initMenu} from "@/utils/menus";
import UserInfo from "@/views/UserInfo";

Vue.config.productionTip = false
Vue.use(ElementUI, {size: 'small'})

//插件形式使用请求
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.downLoadRequest = downLoadRequest;
Vue.prototype.uploadImgRequest = uploadImgRequest;

router.beforeEach((to, from, next) => {
    // if (window.sessionStorage.getItem('tokenStr')) {
    //     initMenu(router,store);
    //     //判断用户信息是否存在
    //     if (!window.sessionStorage.getItem('user')) {
    //         return getRequest('/admin/info').then(resp => {
    //             if (resp) {
    //                 //存入用户信息
    //                 window.sessionStorage.setItem('user', JSON.stringify(resp));
    //                 store.commit('INIT_ADMIN', resp);
    //                 next();
    //             }
    //         })
    //     }
    //     next();
    // } else {
    //     if (to.path == '/') {
    //         next();
    //     } else {
    //         next('/?redirect=' + to.path);
    //     }
    //     next();
    // }

    // alert("00")
    if (window.sessionStorage.getItem('tokenStr')) {
        initMenu(router, store);
        if (!window.sessionStorage.getItem('user')) {
            //连接websocket
            console.log('连接websocket');
            store.dispatch('connect');
            return getRequest('/user/info').then(resp=>{
                if(resp){
                    window.sessionStorage.setItem('user', JSON.stringify(resp));
                    store.commit('INIT_ADMIN', resp);
                    // alert("你倒是next啊1")
                    next('/home');
                }
            })
        }else {
            console.log(JSON.parse(window.sessionStorage.getItem('user')));
            console.log(store.state.currentAdmin);
            store.commit('INIT_ADMIN', JSON.parse(window.sessionStorage.getItem('user')));
            console.log(store.state.currentAdmin);

        }

        // alert("你倒是next啊3")
        next();
    }
    else {
        if (to.path == '/') {
            // alert("你倒是next啊4")
            next();
        } else {
            // alert("你倒是next啊4")
            next('/?redirect=' + to.path);
        }
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
