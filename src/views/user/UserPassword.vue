<template>
  <div>
    <div>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="请输入旧密码" prop="oldPassword">
          <el-input type="password" style="width: 50%" v-model="ruleForm.oldPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" style="width: 50%" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass">
          <el-input type="password" style="width: 50%" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import store from "@/store";

export default {
  name: "UserPassword",
  data() {
    var oldPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      }else{
        callback();
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
      admin: null,
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
    initAdmin() {
      this.getRequest('/userinfo/').then(resp => {
        if (resp) {
          this.admin = resp;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.adminId = this.admin.id;
          this.putRequest('/userinfo/password', this.ruleForm).then(resp => {
            if (resp && resp.code === 200) {
              this.postRequest('/logout');

              window.sessionStorage.removeItem('user');
              window.sessionStorage.removeItem('tokenStr');
              this.$store.commit('initRoutes', []);
              this.$router.replace('/');
              //关闭websocket
              store.dispatch('disconnect');

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
    }
  }
}
</script>

<style scoped>

</style>
