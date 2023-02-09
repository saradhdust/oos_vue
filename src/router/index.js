import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from "@/views/Home";
import Test1 from "@/views/Test1";
import Test2 from "@/views/Test2";
import EmpBasic from "@/views/emp/EmpBasic";
import EmpAdv from "@/views/emp/EmpAdv";
import PerEc from "@/views/per/PerEc";
import PerEmp from "@/views/per/PerEmp";
import PerMv from "@/views/per/PerMv";
import PerSalary from "@/views/per/PerSalary";
import PerTrain from "@/views/per/PerTrain";
import SalSob from "@/views/sal/SalSob";
import SalSobCfg from "@/views/sal/SalSobCfg";
import SalTable from "@/views/sal/SalTable";
import SalMonth from "@/views/sal/SalMonth";
import SalSearch from "@/views/sal/SalSearch";
import StaAll from "@/views/sta/StaAll";
import StaPers from "@/views/sta/StaPers";
import StaScore from "@/views/sta/StaScore";
import StaRecord from "@/views/sta/StaRecord";
import SysBasic from "@/views/sys/SysBasic";
import SysConfig from "@/views/sys/SysConfig";
import SysLog from "@/views/sys/SysLog";
import SysAdmin from "@/views/sys/SysAdmin";
import SysData from "@/views/sys/SysData";
import SysInit from "@/views/sys/SysInit";
import FriendChat from "@/views/chat/FriendChat";
import UserInfo from "@/views/UserInfo";

Vue.use(VueRouter);
// 解决编程式路由往同一地址跳转时会报错的情况
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;

// push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject)
        return originalPush.call(this, location, onResolve, onReject);
    return originalPush.call(this, location).catch(err => err);
};

//replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
    if (onResolve || onReject)
        return originalReplace.call(this, location, onResolve, onReject);
    return originalReplace.call(this, location).catch(err => err);
};

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        hidden: true
    },
    // {
    //     path: '/home',
    //     name: '员工资料',
    //     iconCls: 'fa fa-user-circle-o',
    //     component: Home,
    //     children: [
    //         {
    //             path: '/EmpBasic',
    //             name: '基本资料',
    //             component: EmpBasic
    //         },
    //         {
    //             path: '/EmpAdv',
    //             name: '高级资料',
    //             component: EmpAdv
    //         }
    //     ]
    // },
    // {
    //     path: '/home',
    //     name: '人事管理',
    //     iconCls: 'fa fa-address-card-o',
    //     component: Home,
    //     children: [
    //         {
    //             path: '/PerEc',
    //             name: '员工奖惩',
    //             component: PerEc
    //         },
    //         {
    //             path: '/PerEmp',
    //             name: '员工资料',
    //             component: PerEmp
    //         },
    //         {
    //             path: '/PerMv',
    //             name: '员工调动',
    //             component: PerMv
    //         },
    //         {
    //             path: '/PerSalary',
    //             name: '员工调薪',
    //             component: PerSalary
    //         },
    //         {
    //             path: '/PerTrain',
    //             name: '员工培训',
    //             component: PerTrain
    //         }
    //     ]
    // },
    // {
    //     path: '/home',
    //     name: '薪资管理',
    //     iconCls: 'fa fa-money',
    //     component: Home,
    //     children: [
    //         {
    //             path: '/SalSob',
    //             name: '工资账套管理',
    //             component: SalSob
    //         },
    //         {
    //             path: '/SalSobCfg',
    //             name: '员工账套管理',
    //             component: SalSobCfg
    //         },
    //         {
    //             path: '/SalTable',
    //             name: '工资表管理',
    //             component: SalTable
    //         },
    //         {
    //             path: '/SalMonth',
    //             name: '月末处理',
    //             component: SalMonth
    //         },
    //         {
    //             path: '/SalSearch',
    //             name: '工资表查询',
    //             component: SalSearch
    //         }
    //     ]
    // },
    // {
    //     path: '/home',
    //     name: '统计管理',
    //     iconCls: 'fa fa-bar-chart',
    //     component: Home,
    //     children: [
    //         {
    //             path: '/StaAll',
    //             name: '综合信息统计',
    //             component: StaAll
    //         },
    //         {
    //             path: '/StaScore',
    //             name: '员工积分统计',
    //             component: StaScore
    //         },
    //         {
    //             path: '/StaPers',
    //             name: '人事信息统计',
    //             component: StaPers
    //         },
    //         {
    //             path: '/StaRecord',
    //             name: '人事记录统计',
    //             component: StaRecord
    //         }
    //     ]
    // },
    // {
    //     path: '/home',
    //     name: '系统管理',
    //     iconCls: 'fa fa-windows',
    //     component: Home,
    //     children: [
    //         {
    //             path: '/SysBasic',
    //             name: '基础信息设置',
    //             component: SysBasic
    //         },
    //         {
    //             path: '/SysConfig',
    //             name: '系统管理',
    //             component: SysConfig
    //         },
    //         {
    //             path: '/SysLog',
    //             name: '操作日志管理',
    //             component: SysLog
    //         },
    //         {
    //             path: '/SysAdmin',
    //             name: '操作员管理',
    //             component: SysAdmin
    //         },
    //         {
    //             path: '/SysData',
    //             name: '备份恢复数据库',
    //             component: SysData
    //         },
    //         {
    //             path: '/SysInit',
    //             name: '初始化数据库',
    //             component: SysInit
    //         }
    //     ]
    // },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        hidden: true,
        children: [
            {
                path: '/chat',
                name: '在线聊天',
                component: FriendChat
            },
            {
                path: '/userinfo',
                name: '个人中心',
                component: UserInfo
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

export default router
