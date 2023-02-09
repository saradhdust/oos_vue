<template>
  <div>
    <el-card class="box-card" style="width: 400px">
      <div slot="header" class="clearfix">
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
        <div>电话号码：
          <el-tag>{{ admin.telephone }}</el-tag>
        </div>
        <div>手机号码：
          <el-tag>{{ admin.phone }}</el-tag>
        </div>
        <div>居住地址：
          <el-tag>{{ admin.address }}</el-tag>
        </div>
        <div>
          用户标签：
          <el-tag type="success" v-for="(r,index) in admin.roles" :key="index">{{ r.nameZh }}</el-tag>
        </div>
        <div style="display: flex;justify-content: space-around;margin-top: 10px">
          <el-button type="primary" @click="showEditView">修改信息</el-button>
          <el-button type="danger" @click="showPswdView">修改密码</el-button>
        </div>
      </div>
    </el-card>
    <el-dialog
        title="修改用户信息"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <table>
          <tr>
            <td>用户昵称：</td>
            <td>
              <el-input v-model="editAdmin.name"></el-input>
            </td>
          </tr>
          <tr>
            <td>电话号码：</td>
            <td>
              <el-input v-model="editAdmin.telephone"></el-input>
            </td>
          </tr>
          <tr>
            <td>手机号码：</td>
            <td>
              <el-input v-model="editAdmin.phone"></el-input>
            </td>
          </tr>
          <tr>
            <td>居住地址：</td>
            <td>
              <el-input v-model="editAdmin.address"></el-input>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateAdminInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
        title="修改密码"
        :visible.sync="dialogVisible2"
        width="30%">
      <div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="请输入旧密码" prop="oldPass">
            <el-input type="password" v-model="ruleForm.oldPassword" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="pass">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
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
    var oldPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      header: {
        Authorization: window.sessionStorage.getItem('tokenStr')
      },
      dialogVisible: false,
      dialogVisible2: false,
      admin: admins[1],
      editAdmin: null,
      ruleForm: {
        adminId: null,
        oldPassword: '',
        password: '',
        checkPass: ''
      },
      rules: {
        oldPassword: [
          {validator: oldPass, trigger: 'blur'}
        ],
        password: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ]
      }
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
      this.getRequest('/admin/info').then(resp => {
        if (resp) {
          this.admin = resp;
          window.sessionStorage.setItem('user', JSON.stringify(resp));
          this.$store.commit('INIT_ADMIN', resp);
        }
      });
      this.editAdmin = Object.assign({}, this.admin);
    },
    showEditView() {
      this.editAdmin = Object.assign({}, this.admin);
      this.dialogVisible = true;
    },
    updateAdminInfo() {
      this.putRequest('admin/info', this.editAdmin).then(resp => {
        if (resp) {
          this.initAdmin();
        }
      });
      this.dialogVisible = false;
    },
    showPswdView() {
      this.dialogVisible2 = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.adminId = this.admin.id;
          this.putRequest('/admin/password', this.ruleForm).then(resp => {
            if (resp && resp.code === 200) {
              this.postRequest('/logout');

              //关闭websocket
              store.dispatch('disconnect');
              window.sessionStorage.removeItem('user');
              window.sessionStorage.removeItem('tokenStr');
              this.$store.commit('initRoutes', []);
              this.$router.replace('/');
            }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    uploadImg(f) {
      const data = {
        file: f.file,
        id: this.admin.id
      };
      this.uploadImgRequest('/admin/userFace', data).then(resp => {
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
