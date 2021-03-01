<template>
  <div class="un-edit"
       v-show="this.status === 'daizhipai' ? false : true">
    <title-bar title="进度信息"></title-bar>
    <div class="un-wrapper">
      <ul class="info-list">
        <!-- 一定有的信息 -->
        <div class="common">
          <li class="list-item">
            <span class="item-left">被指派人:</span>
            <span class="item-right">{{header}}</span>
          </li>
<!--          <li class="list-item">-->
<!--            <span class="item-left">指派人电话:</span>-->
<!--            <span class="item-right">-->
<!--              <a :href="'tel:' + orderDetails.assignTel"-->
<!--                 class="phone">{{orderDetails.assignTel}}</a>-->
<!--            </span>-->
<!--          </li>-->
          <li class="list-item">
            <span class="item-left">工单协助人:</span>
            <span class="item-right">{{helper}}</span>
          </li>
        </div>
        <li class="list-item"
            v-show="orderDetails.startTime">
          <span class="item-left">开始时间:</span>
          <span class="item-right">{{orderDetails.startTime}}</span>
        </li>
        <li class="list-item"
            v-show="orderDetails.startTime">
          <span class="item-left">结束时间:</span>
          <span class="item-right">{{orderDetails.endTime}}</span>
        </li>
        <!-- <li class="list-item"
            v-show="this.status === 'yijiedan'">
          <span class="item-left">结单时间:</span>
          <span class="item-right">{{orderDetails.endTime}}</span>
        </li> -->
        <li class="list-item"
            v-show="this.status !== 'yizuofei'">
          <span class="item-left">紧急程度:</span>
          <span class="item-right">{{level}}</span>
        </li>
        <!-- 已结单、待返工、待结单、处理中、等待配件 -->
        <div class="other"
             v-show="this.status !== 'daichuli' && this.status !== 'yizuofei'">
          <li class="list-item"
              v-show="this.status !== 'chulizhong' && this.status !== 'daipeijian'">
            <span class="item-left">工单检查人:</span>
            <span class="item-right">{{checker}}</span>
          </li>
          <li class="list-item">
            <span class="item-left">维修人描述:</span>
            <span class="item-right">{{orderDetails.assignUserDesc}}</span>
          </li>
          <li class="list-item"
              v-show="(this.status !== 'daijiedan') && (this.status !== 'chulizhong') && this.status !== 'daipeijian' && (this.assignFileInfoPaths.length > 0)">
            <span class="item-left">维修人附件:</span>
            <span class="item-right">
              <a v-for="(item, index) in assignFileInfoPaths"
                 :key="index"
                 :href="item.path"
                 class="progress-file">
                <img :src="item.path"
                     class="img_a">
              </a>
            </span>
          </li>
          <li class="list-item"
              v-show="(this.status !== 'daijiedan') && (this.status !== 'chulizhong') && this.status !== 'daipeijian'">
            <span class="item-left">检查人描述:</span>
            <span class="item-right">{{orderDetails.checkUserDesc}}</span>
          </li>
          <li class="list-item"
              v-show="(this.status !== 'daijiedan') && (this.status !== 'chulizhong') && this.status !== 'daipeijian' && (this.checkFileInfoPaths.length > 0)">
            <span class="item-left">检查人附件:</span>
            <span class="item-right">
              <a v-for="(item, index) in checkFileInfoPaths"
                 :key="index"
                 :href="item.path"
                 class="progress-file">
                <img :src="item.path"
                     class="img_a">
              </a>
            </span>
          </li>
          <li class="list-item"
              v-show="!(orderDetails.maintainOrderId == 0 || (typeof orderDetails.maintainOrderId == 'boolean'))">
            <span class="item-left">顺带保养:</span>
            <span class="item-right">
              <el-checkbox disabled
                           :checked="true"></el-checkbox>
            </span>
          </li>
          <li class="list-item"
              v-show="(orderDetails.isStopDevice == 1) && (this.orderDetails.status == 5 || this.orderDetails.status == 6)">
            <span class="item-left">停用设备:</span>
            <span class="item-right">
              <el-checkbox disabled
                           :checked="true"></el-checkbox>
            </span>
          </li>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
import TitleBar from '../../../components/TitleBar'
export default {
  data () {
    return {
      status: '', // 工单状态 已结单 待返工 待结单 处理中 等待配件 待处理 待指派 已作废
      checkFileInfoPaths: [],
      assignFileInfoPaths: []
    }
  },
  props: {
    orderDetails: {
      type: Object
    }
  },
  computed: {
    header () {
      return this.orderDetails.assignName
    },
    helper () {
      let helperArr = this.orderDetails.assistant
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
        return allHelper
      }
      return ''
    },
    checker () {
      return this.orderDetails.checkUserName
    },
    level () {
      const levelDic = ['普通', '优先', '紧急']
      return levelDic[this.orderDetails.level]
    }
  },
  components: {
    TitleBar
  },
  methods: {
    getOrderDetails () {
      // 选择状态类型
      const statusDic = ['daizhipai', 'daichuli', 'chulizhong', 'daipeijian', 'daifangong', 'daijiedan', 'yijiedan', 'yizuofei']
      this.status = statusDic[this.orderDetails.status]
      if (this.orderDetails.id !== undefined) {
        this.checkFileInfoPaths = this.orderDetails.checkFileInfoPaths
        this.assignFileInfoPaths = this.orderDetails.assignFileInfoPaths
      }
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

<style scoped lang="scss">
.un-edit {
  .un-wrapper {
    margin-top: 1.5rem;
    .info-list {
      .list-item {
        line-height: 3rem;
        .item-left {
          text-align: center;
        }
      }
      .other {
        margin-top: 1rem;
      }
    }
  }
}
.progress-file {
  margin-right: 1rem;
  .img_a {
    width: 6.5rem;
    height: 5rem;
    // background-color: pink;
  }
}
</style>
