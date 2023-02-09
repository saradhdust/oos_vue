<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <div>
        <el-radio v-model="selectedState" label="">全部</el-radio>
        <el-radio v-model="selectedState" label="AUDIT">未审核</el-radio>
        <el-button type="primary" icon="el-icon-search" @click="searchLeave" round>查询</el-button>
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
        <el-table-column prop="applier.name" label="申请人" width="100"></el-table-column>
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
        <el-table-column label="操作" width="142">
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
            <el-col style="display: flex">
              申请人:{{ this.detailsLeave.applier.name }}
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-row>
              <el-col>
                {{ '开始时间：' + detailsLeave.beginDate }}
              </el-col>
            </el-row>
            <el-row style="margin-top: 20px">
              <el-col>
                {{ '结束时间：' + detailsLeave.endDate }}
              </el-col>
            </el-row>
          </el-row>
          <el-row style="margin-top: 10px">
            <div>
              请假理由：
            </div>
            <el-col>
              <div style="height: 200px;border: 1px solid #dedede;border-radius: 4px">
                {{ detailsLeave.reason }}
              </div>
            </el-col>
          </el-row>
        </div>
        <div v-if="detailsLeave.state==='AUDIT'">
          <el-row style="margin-top: 10px">
            <el-col>
              审核意见：
            </el-col>
            <el-col>
              <el-input
                  type="textarea"
                  placeholder="请输入内容"
                  v-model="detailsLeave.auditResult"
                  style="width: 100%;margin-top: 4px"
                  :autosize="{ minRows: 3, maxRows: 10}">
              </el-input>
            </el-col>
          </el-row>
        </div>
        <div v-else>
          <el-row style="margin-top: 10px">
            {{ '审核意见：' + (detailsLeave.auditResult == null ? '' : detailsLeave.auditResult) }}
          </el-row>
        </div>

    <span slot="footer" class="dialog-footer" style="margin-top: 2px" v-if="detailsLeave.state==='AUDIT'">
            <el-button @click="refuseLeave">驳 回</el-button>
            <el-button type="primary" @click="passLeave">通 过</el-button>
        </span>
    </el-dialog>
  </div>
  </div>
</template>

<script>
export default {
  name: "LeaveAudit",
  data() {
    return {
      total: null,
      currentPage: 1,
      size: 10,
      loading: false,
      selectedState: '',
      title: '',
      leaves: null,
      detailsLeave: {
        applier: {
          name:'',
        },
        beginDate: null,
        endDate: null,
        state: '',
        auditResult: '',
        reason: ''
      },
      dialogVisible: false,
    }
  },
  mounted() {
    this.initLeave();
  },
  methods: {
    initLeave() {
      this.getRequest('/leave/auditorLeave?currentPage='
          + this.currentPage + '&size=' + this.size + '&state=' + this.selectedState)
          .then(resp => {
            if (resp) {
              this.leaves = resp.data;
              this.total = resp.total;
            }
          })
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initLeave();
    },
    sizeChange(size) {
      this.size = size;
      this.initLeave();
    },
    prevClick(currentPage) {
      this.currentPage = this.currentPage - 1;
      this.initLeave();
    },
    nextClick(currentPage) {
      this.currentPage = this.currentPage + 1;
      this.initLeave();
    },
    searchLeave() {
      this.currentPage = 1;
      this.initLeave();
    },
    showDetails(data) {
      this.detailsLeave = JSON.parse(JSON.stringify(data));
      this.dialogVisible = true
    },
    refuseLeave() {
      this.postRequest('/leave/refuse', this.detailsLeave).then(resp => {
        if (resp) {
          this.initLeave();
          this.dialogVisible = false;
        }
      })
    },
    passLeave() {
      this.postRequest('/leave/pass', this.detailsLeave).then(resp => {
        if (resp) {
          this.initLeave();
          this.dialogVisible = false;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
