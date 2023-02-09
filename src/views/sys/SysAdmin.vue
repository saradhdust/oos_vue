<template>
  <div>
    <div style="display: flex;justify-content: center;margin-top: 10px">
      <el-input
          placeholder="请输入用户名进行搜索..."
          prefix-icon="el-icon-search"
          style="width: 400px;margin-right: 10px"
          v-model="keywords">
      </el-input>
      <el-button type="primary" icon="el-icon-search" round @click="searchUser">搜索</el-button>
    </div>
    <div class="admin-container">
      <el-card class="admin-card"
               v-for="(admin,index) in admins"
               :key="index">
        <div slot="header" class="clearfix">
          <span>{{ admin.name }}</span>
          <el-button style="float: right; padding: 3px 0;color: red"
                     type="text"
                     icon="el-icon-delete"
                     @click="deleteAdmin(admin)">
          </el-button>
        </div>
        <div class="img-container">
          <img :src="admin.userFace" :alt="admin.name" :title="admin.name" class="userFace-img">
        </div>
        <div class="userInfo-container">
          <div>用户名：{{ admin.name }}</div>
          <div>手机号码：{{ admin.phone }}</div>
          <div>电话号码：{{ admin.telephone }}</div>
          <div>地址：{{ admin.address }}</div>
          <div>用户状态：
            <el-switch
                v-model="admin.enabled"
                active-text="启用"
                inactive-text="禁用"
                @change="enabledChange(admin)">
            </el-switch>
          </div>
          <div>
            用户角色：
            <el-tag style="margin-right: 4px" type="success"
                    v-for="(role,index) in admin.roles" :key="index">
              {{ role.nameZh }}
            </el-tag>
            <el-popover
                placement="right"
                title="角色列表"
                width="200"
                trigger="click"
                @show="showPopover(admin)"
                @hide="hidePopover(admin)">
              <el-select v-model="selectedRoles" multiple placeholder="请选择">
                <el-option
                    v-for="(role,index) in allRoles"
                    :key="index"
                    :label="role.nameZh"
                    :value="role.id">
                </el-option>
              </el-select>
              <el-button type="text" icon="el-icon-more" slot="reference"></el-button>
            </el-popover>
            <div>
              备注：{{ admin.remark }}
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import admins from '@/api/admins.json';
import roles from '@/api/roles.json';


export default {
  name: "SysAdmin",
  data() {
    return {
      admins: admins,
      keywords: '',
      allRoles: roles,
      selectedRoles: []
    }
  },
  mounted() {
    this.initAdmins();
  },
  methods: {
    //获取所有角色
    initAllRoles() {
      this.getRequest('/system/admin/roles').then(resp => {
        if (resp) {
          this.allRoles = resp;
        }
      })
    },
    //获取所有操作员
    initAdmins() {
      this.getRequest('/system/admin/?keywords=' + this.keywords).then(resp => {
        if (resp) {
          this.admins = resp;
        }
      })
    },
    //  搜索操作员
    searchUser() {
      this.initAdmins();
    },
    //  删除操作员
    deleteAdmin(admin) {
      this.$confirm('此操作将永久删除[' + admin.name + ']操作员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/admin/' + admin.id).then(resp => {
          if (resp) {
            this.initAdmins();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //更新启用状态
    enabledChange(admin) {
      this.putRequest('/system/admin/', admin).then(resp => {
        if (resp) {
          this.initAdmins();
        }
      })
    },
    //显示角色列表
    showPopover(admin) {
      let roles = admin.roles;
      this.selectedRoles = [];
      roles.forEach(role => {
        this.selectedRoles.push(role.id);
      })
      this.initAllRoles();
    },
    //隐藏角色列表并更新操作员角色
    hidePopover(admin) {
      let roles = [];
      Object.assign(roles, admin.roles);
      let flag = false;
      if (roles.length != this.selectedRoles.length) {
        flag = true;
      } else {
        for (let i = 0; i < roles.length; i++) {
          let role = roles[i];
          for (let j = 0; j < this.selectedRoles.length; j++) {
            let sr = this.selectedRoles[j];
            if (role.id == sr) {
              roles.splice(i, 1);
              i--;
              break;
            }
          }
        }
        if (roles.length != 0) {
          flag = true;
        }
      }
      if (flag) {
        let url = '/system/admin/role?adminId=' + admin.id;
        this.selectedRoles.forEach(sr => {
          url += '&rids=' + sr;
        });
        this.putRequest(url).then(resp => {
          if (resp) {
            this.initAdmins();
          }
        })
      }
    }
  }
}
</script>

<style>
.admin-card {
  width: 350px;
  margin-bottom: 20px;
}

.admin-container {
  display: flex;
  margin-top: 10px;
  justify-content: space-around;
  flex-wrap: wrap;
}

.userFace-img {
  width: 72px;
  height: 72px;
  border-radius: 72px;
}

.img-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.userInfo-container {
  font-size: 15px;
  color: #409eef;
}
</style>
