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
        <el-radio v-model="selectedState" label="">全部</el-radio>
        <el-radio v-model="selectedState" label="FINANCE_AUDIT">未审核</el-radio>
        <el-button type="primary" icon="el-icon-search" @click="searchTasks" round>查询</el-button>
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
        <el-table-column prop="applier.name" label="填写人" width="100"></el-table-column>
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
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button style="padding: 3px" size="mini" @click="showDetails(scope.row)">查看</el-button>
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
      <!--      task详情面板-->
      <el-dialog
          title="详情"
          :visible.sync="dialogVisible"
          width="60%">
        <div style="margin-left: 5px">
          <el-row style="display: flex;justify-content: space-between">
            <el-col>
              {{ this.detailsTask.type === 'LOG' ? '工作汇报' : '项目申报' }}
            </el-col>
            <el-col style="display: flex">
              申请人:{{ this.detailsTask.applier.name }}
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-col>
              {{ '标题：' + detailsTask.title }}
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <div>
              详细内容：
            </div>
            <el-col>
              <div style="height: 200px;border: 1px solid #dedede;border-radius: 4px">
                {{ detailsTask.content }}
              </div>
            </el-col>
          </el-row>
          <div v-if="detailsTask.type==='PROGRAM'" style="display: flex;margin-top: 20px">
            <el-row v-if="detailsTask.expenditure!=null">
              <el-col>
                {{ '支出：' + detailsTask.expenditure + '元' }}
              </el-col>
            </el-row>
            <el-row style="margin-left: 100px" v-if="detailsTask.revenue!=null">
              <el-col>
                {{ '收入：' + detailsTask.revenue + '元' }}
              </el-col>
            </el-row>
          </div>
          <div>
            <el-row style="margin-top: 10px">
              {{'审核意见：'+(detailsTask.auditResult==null?'':detailsTask.auditResult)}}
            </el-row>
          </div>
          <div v-if="detailsTask.state==='FINANCE_AUDIT'">
            <el-row style="margin-top: 10px">
              <el-col>
                财务部审核意见：
              </el-col>
              <el-col>
                <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="detailsTask.fAuditResult"
                    style="width: 100%;margin-top: 4px"
                    :autosize="{ minRows: 3, maxRows: 10}">
                </el-input>
              </el-col>
            </el-row>
          </div>
          <div v-else>
            <el-row style="margin-top: 10px" v-if="detailsTask.type==='PROGRAM'">
              {{'财务部意见：'+(detailsTask.fAuditResult==null?'':detailsTask.fAuditResult)}}
            </el-row>
          </div>
        </div>
        <span slot="footer" class="dialog-footer" style="margin-top: 2px" v-if="detailsTask.state==='FINANCE_AUDIT'">
            <el-button @click="refuseTask">驳 回</el-button>
            <el-button type="primary" @click="passTask">通 过</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "FinIomanage",
  data() {
    return {
      total: null,
      currentPage: 1,
      size: 10,
      loading: false,
      selectedState: '',
      title: '',
      tasks: null,
      detailsTask: {
        applier: '',
        title: '',
        content: '',
        type: '',
        state:'',
        expenditure: '',
        revenue: '',
        auditResult:'',
        fAuditResult:''
      },
      dialogVisible: false,
    }
  },
  mounted() {
    this.initTasks();
  },
  methods: {
    initTasks() {
      this.getRequest('/task/finTask?currentPage='
          + this.currentPage + '&size=' + this.size + '&title=' + this.title + '&state=' + this.selectedState)
          .then(resp => {
            if (resp) {
              this.tasks = resp.data;
              this.total = resp.total;
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
    showDetails(data) {
      this.detailsTask = JSON.parse(JSON.stringify(data));
      this.dialogVisible = true
    },
    refuseTask(){
      this.postRequest('/task/refuse',this.detailsTask).then(resp=>{
        if(resp){
          this.initTasks();
          this.dialogVisible=false;
        }
      })
    },
    passTask(){
      this.postRequest('/task/pass',this.detailsTask).then(resp=>{
        if(resp){
          this.initTasks();
          this.dialogVisible=false;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
