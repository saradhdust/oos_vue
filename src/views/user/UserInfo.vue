<template>
  <div style="display: flex;justify-content: center">
    <el-card class="box-card" style="width:50%">
      <div slot="header" class="clearfix" style="display: flex;justify-content: center">
        <span>{{ admin.name }}</span>
      </div>
      <div>
        <div style="display: flex;justify-content: center">
          <el-upload
              action="#"
              :header="header"
              :data="admin"
              :show-file-list="false"
              :on-success="onSuccess"
              :http-request="uploadImg">
            <img :src="admin.userFace"
                 title="点击修改头像" style="height: 100px;width: 100px;border-radius: 50px">
          </el-upload>
        </div>
        <table>
          <tr>
            <td>工号：</td>
            <td>{{ admin.employee.workID }}</td>
          </tr>
          <tr>
            <td>性别：</td>
            <td>
              <el-tag>{{ admin.employee.gender }}</el-tag>
            </td>
          </tr>
          <tr>
            <td>出生日期：</td>
            <td>
              <el-tag>{{ admin.employee.birthday }}</el-tag>
            </td>
          </tr>
          <tr>
            <td>政治面貌：</td>
            <td>{{ admin.employee.politicsStatus.name }}</td>
          </tr>
          <tr>
            <td>用户名：</td>
            <td>
              <el-tag>{{ admin.username }}</el-tag>
            </td>
          </tr>
          <tr>
            <td>手机号码：</td>
            <td>
              <el-tag>{{ admin.employee.phone }}</el-tag>
            </td>
          </tr>
          <tr>
            <td>邮箱：</td>
            <td>
              <el-tag>{{ admin.employee.email }}</el-tag>
            </td>
          </tr>
          <tr>
            <td>居住地址：</td>
            <td>
              <el-tag>{{ admin.employee.address }}</el-tag>
            </td>
          </tr>
          <!--          <tr>-->
          <!--            <td>用户标签：</td>-->
          <!--            <td><el-tag type="success" v-for="(r,index) in admin.roles" :key="index">{{ r.nameZh }}</el-tag></td>-->
          <!--          </tr>-->
          <tr>
            <td>部门：</td>
            <td> {{ admin.employee.department.name }}</td>
          </tr>
          <tr>
            <td>职位：</td>
            <td>{{ admin.employee.position.name }}</td>
          </tr>

        </table>
        <div style="display: flex;justify-content: space-around;margin-top: 10px">
          <el-button type="primary" @click="showEditView">修改信息</el-button>
        </div>
      </div>
    </el-card>
    <el-dialog
        title="修改用户信息"
        :visible.sync="dialogVisible"
        width="50%">
      <div>
        <table>
          <tr>
            <td>用户名：</td>
            <td>
              <el-input size="mini" v-model="editAdmin.username" style="width: 250px"></el-input>
            </td>
          </tr>
          <tr>
            <td>性别：</td>
            <td>
              <el-radio-group v-model="editAdmin.employee.gender">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td>出生日期：</td>
            <td>
              <el-date-picker
                  v-model="editAdmin.employee.birthday"
                  type="date"
                  size="mini"
                  style="width: 200px"
                  value-format="yyyy-MM-dd"
                  placeholder="出生日期">
              </el-date-picker>
            </td>
          </tr>
          <tr>
            <td>手机号码：</td>
            <td>
              <el-input size="mini" v-model="editAdmin.employee.phone"></el-input>
            </td>
          </tr>
          <tr>
            <td>邮箱：</td>
            <td>
              <el-input size="mini" style="width:250px" prefix-icon="el-icon-message" v-model="editAdmin.employee.email"
                        placeholder="请输入邮箱"></el-input>
            </td>
          </tr>
          <tr>
            <td>居住地址：</td>
            <td>
              <el-input size="small" v-model="editAdmin.employee.address" style="width: 500px"></el-input>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import admins from '@/api/admins.json'
import store from "@/store";

export default {
  name: "UserInfo",
  data() {
    return {
      header: {
        Authorization: window.sessionStorage.getItem('tokenStr')
      },
      dialogVisible: false,
      dialogVisible2: false,
      admin: null,
      editAdmin: null,
      nations: null,
      politicsStatus: null,
      allDeps: null
    }
  },
  mounted() {
    this.initAdmin();
  },
  methods: {
    onSuccess() {
      // console.log('上传成功')
      // this.initAdmin();
    },
    initAdmin() {
      this.getRequest('/userinfo/').then(resp => {
        if (resp) {
          this.admin = resp;
          console.log(resp);
          this.editAdmin = JSON.parse(JSON.stringify(this.admin));
          window.sessionStorage.setItem('user', JSON.stringify(resp));
          this.$store.commit('INIT_ADMIN', resp);
        }
      });
    },
    initData() {
      //加载民族数据
      this.getRequest('employee/basic/nations').then(resp => {
        if (resp) {
          this.nations = resp;
          window.sessionStorage.setItem('nations', JSON.stringify(this.nations));
        }
      });
      //加载职称数据
      // this.getRequest('employee/basic/jobLevels').then(resp => {
      //   if (resp) {
      //     this.jobLevels = resp;
      //     window.sessionStorage.setItem('jobLevels', JSON.stringify(this.jobLevels));
      //   }
      // });
      //加载政治面貌数据
      this.getRequest('employee/basic/politicsStatus').then(resp => {
        if (resp) {
          this.politicsStatus = resp;
          window.sessionStorage.setItem('politicsStatus', JSON.stringify(this.politicsStatus));
        }
      });
      //加载部门数据
      this.getRequest('employee/basic/deps').then(resp => {
        if (resp) {
          this.allDeps = resp;
          window.sessionStorage.setItem('allDeps', JSON.stringify(this.allDeps));
        }
      });
    },
    showEditView() {
      this.initData();
      this.editAdmin = JSON.parse(JSON.stringify(this.admin));
      console.log(this.editAdmin)
      this.dialogVisible = true;
    },
    updateUserInfo() {
      this.putRequest('/userinfo/', this.editAdmin).then(resp => {
        if (resp) {
          //更新成功，重新登陆
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
        }
      });
      this.dialogVisible = false;
    },
    uploadImg(f) {
      const data = {
        file: f.file,
        id: this.admin.id
      };
      this.uploadImgRequest('/userinfo/userFace', data).then(resp => {
        if (resp) {
          console.log('上传成功');
          this.initAdmin();
        }
      }, error => {
        alert("上传失败！")
      })
    }
  }
}
</script>

<style scoped>

</style>
