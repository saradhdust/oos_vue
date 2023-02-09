<template>
  <div>
    <div class="PermissManaTool">
      <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input size="small" v-model="role.nameZh" placeholder="请输入角色中文名"></el-input>
      <el-button size="small" type="primary" icon="el-icon-plus" round @click="doAddRole">添加</el-button>
    </div>
    <div class="PermissManaMain">
      <el-collapse v-model="activeName" accordion @change="change">
        <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r,index) in roles" :key="index">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问资源</span>
              <el-button style="float: right; padding: 3px 0;color: #ff0000" type="text"
                         icon="el-icon-delete" @click="doDeleteRole(r)"></el-button>
            </div>
            <div>
              <el-tree show-checkbox
                       ref="tree"
                       :key="index"
                       :data="allMenus"
                       :props="defaultProps"
                       :default-checked-keys="selectedMenus"
                       node-key="id"></el-tree>
              <div style="display: flex;justify-content: flex-end">
                <el-button size="mini" round @click="cancelUpdate">取消修改</el-button>
                <el-button size="mini" type="primary" round @click="doUpdate(r.id,index)">确认修改</el-button>
              </div>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import allMenus from '@/api/allMenus.json'
import roles from '@/api/roles.json'

export default {
  name: "PermissMana",
  data() {
    return {
      role: {
        id: '',
        name: '',
        nameZh: '',
      },
      allMenus: allMenus,
      selectedMenus: [7, 8, 9, 10, 12, 16],
      activeName: -1,
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      roles: roles
    }
  },
  mounted() {
    this.initRoles();
  },
  methods: {
    //加载角色
    initRoles() {
      this.getRequest('/system/basic/permiss/').then(resp => {
        if (resp) {
          this.roles = resp;
        }
      })
    },
    //树形菜单变化
    change(rid) {
      if (rid) {
        this.initAllMenus();
        this.initSelectedMenus(rid);
      }
    },
    //加载菜单
    initAllMenus() {
      this.getRequest('/system/basic/permiss/menus').then(resp => {
        if (resp) {
          this.allMenus = resp;
        }
      })
    },
    initSelectedMenus(rid) {
      this.getRequest('/system/basic/permiss/mid/' + rid).then(resp => {
        if (resp) {
          this.selectedMenus = resp;
        }
      })
    },
    //修改权限树
    doUpdate(rid, index) {
      let tree = this.$refs.tree[index];
      let selectedKeys = tree.getCheckedKeys(true);
      let url = "system/basic/permiss/?rid=" + rid;
      selectedKeys.forEach(key => {
        url += '&mids=' + key;
      });
      this.putRequest(url).then(resp => {
        if (resp) {
          this.initRoles();
          this.activeName = -1;
        }
      })
    },
    //  取消修改
    cancelUpdate() {
      this.activeName = -1;
    },
    //  添加权限角色
    doAddRole() {
      if (this.role.name && this.role.nameZh) {
        this.postRequest('/system/basic/permiss/role', this.role).then(resp => {
          if (resp) {
            this.initRoles();
            this.role.name = '';
            this.role.nameZh = '';
          }
        })
      } else {
        this.$message.warning("所有字段不能为空!!");
      }
    },
    doDeleteRole(role) {
      this.$confirm('此操作将删除[' + role.nameZh + ']角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/permiss/role/' + role.id).then(resp => {
          if (resp) {
            // this.initRoles();
            this.initSelectedMenus(role.id);
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style scoped>
.PermissManaTool {
  display: flex;
  justify-content: flex-start;
}

.PermissManaTool .el-input {
  width: 300px;
  margin-right: 5px;
}

.PermissManaMain {
  margin-top: 10px;
  width: 70%;
}
</style>
