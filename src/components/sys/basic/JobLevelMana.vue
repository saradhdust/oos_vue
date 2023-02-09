<template>
  <div>
    <div>
      <!--    添加按钮-->
      <el-input size="small" style="width: 300px;" placeholder="添加职称"
                suffix-icon="el-icon-plus" v-model="jl.name"></el-input>
      <!--      下拉框-->
      <el-select v-model="jl.titleLevel" placeholder="职称等级" size="small"
                 style="margin-right: 6px;margin-left: 6px">
        <el-option
            v-for="item in titleLevels"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
      <el-button size="small" type="primary" icon="el-icon-plus" round @click="addJobLevel">添加</el-button>
    </div>
    <div style="margin-top: 8px">
      <el-table stripe border size="small" :data="jls" style="width: 70%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="编号" width="100px"></el-table-column>
        <el-table-column prop="name" label="职称" width="150px"></el-table-column>
        <el-table-column prop="titleLevel" label="职称等级" width="150px"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" width="220px"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="showEditView(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteJobLevel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--    批量删除按钮-->
    <el-button type="danger" style="margin-top: 8px" size="small"
               :disabled="this.multipleSelection.length==0" @click="deleteMany">批量删除
    </el-button>
    <!--    编辑面板-->
    <el-dialog
        title="编辑职称"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <table>
          <tr>
            <el-tag>职位名称</el-tag>
            <el-input size="small" style="width: 200px;margin-left: 5px" v-model="newJl.name"></el-input>
          </tr>
          <tr>
            <el-tag>职称等级</el-tag>
            <el-select v-model="newJl.titleLevel" placeholder="职称等级" size="small"
                       style="margin-right: 6px;margin-left: 6px">
              <el-option v-for="item in titleLevels" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="updateJl">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import jls from '@/api/jls.json'

export default {
  name: "JobLevelMana",
  data() {
    return {
      dialogVisible: false,
      jl: {
        name: '',
        titleLevel: ''
      },
      newJl: {
        id: '',
        name: '',
        titleLevel: '',
        enabled: true,
        createDate: '',
      },
      titleLevels: [
        '正高级',
        '副高级',
        '中级',
        '初级',
        '员级'
      ],
      multipleSelection: [],
      jls: jls
    }
  },
  mounted() {
    this.initJls();
  },
  methods: {
    //获取职称信息
    initJls() {
      this.getRequest('/system/basic/jobLevel/').then(resp => {
        if (resp) {
          this.jls = resp;
          this.jl.name = '';
          this.jl.titleLevel = '';
        }
      })
    },
    //  添加职称
    addJobLevel() {
      if (this.jl.name && this.jl.titleLevel) {
        this.postRequest('/system/basic/jobLevel/', this.jl).then(resp => {
          if (resp) {
            this.initJls();
          }
        })
      } else {
        this.$message.warning('字段不能为空！');
      }
    },
    //删除职称
    deleteJobLevel(index, data) {
      this.$confirm('此操作将删除[' + data.name + ']职称, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/jobLevel/' + data.id).then(resp => {
          if (resp) {
            this.initJls();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //调出编辑面板
    showEditView(index, data) {
      Object.assign(this.newJl, data);
      this.newJl.createDate = '';
      this.dialogVisible = true;
    },
    //更新职位
    updateJl() {
      this.putRequest('/system/basic/jobLevel/', this.newJl).then(resp => {
        if (resp) {
          this.initJls();
          this.dialogVisible = false;
        }
      })
    },
    //批量选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //  批量删除
    deleteMany() {
      this.$confirm('此操作将删除[' + this.multipleSelection.length + ']条职称, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item => {
          ids += 'ids=' + item.id + '&';
        })
        this.deleteRequest('/system/basic/jobLevel/' + ids).then(resp => {
          if (resp) {
            this.initJls();
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

</style>
