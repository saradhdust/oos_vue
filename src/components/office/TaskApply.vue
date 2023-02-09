<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <div>
        <el-input style="width: 300px;margin-right: 10px" placeholder="请输入标题进行搜索"
                  prefix-icon="el-icon-search"
                  clearable
                  v-model="title"
                  @keydown.enter.native="searchTasks"
                  @clear="searchTasks">
        </el-input>

        <el-button type="primary" icon="el-icon-search" @click="searchTasks" round>搜索</el-button>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="showAddView" round>汇报工作</el-button>
      </div>
    </div>

    <div style="margin-top: 10px;justify-content: center">
      <!--展示表格-->
      <el-table :data="tasks"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                border
                style="width: 60%;margin-left: 15%;">
        <el-table-column prop="createDate" label="填写时间" width="125"></el-table-column>
        <el-table-column prop="title" label="标题" width="200"></el-table-column>
        <el-table-column prop="type" label="类型" width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.type==='LOG'">工作汇报</div>
            <div v-if="scope.row.type==='PROGRAM'">项目申报</div>
          </template>

        </el-table-column>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state==='AUDIT'||scope.row.state==='FINANCE_AUDIT'">
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
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button style="padding: 3px" size="mini" @click="showDetails(scope.row)">详情</el-button>
            <!--            <el-button style="padding: 3px" size="mini" type="primary">查看高级资料</el-button>-->
            <el-button style="padding: 3px" size="mini" type="danger" @click="deleteTask(scope.row)">撤销</el-button>
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
    </div>
    <!--      添加task编辑面板-->
    <el-dialog
        title="汇报工作"
        :visible.sync="addDialogVisible"
        width="60%">
      <div style="margin-left: 5px">
        <el-row style="display: flex;justify-content: space-between">
          <el-col>
            <el-select v-model="newTask.type" placeholder="请选择">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-col>
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
            <el-select v-model="newTask.auditorWorkID" placeholder="请选择" style="margin-left: 5px">
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
            标题：
          </el-col>
          <el-col>
            <el-input
                type="text"
                placeholder="请输入内容"
                v-model="newTask.title"
                maxlength="30"
                show-word-limit
                style="width: 70%;margin-top: 4px">
            </el-input>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col>
            详细内容：
          </el-col>
          <el-col>
            <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="newTask.content"
                style="width: 90%;margin-top: 4px"
                :autosize="{ minRows: 10, maxRows: 40}">
            </el-input>
          </el-col>
        </el-row>
        <div v-if="newTask.type==='PROGRAM'" style="display: flex;justify-content: space-between;margin-top: 20px">
          <el-row>
            <el-col>
              支出：
            </el-col>
            <el-col>
              <el-input v-model="newTask.expenditure">
                <template slot="append">元</template>
              </el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              收入：
            </el-col>
            <el-col>
              <el-input v-model="newTask.revenue">
                <template slot="append">元</template>
              </el-input>
            </el-col>
          </el-row>
        </div>

      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTask">确 定</el-button>
      </span>
    </el-dialog>
    <!--      task详情面板-->
    <el-dialog
        title="详情"
        :visible.sync="detailsDialogVisible"
        width="60%">
      <div style="margin-left: 5px">
        <el-row style="display: flex;justify-content: space-between">
          <el-col >
            {{this.detailsTask.type==='LOG'?'工作汇报':'项目申报'}}
          </el-col>
          <el-col style="display: flex">
            审核人:{{this.detailsTask.auditor}}
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col>
            {{'标题：'+detailsTask.title}}
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <div>
            详细内容：
          </div>
          <el-col>
            <div style="height: 200px;border: 1px solid #dedede;border-radius: 4px">
              {{detailsTask.content}}
            </div>
          </el-col>
        </el-row>
        <div v-if="detailsTask.type==='PROGRAM'" style="display: flex;margin-top: 20px">
          <el-row v-if="detailsTask.expenditure!=null">
              <el-col>
                {{'支出：'+detailsTask.expenditure+'元'}}
              </el-col>
          </el-row>
          <el-row style="margin-left: 100px" v-if="detailsTask.revenue!=null">
            <el-col>
              {{'收入：'+detailsTask.revenue+'元'}}
            </el-col>
          </el-row>
        </div>
        <div >
          <el-row style="margin-top: 10px">
            {{'审核意见：'+(detailsTask.auditResult==null?'':detailsTask.auditResult)}}
          </el-row>
          <el-row style="margin-top: 10px" v-if="detailsTask.type==='PROGRAM'">
            {{'财务部意见：'+(detailsTask.fAuditResult==null?'':detailsTask.fAuditResult)}}
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Tasks from '@/api/Tasks.json'

export default {
  name: "TaskApply",
  data() {
    return {
      tasks: Tasks,
      employee: null,
      deps: null,
      loading: false,
      visible: false,
      total: 20,
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
      title: '',
      addDialogVisible: false,
      detailsDialogVisible:false,
      newTask: {
        type: 'LOG',
        state:'AUDIT',
        title: '',
        content: '',
        applierWorkID: null,
        auditorWorkID: null,
        expenditure: null,
        revenue: null
      },
      detailsTask:{
        type:'',
        auditor:'',
        title:'',
        content:'',
        expenditure: null,
        revenue:null,
      },
      options: [
        {
          label: '工作汇报',
          value: 'LOG'
        },
        {
          label: '项目申报',
          value: 'PROGRAM'
        }
      ],
    }
  },
  mounted() {
    this.initTasks();
    this.initData();
  },
  methods: {
    initTasks() {
      this.getRequest('/task/?currentPage='
          + this.currentPage + '&size=' + this.size + '&title=' + this.title).then(resp => {
        this.tasks = resp.data;
        this.total = resp.total;
      })
    },
    initData() {
      this.getRequest("/task/deps").then(resp => {
        if (resp) {
          this.deps = resp;
        }
      });
      this.getRequest('/task/employee').then(resp => {
        if (resp) {
          this.employee = resp;
          this.inputDep.name = resp.department.name;
          this.inputDep.id = resp.department.id;
        }
      });
    },
    changeDepEmps() {
      this.getRequest('/task/depEmps?id=' + this.inputDep.id).then(resp => {
        if (resp) {
          this.inputDepEmps = resp;
        }
      })
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initTasks();
    },
    sizeChange(size) {
      this.size = size;
      this.initTasks();
    },
    prevClick(currentPage) {
      this.currentPage = this.currentPage - 1;
      this.initTasks();
    },
    nextClick(currentPage) {
      this.currentPage = this.currentPage + 1;
      this.initTasks();
    },
    searchTasks() {
      this.currentPage = 1;
      this.initTasks();
    },
    showAddView() {
      this.addDialogVisible = true;
      this.changeDepEmps();
    },
    handleNodeClick(data) {
      this.inputDep.name = data.name;
      this.inputDep.id = data.id;
      this.visible = !this.visible;
    },
    showDepView() {
      this.visible = !this.visible;
    },
    addTask() {
      this.newTask.applierWorkID = this.employee.workID
      this.postRequest('/task/',this.newTask).then(resp=>{
        if(resp){
          this.initTasks();
          this.newTask=this.$options.data().newTask;
          this.addDialogVisible=false;
        }
      })
    },
    showDetails(data){
      this.getRequest('/task/auditor?auditorWorkID='+data.auditorWorkID).then(resp=>{
        if (resp) {
          this.detailsTask=JSON.parse(JSON.stringify(data));
          this.detailsTask.auditor=resp.name;
          this.detailsDialogVisible=true;
        }
      });
    },
    deleteTask(data){
      if(data.state==='AUDIT'||data.state==='FINANCE_AUDIT'){
        this.$confirm('此操作将撤回审核, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/task/?id='+data.id).then(resp=>{
            this.initTasks();
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
    }
  }
}
</script>

<style scoped>

</style>
