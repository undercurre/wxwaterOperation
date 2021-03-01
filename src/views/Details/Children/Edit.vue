<template>
  <div class="edit">
    <title-bar title="进度信息"></title-bar>
    <el-form ref="form"
             :rules="rules"
             label-width="100px"
             size="mini">
      <!-- 都有的通用item -->
      <el-form-item label="被指派人:"
                    prop="assignedUser">
        <el-input v-model="header"
                  style="width:calc(100% - 90px);"
                  disabled></el-input>
        <el-button style="float:right;padding:7px 0;width: 80px;text-align: center;"
                   type="primary"
                   v-show="this.status === 'daizhipai' ? true : false"
                   :disabled="confirmDisabled"
                   @click="choosePerson('one')">选择指派人</el-button>
      </el-form-item>
<!--      <el-form-item label="指派人电话:">-->
<!--        <a :href="'tel:'+ this.$store.state.orderAssigned.assignTel || this.$store.state.orderAssigned.tel"-->
<!--           class="phone">{{this.$store.state.orderAssigned.assignTel || this.$store.state.orderAssigned.tel || '无'}}</a>-->
<!--      </el-form-item>-->
      <el-form-item label="工单协助人:">
        <el-input v-model="helper"
                  style="width:calc(100% - 90px);"
                  type="textarea"
                  disabled></el-input>
        <el-button style="float:right;padding:7px 0;width: 80px;text-align: center;"
                   type="primary"
                   v-show="this.status === 'daizhipai' ? true : false"
                   :disabled="confirmDisabled"
                   @click="choosePerson('more')">选择协助人</el-button>
        <!-- !$isAuth('维修班长') &&  -->
        <!-- :disabled="!$isAuth('维修班长') && !$isAuth('设备负责人')"
                   @click="choosePerson('more')" -->
      </el-form-item>
      <el-form-item label="工单检查人:">
        <el-input v-model="this.$store.state.orderCheckUser.username"
                  style="width:calc(100% - 90px);"
                  disabled></el-input>
        <!-- <el-button style="float:right;padding:7px 0;width: 80px;text-align: center;"
                   type="primary"
                   v-show="this.status === 'daizhipai'"
                   :disabled="confirmDisabled"
                   @click.prevent="choosePerson('check')">选择检查人</el-button> -->
        <!-- !$isAuth('维修班长') &&  !$isAuth('设备负责人')-->
      </el-form-item>
      <el-form-item v-if="this.orderDetails.startTime && this.orderDetails.startTime !== '无'"
                    label="开始时间:">
        <el-input v-model="this.orderDetails.startTime"
                  disabled></el-input>
      </el-form-item>
      <el-form-item v-if="this.orderDetails.endTime && this.orderDetails.endTime !== '无'"
                    label="结束时间:">
        <el-input v-model="this.orderDetails.endTime"
                  disabled></el-input>
      </el-form-item>
      <el-form-item label="紧急程度:"
                    prop="validateLevel">
        <el-radio-group v-model="level"
                        :disabled="!$isAuth('设备负责人') || (this.status === 'daizhipai' ? false : true)">
          <el-radio :label="0">普通</el-radio>
          <el-radio :label="1">优先</el-radio>
          <el-radio :label="2">紧急</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="维修人附件:"
                    v-show="(this.status === 'daijiedan' || this.status === 'yijiedan') && (this.assignFileInfoPaths.length > 0)">
        <a v-for="(item, index) in assignFileInfoPaths"
           :key="index"
           :href="item.path"
           class="progress-file">
          <img :src="item.path"
               class="img_a">
        </a>
      </el-form-item>

      <el-form-item label="检查人附件:"
                    v-show="(this.status === 'chulizhong' || this.status === 'daifangong' || this.status === 'yijiedan') && (this.checkFileInfoPaths.length > 0)">
        <a v-for="(item, index) in checkFileInfoPaths"
           :key="index"
           :href="item.path"
           class="progress-file">
          <img :src="item.path"
               class="img_a">
        </a>
      </el-form-item>

      <el-form-item :label="this.status === 'chulizhong' ? '维修附件:' : '检查附件:'"
                    v-show="this.status === 'chulizhong' || this.status === 'daijiedan'">
        <UploadImage @changeIsPicSuccess="changeIsPicSuccess"
                     @getFileIds="getFileIds"
                     :isDisabled="this.status === 'chulizhong' ? completeDisabled : checkpassDisabled"></UploadImage>
      </el-form-item>

      <!-- 待返工 -->
      <div class="wating-rework"
           v-show="(this.status === 'daifangong' || this.status === 'chulizhong' || this.status === 'daijiedan' || this.status === 'yijiedan') ? true : false">
        <el-form-item label="维修人描述:">
          <el-input v-model="orderDetails.assignUserDesc"
                    class="textarea"
                    style="width:20rem;"
                    :disabled="completeDisabled"
                    type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="检查人描述:"
                      v-show="(this.status === 'chulizhong' ? false : true) || (this.status === 'yijiedan' ? true : false)">
          <el-input v-model="orderDetails.checkUserDesc"
                    style="width:20rem;"
                    :disabled="checkpassDisabled"
                    type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="保养情况:"
                      v-show="(this.status === 'chulizhong' ? true : false) && (this.maintanPlanIsShow)">
          <el-checkbox v-if="orderDetails.maintainOrderId == 0 || (typeof orderDetails.maintainOrderId == 'boolean')"
                       :disabled="completeDisabled"
                       v-model="orderDetails.maintainOrderId">顺便做了保养</el-checkbox>
          <el-checkbox v-else
                       disabled
                       :checked="true">顺便做了保养</el-checkbox>
        </el-form-item>
        <el-form-item label="停用设备:"
                      v-show="(orderDetails.isStopDevice == 1) && (this.orderDetails.status == 5 || this.orderDetails.status == 6)">
          <el-checkbox disabled
                       :checked="true"></el-checkbox>
        </el-form-item>
      </div>
      <!-- 底下按钮 -->
      <div class="form-btn"
           style="text-align: center;">
        <!-- 指派的按钮 -->
        <div class="daizhipai"
             v-show="this.status === 'daizhipai' ? true : false">
          <el-button type="danger"
                     size="medium"
                     :disabled="cancelDisabled"
                     @click.prevent="cancelOrder">作废</el-button>
          <!-- :disabled="!$isAuth('维修班长') && !$isAuth('设备负责人')" -->
          <el-button type="success"
                     size="medium"
                     :disabled="confirmDisabled"
                     @click.prevent="beforeTransOrder">转移工单</el-button>
          <el-button type="success"
                     size="medium"
                     :disabled="confirmDisabled"
                     @click.prevent="confirmAssignment">确认指派</el-button>
          <!-- :disabled="!$isAuth('维修班长') && !$isAuth('设备负责人')" -->
        </div>
        <!-- 待处理 的按钮 -->
        <div class="daichuli daifangong daipeijian"
             v-show="this.status === 'daichuli' || this.status === 'daipeijian' || this.status === 'daifangong' || this.status === 'weiwaiweixiu'">
          <el-button type="success"
                     style="width: 20rem;"
                     :disabled="greenDisabled"
                     @click.prevent="startProcessing">{{greenbtn}}</el-button>
          <!-- :disabled="!$isAuth('维修员')" -->
        </div>
        <!-- 处理中的按钮 -->
        <div class="chulizhong"
             v-show="this.status === 'chulizhong'">
          <el-button type="warning"
                     size="small"
                     :disabled="waitDisabled"
                     @click.prevent="waitingForAccessories">
            等待配件
          </el-button>
          <el-button type="danger"
                     size="small"
                     :disabled="waitDisabled"
                     @click.prevent="commissionedMaintenance">
            委外维修
          </el-button>
          <!-- :disabled="!$isAuth('维修员')" -->
          <el-button type="success"
                     size="small"
                     :disabled="completeDisabled"
                     :loading="!isPicSuccess"
                     @click.prevent="repairComplete">
            <span v-if="isPicSuccess">完成修复</span>
            <span v-else>图片上传中</span>
          </el-button>
          <!-- :disabled="!$isAuth('维修员')" -->
          <el-button type="danger"
                     style="margin-top:1rem;margin-left:0;"
                     size="small"
                     v-show="this.orderDetails.deviceCode === 0 ? false : true"
                     :disabled="deactivateDisabled"
                     :loading="!isPicSuccess"
                     @click.prevent="deactivateAndCompleteTheRepair">
            <span v-if="isPicSuccess">停用并完成修复</span>
            <span v-else>图片上传中</span>
          </el-button>
          <!-- :disabled="!$isAuth('维修员')" -->
        </div>
        <!-- 待结单的按钮 -->
        <div class="daijiedan"
             v-show="this.status === 'daijiedan'">
          <el-button type="danger"
                     size="small"
                     :disabled="notPassDisabled"
                     :loading="!isPicSuccess"
                     @click.prevent="checkDoesnotPass">
            <span v-if="isPicSuccess">检查不通过</span>
            <span v-else>图片上传中</span>
          </el-button>
          <el-button type="success"
                     size="small"
                     :loading="!isPicSuccess"
                     :disabled="checkpassDisabled"
                     @click.prevent="byCheckingAndClosing">
            <span v-if="isPicSuccess">通过检查并{{orderDetails.isStopDevice == 1 ? '停用' : '结单'}}</span>
            <span v-else>图片上传中</span>
          </el-button>
        </div>
      </div>
    </el-form>
    <el-dialog title="转移工单"
               :visible.sync="transferDialogVisible"
               width="80%">
      <el-select v-model="AreaId"
                 placeholder="请选择地区"
                 @change="getAreachange"
                 style="margin:0 0 15px;">
        <el-option v-for="item in AreaOptions"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="transDepartmentId"

                 placeholder="请选择转移的部门">
        <el-option v-for="item in departmentOptions"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
        </el-option>
      </el-select>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="transferDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="TransferOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TitleBar from '../../../components/TitleBar'
import { isIOS } from '../../../utils/validate'
import { debounce } from '../../../utils/common'
import UploadImage from '../../../components/UploadImage'
const curUserId = sessionStorage.getItem('userId') || ''
export default {
  data () {
    return {
      status: '', // 七种状态 待指派 待处理 等待配件 待返工 处理中 待结单 已作废
      assistantIds: [],
      level: 0,
      rules: {
        assignedUser: [
          { required: true, message: '负责人不能为空', trigger: 'blur' }
        ],
        validateLevel: [
          { required: true, message: '紧急程度不能为空', trigger: 'blur' }
        ]
      },
      assetsType: '', // 资产类型
      cancelDisabled: true, // 作废的禁用
      confirmDisabled: true, // 确认指派
      checkpassDisabled: true, // 检查通过
      completeDisabled: true, // 维修完成
      notPassDisabled: true, // 不通过
      deactivateDisabled: true, // 停用并结单
      waitDisabled: true, // 等待配件
      greenDisabled: true, // 开始处理或继续处理
      maintanPlanIsShow: true,
      transferDialogVisible: false,
      departmentOptions: [],
      transDepartmentId: '',
      AreaOptions: [],
      AreaId: parseInt(sessionStorage.getItem('areaId')),
      isPicSuccess: true,
      fileIds: [],
      checkFileInfoPaths: [],
      assignFileInfoPaths: [],
      opendepartment: false
    }
  },
  props: {
    orderDetails: {
      type: Object
    }
  },
  components: {
    TitleBar,
    UploadImage
  },
  activated() {
    this.getAreaOptions();
  },
  computed: {
    greenbtn () {
      let val
      if (this.status === 'daichuli') {
        val = '开始处理'
      } else if (this.status === 'daipeijian' || this.status === 'daifangong') {
        val = '继续处理'
      } else if (this.status === 'weiwaiweixiu') {
        val = '结束委托'
      }
      return val
    },
    header () {
      return this.$store.state.orderAssigned.assignName ? this.$store.state.orderAssigned.assignName : this.$store.state.orderAssigned.username
    },
    helper () {
      let helperArr = this.$store.state.orderHelper
      if (helperArr) {
        let allHelper = ''
        helperArr.forEach(item => {
          // 解决后台人员命名不规范的问题
          if (item.username) {
            allHelper += item.username + ','
          } else {
            allHelper += item.userName + ','
          }
        })
        return allHelper.slice(0, allHelper.length - 1)
      }
      return ''
    }
  },
  methods: {
    getOrderDetails () {
      // 选择状态类型
      let statusDic = ['daizhipai', 'daichuli', 'chulizhong', 'daipeijian', 'daifangong', 'daijiedan', 'yijiedan', 'yizuofei', 'weiwaiweixiu']

      this.status = statusDic[this.orderDetails.status]
      // 被指派人
      this.$store.dispatch('changeCurAssigned', {
        assignName: this.orderDetails.assignName,
        assignTel: this.orderDetails.assignTel,
        assignUserDesc: this.orderDetails.assignUserDesc,
        assignUserId: this.orderDetails.assignUserId
      })
      // 协助人
      this.$store.dispatch('changeCurHelper', this.orderDetails.assistant)
      // this.$store.state.orderHelper = this.orderDetails.assistant || []

      // 紧急程度 默认为0
      this.level = this.orderDetails.level || 0

      // 非固定资产设备和保养工单不需要保养情况
      if (this.orderDetails.deviceCode === null || this.orderDetails.deviceCode === '' || this.orderDetails.deviceCode === 0 || this.orderDetails.type == 1) {
        this.maintanPlanIsShow = false
      }
      // 权限控制
      switch (this.orderDetails.status) {
        case 0:
          if (curUserId == this.orderDetails.leaderOrMonitorUserId) {
            this.cancelDisabled = this.confirmDisabled = false
          }
          break
        case 1: // 待处理
        case 2: //处理中
        case 3: // 待配件
        case 4: // 待返工
        case 8: // 委外维修
          if (curUserId == this.orderDetails.assignUserId) {
            this.greenDisabled = this.waitDisabled = this.completeDisabled = this.deactivateDisabled = false
          }
          break
        case 5: // 待结单
          if (curUserId == this.orderDetails.checkUserId) {
            this.notPassDisabled = this.checkpassDisabled = false
          }
          break
      }

      this.checkFileInfoPaths = this.orderDetails.checkFileInfoPaths
      this.assignFileInfoPaths = this.orderDetails.assignFileInfoPaths
    },
    choosePerson (tag) {
      if (tag === 'one') {
        // 指派人
        this.$router.push({
          name: 'choose',
          query: {
            isMulti: false,
            id: this.orderDetails.id,
            areaId: this.orderDetails.areaId,
            departmentId: this.orderDetails.departmentId,
            tag: 'assigned'
          }
        })
      } else if (tag === 'more') {
        // 协助人
        this.$router.push({
          name: 'choose',
          query: {
            isMulti: true,
            id: this.orderDetails.id,
            departmentId: this.orderDetails.departmentId,
            areaId: this.orderDetails.areaId
          }
        })
      } else {
        // 选择负责人
        this.$router.push({
          name: 'choose',
          query: {
            isMulti: false,
            id: this.orderDetails.id,
            departmentId: this.orderDetails.departmentId,
            areaId: this.orderDetails.areaId,
            tag: 'header'
          }
        })
      }
    },
    // 作废
    cancelOrder: debounce(function () {
      this.$http.httpPost('/app/apptborder/updateOrderStatus', {
        "orderId": this.orderDetails.id,
        "status": 7
      }).then(res => {
        if (res.msg === 'success' && res.code === 0) {
          this.$message.success('工单状态改变为作废成功!')
          this.refresh()
        } else {
          this.$message.error('状态更改失败! ' + res.msg)
        }
      })
    }),
    // 确认指派
    confirmAssignment: debounce(function () {
      if ((!this.$store.state.orderAssigned.id) && (!this.$store.state.orderAssigned.assignUserId)) {
        this.$message.error('被指派人不能为空')
      } else {
        // 获取协助人的id
        this.assistantIds = []
        this.$store.state.orderHelper.forEach(item => {
          if (item.userId) {
            this.assistantIds.push(item.userId)
          } else {
            this.assistantIds.push(item.id)
          }
        })
        this.$http.httpPost('/app/apptborder/updateOrderStatus', {
          "orderId": this.orderDetails.id,
          "assignUserId": this.$store.state.orderAssigned.id || this.$store.state.orderAssigned.assignUserId,
          "assistantIds": this.assistantIds,
          "level": this.level,
          "leaderOrMonitorDesc": this.orderDetails.leaderOrMonitorDesc, // 班长或负责人描述
          "status": 1,
          "checkUserId": this.$store.state.orderCheckUser.id
        }).then(res => {
          if (res.code === 0 && res.msg === 'success') {
            this.$message.success('工单已经确认指派')
            this.refresh()
          } else {
            this.$message.error('工单指派失败 ' + res.msg)
          }
        })
      }
    }),
    // 开始处理 继续处理  结束委外维修
    startProcessing: debounce(function () {
      this.$http.httpPost('/app/apptborder/updateOrderStatus', {
        "orderId": this.orderDetails.id,
        "status": 2
      }).then(res => {
        if (res.code === 0 && res.msg === 'success') {
          this.$message.success('工单已经进行处理')
          this.refresh()
        } else {
          this.$message.error('工单处理失败 ' + res.msg)
        }
      })
    }),
    // 等待配件
    waitingForAccessories: debounce(function () {
      this.$http.httpPost('/app/apptborder/updateOrderStatus', {
        "orderId": this.orderDetails.id,
        "status": 3
      }).then(res => {
        if (res.code === 0 && res.msg === 'success') {
          this.$message.success('工单状态变更为等待配件')
          this.refresh()
        } else {
          this.$message.error('工单处理失败 ' + res.msg)
        }
      })
    }),
    // 委外维修
    commissionedMaintenance: debounce(function () {
      this.$http.httpPost('/app/apptborder/updateOrderStatus', {
        "orderId": this.orderDetails.id,
        "status": 8
      }).then(res => {
        if (res.code === 0 && res.msg === 'success') {
          this.$message.success('工单状态变更为委外维修')
          this.refresh()
        } else {
          this.$message.error('工单处理失败 ' + res.msg)
        }
      })
    }),
    // 完成修复
    repairComplete: debounce(function () {
      // 拿到是否顺带保养
      let maintainOrderId
      if (this.orderDetails.maintainOrderId) {
        maintainOrderId = this.orderDetails.id
      } else {
        maintainOrderId = 0
      }
      this.$http.httpPost('/app/apptborder/updateOrderStatus', {
        "orderId": this.orderDetails.id,
        "status": 5,
        "isStopDevice": 0,
        "maintainOrderId": maintainOrderId,
        "checkUserId": this.$store.state.orderCheckUser.id, // 检查人id
        "assignUserDesc": this.orderDetails.assignUserDesc,
        "fileIds": this.fileIds,
      }).then(res => {
        if (res.code === 0 && res.msg === 'success') {
          this.$message.success('工单状态变更为完成修复')
          this.refresh()
        } else {
          this.$message.error('工单处理失败 ' + res.msg)
        }
      })
    }),
    // 停用并完成修复
    deactivateAndCompleteTheRepair: debounce(function () {
      // 拿到是否顺带保养
      let maintainOrderId = this.orderDetails.maintainOrderId ? this.orderDetails.id : 0
      // if (this.orderDetails.maintainOrderId) {
      //   maintainOrderId = this.orderDetails.id
      // } else {
      //   maintainOrderId = 0
      // }
      this.$http.httpPost('/app/apptborder/updateOrderStatus', {
        "orderId": this.orderDetails.id,
        "status": 5,
        "maintainOrderId": maintainOrderId,
        "checkUserId": this.$store.state.orderCheckUser.id, // 检查人id
        "assignUserDesc": this.orderDetails.assignUserDesc,
        "isStopDevice": 1,
        "fileIds": this.fileIds,
      }).then(res => {
        if (res.code === 0 && res.msg === 'success') {
          this.$message.success('工单状态变更为停用并完成修复')
          this.refresh()
        } else {
          this.$message.error('工单处理失败 ' + res.msg)
        }
      })
    }),
    // 检查不通过
    checkDoesnotPass: debounce(function () {
      // 这里的检查人留言是否要？
      this.$http.httpPost('/app/apptborder/updateOrderStatus', {
        "orderId": this.orderDetails.id,
        "status": 4,
        "checkUserDesc": this.orderDetails.checkUserDesc,
        "fileIds": this.fileIds,
      }).then(res => {
        if (res.code === 0 && res.msg === 'success') {
          this.$message.success('工单状态变更为待返工')
          this.refresh()
        } else {
          this.$message.error('工单处理失败 ' + res.msg)
        }
      })
    }),
    // 通过检查并结单
    byCheckingAndClosing: debounce(function () {
      // 这里的检查人留言是否要？
      this.$http.httpPost('/app/apptborder/updateOrderStatus', {
        "orderId": this.orderDetails.id,
        "checkUserDesc": this.orderDetails.checkUserDesc,
        "status": 6,
        "fileIds": this.fileIds,
      }).then(res => {
        if (res.code === 0 && res.msg === 'success') {
          this.$message.success('工单状态变更为已结单')
          this.refresh()
        } else {
          this.$message.error('工单处理失败 ' + res.msg)
        }
      })
    }),
    // 自动刷新
    refresh () {
      if (isIOS()) {
        setTimeout(() => { window.location.reload() }, 1500)
      } else {
        setTimeout(() => { window.location.href = window.location.href + "&timer=" + 1000 * Math.random(); }, 1500)
      }
    },
    //获取地区选项
    getAreaOptions() {
      this.$http.httpGet('/app/tbarea/listCombo').then(res => {
        if (res.code === 0 && res.msg === 'success') {
          //初始判断，如果当前的用户session的地区ID为3和4，则显示全部地区，否则只显示非测试部门外的所有地区
          //地区ID 3和4 是测试地区，默认是不显示给其他人观看的
          if(parseInt(sessionStorage.getItem('areaId')) === 3 || parseInt(sessionStorage.getItem('areaId')) === 4){
              this.AreaOptions = res.data;
          } else {
            this.AreaOptions = res.data.filter(item => {
              if(item.id !== 3 && item.id !== 4){
                return item
              }
            })
          }
          sessionStorage.setItem('AreaOptions', JSON.stringify(this.AreaOptions))
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    //通过改变地区ID来获取部门信息
    getAreachange(val) {
      this.departmentOptions = []     //选择地区后清空部门的数据
      this.transDepartmentId = null   //选择地区后清空部门ID
      this.$http.httpGet('/app/tbdepartment/list-all', {
        areaId: val
      }).then(res => {
        if (res.code === 0 && res.msg === 'success') {
          this.departmentOptions = res.data.filter(item => {
            return item.id !== this.orderDetails.departmentId
          })
          // sessionStorage.setItem('departmentOptions', JSON.stringify(this.departmentOptions))
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    beforeTransOrder () {
      this.transferDialogVisible = true
      // 获取部门列表
      this.departmentOptions = JSON.parse(sessionStorage.getItem('departmentOptions') || '[]')

      if (this.departmentOptions.length === 0) {
        this.$http.httpGet('/app/tbdepartment/list-all', {
          // areaId: sessionStorage.getItem('areaId')
          areaId: this.AreaId
        }).then(res => {
          if (res.code === 0 && res.msg === 'success') {
            this.departmentOptions = res.data.filter(item => {
              return item.id !== this.orderDetails.departmentId
            })
            sessionStorage.setItem('departmentOptions', JSON.stringify(this.departmentOptions))
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    // 转移工单
    TransferOrder: debounce(function () {
      // 发送请求，将工单id和部门id发过去
      this.$http.httpPost('/app/apptborder/transferOrder', {
        "areaId": this.AreaId,
        "departmentId": this.transDepartmentId,
        "orderId": this.orderDetails.id,
        "status": 0
      }).then(res => {
        if (res.code === 0 && res.msg === 'success') {
          this.$message.success('转移工单成功!')
          this.transferDialogVisible = false
          this.refresh()
        } else {
          this.$message.error('转移失败，原因：' + res.msg)
          this.transferDialogVisible = false
        }
      })
    }),
    // 子组件控制picSuccess
    changeIsPicSuccess (flag) {
      this.isPicSuccess = flag
    },
    getFileIds (fileIds) {
      this.fileIds = fileIds
    }
  },
  watch: {
    // 监听orderDetails
    orderDetails () {
      this.getOrderDetails()
    }
  },
  mounted () {
    this.getOrderDetails()
  }
}
</script>

<style lang="scss">
@import '@/assets/style/global.scss';
.edit {
  // background-color: #fff;
  .el-form {
    margin-top: 1.5rem;
    .el-form-item__label {
      font-size: 15px;
    }
    .el-input__inner {
      font-size: 15px;
    }
    .el-textarea__inner {
      font-size: 15px;
    }
    .el-textarea.is-disabled .el-textarea__inner,
    .el-input.is-disabled .el-input__inner {
      background-color: #eee;
      border-color: #e4e7ed;
      color: #333;
      opacity: 0.8;
      -webkit-text-fill-color: #333;
      cursor: not-allowed;
    }
    .el-radio.is-disabled {
      border-color: #e4e7ed;
      color: #333;
      opacity: 0.8;
      -webkit-text-fill-color: #333;
      cursor: not-allowed;
    }
    .progress-file {
      margin-right: 1rem;
      .img_a {
        width: 6.5rem;
        height: 5rem;
        // background-color: pink;
      }
    }
    .wating-rework {
      .el-textarea {
        textarea {
          min-height: 12rem !important;
        }
      }
    }
  }
}
.daizhipai {
  display: flex;
  text-align: center;
  .el-button {
    flex: 1;
  }
}
</style>
