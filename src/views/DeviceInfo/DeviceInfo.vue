<template>
  <div class="deviceinfo"
       v-loading="loading"
       element-loading-text="拼命加载中..."
       v-loading.lock="true">
    <div class="deviceBack"><img src="./angleLeft.png" @click="getBack" /></div>
    <div class="device-content">
      <div class="device-wrapper">
        <ul class="info-list">
          <li class="list-item"
              v-if="this.deviceAssetType">
            <span class="item-left">设备编号:</span>
            <span class="item-right">{{this.deviceInfo.code}}</span>
          </li>
          <li class="list-item">
            <span class="item-left">设备名称:</span>
            <span class="item-right">{{this.deviceInfo.name}}</span>
          </li>
          <li class="list-item">
            <span class="item-left">设备型号:</span>
            <span class="item-right">{{this.deviceInfo.model}}</span>
          </li>
          <li class="list-item">
            <span class="item-left">设备类别:</span>
            <span class="item-right">{{this.deviceInfo.deviceType}}</span>
          </li>
          <li class="list-item">
            <span class="item-left">设备规格:</span>
            <span class="item-right">{{this.deviceInfo.spec}}</span>
          </li>
          <li class="list-item">
            <span class="item-left">设备价值:</span>
            <span class="item-right">{{this.deviceInfo.value}}{{this.deviceInfo.value == '无' ? '' : '元'}}</span>
          </li>
          <li class="list-item">
            <span class="item-left">资产类型:</span>
            <span class="item-right">{{this.deviceInfo.assetType}}</span>
          </li>
          <li class="list-item">
            <span class="item-left">管理部门:</span>
            <span class="item-right">{{this.deviceInfo.chargeDept}}</span>
          </li>
          <li class="list-item">
            <span class="item-left">使用部门:</span>
            <span class="item-right">{{this.deviceInfo.useDept}}</span>
          </li>
          <li class="list-item">
            <span class="item-left">使用时间:</span>
            <span class="item-right">{{this.deviceInfo.useTime}}</span>
          </li>
          <li class="list-item"
              v-if="this.deviceAssetType">
            <span class="item-left">保养周期(天):</span>
            <span class="item-right">{{this.deviceInfo.cycle}}</span>
          </li>
          <li class="list-item">
            <span class="item-left">当前状态:</span>
            <span class="item-right">{{this.deviceInfo.status}}</span>
          </li>
          <li class="list-item">
            <span class="item-left">设备所在位置:</span>
            <span class="item-right">{{this.deviceInfo.devicePosition}}</span>
          </li>
          <li class="list-item">
            <span class="item-left">设备详细位置:</span>
            <span class="item-right">{{this.deviceInfo.location}}</span>
          </li>
          <li class="list-item">
            <span class="item-left">上次维修时间:</span>
            <span class="item-right">{{this.deviceInfo.lastFixTime}}
            </span>
          </li>
          <li class="list-item"
              v-if="this.deviceAssetType">
            <span class="item-left">上次保养时间:</span>
            <span class="item-right">{{this.deviceInfo.lastMaintainTime}}</span>
          </li>
          <li class="list-item"
              v-if="this.deviceAssetType">
            <span class="item-left">下次保养时间:</span>
            <span class="item-right">{{this.deviceInfo.nextMaintainTime}}</span>
          </li>
          <li class="list-item"
              v-if="this.deviceAssetType">
            <span class="item-left">保养负责人:</span>
            <span class="item-right">{{this.deviceInfo.maintainUserName}}</span>
          </li>
<!--          <li class="list-item"-->
<!--              v-if="this.deviceAssetType">-->
<!--            <span class="item-left">负责人电话:</span>-->
<!--            <span class="item-right phone">-->
<!--              <a :href="'tel:'+this.deviceInfo.maintainUserTel"-->
<!--                 :class="this.deviceInfo.maintainUserTel == '无' ? '' : 'phone'">-->
<!--                {{this.deviceInfo.maintainUserTel}}-->
<!--              </a>-->
<!--            </span>-->
<!--          </li>-->
          <li class="list-item">
            <span class="item-left">经纬度:</span>
            <span class="item-right">{{this.deviceInfo.longitude}} ， {{this.deviceInfo.latitude}}</span>
          </li>

          <li class="list-item">
            <span class="item-left">设备附件:</span>
            <div class="item-right">
              <div class="appendix">
                <a href="#"
                   v-for="(item, index) in fileList"
                   :key="index"
                   @click.prevent="judgeAndDownload(item.path,item.originalFilename)">
                  <i class="iconfont"
                     :class="item.icon"></i>
                  <span>{{item.originalFilename}}</span>
                </a>
              </div>
              <div v-show="fileList.length == 0">
                无
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="device-bottom"
           v-show="permission">
        <div class="bottom-content">
          <button class="maintenance btn"
                  v-if="this.deviceAssetType"
                  @click="maintenancePlan"
                  :disabled="btnDisabled">保养计划</button>
          <button class="recording btn"
                  @click="orderRecord"
                  :disabled="btnDisabled">工单记录</button>
          <button class="create btn"
                  v-if="this.deviceAssetType"
                  @click.prevent="createOrder"
                  :disabled="btnDisabled">创建工单</button>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div id='weixin-tip-box'
           v-show="isWeixinToOther"
           @click="closeTips">
        <div class="triangle_border_up">
          <span></span>
        </div>
        <div class="weixin-tip">
          <p>
            请点击右上角
          </p>
          <p class="content">
            选择"浏览器中打开"
          </p>
          <i class="icon iconfont icon-close_icon"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import dic from '../../utils/dictionary'
import { isWeiXin, isIOS } from '../../utils/validate'
export default {
  data () {
    return {
      permission: true, // 权限，控制底部是否显示
      deviceInfo: {
      },
      fileList: [], // 附件列表
      loading: true,
      btnDisabled: false, // 按钮是否不可以按
      isWeixinToOther: false,
      deviceAssetType: true,
      getDeviceId: null,
      getDeviceKeyword: null,
    }
  },
  methods: {
    // 获取设备信息
    async getDeviceInfo () {
      let code = this.$route.query.code;
      this.getDeviceId = this.$route.query.deviceId;
      this.getDeviceKeyword = this.$route.query.keyword;
      let id = this.$route.query.id;
      if(id){
        await this.$http.httpGet('/app/apptbdevice/queryDeviceById' , { id }).then(res => {
          // await this.$http.httpGet('/app/apptbdevice/queryDeviceById', { id }).then(res => {
          if (res.code === 0 && res.msg === "success") {
            this.deviceInfo = res.data
            if (!this.deviceInfo.code) {
              this.deviceAssetType = false
            }
            // 遍历对象
            for (let item in this.deviceInfo) {
              (item === 'location' && this.deviceInfo[item] === '') ? this.deviceInfo[item] = '无' : null
              if (this.deviceInfo[item] === null) {
                this.deviceInfo[item] = '无'
              }
            }
            // 部门前面加上地区
            this.deviceInfo.useDept = this.deviceInfo.areaName + '/' + this.deviceInfo.useDept
            this.deviceInfo.chargeDept = this.deviceInfo.areaName + '/' + this.deviceInfo.chargeDept

            // 下次保养时间
            this.deviceInfo.nextMaintainTime = this.getNextMaintainTime(this.deviceInfo.lastMaintainTime, this.deviceInfo.cycle)

            // 变换一下设备类型和设备状态
            this.deviceInfo.assetType = dic.assetsTypeDic[Number(this.deviceInfo.assetType)]
            this.deviceInfo.status = dic.deviceStatusDic[Number(this.deviceInfo.status)]
          } else {
            // this.$message.error('获取设备信息出错, 原因:' + res.msg)
            this.$alert('获取设备信息出错, 原因:' + res.msg, '提示', {
              confirmButtonText: '确定',
              callback: () => {
                window.history.back(-1)
              }
            });
            this.btnDisabled = true
          }
        })
      }else{
        await this.$http.httpGet('/app/apptbdevice/queryDeviceByCode' , { code }).then(res => {
          // await this.$http.httpGet('/app/apptbdevice/queryDeviceById', { id }).then(res => {
          if (res.code === 0 && res.msg === "success") {
            this.deviceInfo = res.data
            if (!this.deviceInfo.code) {
              this.deviceAssetType = false
            }
            // 遍历对象
            for (let item in this.deviceInfo) {
              (item === 'location' && this.deviceInfo[item] === '') ? this.deviceInfo[item] = '无' : null
              if (this.deviceInfo[item] === null) {
                this.deviceInfo[item] = '无'
              }
            }
            // 部门前面加上地区
            this.deviceInfo.useDept = this.deviceInfo.areaName + '/' + this.deviceInfo.useDept
            this.deviceInfo.chargeDept = this.deviceInfo.areaName + '/' + this.deviceInfo.chargeDept

            // 下次保养时间
            this.deviceInfo.nextMaintainTime = this.getNextMaintainTime(this.deviceInfo.lastMaintainTime, this.deviceInfo.cycle)

            // 变换一下设备类型和设备状态
            this.deviceInfo.assetType = dic.assetsTypeDic[Number(this.deviceInfo.assetType)]
            this.deviceInfo.status = dic.deviceStatusDic[Number(this.deviceInfo.status)]
          } else {
            // this.$message.error('获取设备信息出错, 原因:' + res.msg)
            this.$alert('获取设备信息出错, 原因:' + res.msg, '提示', {
              confirmButtonText: '确定',
              callback: () => {
                window.history.back(-1)
              }
            });
            this.btnDisabled = true
          }
        })
      };

      await this.$http.httpGet('/app/apptbdevice/list-file/' + this.deviceInfo.id).then(res => {
        this.loading = false
        if (res.code === 0 && res.msg === 'success') {
          this.fileList = []
          res.data.forEach(item => {
            if (item !== null && item !== undefined) {
              this.fileList.push(item)
            }
          })
          // 图标和url
          this.fileList.forEach(item => {
            item.path = process.env.VUE_APP_FILEURL + item.path
            if (item.originalFilename.includes('doc')) {
              item.icon = 'icon-word'
            } else if (item.originalFilename.includes('pdf')) {
              item.icon = 'icon-PDF'
            } else if (item.originalFilename.includes('png')) {
              item.icon = 'icon-PNG'
            } else if (item.originalFilename.includes('jpg') || item.originalFilename.includes('jpeg')) {
              item.icon = 'icon-JPEG'
            } else {
              item.icon = 'icon-fujian'
            }
          })
        } else {
          // this.$message.error('获取附件出错,' + res.msg)
          console.log('获取附件出错,' + res.msg);
        }
      })

      // 是否可以修改的权限
      if ((typeof this.$route.query.permission) !== 'boolean') {
        this.permission = eval(this.$route.query.permission.toLowerCase())
      } else {
        this.permission = this.$route.query.permission
      }
    },
    //返回上一层
    getBack() {
      // window.history.back(-1);
      this.$router.push({ name: 'numbersearch', query: { deviceId: this.getDeviceId, keyword: this.getDeviceKeyword, permission: true } })
    },
    // 获取下次保养的日期
    getNextMaintainTime (lastMaintainTime, cycle) {
      if (lastMaintainTime === '无' && this.deviceInfo.useTime === '无') {
        return '无'
      }
      lastMaintainTime = lastMaintainTime === '无' ? this.deviceInfo.useTime : lastMaintainTime
      if (isIOS()) {
        return new Date(new Date(lastMaintainTime.replace(/-/g, '/')).getTime() + cycle * (1000 * 60 * 60 * 24)).Format('yyyy-MM-dd')
      } else {
        return new Date((new Date(lastMaintainTime).getTime()) + (cycle * (1000 * 60 * 60 * 24))).Format("yyyy-MM-dd")
      }
    },
    createOrder () {
      this.$router.push({ name: 'createorder', query: { code: this.deviceInfo.code, isFixedAssets: true } })
    },
    // 保养计划
    maintenancePlan () {
      this.$router.push({ name: 'viewplan', query: { id: this.deviceInfo.id, deviceName: this.deviceInfo.name, code: this.deviceInfo.code } })
    },
    // 工单记录
    orderRecord () {
      this.$router.push({ name: 'orderquery', query: { myOrderType: 5, deviceId: this.deviceInfo.id } })
    },
    // 判断浏览器并下载
    judgeAndDownload (path, fileName) {
      // 进来后要判断是不是微信端
      if (isWeiXin()) {
        // 微信端提示用户去其他浏览器
        this.isWeixinToOther = true
      } else {
        // 非微信端直接下载
        let url = path
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        let body = document.body
        body.removeChild(link)
      }
    },
    closeTips () {
      this.isWeixinToOther = false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getDeviceInfo()
    })
  },
}
</script>

<style lang="scss">
.deviceinfo {
  // margin-top: 10px;
  padding: 0;
  position: relative;
  background-color: #fff;
  .device-content {
    .device-wrapper {
      padding-bottom: 5rem;
      .info-list {
        border-top: 1px #efefef solid;
        .list-item {
          padding: 15px 20px;
          display: flex;
          font-size: 1.6rem;
          border-bottom: 1px #efefef solid;
          overflow: hidden;
          margin: 0;
          .item-left {
            width: 120px;
            flex: 120px 0 0;
          }
          .item-right {
            flex: 3;
          }
          .appendix {
            margin-top: 0;
            text-align: center;
            margin-right: 1rem;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            a {
              flex: 0 0 8rem;
              width: 8rem;
              height: 6rem;
              // display: inline-block;
              color: #000;
              overflow: hidden;
              i {
                font-size: 3.6rem;
                fill: currentColor;
              }
              span {
                line-height: 1.6rem;
                margin-top: 0.5rem;
                font-size: 1.4rem;
                width: 8rem;
                height: 3rem;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
        }
      }
    }
    .device-bottom {
      width: 100%;
      height: 5rem;
      background-color: transparent;
      position: fixed;
      bottom: 0;
      left: 0;
      .bottom-content {
        display: flex;
        padding: 0 0rem;
        button {
          height: 5rem;
          line-height: 5rem;
          font-size: 1.6rem;
          border-radius: 0;
          -webkit-border-radius: 0;
          -moz-border-radius: 0;
        }
        .maintenance {
          flex: 1;
          background: #fad100;
        }
        .recording {
          flex: 1;
          background-color: #67c23a;
          color: #000;
        }
        .create {
          flex: 1;
          background-color: #0066cb;
        }
      }
    }
  }
}
#weixin-tip-box {
  position: fixed;
  right: 0;
  top: 0.4rem;
  width: 16rem;
  align-items: center;
}
.weixin-tip {
  position: relative;
  background: #40b2a8;
  z-index: 100;
  padding: 0.8rem;
  border-radius: 0.8rem;
  margin-right: 0.8rem;
}

.weixin-tip p {
  // text-align: center;
  font-size: 1.4rem;
  color: #fff;
  margin: 0.6rem 0;
}

.weixin-tip p.content {
  // text-align: center;
  font-size: 1.4rem;
}

.weixin-tip i.icon {
  position: absolute;
  right: 2rem;
  font-size: 1.4rem;
  top: 1rem;
  color: #fff;
}

.triangle_border_up {
  width: 0;
  height: 0;
  border-width: 0 0.6rem 1.2rem;
  border-style: solid;
  border-color: transparent transparent #40b2a8;
  /*透明 透明  灰*/
  margin-left: 11.4rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.el-message-box {
  width: 35rem;
}
.deviceBack{
  display: block;
  background-color: #efefef;
  padding: 0 10px;
  img{
    display: inline-block;
    width: 40px;
    padding: 0;
  }
}
</style>
