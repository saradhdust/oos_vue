<template>
  <div>
    <el-tabs type="card" v-model="active">
      <el-tab-pane label="请假申请" name="LeaveApply">
        <LeaveApply></LeaveApply>
      </el-tab-pane>
      <el-tab-pane label="请假审核" name="LeaveAudit">
        <LeaveAudit></LeaveAudit>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import LeaveApply from "@/components/office/LeaveApply";
import LeaveAudit from "@/components/office/LeaveAudit";

export default {
  name: "OffLeave",
  components:{
    LeaveApply,
    LeaveAudit
  },
  data(){
    return{
      active:'LeaveApply',
    }
  }
}
</script>

<style scoped>

</style>
