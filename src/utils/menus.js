import {getRequest} from "@/utils/api";
import router from "@/router";

export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return;
    }

    getRequest('/system/config/menu').then(data => {
        if (data) {
            //格式化Routes
            let fmtRoutes = formatRoutes(data);
            //添加到router
            router.addRoutes(fmtRoutes);
            //将数据存入vuex
            store.commit('initRoutes', fmtRoutes);

        }
    })
}

export const formatRoutes = (routes) => {
    let fmtRoutes = [];
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            iconCls,
            children,
        } = router;
        if (children && children instanceof Array) {
            //递归
            children = formatRoutes(children);
        }
        let fmtRouter = {
            path: path,
            name: name,
            iconCls: iconCls,
            children: children,
            component(resolve) {
                if (component.startsWith('Home')) {
                    require(['../views/' + component + '.vue'], resolve);
                } else if (component.startsWith('Fin')) {
                    require(['../views/finance/' + component + '.vue'], resolve);
                } else if (component.startsWith('Off')) {
                    require(['../views/office/' + component + '.vue'], resolve);
                } else if (component.startsWith('Sys')) {
                    require(['../views/system/' + component + '.vue'], resolve);
                } else if (component.startsWith('User')) {
                    require(['../views/user/' + component + '.vue'], resolve);
                }
            }
        }
        fmtRoutes.push(fmtRouter)

    });
    // console.log(fmtRoutes);
    return fmtRoutes;
}
