<template>
  <div class="detalis"
       v-loading="loading"
       element-loading-text="拼命加载中..."
       v-loading.lock="true">
    <div class="details-wrapper">
      <div class="basic-info">
        <title-bar title="基础信息"></title-bar>
        <ul class="info-list">
          <li class="list-item">
            <span class="item-left">设备名称:</span>
            <span class="item-right"
                  style="margin-right: 58px">{{orderDetails.deviceName}}</span>
            <button class="btn item-btn"
                    v-if="orderDetails.deviceCode != ''"
                    @click="toSeeMore">查看详情</button>
          </li>
          <li class="list-item">
            <span class="item-left">工单编号:</span>
            <span class="item-right">{{orderDetails.id}}</span>
          </li>
          <li class="list-item">
            <span class="item-left">工单类型:</span>
            <span class="item-right">{{this.type}}</span>
          </li>
          <li class="list-item">
            <span class="item-left">工单状态:</span>
            <span class="item-right">{{status}}</span>
          </li>
          <li class="list-item">
            <span class="item-left">报单时间:</span>
            <span class="item-right">{{orderDetails.createTime}}</span>
          </li>
          <li class="list-item"
              @click="seeDescription">
            <span class="item-left">工单描述:</span>
            <span class="item-right desc">
              {{orderDetails.description}}
            </span>
            <span class="tips"
                  v-show="orderDetails.description">点击查看描述详情</span>
          </li>
          <el-dialog title="工单描述"
                     :visible.sync="dialogVisible"
                     width="80%">
            <p style="line-height: 1.8rem;">{{orderDetails.description}}</p>
          </el-dialog>
          <li class="list-item"
              v-if="orderDetails.deviceCode != ''">
            <span class="item-left">所在位置:</span>
            <span class="item-right">{{orderDetails.devicePosition}}</span>
          </li>
          <li class="list-item">
            <span class="item-left">详细位置:</span>
            <span class="item-right">{{orderDetails.location}}</span>
          </li>
          <li class="list-item">
            <span class="item-left">报单人:</span>
            <span class="item-right">{{orderDetails.username}}</span>
          </li>
<!--          <li class="list-item">-->
<!--            <span class="item-left">报单人电话:</span>-->
<!--            <span class="item-right ">-->
<!--              <a :href="'tel:'+this.orderDetails.tel"-->
<!--                 class="phone">{{orderDetails.tel}}</a>-->
<!--            </span>-->
<!--          </li>-->
          <li class="list-item">
            <span class="item-left">设备负责人:</span>
            <!-- <span class="item-left"
                  v-else>维修班长:</span> -->
            <span class="item-right">{{orderDetails.leaderOrMonitorName}}</span>
          </li>
          <li class="list-item">
            <span class="item-left">工单附件:</span>
            <span class="item-right">
              <div class="item-img"
                   v-for="(item, index) in orderDetails.fileInfoPaths"
                   :key="index">
                <a :href="item.path">
                  <img :src="item.path"
                       width="100%"
                       height="100%">
                </a>
              </div>
            </span>
          </li>
          <li class="list-item">
            <span class="item-left">负责人描述:</span>
            <!-- <span class="item-left"
                  v-else>班长描述:</span> -->
            <div class="item-right">
              <textarea cols="30"
                        rows="5"
                        v-model="orderDetails.leaderOrMonitorDesc"
                        placeholder="请输入情况描述，可为空"
                        :disabled="(this.orderDetails.status !== 0) || (!$isAuth('设备负责人'))"></textarea>
              <!-- <textarea cols="30"
                        rows="5"
                        v-else
                        v-model="orderDetails.leaderOrMonitorDesc"
                        placeholder="请输入情况描述，可为空"
                        :disabled="(this.orderDetails.status !== 0) || (!$isAuth('维修班长'))"></textarea> -->
            </div>
          </li>
        </ul>
      </div>
      <div class="progress-info">
        <!-- <title-bar title="进度信息"></title-bar> -->
        <div class="children">
          <keep-alive>
            <router-view :orderDetails="this.orderDetails"></router-view>
          </keep-alive>
          <!-- <Edit></Edit> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleBar from '../../components/TitleBar'
export default {
  data () {
    return {
      id: '',
      orderDetails: {}, // 工单详情
      assetsType: '', // 资产类型
      reload: '', // 是否更新数据
      dialogVisible: false,
      loading: true
    }
  },
  computed: {
    // 工大类型
    type () {
      return this.orderDetails.type == '0' ? '维修' : '保养'
    },
    // 将工单类型数字转换成中文
    status () {
      const statusDic = ['待指派', '待处理', '处理中', '等待配件', '待返工', '待结单', '已结单', '已作废', '委外维修']
      return statusDic[this.orderDetails.status]
    }
  },
  components: {
    TitleBar
  },
  // 解决keep-alive的冲突
  beforeRouteEnter (to, from, next) {
    if (from.path === '/record' || from.path === '/remindrecord') {
      next(vm => {
        // 通过 `vm` 访问组件实例
        vm.getDetailsById()
      })
    } else {
      next()
    }
  },
  methods: {
    getDetailsById () {
      // 先拿id
      this.id = this.$route.query.id
      // 然后拿工单详情
      this.$http.httpGet('/app/apptborder/queryOrderById', { id: this.id }).then(res => {
        this.loading = false
        if (res.code === 0 && res.msg === 'success') {
          this.orderDetails = res.orderDetails

          // 判断deviceCode是否存在，存在的就是固定资产
          this.assetsType = this.orderDetails.deviceCode ? 1 : 0

          // 先将检查人存进来
          this.$store.state.orderCheckUser = {
            username: this.orderDetails.checkUserName,
            id: this.orderDetails.checkUserId,
            checkUserDesc: this.orderDetails.checkUserDesc
          }

          // 拿附件路径
          this.orderDetails.fileInfoPaths = this.getFilePath(this.orderDetails.fileInfoPaths)
          this.orderDetails.assignFileInfoPaths = this.getFilePath(this.orderDetails.assignFileInfoPaths)
          this.orderDetails.checkFileInfoPaths = this.getFilePath(this.orderDetails.checkFileInfoPaths)

          // 空白信息处理
          for (let item in this.orderDetails) {
            if (this.orderDetails[item] === null) {
              this.orderDetails[item] = '无'
              if (item == 'level' || item == 'assignName' || item == 'deviceCode' || item == 'assignUserId') {
                this.orderDetails[item] = 0
              } else if (item == 'leaderOrMonitorDesc') {
                this.orderDetails[item] = ''
              }
            }
          }
        } else {
          // this.$message.error(res.msg)
          this.$alert('获取设备信息出错, 原因:' + res.msg, '提示', {
            confirmButtonText: '确定',
            callback: () => {
              window.history.back(-1)
            }
          });
        }
      })
    },
    // 查看详情
    toSeeMore () {
      // 跳转到设备详情页
      this.$router.push({
        name: 'deviceinfo',
        query: {
          id: this.orderDetails.deviceId,
          permission: false
        }
      })
    },
    // 查看工单描述
    seeDescription () {
      this.dialogVisible = true
    },
    // 获取完整文件路径
    getFilePath (fileAry) {
      if (fileAry.length > 0) {
        fileAry.forEach(item => {
          item.path = process.env.VUE_APP_FILEURL + item.path
        })
        return fileAry
      } else {
        return []
      }
    }
  },
  created () {
    this.getDetailsById()
  }
}
</script>

<style lang="scss">
@import '@/assets/style/global.scss';
.detalis {
  background-color: #fff;
  .details-wrapper {
    .basic-info {
      padding: 15px 20px;
      padding-bottom: 0;
      .info-list {
        .list-item {
          // height: 1.5rem;
          position: relative;
          margin-top: 0;
          padding: 15px 0;
          .tips {
            position: absolute;
            left: 30%;
            bottom: 0;
            font-size: 1.2rem;
            color: #aaa;
          }
          .item-left {
            flex: 88px 0 0;
            padding: 0 12px 0 0;
            text-align: right;
            font-size: 15px;
          }
          .item-right {
            font-size: 15px;
            &.desc {
              display: -webkit-box; //将对象作为弹性伸缩盒子模型显示。
              line-height: 20px;
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              -webkit-box-orient: vertical; //从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
              -webkit-line-clamp: 3; //这个属性不是css的规范属性，需要组合上面两个属性，表示显示的行数。
            }
            .item-img {
              display: inline-block;
              margin-right: 1.5rem;
              width: calc((100% - 3rem) / 3);
              height: 5rem;
              // background-color: pink;
              &:nth-of-type(3n) {
                margin-right: 0;
              }
            }
            textarea {
              width: 100%;
              background-color: #fff;
              border: 1px solid #dcdfe6;
              outline: none;
              padding: 1rem;
              box-sizing: border-box;
              height: 10rem;
              border-radius: 0.5rem;
              font-size: 1.2rem;
              color: #333;
              &:disabled {
                background-color: #eee;
                border-color: #e4e7ed;
                color: #333;
                opacity: 0.8;
                -webkit-text-fill-color: #333;
                cursor: not-allowed;
              }
            }
          }
          .center {
            text-align: center;
          }
          .item-btn {
            position: absolute;
            right: 0;
            top: 10px;
            background-color: #409eff;
            font-size: 12px;
            height: 30px;
            line-height: 30px;
          }
        }
      }
    }
    .progress-info {
      padding: 0 20px 20px;
    }
  }
}
.el-dialog__body {
  padding: 10px 20px 20px;
  color: #606266;
  font-size: 16px;
  word-break: break-all;
}
.el-message-box {
  width: 35rem;
}
</style>
