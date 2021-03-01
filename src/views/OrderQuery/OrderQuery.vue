<template>
  <div class="order-query">
    <div v-if="this.permission">
      <title-bar :title="title"></title-bar>
      <div class="query-form">
        <el-form ref="form"
                 label-position="center"
                 :model="form"
                 label-width="80px">
          <el-form-item label="设备名:">
            <el-input maxlength="20"
                      placeholder="请输入设备名"
                      v-model="form.deviceName"
                      style="width:100%;"></el-input>
          </el-form-item>
          <el-form-item label="工单状态:"
                        v-show="this.myOrderType === '3' || this.myOrderType === '4'">
            <el-select v-model="form.status"
                       clearable
                       multiple
                       placeholder="请选择">
              <el-option v-for="item in statusOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="紧急程度:">
            <el-select v-model="form.level"
                       clearable
                       placeholder="请选择">
              <el-option v-for="item in levelOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所在位置:">
            <el-select v-model="form.devicePositionId"
                       clearable
                       filterable
                       placeholder="请选择">
              <el-option v-for="item in devicePositionOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工单类型:">
            <el-select v-model="form.type">
              <el-option label="维修工单"
                         value="0"></el-option>
              <el-option label="保养工单"
                         value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报单时间:">
            <el-date-picker type="date"
                            placeholder="开始日期"
                            @focus="noBulletFrame"
                            v-model="form.createTimeStart"></el-date-picker>
            <div>至</div>
            <el-date-picker type="date"
                            placeholder="结束日期"
                            @focus="noBulletFrame"
                            v-model="form.createTimeEnd"></el-date-picker>
          </el-form-item>
          <el-form-item label="被指派人:"
                        v-show="this.myOrderType === '1' || this.myOrderType === '4'">
            <el-input type="text"
                      v-model="this.$store.state.orderAssigned.username"
                      disabled
                      style="width:50%;"></el-input>
            <el-button type="primary"
                       size="small"
                       @click.prevent="chooseAssignedUser"
                       style="margin-left: 2rem;">选择指派人</el-button>
          </el-form-item>
          <el-form-item label="工单描述:">
            <el-input type="textarea"
                      maxlength="100"
                      placeholder="请输入工单描述"
                      v-model="form.description"
                      style="width:100%;"></el-input>
          </el-form-item>
          <div class="form-btn">
            <button class="btn"
                    @click.prevent="queryOrder">查询工单</button>
          </div>
        </el-form>
      </div>
    </div>
    <div v-else
         class="no-permission">
      <span class="tips">您暂时无法查看此页</span>
    </div>
  </div>
</template>

<script>
import TitleBar from '../../components/TitleBar'
export default {
  data () {
    return {
      myOrderType: '', // 0 创建  1 检查  2 指派   3 我接的单  4所有 5历史工单
      title: '筛选条件',
      form: {
        status: '', // 工单状态
        level: '', // 紧急程度
        type: '', // 工单类型
        createTimeStart: new Date().setDate(1), // 创建时间 默认当月第一天
        createTimeEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), // 结束时间 默认当月最后一天
        leaderOrMonitorUserId: '', // 负责人或班长id
        checkUserId: '', // 检查人id
        createUserId: '', // 报单人id
        description: '', // 描述
        assignUserId: '', // 被指派人
        unEdit: '0',
        deviceName: '',
        devicePositionId: ''
      },
      permission: true,
      devicePositionOptions: [],
      levelOptions: [
        { label: '普通', value: 0 },
        { label: '优先', value: 1 },
        { label: '紧急', value: 2 }
      ],
      statusOptions: [
        { label: '待指派', value: 0 },
        { label: '待处理', value: 1 },
        { label: '处理中', value: 2 },
        { label: '等待配件', value: 3 },
        { label: '委外维修', value: 8 },
        { label: '待返工', value: 4 },
        { label: '待结单', value: 5 },
        { label: '已结单', value: 6 },
        { label: '已作废', value: 7 }
      ],
    }
  },
  components: {
    TitleBar
  },
  methods: {
    // 输入法不弹出
    noBulletFrame () {
      document.activeElement.blur()
    },
    getType () {
      this.myOrderType = this.$route.query.myOrderType

      // myOrderType和权限判断
      if (this.myOrderType === '2') {
        this.permission = this.$isAuth('设备负责人')
      }
    },
    queryOrder () {
      // 校验
      if (new Date(this.form.createTimeStart).getTime() > new Date(this.form.createTimeEnd).getTime()) {
        this.$message.error('工单时间间隔有误，结束时间大于开始时间')
      } else {
        // 对时间处理
        if (!this.form.createTimeStart) {
          // this.form.createTimeStart === '' || this.form.createTimeStart === null
          this.form.createTimeStart = null
        } else {
          this.form.createTimeStart = new Date(this.form.createTimeStart).Format("yyyy-MM-dd hh:mm:ss")
        }

        if (!this.form.createTimeEnd) {
          this.form.createTimeEnd = null
        } else {
          this.form.createTimeEnd = new Date(this.form.createTimeEnd).Format("yyyy-MM-dd hh:mm:ss")
        }

        // 被指派人的id  如果有被指派人的话执行
        let assignedUser = this.$store.state.orderAssigned || {}
        if (assignedUser) {
          this.form.assignUserId = assignedUser.id
        }

        if (this.myOrderType == '0') {  // 我创建的
          this.form.createUserId = sessionStorage.getItem('userId')
        } else if (this.myOrderType == '1') { // 我检查的
          this.form.checkUserId = sessionStorage.getItem('userId')
          this.form.status = 5
        } else if (this.myOrderType == '2') {  // 等我指派的
          this.form.status = 0
          this.form.leaderOrMonitorUserId = sessionStorage.getItem('userId')
        } else if (this.myOrderType == '3') {
          this.form.assignUserId = sessionStorage.getItem('userId')
        } else if (this.myOrderType == '5') {
          this.form.unEdit = '1' // 这里过去的工单是不可以编辑的
          this.form.deviceId = this.$route.query.deviceId
        }

        // 跳转到工单记录页面再请求数据
        this.$router.push({ name: 'record', query: this.form })
      }
    },
    chooseAssignedUser () {
      // 拿到地区id
      let areaId = sessionStorage.getItem('areaId')
      this.$router.push({
        name: 'choose',
        query: {
          areaId,
          isMulti: false,
          tag: 'assigned'
        }
      })
    },
    getOptions () {
      this.$http.httpGet('/app/tbDevicePosition/listAll')
        .then(res => {
          if (res.code === 0 && res.msg === 'success') {
            this.devicePositionOptions = res.data
          } else {
            this.$message.error('获取所在地点信息失败，原因:' + res.msg)
          }
        })
    }
  },
  created () {
    this.getType()
    this.getOptions()
  },
}
</script>

<style lang="scss">
@import '@/assets/style/global.scss';
.order-query {
  // text-align: center;
  padding: 15px 20px;
  .query-form {
    margin-top: 0;
    .el-form-item {
      margin-top: 10px;
      margin-bottom: 0;
      .el-form-item__label {
        // font-weight: 700;
        color: #000;
        font-size: 15px;
      }
      .el-form-item__content {
        .el-select {
          width: 100%;
        }
        .el-input {
          width: 100%;
        }
        .el-textarea__inner {
          height: 80px;
        }
      }
    }
    .form-btn {
      // position: fixed;
      // bottom: 0;
      // left: 0;
      width: 100%;
      margin-top: 30px;
      z-index: 99;
      border-top: 1px #efefef solid;
      border-bottom: 1px #efefef solid;
      button {
        width: calc(100% - 40px);
        height: 40px;
        margin: 10px auto;
        display: block;
        font-weight: 700;
        font-size: 14px;
        background-color: rgb(17, 216, 17);
      }
    }
  }
  .no-permission {
    width: 100%;
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    margin-top: 2rem;
    .tips {
      font-size: 1.6rem;
    }
  }
}
.el-input.is-disabled .el-input__inner {
  background-color: #eee;
  border-color: #e4e7ed;
  color: #333;
  opacity: 0.8;
  -webkit-text-fill-color: #333;
  cursor: not-allowed;
}
</style>
