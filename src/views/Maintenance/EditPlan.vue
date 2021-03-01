<template>
  <div class="edit-plan">
    <div class="edit-wrapper">
      <!-- 中间内容 -->
      <div class="edit-content">
        <el-form label-width="110px"
                 :rules="rules"
                 ref="form"
                 label-position="left"
                 :model="maintainPlan">
          <el-form-item label="设备名称：">
            <span class="item-info">{{deviceInfo.name}}</span>
            <button class="btn item-btn"
                    @click.prevent="toSeeMore">查看详情</button>
          </el-form-item>
          <el-form-item label="保养周期：">
            <el-input v-model="maintainPlan.cycle"
                      style="width: calc(100% - 120px);"></el-input>
            <span class="day"
                  style="font-size: 15px;">天</span>
          </el-form-item>
          <el-form-item label="上次保养时间："
                        v-show="this.editType === '2'">
            <span class="item-info">{{maintainPlan.lastMaintainTime}}</span>
          </el-form-item>
          <el-form-item label="保养负责人：">
            <el-input class="item-info"
                      disabled
                      v-model="this.$store.state.maintenancePerson.username"
                      style="width: 11rem;"></el-input>
            <!-- <span class="item-info">{{maintainPlan.maintainUser}}</span> -->
            <button class="btn item-btn"
                    @click.prevent="choosePerson">选择负责人</button>
          </el-form-item>
<!--          <el-form-item label="负责人电话：">-->
<!--            <span class="item-info phone">{{this.$store.state.maintenancePerson.tel}}</span>-->
<!--          </el-form-item>-->
          <el-form-item label="开始时间：">
            <el-date-picker v-model="maintainPlan.useTime"
                            align="right"
                            type="date"
                            disabled
                            @focus="noBulletFrame"
                            placeholder="选择日期"
                            style="width:100%;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="状态："
                        style="margin-top:2rem;">
            <el-select v-model="maintainPlan.maintainStatus"
                       style="width:100%;">
              <el-option label="启用"
                         value="0"></el-option>
              <el-option label="停用"
                         value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="保养内容:"
                        style="margin-top:2rem;">
            <el-input type="textarea"
                      v-model="maintainPlan.maintainContent"
                      placeholder="保养内容"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 底部 -->
      <div class="edit-bottom">
        <div class="bottom-btn">
          <button class="btn"
                  @click.prevent="confirmThePlan">{{this.editType === '2' ? '确认修改' : '确认添加'}}</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import dic from '../../utils/dictionary'
import { isIOS } from '../../utils/validate'
export default {
  data () {
    return {
      editType: '1', // 编辑类型，1为新增 2为编辑
      deviceId: '',
      deviceCode: '',
      maintainPlan: {}, // 保养计划
      deviceInfo: {}, // 设备信息表
      rules: {
      }
    }
  },
  methods: {
    // 初始化数据
    async init () {
      let query = this.$route.query
      this.editType = query.editType
      this.deviceId = query.id
      this.deviceCode = query.code
      // 拿到设备信息
      await this.$http.httpGet('/app/apptbdevice/queryDeviceByCode', { code: this.deviceCode }).then(res => {
        if (res.code === 0 && res.msg === 'success') {
          this.deviceInfo = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
      // 拿到保养信息
      await this.$http.httpGet('/app/apptbdevice/maintainPlan', { id: this.deviceId }).then(res => {
        if (res.code === 0 && res.msg === 'success') {
          this.maintainPlan = res.data
          // 判断是否是iPhone
          this.maintainPlan.useTime = isIOS() ? new Date(this.maintainPlan.useTime.replace(/-/g, '/')) : new Date(this.maintainPlan.useTime)
          this.maintainPlan.maintainStatus = dic.maintenancePlanDic[this.maintainPlan.maintainStatus]
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    toSeeMore () {
      this.$router.push({ name: 'deviceinfo', query: { id: this.deviceInfo.id, permission: false } })
    },
    // 提交修改
    confirmThePlan () {
      // 要先通过判断
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 注意修改一下maintainStatus
          if (this.maintainPlan.maintainStatus === '启用' || this.maintainPlan.maintainStatus === '进行中') {
            this.maintainPlan.maintainStatus = 0
          } else if (this.maintainPlan.maintainStatus === '停用' || this.maintainPlan.maintainStatus === '已停用') {
            this.maintainPlan.maintainStatus = 1
          }
          let useTime = new Date(this.maintainPlan.useTime).Format("yyyy-MM-dd hh:mm:ss")
          this.$http.httpPost('/app/apptbdevice/maintainPlan', {
            "cycle": this.maintainPlan.cycle,
            "id": this.deviceInfo.id,
            "maintainStatus": this.maintainPlan.maintainStatus,
            "maintainUserId": this.$store.state.maintenancePerson.id,
            "useTime": useTime,
            "maintainContent": this.maintainPlan.maintainContent
          }).then(res => {
            if (res.code === 0 && res.msg === 'success') {
              this.$message.success('修改成功')
              setTimeout(() => {
                window.history.back()
              }, 1000);
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          this.$message.error('校验不通过')
        }
      })
    },
    noBulletFrame () {
      document.activeElement.blur()
    },
    choosePerson () {
      this.$router.push({
        name: 'choose',
        query: {
          isMulti: false,
          areaId: sessionStorage.getItem('areaId'),
          departmentId: this.deviceInfo.useDeptId,
          tag: 'maintenancePerson'
        }
      })
    }
  },
  mounted () {
    this.init()
  },
  activated () {
    // 第二次进入状态会变成0或1 需手动修改为文字
    this.$nextTick(() => {
      // 判断是不是已经转化成汉字
      let status = this.maintainPlan.maintainStatus
      if (typeof status === 'string' && status !== '0' && status !== '1') {
        status = (status === '进行中' ? 0 : 1)
      }
      this.maintainPlan.maintainStatus = dic.maintenancePlanDic[status]
    })
  }
}
</script>

<style  lang="scss">
@import '@/assets/style/global.scss';
.edit-plan {
  box-sizing: border-box;
  padding: 15px 20px;
  background-color: #fff;
  height: 100%;
  .edit-wrapper {
    .edit-content {
      .el-form {
        .el-form-item {
          margin-top: 0;
          margin-bottom: 10px;
          .el-form-item__label {
            color: #000;
            // font-weight: 700;
            font-size: 15px;
            padding: 0;
          }
          .item-info {
            font-size: 15px;
          }
          .day {
            margin-left: 1rem;
          }
          .el-input__inner {
            font-size: 1.6rem;
          }
          .item-btn {
            margin-left: 10px;
            color: #fff;
            background-color: #409eff;
            height: 40px;
            font-size: 12px;
            float: right;
          }
        }
      }
      .el-picker-panel,
      .el-date-picker,
      .el-popper {
        width: 20rem;
        height: 20rem;
      }
    }
    .edit-bottom {
      background-color: #fff;
      position: fixed;
      width: 100%;
      bottom: 0;
      left: 0;
      z-index: 99;
      border-top: 1px #efefef solid;
      .bottom-btn {
        button {
          width: calc(100% - 40px);
          height: 40px;
          margin: 10px auto;
          display: block;
          background-color: rgb(10, 211, 10);
          font-size: 14px;
          font-weight: 700;
        }
      }
    }
  }
}
.el-form-item__label {
  font-size: 15px;
}
.el-input__inner {
  font-size: 15px;
}
.el-textarea__inner {
  font-size: 15px;
}
.el-textarea.is-disabled .el-textarea__inner {
  background-color: #eee;
  border-color: #e4e7ed;
  color: #333;
  opacity: 0.8;
  -webkit-text-fill-color: #333;
  cursor: not-allowed;
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
