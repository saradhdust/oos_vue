<template>
  <el-container>
    <el-header class="homeHeader">
      <div class="title">OOS</div>
      <div>
        <el-button type="text"
                   icon="el-icon-bell"
                   size="normal" style="color: black;margin-right: 20px"
                   @click="toChat">
        </el-button>
        <el-dropdown class="userInfo" @command="commandHandler">
        <span class="el-dropdown-link" v-if="user != null">
          {{ user.name }}
          <!--          admin-->
          <i><img :src="user.userFace"></i>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="setting">设置</el-dropdown-item>
            <el-dropdown-item command="logout">注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside width="220px">
        <el-menu router unique-opened>
          <el-submenu :index="index+''"
                      v-for="(item,index) in routes"
                      :key="index"
                      v-if="!item.hidden">
            <template slot="title">
              <i :class="item.iconCls" style="color: aqua;margin-right: 5px"></i>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item :index="children.path"
                          v-for="(children,indexj) in item.children" :key="indexj">
              {{ children.name }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <el-breadcrumb v-if="this.$router.currentRoute.path!='/home'">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
          欢迎进入系统！
        </div>
        <router-view class="homeRouterView"/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import store from "@/store";

export default {
  name: "Home",
  data() {
    return {}
  },
  computed: {
    routes() {
      return this.$store.state.routes;
    },
    user() {
      return store.state.currentAdmin;
    }
  },
  mounted() {
    // console.log(this.user);
    // console.log(store.state.currentAdmin);
  },
  methods: {
    toChat() {
      this.$router.push('/chat');
    },
    commandHandler(command) {
      if (command == 'logout') {
        //确认信息
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(this.$store.state.routes)
          //确认注销
          //注销登录
          this.postRequest('/logout');
          //清空用户信息
          window.sessionStorage.removeItem('tokenStr');
          window.sessionStorage.removeItem('user');

          //清空菜单信息
          this.$store.commit('initRoutes', []);
          console.log(this.$store.state.routes)


          // this.$state.stomp.disconnect();
          // console.log('关闭websocket连接')
          //关闭websocket
          store.dispatch('disconnect');

          //跳转页面
          this.$router.replace('/');
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      }
      if (command == 'userinfo') {
        this.$router.push('/userinfo');
      }
    }
  }
}
</script>

<style>
.homeHeader {
  background: #409eef;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
}

.homeHeader .title {
  font-size: 30px;
  font-family: 华文楷体;
  color: white;
}

.homeHeader .userInfo {
  cursor: pointer;
}

.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-left: 8px;
}

.homeWelcome {
  text-align: center;
  font-size: 30px;
  font-family: 华文楷体;
  color: #409eff;
  padding-top: 50px;
}

.homeRouterView {
  margin-top: 10px;
}
</style>
