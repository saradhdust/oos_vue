<template>
  <div>
    <!--员工表格-->
    <el-table
        :data="emps"
        size="mini"
        border
        stripe>
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="name" label="姓名" width="120" align="left" fixed></el-table-column>
      <el-table-column prop="gender" label="性别" width="120" align="left" fixed></el-table-column>
      <el-table-column prop="workID" label="工号" width="120" align="left" fixed></el-table-column>
      <el-table-column prop="phone" label="电话" width="120" align="left" fixed></el-table-column>
      <el-table-column prop="workState" label="在职状态" width="120" align="left" fixed></el-table-column>
      <el-table-column prop="department.name" label="部门" width="120" align="left" fixed></el-table-column>
      <el-table-column label="工资账套" align="center">
        <template slot-scope="scope">
          <el-tooltip placement="right" v-if="scope.row.salary">
            <div slot="content">
              <!--资账套文字提示-->
              <table>
                <tr>
                  <td>基本工资</td>
                  <td>{{ scope.row.salary.basicSalary }}</td>
                </tr>
                <tr>
                  <td>交通补助</td>
                  <td>{{ scope.row.salary.trafficSalary }}</td>
                </tr>
                <tr>
                  <td>午餐补助</td>
                  <td>{{ scope.row.salary.lunchSalary }}</td>
                </tr>
                <tr>
                  <td>奖金</td>
                  <td>{{ scope.row.salary.bonus }}</td>
                </tr>
                <tr>
                  <td>养老金比率</td>
                  <td>{{ scope.row.salary.pensionPer }}</td>
                </tr>
                <tr>
                  <td>养老金基数</td>
                  <td>{{ scope.row.salary.pensionBase }}</td>
                </tr>
                <tr>
                  <td>医疗保险比率</td>
                  <td>{{ scope.row.salary.medicalPer }}</td>
                </tr>
                <tr>
                  <td>医疗保险基数</td>
                  <td>{{ scope.row.salary.medicalBase }}</td>
                </tr>
                <tr>
                  <td>公积金比率</td>
                  <td>{{ scope.row.salary.accumulationFundPer }}</td>
                </tr>
                <tr>
                  <td>公积金基数</td>
                  <td>{{ scope.row.salary.accumulationFundBase }}</td>
                </tr>
              </table>
            </div>
            <el-tag>{{ scope.row.salary.name }}</el-tag>
          </el-tooltip>
          <el-tag v-else>暂未设置</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-popover
              placement="left"
              title="编辑工资账套"
              width="200"
              trigger="click"
              @show="showPop(scope.row.salary)"
              @hide="hidePop(scope.row)">
            <div>
              <el-select v-model="currentSalary" placeholder="请选择" size="mini">
                <el-option
                    v-for="item in salaries"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </div>
            <el-button slot="reference" type="danger" size="mini" round @click="deleteSalary(scope.row)">修改工资账套
            </el-button>
          </el-popover>

        </template>
      </el-table-column>
    </el-table>
    <!--      分页控件-->
    <div style="display: flex;justify-content: flex-end">
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
</template>

<script>
import emps from '@/api/emps.json'
import salaries from '@/api/salaries.json'

export default {
  name: "FinSobcfg",
  data() {
    return {
      emps: emps.data,
      currentPage: 1,
      size: 10,
      total: 0,
      salaries: salaries,
      currentSalary: null
    }
  },
  mounted() {
    this.initEmps();
    this.initSalaries();
  },
  methods: {
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initEmps()
    },
    sizeChange(size) {
      this.size = size;
      this.initEmps();
    },
    prevClick(currentPage) {
      this.currentPage = this.currentPage - 1;
      this.initEmps();
    },
    nextClick(currentPage) {
      this.currentPage = this.currentPage + 1;
      this.initEmps();
    },
    showPop(data) {
      if (data) {
        this.currentSalary = data.id;
      } else {
        this.currentSalary = null;
      }
    },
    hidePop(data) {
      if(!data.salary){
        this.putRequest('/salary/sobcfg/?eid=' + data.id + '&sid=' + this.currentSalary).then(resp => {
          if (resp) {
            this.initEmps();
          }
        });
      } else if (this.currentSalary && this.currentSalary != data.salary.id) {
        this.putRequest('/salary/sobcfg/?eid=' + data.id + '&sid=' + this.currentSalary).then(resp => {
          if (resp) {
            this.initEmps();
          }
        });
      }
    },
    initSalaries() {
      this.getRequest('/salary/sobcfg/salaries').then(resp => {
        if (resp) {
          this.salaries = resp;
        }
      })
    },
    initEmps() {
      this.getRequest('/salary/sobcfg/?currentPage=' + this.currentPage + '&size=' + this.size).then(resp => {
        if (resp) {
          this.emps = resp.data;
          this.total = resp.total;
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
