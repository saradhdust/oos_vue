<template>
<div>
  <el-tabs type="card" v-model="active">
    <el-tab-pane label="工作汇报" name="TaskApply">
      <TaskApply></TaskApply>
    </el-tab-pane>
    <el-tab-pane label="任务审核" name="TaskAudit">
      <TaskAudit></TaskAudit>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import TaskApply from "@/components/office/TaskApply";
import TaskAudit from "@/components/office/TaskAudit";

export default {
  name: "OffTask",
  components:{
    TaskApply,
    TaskAudit
  },
  data(){
    return{
      active:'TaskApply',
    }
  }
}
</script>

<style scoped>

</style>
