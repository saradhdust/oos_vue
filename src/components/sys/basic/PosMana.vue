<template>
  <div>
    <div>
      <!--    添加按钮-->
      <el-input size="small"
                style="width: 300px;margin-right: 8px;"
                placeholder="添加职位"
                suffix-icon="el-icon-plus"
                v-model="pos.name"
                @keydown.enter.native="addPosition"></el-input>
      <el-button size="small" type="primary" icon="el-icon-plus" round @click="addPosition">添加</el-button>
    </div>
    <!--    职位表格-->
    <div class="posManaMain">
      <el-table stripe border size="small" :data="positions" style="width: 70%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="编号" width="100px"></el-table-column>
        <el-table-column prop="name" label="职位" width="220px"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" width="220px"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="showEditView(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deletePos(scope.$index, scope.row)">删除</el-button>
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
        title="编辑职位"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <el-tag>职位名称</el-tag>
        <el-input size="small" style="width: 200px;margin-left: 5px" v-model="newPos.name"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="updatePos">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import positions from '@/api/positions.json'
export default {
  name: "PosMana",
  data() {
    return {
      pos: {
        name: ''
      },
      dialogVisible: false,
      newPos: {
        id:'',
        name: '',
        createDate: ''
      },
      multipleSelection: [],
      positions: positions
    }
  },
  mounted() {
    this.initPositions();
  },
  methods: {
    //添加职位
    addPosition() {
      if (this.pos.name) {
        this.postRequest('/system/basic/pos/', this.pos).then(resp => {
          if (resp) {
            this.initPositions();
            this.pos.name = '';
          }
        })
      } else {
        this.$message.warning('职位名称不能为空！');
      }
    },
    //获取职位信息
    initPositions() {
      this.getRequest('/system/basic/pos/').then(resp => {
        if (resp) {
          this.positions = resp;
        }
      })
    },
    //调出编辑面板
    showEditView(index, data) {
      Object.assign(this.newPos, data);
      this.newPos.createDate = '';
      this.dialogVisible = true;
    },
    //删除职位
    deletePos(index, data) {
      this.$confirm('此操作将删除[' + data.name + ']职位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/pos/' + data.id).then(resp => {
          if (resp) {
            this.initPositions();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //更新职位
    updatePos() {
      this.putRequest('/system/basic/pos/', this.newPos).then(resp => {
        if (resp) {
          this.initPositions();
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
      this.$confirm('此操作将删除[' + this.multipleSelection.length + ']条职位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item => {
          ids += 'ids=' + item.id + '&';
        })
        this.deleteRequest('/system/basic/pos/' + ids).then(resp => {
          if (resp) {
            this.initPositions();
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

<style>
.posManaMain {
  margin-top: 10px;
}
</style>
