<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <div>
        <el-input style="width: 300px;margin-right: 10px" placeholder="请输入工号进行搜索"
                  prefix-icon="el-icon-search"
                  clearable
                  v-model="workID"
                  @keydown.enter.native="searchUser"
                  @clear="searchUser">
        </el-input>

        <el-button type="primary" icon="el-icon-search" @click="searchUser" round>搜索</el-button>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="showAddView" round>创建账号</el-button>
      </div>
    </div>
    <div style="margin-top: 10px">
      <!--     账号表格 -->
      <el-table
          :data="users"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          border
          style="width: 100%">
        <el-table-column prop="employee.workID" label="工号" width="85" align="left" fixed="left"></el-table-column>
        <el-table-column prop="name" label="姓名" width="90" align="left" fixed="left"></el-table-column>
        <el-table-column prop="username" label="用户名" width="120" align="left"></el-table-column>
        <el-table-column prop="password" label="密码" width="150" align="left"></el-table-column>
        <el-table-column label="角色" width="300px" align="left">
          <template slot-scope="scope">
            <el-tag type="success" v-for="(r,index) in scope.row.roles" :key="index" style="margin-right: 5px">
              {{ r.nameZh }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button style="padding: 3px" size="mini" @click="showEditView(scope.row)">编辑</el-button>
            <!--            <el-button style="padding: 3px" size="mini" type="primary">查看高级资料</el-button>-->
            <el-button style="padding: 3px" size="mini" type="danger" @click="deleteUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页控件-->
      <div style="display: flex;justify-content: left">
        <el-pagination
            background
            layout="sizes,prev, pager, next, jumper ,->,total"
            :total="total"
            @current-change="currentChange"
            @size-change="sizeChange"
            @prev-click="prevClick"
            @next-click="nextClick">
        </el-pagination>
      </div>
    </div>
    <!--      添加账号编辑面板-->
    <el-dialog
        title="创建账号"
        :visible.sync="AddDialogVisible"
        width="50%">
      <el-form ref="addForm" :model="newUser" :rules="rules">
        <el-row>
          <el-form-item label="姓名：" prop="name">
            <el-select v-model="newUser.eid" size="mini" style="width: 50%" placeholder="员工姓名" filterable
                       @change="change">
              <el-option
                  v-for="item in empWithNoUser"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.workID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="用户名：" prop="username">
              <el-input size="mini" style="width:50%" prefix-icon="el-icon-edit" v-model="newUser.username"
                        placeholder="用户名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="密码：" prop="password">
            <el-input size="mini" type="password" style="width:50%" prefix-icon="el-icon-edit"
                      v-model="newUser.password"
                      placeholder="密码"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="角色：" prop="roles">
            <el-select v-model="newUser.roles" size="mini" style="width: 50%" placeholder="角色" multiple>
              <el-option
                  v-for="item in roles"
                  :key="item.id"
                  :label="item.nameZh"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createUser">确 定</el-button>
        </span>
    </el-dialog>
    <!--    编辑账号面板-->
    <el-dialog title="编辑账号"
               :visible.sync="EditDialogVisible"
               width="50%">
      <el-form ref="editForm" :model="editUser" :rules="rules">
        <el-row>
          <el-col>
            <el-form-item label="用户名：" prop="username">
              <el-input size="mini" style="width:50%" prefix-icon="el-icon-edit" v-model="editUser.username"
                        placeholder="用户名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="密码：" prop="password">
            <el-input size="mini" type="password" style="width:50%" prefix-icon="el-icon-edit"
                      v-model="editUser.password"
                      placeholder="密码"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="角色：" prop="roles">
            <el-select v-model="editUser.roles" size="mini" style="width: 50%" placeholder="角色" multiple>
              <el-option
                  v-for="item in roles"
                  :key="item.id"
                  :label="item.nameZh"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pinyin from 'js-pinyin'

export default {
  name: "SysUsers",
  data() {
    return {
      loading: false,
      currentPage: 1,
      size: 10,
      users: null,
      empWithNoUser: null, //没有账号的员工列表
      selectedEmp: null,
      newUser: {
        name: '',
        username: '',
        eid: null,
        password: '123456',
        userFace: null,
        roles: null
      },
      editUser: {
        id: null,
        name: '',
        username: '',
        eid: null,
        password: '',
        userFace: null,
        roles: [],
        enabled: true,
      },
      rules: {
        name: [{required: true, message: '请选择员工', trigger: 'blur'}],
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        roles: [{required: true, message: '请选择角色', trigger: 'blur'}],
      },
      roles: null,
      workID: '',
      total: null,
      title: '',
      AddDialogVisible: false,
      EditDialogVisible: false
    }
  },
  mounted() {
    this.initUsers();
    this.initData();
  },
  methods: {
    initUsers() {
      this.loading = true;
      //加载 第page页 size行的员工数据
      this.getRequest('/userEmp/?currentPage='
          + this.currentPage + '&size=' + this.size + '&workID=' + this.workID).then(resp => {
        if (resp) {
          this.total = resp.total;
          this.users = resp.data;
        }
      })
      this.loading = false;
    },
    initData() {
      this.getRequest('/system/admin/roles').then(resp => {
        if (resp) {
          this.roles = resp;
        }
      })
    },
    searchUser() {
      this.currentPage = 1;
      this.initUsers();
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initUsers();
    },
    sizeChange(size) {
      this.size = size;
      this.initUsers();
    },
    prevClick(currentPage) {
      this.currentPage = this.currentPage - 1;
      this.initUsers();
    },
    nextClick(currentPage) {
      this.currentPage = this.currentPage + 1;
      this.initUsers();
    },
    showEditView(data) {
      this.editUser = JSON.parse(JSON.stringify(data));
      let roles = data.roles;
      this.editUser.roles = [];
      roles.forEach(role => {
        this.editUser.roles.push(role.id);
      })
      this.EditDialogVisible = true
    },
    deleteUser(data) {
      this.$confirm('此操作将永久删除[ ' + data.employee.workID +'：'+data.name+ ' ]员工账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/userEmp/'+data.id).then(resp => {
          if (resp) {
            this.initUsers();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    showAddView() {
      this.newUser = this.$options.data().newUser;
      this.title = '创建账号';
      this.getRequest('/userEmp/nouser').then(resp => {
        if (resp) {
          this.empWithNoUser = resp;
        }
      })
      this.AddDialogVisible = true;
    },
    change(value) {
      this.newUser.eid = value;
      this.empWithNoUser.forEach(emp => {
        if (emp.id === this.newUser.eid) {
          this.newUser.name = emp.name;
          this.newUser.username = pinyin.getFullChars(emp.name);
        }
      })
    },
    createUser() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.postRequest('/userEmp/create', this.newUser).then(resp => {
            this.initUsers();
            this.AddDialogVisible = false;
          })
        }
      });

    },
    updateUser() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.putRequest('/userEmp/', this.editUser).then(resp => {
            this.initUsers();
            this.EditDialogVisible = false;
          })
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
