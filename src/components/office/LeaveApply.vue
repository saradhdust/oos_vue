<template>
  <div style="margin-left: 10px">
    <div style="display: flex;justify-content: space-between">
      <div>
        <el-radio v-model="selectedState" label="">全部</el-radio>
        <el-radio v-model="selectedState" label="AUDIT">未审核</el-radio>
        <el-button type="primary" icon="el-icon-search" @click="searchLeaves" round>查询</el-button>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="showAddView" round>申请请假</el-button>
      </div>
    </div>
    <div style="margin-top: 10px;justify-content: center">
      <!--展示表格-->
      <el-table :data="leaves"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                border
                style="width: 60%;margin-left: 15%;">
        <el-table-column prop="createDate" label="填写时间" width="125"></el-table-column>
        <el-table-column prop="auditor.name" label="审核人" width="100"></el-table-column>
        <el-table-column prop="beginDate" label="开始时间" width="125"></el-table-column>
        <el-table-column prop="endDate" label="结束时间" width="125"></el-table-column>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state==='AUDIT'">
              审核中
            </el-tag>

            <el-tag v-if="scope.row.state==='PASS'" type="success">
              已通过
            </el-tag>

            <el-tag v-if="scope.row.state==='REFUSE'" type="danger">
              驳回
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="164">
          <template slot-scope="scope">
            <el-button style="padding: 3px" size="mini" @click="showDetails(scope.row)">详情</el-button>
            <!--            <el-button style="padding: 3px" size="mini" type="primary">查看高级资料</el-button>-->
            <el-button style="padding: 3px" size="mini" type="danger" @click="deleteLeave(scope.row)">撤销</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页控件-->
      <div style="display: flex;justify-content:center">
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
      <!--      Leave详情面板-->
      <el-dialog
          title="详情"
          :visible.sync="detailsDialogVisible"
          width="60%">
        <div style="margin-left: 5px">
          <el-row style="display: flex;justify-content: space-between">
            <el-col style="display: flex">
              申请人:{{ this.detailLeave.applier.name }}
            </el-col>
          </el-row>
          <el-row style="display: flex;margin-top: 4px">
            <el-col>
              开始时间:{{ this.detailLeave.beginDate }}
            </el-col>
            <el-col>
              结束时间:{{ this.detailLeave.endDate }}
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <div>
              请假理由：
            </div>
            <el-col>
              <div style="height: 200px;border: 1px solid #dedede;border-radius: 4px">
                {{ detailLeave.reason }}
              </div>
            </el-col>
          </el-row>
          <div v-if="detailLeave.state!='AUDIT'">
            <el-row style="margin-top: 10px">
              {{ '审核意见：' + (detailLeave.auditResult == null ? '' : detailLeave.auditResult) }}
            </el-row>
          </div>
        </div>
      </el-dialog>
      <!--      添加leave编辑面板-->
      <el-dialog
          title="请假申请"
          :visible.sync="addDialogVisible"
          width="60%">
        <div style="margin-left: 5px">
          <el-row style="display: flex;justify-content: space-between">
            <el-col style="display: flex">
              审核人：
              <el-popover
                  placement="right-end"
                  title="请选择部门"
                  trigger="click"
                  @hide="changeDepEmps">
                <el-tree :data="deps"
                         :props="defaultProps"
                         @node-click="handleNodeClick">
                </el-tree>
                <div
                    slot="reference"
                    style="width: 150px;display: inline-flex;border: 1px solid #dedede;height: 30px;
                               border-radius: 4px;cursor: pointer;align-items: center;
                               font-size: 13px;padding-left: 8px;box-sizing: border-box"
                    @click="showDepView">{{ inputDep.name }}
                </div>
              </el-popover>
              <el-select v-model="newLeave.auditorWorkID" placeholder="请选择" style="margin-left: 5px">
                <el-option
                    v-for="item in inputDepEmps"
                    :key="item.id"
                    :label="item.name"
                    :value="item.workID">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.position.name }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-row>

          <el-row style="margin-top: 10px">
            <el-col>
              请假时间：
              <el-date-picker
                  v-model="dateValue"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-col>
              请假理由：
            </el-col>
            <el-col>
              <el-input
                  type="textarea"
                  placeholder="请输入内容"
                  v-model="newLeave.reason"
                  style="width: 90%;margin-top: 4px"
                  :autosize="{ minRows: 10, maxRows: 40}">
              </el-input>
            </el-col>
          </el-row>
        </div>

        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addLeave">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "LeaveApply",
  data() {
    return {
      loading: false,
      detailsDialogVisible: false,
      addDialogVisible: false,
      visible: false,
      selectedState: '',
      leaves: null,
      employee:null,
      deps: null,
      detailLeave: {
        applier: {
          name: '',
        },
        beginDate: null,
        endDate: null,
        reason: '',
        auditResult: '',
        state: null
      },
      newLeave: {
        applierWorkID: '',
        auditorWorkID: '',
        reason:'',
        state:'AUDIT',
        beginDate: null,
        endDate: null
      },
      total: null,
      currentPage: 1,
      size: 10,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      inputDep: {
        id: null,
        name: ''
      },
      inputDepEmps: null,
      dateValue:[],
    }
  },
  mounted() {
    this.initLeaves();
    this.initData();
  },
  methods: {
    initLeaves() {
      this.getRequest('/leave/?currentPage='
          + this.currentPage + '&size=' + this.size + '&state=' + this.selectedState).then(resp => {
        if (resp) {
          this.leaves = resp.data;
          this.total = resp.total;
        }
      })
    },
    initData() {
      this.getRequest("/leave/deps").then(resp => {
        if (resp) {
          this.deps = resp;
        }
      });
      this.getRequest('/leave/employee').then(resp => {
        if (resp) {
          this.employee = resp;
          this.inputDep.name = resp.department.name;
          this.inputDep.id = resp.department.id;
        }
      });
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initLeaves();
    },
    sizeChange(size) {
      this.size = size;
      this.initLeaves();
    },
    prevClick(currentPage) {
      this.currentPage = this.currentPage - 1;
      this.initLeaves();
    },
    nextClick(currentPage) {
      this.currentPage = this.currentPage + 1;
      this.initLeaves();
    },
    searchLeaves() {
      this.currentPage = 1;
      this.initLeaves();
    },
    showDetails(data) {
      this.detailLeave = JSON.parse(JSON.stringify(data));
      this.detailsDialogVisible = true
    },
    deleteLeave(data) {
      if(data.state==='AUDIT'){
        this.$confirm('此操作将撤回申请, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/leave/?id='+data.id).then(resp=>{
            this.initLeaves();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消撤回'
          });
        });
      }else{
        this.$message.error('审核已结束，无法撤回！');
      }
    },
    showAddView() {
      this.addDialogVisible = true;
      this.changeDepEmps();
    },
    changeDepEmps() {
      this.getRequest('/leave/depEmps?id=' + this.inputDep.id).then(resp => {
        if (resp) {
          this.inputDepEmps = resp;
        }
      })
    },
    handleNodeClick(data) {
      this.inputDep.name = data.name;
      this.inputDep.id = data.id;
      this.visible = !this.visible;
    },
    showDepView() {
      this.visible = !this.visible;
    },
    addLeave(){
      this.newLeave.applierWorkID = this.employee.workID
      this.newLeave.beginDate=this.dateValue[0];
      this.newLeave.endDate=this.dateValue[1];

      this.postRequest('/leave/',this.newLeave).then(resp=>{
        if(resp){
          this.initLeaves();
          this.newLeave=this.$options.data().newLeave;
          this.addDialogVisible=false;
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
