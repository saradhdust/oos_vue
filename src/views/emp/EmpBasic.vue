<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <div>
        <el-input style="width: 300px;margin-right: 10px" placeholder="请输入员工名进行搜索"
                  prefix-icon="el-icon-search"
                  v-model="empName"
                  @keydown.enter.native="initEmps"
                  @clear="initEmps"
                  clearable></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchEmp" round>搜索</el-button>
        <el-button type="primary" round><i class="fa fa-angle-double-down" aria-hidden="true"></i>高级搜索</el-button>
      </div>
      <div>
        <el-upload
            style="display: inline-flex;margin-right: 8px"
            :headers="headers"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="onSuccess"
            :on-error="onError"
            :disabled="importBtnDisabled"
            action="/employee/basic/import">
          <el-button type="success" :icon="importBtnIcon" :disabled="importBtnDisabled" round>
            {{ importBtnText }}
          </el-button>
        </el-upload>
        <el-button type="success" icon="el-icon-download" round @click="exportData">
          导出数据
        </el-button>
        <el-button type="primary" icon="el-icon-plus" round @click="showAddView">添加员工</el-button>
      </div>
    </div>
    <div style="margin-top: 10px">
      <!--      员工表格-->
      <el-table
          :data="emps"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          border
          style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="姓名" width="90" align="left" fixed="left"></el-table-column>
        <el-table-column prop="workID" label="工号" width="85" align="left"></el-table-column>
        <el-table-column prop="gender" label="性别" width="40" align="left"></el-table-column>
        <el-table-column prop="birthday" label="出生日期" width="95" align="left"></el-table-column>
        <el-table-column prop="idCard" label="身份证号" width="150" align="left"></el-table-column>
        <el-table-column prop="wedlock" label="婚姻状况" width="70" align="left"></el-table-column>
        <el-table-column prop="nation.name" label="民族" width="50" align="left"></el-table-column>
        <el-table-column prop="nativePlace" label="籍贯" width="80" align="left"></el-table-column>
        <el-table-column prop="politicsStatus.name" label="政治面貌" width="100" align="left"></el-table-column>
        <el-table-column prop="email" label="电子邮件" width="180" align="left"></el-table-column>
        <el-table-column prop="phone" label="电话号码" width="100" align="left"></el-table-column>
        <el-table-column prop="address" label="联系地址" width="250" align="left"></el-table-column>
        <el-table-column prop="department.name" label="所属部门" width="100" align="left"></el-table-column>
        <el-table-column prop="joblevel.name" label="职称" width="100" align="left"></el-table-column>
        <el-table-column prop="position.name" label="职位" width="100" align="left"></el-table-column>
        <el-table-column prop="engageForm" label="聘用形式" width="100" align="left"></el-table-column>
        <el-table-column prop="tiptopDegree" label="最高学历" width="80" align="left"></el-table-column>
        <el-table-column prop="school" label="毕业院校" width="150" align="left"></el-table-column>
        <el-table-column prop="specialty" label="专业" width="150" align="left"></el-table-column>
        <el-table-column prop="workState" label="在职状态" width="70" align="left"></el-table-column>
        <el-table-column prop="beginDate" label="入职日期" width="95" align="left"></el-table-column>
        <el-table-column prop="conversionTime" label="转正日期" width="95" align="left"></el-table-column>
        <el-table-column prop="beginContract" label="合同起始日期" width="95" align="left"></el-table-column>
        <el-table-column prop="endContract" label="合同结束日期" width="95" align="left"></el-table-column>
        <el-table-column prop="contractTerm" label="合同期限" width="100" align="left">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.contractTerm }}</el-tag>
            年
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button style="padding: 3px" size="mini" @click="showEditView(scope.row)">编辑</el-button>
            <el-button style="padding: 3px" size="mini" type="primary">查看高级资料</el-button>
            <el-button style="padding: 3px" size="mini" type="danger" @click="deleteEmp(scope.row)">删除</el-button>
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
      <!--      添加&编辑员工编辑面板-->
      <el-dialog
          :title="title"
          :visible.sync="dialogVisible"
          width="80%">
        <div>
          <el-form ref="empForm" :model="emp" :rules="rules">
            <el-row>
              <el-col :span="6">
                <el-form-item label="姓名：" prop="name">
                  <el-input size="mini" style="width:150px" prefix-icon="el-icon-edit" v-model="emp.name"
                            placeholder="请输入姓名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="性别：" prop="gender">
                  <el-radio-group v-model="emp.gender">
                    <el-radio label="男">男</el-radio>
                    <el-radio label="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="出生日期：" prop="birthday">
                  <el-date-picker
                      v-model="emp.birthday"
                      type="date"
                      size="mini"
                      style="width: 150px"
                      value-format="yyyy-MM-dd"
                      placeholder="出生日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="政治面貌：" prop="politicId">
                  <el-select v-model="emp.politicId" size="mini" style="width: 200px" placeholder="政治面貌">
                    <el-option
                        v-for="item in politicsStatus"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="民族：" prop="nationId">
                  <el-select v-model="emp.nationId" size="mini" style="width: 150px" placeholder="民族">
                    <el-option
                        v-for="item in nations"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="籍贯：" prop="nativePlace">
                  <el-input size="mini" style="width:150px" prefix-icon="el-icon-edit" v-model="emp.nativePlace"
                            placeholder="请输入籍贯"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="电子邮箱：" prop="email">
                  <el-input size="mini" style="width:150px" prefix-icon="el-icon-message" v-model="emp.email"
                            placeholder="请输入邮箱"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="联系地址：" prop="address">
                  <el-input size="mini" style="width:200px" prefix-icon="el-icon-edit" v-model="emp.address"
                            placeholder="请输入地址"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="职位：" prop="posId">
                  <el-select v-model="emp.posId" size="mini" style="width: 150px" placeholder="职位">
                    <el-option
                        v-for="item in positions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="职称：" prop="jobLevelId">
                  <el-select v-model="emp.jobLevelId" size="mini" style="width: 150px" placeholder="职称">
                    <el-option
                        v-for="item in jobLevels"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="所属部门：" prop="departmentId">
                  <el-popover
                      placement="bottom"
                      title="请选择部门"
                      trigger="click">
                    <el-tree :data="allDeps"
                             :props="defaultProps"
                             default-expand-all
                             @node-click="handleNodeClick">
                    </el-tree>
                    <div
                        slot="reference"
                        style="width: 150px;display: inline-flex;border: 1px solid #dedede;height: 24px;
                               border-radius: 5px;cursor: pointer;align-items: center;
                               font-size: 13px;padding-left: 8px;box-sizing: border-box"
                        @click="showDepView">{{ inputDepName }}
                    </div>
                  </el-popover>

                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="电话号码：" prop="phone">
                  <el-input size="mini" style="width:200px" prefix-icon="el-icon-phone" v-model="emp.phone"
                            placeholder="请输入电话号码"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="工号：" prop="workID">
                  <el-input size="mini" style="width:150px" prefix-icon="el-icon-edit" v-model="emp.workID"
                            placeholder="请输入工号" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="学历：" prop="tiptopDegree">
                  <el-select v-model="emp.tiptopDegree" size="mini" style="width: 150px" placeholder="学历">
                    <el-option
                        v-for="item in tiptopDegree"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="毕业院校：" prop="school">
                  <el-input size="mini" style="width:150px" prefix-icon="el-icon-edit" v-model="emp.school"
                            placeholder="请输入院校"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="专业名称：" prop="specialty">
                  <el-input size="mini" style="width:200px" prefix-icon="el-icon-edit" v-model="emp.specialty"
                            placeholder="请输入专业名称"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="入职日期：" prop="beginDate">
                  <el-date-picker
                      v-model="emp.beginDate"
                      type="date"
                      size="mini"
                      style="width: 120px"
                      value-format="yyyy-MM-dd"
                      placeholder="入职日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="转正日期：" prop="conversionTime">
                  <el-date-picker
                      v-model="emp.conversionTime"
                      type="date"
                      size="mini"
                      style="width: 120px"
                      value-format="yyyy-MM-dd"
                      placeholder="转正日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="合同起始日期：" prop="beginContract">
                  <el-date-picker
                      v-model="emp.beginContract"
                      type="date"
                      size="mini"
                      style="width: 120px"
                      value-format="yyyy-MM-dd"
                      placeholder="起始日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="合同截止日期：" prop="endContract">
                  <el-date-picker
                      v-model="emp.endContract"
                      type="date"
                      size="mini"
                      style="width: 170px"
                      value-format="yyyy-MM-dd"
                      placeholder="截止日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="身份证号：" prop="idCard">
                  <el-input size="mini" style="width:180px" prefix-icon="el-icon-edit" v-model="emp.idCard"
                            placeholder="请输入身份证号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="聘用形式：" prop="engageForm">
                  <el-radio-group v-model="emp.engageForm">
                    <el-radio label="劳动合同">劳动合同</el-radio>
                    <el-radio label="劳务合同">劳务合同</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="婚姻状况：" prop="wedlock">
                  <el-radio-group v-model="emp.wedlock">
                    <el-radio label="已婚">已婚</el-radio>
                    <el-radio label="未婚">未婚</el-radio>
                    <el-radio label="离异">离异</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEmp">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import emps from '@/api/emps.json'
import jls from '@/api/jls.json'
import politicsStatus from '@/api/politicStatus.json'
import nations from '@/api/nations.json'
import positions from '@/api/positions.json'
import tiptopDegree from '@/api/tiptopDegree.json'
import Department from '@/api/Department.json'

export default {
  name: "EmpBasic",
  data() {
    return {
      importBtnText: '导入数据',
      importBtnIcon: 'el-icon-upload2',
      importBtnDisabled: false,
      headers: {
        Authorization: window.sessionStorage.getItem('tokenStr')
      },
      title: '',
      emps: emps.data,
      total: emps.total,
      loading: false,
      currentPage: 1,
      size: 10,
      empName: '',
      dialogVisible: false,
      emp: {
        id: null,
        name: '',
        gender: '',
        birthday: '',
        idCard: '',
        wedlock: '',
        nationId: null,
        nativePlace: '',
        politicId: null,
        email: '',
        phone: '',
        address: '',
        departmentId: null,
        jobLevelId: null,
        posId: null,
        engageForm: '',
        tiptopDegree: '',
        specialty: '',
        school: '',
        beginDate: '',
        workState: '在职',
        workID: '-1',
        contractTerm: null,
        conversionTime: '',
        notWorkDate: '',
        beginContract: '',
        endContract: '',
        workAge: null,
        salaryId: null
      },
      nations: nations,
      jobLevels: jls,
      politicsStatus: politicsStatus,
      positions: positions,
      tiptopDegree: tiptopDegree,
      allDeps: Department,
      inputDepName: '',
      visible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rules: {
        name: [{required: true, message: '请输入员工姓名', trigger: 'blur'}],
        gender: [{required: true, message: '请选择性别', trigger: 'blur'}],
        birthday: [{required: true, message: '请输入出生日期', trigger: 'blur'}],
        idCard: [{required: true, message: '请输入身份证号码', trigger: 'blur'}],
        wedlock: [{required: true, message: '请输入婚姻状况', trigger: 'blur'}],
        nationId: [{required: true, message: '请选择民族', trigger: 'blur'}],
        nativePlace: [{required: true, message: '请输入籍贯', trigger: 'blur'}],
        email: [{required: true, message: '请输入邮箱', trigger: 'blur'},
          {type: "email", message: '邮箱地址格式不正确', trigger: 'blur'}],
        phone: [{required: true, message: '请输入电话号码', trigger: 'blur'}],
        address: [{required: true, message: '请输入联系地址', trigger: 'blur'}],
        politicId: [{required: true, message: '请选择政治面貌', trigger: 'blur'}],
        departmentId: [{required: true, message: '请选择部门', trigger: 'blur'}],
        jobLevelId: [{required: true, message: '请选择职称', trigger: 'blur'}],
        posId: [{required: true, message: '请选择职位', trigger: 'blur'}],
        engageForm: [{required: true, message: '请选择聘用形式', trigger: 'blur'}],
        tiptopDegree: [{required: true, message: '请选择学历', trigger: 'blur'}],
        specialty: [{required: true, message: '请输入专业', trigger: 'blur'}],
        school: [{required: true, message: '请输入毕业院校', trigger: 'blur'}],
        beginDate: [{required: true, message: '请选择入职日期', trigger: 'blur'}],
        workState: [{required: true, message: '请输入工作状态', trigger: 'blur'}],
        workID: [{required: true, message: '请输入工号', trigger: 'blur'}],
        contractTerm: [{required: true, message: '请选择合同期限', trigger: 'blur'}],
        conversionTime: [{required: true, message: '请选择转正日期', trigger: 'blur'}],
        notWorkDate: [{required: true, message: '请选择离职日期', trigger: 'blur'}],
        beginContract: [{required: true, message: '请选择合同起始日期', trigger: 'blur'}],
        endContract: [{required: true, message: '请选择合同结束日期', trigger: 'blur'}],
        workAge: [{required: true, message: '请输入工龄', trigger: 'blur'}],
      }
    }
  },
  mounted() {
    this.initEmps();
    this.initData();
  },
  methods: {
    initEmps() {
      this.loading = true;
      //加载 第page页 size行的员工数据
      this.getRequest('/employee/basic/?currentPage='
          + this.currentPage + '&size=' + this.size + '&name=' + this.empName).then(resp => {
        if (resp) {
          this.total = resp.total;
          this.emps = resp.data;
        }
      })
      this.loading = false;
    },
    //员工搜索
    searchEmp(){
      this.currentPage=1;
      this.initEmps();
    },
    initData() {
      //加载民族数据
        this.getRequest('employee/basic/nations').then(resp => {
          if (resp) {
            this.nations = resp;
            window.sessionStorage.setItem('nations', JSON.stringify(this.nations));
          }
        });
      //加载职称数据
        this.getRequest('employee/basic/jobLevels').then(resp => {
          if (resp) {
            this.jobLevels = resp;
            window.sessionStorage.setItem('jobLevels', JSON.stringify(this.jobLevels));
          }
        });
      //加载政治面貌数据
        this.getRequest('employee/basic/politicsStatus').then(resp => {
          if (resp) {
            this.politicsStatus = resp;
            window.sessionStorage.setItem('politicsStatus', JSON.stringify(this.politicsStatus));
          }
        });
      //加载部门数据
        this.getRequest('employee/basic/deps').then(resp => {
          if (resp) {
            this.allDeps = resp;
            window.sessionStorage.setItem('allDeps', JSON.stringify(this.allDeps));
          }
        });
    },
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
    //显示添加员工面板
    showAddView(data) {
      this.title = '添加员工';
      this.emp = this.$options.data().emp;
      this.inputDepName = '';
      //加载职位数据
      this.getRequest('employee/basic/positions').then(resp => {
        if (resp) {
          this.positions = resp;
        }
      });
      //  加载新工号
      this.getRequest('employee/basic/maxWorkID').then(resp => {
        if (resp) {
          this.emp.workID = resp.object;
        }
      });
      this.dialogVisible = true;
    },
    showDepView() {
      this.visible = !this.visible;
    },
    handleNodeClick(data) {
      this.inputDepName = data.name;
      this.emp.departmentId = data.id;
      this.visible = !this.visible;
    },
    //添加&更新员工
    addEmp() {
      if (this.emp.id) {
        this.$refs['empForm'].validate(valid => {
          if (valid) {
            this.putRequest('/employee/basic/', this.emp).then(resp => {
              if (resp) {
                this.initEmps();
                this.dialogVisible = false;
              }
            });
          }
        });
      } else {
        this.$refs['empForm'].validate(valid => {
          if (valid) {
            this.postRequest('/employee/basic/', this.emp).then(resp => {
              if (resp) {
                this.initEmps();
                this.dialogVisible = false;
              }
            });
          }
        });
      }
    },
    //  删除员工
    deleteEmp(data) {
      this.$confirm('此操作将永久删除[' + data.name + ']员工, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/employee/basic/' + data.id).then(resp => {
          if (resp) {
            this.initEmps();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //  显示编辑员工面板
    showEditView(data) {
      this.emp = this.$options.data().emp;
      this.title = '编辑员工信息';
      this.inputDepName = data.department.name;
      //加载职位数据
      this.getRequest('employee/basic/positions').then(resp => {
        if (resp) {
          this.positions = resp;
        }
      });
      this.emp = data;
      this.dialogVisible = true;
    },
    //导出数据
    exportData() {
      this.downLoadRequest('/employee/basic/export');
    },
    //导入数据时改变图标
    beforeUpload() {
      this.importBtnIcon = 'el-icon-loading';
      this.importBtnText = '正在导入';
      this.importBtnDisabled = true;
    },
    //导入成功时改变图标
    onSuccess() {
      this.importBtnIcon = 'el-icon-upload2';
      this.importBtnText = '导入数据';
      this.importBtnDisabled = false;
      this.initEmps();
    },
    //导入失败时改变图标
    onError() {
      this.importBtnIcon = 'el-icon-upload2';
      this.importBtnText = '导入数据';
      this.importBtnDisabled = false;
    }
  }
}
</script>

<style>

</style>
