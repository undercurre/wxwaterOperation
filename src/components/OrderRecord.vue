<template>
  <!-- 传入不同的type和data来使用 -->
  <div class="order-record">
    <!-- 提醒记录 -->
    <div class="record-wrapper"
         @click="toOrderDetails(list.orderId, list.unEdit,list.url)"
         v-if="recordType == '1'">
      <div class="record-header">
        <div class="header">{{list.title}}</div>
        <!-- <span class="header">编号为{{list.deviceCode}}的设备</span> -->
        <div class="time">{{list.createTime}}</div>
        <!-- <span class="code">{{list.deviceCode}}</span> -->
      </div>
      <div class="record-content">
        <!-- 普通提醒 -->
        <div class="content-list"
             v-if="list.pushCategoryType == 0 || list.pushCategoryType == null">
          <ul class="list">
            <li class="list-item">
              <span class="list-leftway">工单编号:</span>
              <span class="list-rightway">{{list.orderId}}</span>
            </li>
            <li class="list-item">
              <span class="list-leftway">设备名称:</span>
              <span class="list-rightway">{{list.deviceName}}</span>
            </li>
            <li class="list-item">
              <span class="list-leftway">设备描述:</span>
              <span class="list-rightway list-desc">{{list.description}}</span>
            </li>
            <li class="list-item">
              <span class="list-leftway">设备类别:</span>
              <span class="list-rightway">{{list.assetsType}}</span>
            </li>
            <li class="list-item">
              <span class="list-leftway">工单类型:</span>
              <span class="list-rightway">{{list.type}}</span>
            </li>
            <li class="list-item">
              <span class="list-leftway">报单时间:</span>
              <span class="list-rightway">{{list.createTime}}</span>
            </li>
          </ul>
        </div>
        <!-- 保养提醒 -->
        <div class="content-list"
             v-else-if="list.pushCategoryType == 1">
          <ul class="list">
            <li class="list-item">
              <span class="list-leftway">工单编号:</span>
              <span class="list-rightway">{{list.deviceName}}</span>
            </li>
            <li class="list-item">
              <span class="list-leftway">设备名称:</span>
              <span class="list-rightway">{{list.time}}</span>
            </li>
          </ul>
        </div>
        <!-- 未完成提醒 -->
        <div class="content-list"
             v-else-if="list.pushCategoryType == 2">
          <ul class="list">
            <li class="list-item">
              <span class="list-leftway">工单编号:</span>
              <span class="list-rightway">{{list.orderId}}</span>
            </li>
            <li class="list-item">
              <span class="list-leftway">提交用户:</span>
              <span class="list-rightway">{{list.orderSubmitPerson}}</span>
            </li>
            <li class="list-item">
              <span class="list-leftway">提交时间:</span>
              <span class="list-rightway">{{list.submitTime}}</span>
            </li>
          </ul>
        </div>
        <div class="details">
          <a href="#">详情</a>
        </div>
      </div>
    </div>

    <!-- 工单记录 -->
    <div class="record-wrapper"
         @click="toOrderDetails(list.id, list.unEdit)"
         v-else>
      <div class="record-header">
        <div class="header"
             v-if="list.deviceName">{{list.deviceName}}</div>
        <div class="header"
             v-else>编号为{{list.deviceCode}}的设备</div>
        <div class="time">{{list.createTime}}</div>
        <div class="code"
             v-if="this.recordType !== 1">{{list.deviceCode}}</div>
      </div>
      <div class="record-content">
        <div class="content-list">
          <ul class="list">
            <li class="list-item">
              <span class="list-leftway">工单编号:</span>
              <span class="list-rightway">{{list.id}}</span>
            </li>
            <li class="list-item">
              <span class="list-leftway">工单状态:</span>
              <span class="list-rightway"
                    :style="color">{{list.status}}</span>
            </li>
            <li class="list-item">
              <span class="list-leftway">工单类型:</span>
              <span class="list-rightway">{{list.type}}</span>
            </li>
            <li class="list-item">
              <span class="list-leftway">工单描述:</span>
              <span class="list-rightway list-desc">{{list.description}}</span>
            </li>
            <li class="list-item">
              <span class="list-leftway">紧急程度:</span>
              <span class="list-rightway">{{list.level}}</span>
            </li>
            <li class="list-item">
              <span class="list-leftway">被指派人:</span>
              <span class="list-rightway">{{list.assignUser}}</span>
            </li>
          </ul>
        </div>
        <div class="details">
          <a href="#">详情</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dic from '../utils/dictionary'
export default {
  data () {
    return {
      list: [],
      color: {}
    }
  },
  props: {
    // 记录的类型 1为提醒记录 2为工单记录
    recordType: {
      type: Number,
      default: 2
    },
    recordData: {
      type: Object
    }
  },
  methods: {
    initRecordData () {
      this.list = this.recordData
      let type = this.list.type || this.list.orderType
      this.getStatusColor(this.list.status)
      this.getOrderStatus(this.list.status)
      this.getOrderType(type)
    },
    getOrderStatus (status) {
      this.list.status = dic.orderStatusDic[status]
    },
    getOrderType (type) {
      if (typeof type == 'number') {
        this.list.type = dic.orderTypeDic[type]
      } else {
        this.list.type = type
      }
    },
    getOrderLevel (level) {
      this.list.level = dic.levelDic[level]
    },
    getStatusColor (status) {
      if (status === 2 || status === 3) {
        this.color = { 'color': '#E6A23C' }
      } else if (status === 6 || status === 7) {
        this.color = { 'color': '#67C23A' }
      } else {
        this.color = { 'color': '#F56C6C' }
      }
    },
    toOrderDetails (orderId, unEdit, orderUrl) {
      // 根据工单id跳转
      // 先判断跳转过去的页面可否编辑
      unEdit == true ? this.$router.push({ path: '/details/unedit', query: { id: orderId } }) : (orderUrl ? window.location.href = orderUrl : this.$router.push({ path: '/details/edit', query: { id: orderId } }))
      // if (unEdit == true) {
      //   // 不可编辑
      //   this.$router.push({ path: '/details/unedit', query: { id: orderId } })
      // } else {
      //   // 可编辑
      //   this.$router.push({ path: '/details/edit', query: { id: orderId } })
      // }
    }
  },
  mounted () {
    this.initRecordData()
  }
}
</script>

<style scoped lang="scss">
.order-record {
  box-sizing: border-box;
  padding: 0 2rem;
  background-color: #fff;
  padding-top: 1rem;
  padding-bottom: 1rem;
  &:first-child {
    margin-top: 0;
  }
  .record-wrapper {
    display: block;
    padding: 0;
    border-radius: 0.5rem;
    color: #000;
    background-color: #eee;
    .record-header {
      position: relative;
      padding: 0 2rem;
      padding-bottom: 5rem;
      box-sizing: border-box;
      height: 5rem;
      padding-top: 1rem;
      border-bottom: 0.1rem #dcdcdc solid;
      .code {
        position: absolute;
        bottom: 12px;
        right: 1rem;
        font-size: 1.4rem;
        color: #666;
      }
      .header {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: 600;
        height: 2rem;
        line-height: 2rem;
        font-size: 1.8rem;
        margin: 0.5rem 0 0.5rem;
      }
      .time {
        font-size: 1.2rem;
        color: #aaa;
        margin-bottom: 0.5rem;
      }
    }
    .record-content {
      .content-list {
        padding: 0 2rem;
        .list {
          .list-item {
            font-size: 1.4rem;
            padding: 1.2rem 0 0;
            color: #333;
            display: flex;
            height: 1.5rem;
            // line-height: 1.4rem;
            // overflow: hidden;
            // white-space: nowrap;
            // text-overflow: ellipsis;
            span {
              &:last-child {
                margin-left: 0.5rem;
              }
            }
            .list-leftway {
              width: 6rem;
              // flex-grow: 0;
            }
            .list-rightway {
              flex: 1;
            }
            .list-desc {
              // height: 2rem;
              line-height: 1.6rem;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            &:last-child {
              padding: 1.2rem 0;
            }
          }
        }
      }
      .details {
        padding: 1.5rem 2rem;
        margin: 0;
        border-top: 0.1rem solid #dcdcdc;
        a {
          display: block;
          box-sizing: border-box;
          font-size: 1.4rem;
          color: #0066cb;
        }
      }
    }
  }
}
</style>
