<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <el-button type="primary" icon="el-icon-plus" round @click="showAddView">添加工资账套</el-button>
      <el-button type="success" icon="el-icon-refresh" round @click="initSalaries"></el-button>
    </div>
    <!--    展示表格-->
    <div style="margin-top: 10px">
      <el-table
          :data="salaries"
          border
          stripe>
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="name" label="账套名称" width="120"></el-table-column>
        <el-table-column prop="basicSalary" label="基本工资" width="70"></el-table-column>
        <el-table-column prop="trafficSalary" label="交通补助" width="70"></el-table-column>
        <el-table-column prop="lunchSalary" label="午餐补助" width="70"></el-table-column>
        <el-table-column prop="bonus" label="奖金" width="70"></el-table-column>
        <el-table-column prop="createDate" label="启用时间" width="100"></el-table-column>
        <el-table-column label="养老金" align="center">
          <el-table-column prop="pensionPer" label="比率" width="70"></el-table-column>
          <el-table-column prop="pensionBase" label="基数" width="70"></el-table-column>
        </el-table-column>
        <el-table-column label="医疗保险" align="center">
          <el-table-column prop="medicalPer" label="比率" width="70"></el-table-column>
          <el-table-column prop="medicalBase" label="基数" width="70"></el-table-column>
        </el-table-column>
        <el-table-column label="公积金" align="center">
          <el-table-column prop="accumulationFundPer" label="比率" width="70"></el-table-column>
          <el-table-column prop="accumulationFundBase" label="基数" width="70"></el-table-column>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" round @click="showEditView(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" round @click="deleteSalary(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--    编辑面板-->
    <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="50%">
      <div>
        <el-steps :active="activeStep">
          <el-step title="基本信息"></el-step>
          <el-step title="养老金"></el-step>
          <el-step title="医疗保险"></el-step>
          <el-step title="公积金"></el-step>
        </el-steps>
        <div v-show="activeStep==0">
          <div style="margin-top: 10px">账套名称：
            <el-input v-model="newSalary.name" placeholder="请输入账套名称" style=" width: 200px"></el-input>
          </div>
          <div style="margin-top: 10px">基本工资：
            <el-input v-model="newSalary.basicSalary" placeholder="请输入基本工资" style=" width: 200px"></el-input>
          </div>
          <div style="margin-top: 10px">交通补助：
            <el-input v-model="newSalary.trafficSalary" placeholder="请输入交通补助" style=" width: 200px"></el-input>
          </div>
          <div style="margin-top: 10px">午餐补助：
            <el-input v-model="newSalary.lunchSalary" placeholder="请输入午餐补助" style=" width: 200px"></el-input>
          </div>
          <div style="margin-top: 10px">奖金：
            <el-input v-model="newSalary.bonus" placeholder="请输入奖金" style=" width: 200px"></el-input>
          </div>
        </div>
        <div v-show="activeStep==1">
          <div style="margin-top: 10px">养老金比率：
            <el-input v-model="newSalary.pensionPer" placeholder="请输入养老金比率" style=" width: 200px"></el-input>
          </div>
          <div style="margin-top: 10px">养老金基数：
            <el-input v-model="newSalary.pensionBase" placeholder="请输入养老金基数" style=" width: 200px"></el-input>
          </div>
        </div>
        <div v-show="activeStep==2">
          <div style="margin-top: 10px">医疗保险比率：
            <el-input v-model="newSalary.medicalPer" placeholder="请输入医疗保险比率" style=" width: 200px"></el-input>
          </div>
          <div style="margin-top: 10px">医疗保险基数：
            <el-input v-model="newSalary.medicalBase" placeholder="请输入医疗保险基数" style=" width: 200px"></el-input>
          </div>
        </div>
        <div v-show="activeStep==3">
          <div style="margin-top: 10px">公积金比率：
            <el-input v-model="newSalary.accumulationFundPer" placeholder="请输入公积金比率" style=" width: 200px"></el-input>
          </div>
          <div style="margin-top: 10px">公积金基数：
            <el-input v-model="newSalary.accumulationFundBase" placeholder="请输入公积金基数" style=" width: 200px"></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="preStep">{{ activeStep == 0 ? '取消' : '上一步' }}</el-button>
        <el-button size="small" type="primary" @click="nextStep">{{ activeStep == 3 ? '完成' : '下一步' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import salaries from "@/api/salaries.json"

export default {
  name: "FinSob",
  data() {
    return {
      activeStep: 0,
      dialogTitle: '',
      dialogVisible: false,
      salaries: salaries,
      newSalary: {
        'id': null,
        'basicSalary': null,
        'trafficSalary': null,
        'bonus': null,
        'lunchSalary': null,
        'allSalary': null,
        'pensionBase': null,
        'pensionPer': null,
        'createDate': '',
        'medicalBase': null,
        'medicalPer': null,
        'accumulationFundBase': null,
        'accumulationFundPer': null,
        'name': ''
      }
    }
  },
  mounted() {
    this.initSalaries();
  },
  methods: {
    preStep() {
      if (this.activeStep == 0) {
        this.dialogVisible = false;
      } else {
        this.activeStep--;
      }
    },
    nextStep() {
      if (this.activeStep == 3) {
        if (this.newSalary.id) {
          //更新账套
          this.putRequest('salary/sob/', this.newSalary).then(resp => {
            if (resp) {
              this.initSalaries();
              this.dialogVisible = false;
              this.newSalary = this.$options.data().newSalary;
            }
          });
        } else {
          //添加账套
          this.postRequest('/salary/sob/', this.newSalary).then(resp => {
            if (resp) {
              this.initSalaries();
              this.dialogVisible = false;
              this.newSalary = this.$options.data().newSalary;
            }
          });
        }

      } else {
        this.activeStep++;
      }
    },
    showAddView() {
      this.dialogTitle = '添加工资账套';
      this.newSalary = this.$options.data().newSalary;
      this.activeStep = 0;
      this.dialogVisible = true;
    },
    showEditView(data) {
      this.dialogTitle = '编辑工资账套';
      this.newSalary = data;
      this.activeStep = 0;
      this.dialogVisible = true;
    },
    //加载工资账套数据
    initSalaries() {
      this.getRequest('/salary/sob/').then(resp => {
        if (resp) {
          this.salaries = resp;
        }
      });
    },
    //  删除工资账套
    deleteSalary(data) {
      this.$confirm('此操作将删除[' + data.name + ']工资账套, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/salary/sob/' + data.id).then(resp => {
          if (resp) {
            this.initSalaries();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
    //  编辑工资账套
  }
}
</script>

<style scoped>

</style>
