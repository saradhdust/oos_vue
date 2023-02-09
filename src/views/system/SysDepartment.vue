<template>
  <div style="width: 500px">
    <el-input
        placeholder="请输入部门名称进行搜索..."
        prefix-icon="el-icon-search"
        v-model="filterText">
    </el-input>

    <el-tree
        :data="deps"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :expand-on-click-node=false
        style="padding-top: 10px"
        ref="tree">
      <span class="custom-tree-node" slot-scope="{ node, data }"
            style="display: flex;justify-content: space-between;width: 100%">
        <span>{{ node.label }}</span>
        <span>
          <el-button
              type="text"
              size="mini"
              @click="showEditView(data)">
            添加子部门
          </el-button>
          <el-button
              type="text"
              size="mini"
              style="color: red"
              @click="() => DeleteDep(data)">
            删除部门
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
        title="添加部门"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <table>
          <tr>
            <td>
              <el-tag>上级部门</el-tag>
            </td>
            <td>
              {{ parentName }}
            </td>
          </tr>
          <tr>
            <td>
              <el-tag>部门名称</el-tag>
            </td>
            <td>
              <el-input placeHolder="请输入部门名称..." v-model="newDep.name"></el-input>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDep">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import Department from "@/api/Department.json"

export default {
  name: "SysDepartment",
  data() {
    return {
      filterText: '',
      deps: Department,
      newDep: {
        name: '',
        parentId: -1,
      },
      parentName: '',
      dialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.initDeps();
  },
  methods: {
    //获取部门
    initDeps() {
      this.getRequest('/system/basic/department/').then(resp => {
        if (resp) {
          this.deps = resp;
        }
      });

    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    addDep2Deps(deps, dep) {
      for (let i = 0; i < deps.length; i++) {
        let d = deps[i];
        if (d.id == dep.parentId) {
          d.children = d.children.concat(dep);
          if (d.children.length > 0) {
            d.isParent = true;
          }
          return;
        } else {
          this.addDep2Deps(d.children, dep);
        }
      }
    },
    //添加子部门
    addDep() {
      this.postRequest('system/basic/department/', this.newDep).then(resp => {
        if (resp) {
          // this.initDeps();
          this.addDep2Deps(this.deps,resp.object);
          this.newDep = {
            name: '',
            parentId: -1,
          };
          this.parentName = '';
          this.dialogVisible = false;
        }
      })

    },
    //显示添加部门编辑面板
    showEditView(data) {
      this.dialogVisible = true;
      this.parentName = data.name;
      this.newDep.parentId = data.id;
    },
    removeDepFromDeps(parent, deps, depId) {
      for (let i = 0; i < deps.length; i++) {
        let d = deps[i];
        if (d.id == depId) {
          deps.splice(i, 1);
          if (deps.length == 0) {
            parent.isParent = false;
          }
          return;
        } else {
          this.removeDepFromDeps(d, d.children, depId);
        }
      }
    },
    //删除部门
    DeleteDep(data) {
      if (data.isParent) {
        this.$message.warning('父部门删除失败!!');
      } else {
        this.$confirm('此操作将永久删除该[' + data.name + ']部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/system/basic/department/' + data.id).then(resp => {
            if (resp) {
              this.removeDepFromDeps(null, this.deps, data.id);
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
}
</script>

<style scoped>

</style>
