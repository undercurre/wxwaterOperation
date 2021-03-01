<template>
  <div class="number-search"
       v-loading="loading"
       element-loading-text="拼命加载中">
    <div class="search-input">
      <div class="search-wrapper">
        <div class="wrapper-input">
          <input type="text"
                 placeholder="请输入设备编号或设备名"
                 v-model="keyword" />
        </div>
        <div class="wrapper-icon">
          <a @click.prevent="scanCode()">
            <i class="iconfont icon-iconfontscan"></i>
          </a>
        </div>
      </div>
      <div class="search-select">
        <el-select v-model="devicePositionId"
                   clearable
                   filterable
                   placeholder="请选择设备所在位置">
          <el-option v-for="item in positionList"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="search-btn">
        <button class="btn btn-left"
                @click="clear">
          清除内容
        </button>
        <button class="btn btn-right"
                @click.prevent="searchDevice(1)">查询设备</button>
      </div>
    </div>

    <div class="search-result warpper"
         ref="wrapper">
      <ul class="result-content content">
        <li class="result-item"
            v-for="(item, index) in resultList"
            :key="index"
            @click="toDeviceInfo(item.code)">
            <!-- @click="toDeviceInfo(item.id)" -->
          <div class="item-name">{{item.name}}</div>
          <div class="item-code">{{item.code}}</div>
          <div class="item-location">
            <span class="item-area"
                  style="margin-right:20px; font-size:1.3rem;">地区：{{item.areaName}}</span>
            <span>位置：{{item.devicePosition}}</span>
          </div>
        </li>
      </ul>
      <!-- 底部提示信息 -->
      <transition name="fade">
        <div class="bottom-tip"
             v-show="isShowTips">
          <span class="loading-hook">{{pullupMsg}}</span>
        </div>
      </transition>

    </div>

  </div>
</template>

<script>
import wx from "weixin-js-sdk";
import BScroll from 'better-scroll'
export default {
  data () {
    return {
      loading: false,
      keyword: '', // 设备编号
      resultList: [],
      page: 1, // 分页查询，第一次为1
      pullupMsg: '加载更多',
      isShowTips: false,
      devicePositionId: '',
      positionList: []
    };
  },
  created() {
    this.searchDevice(0);
  },
  methods: {
    scanCode () {
      // 获取jsapi_ticket
      this.$http
        .get("/wechat/sign/url", {
          params: {
            // 这里是当前页面的url（本页面的域名必须与公众号js安全域名一致），一定要 location.href 获取，不然签名会无效。
            url: location.href
          }
        })
        .then(function (res) {
          // 通过config接口注入权限验证配置
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.appId, // 必填，公众号的唯一标识
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名
            jsApiList: ["scanQRCode"] // 必填，需要使用的JS接口列表
          });

          //通过ready接口处理成功验证
          wx.ready(function () {
            // config信息验证成功后会执行ready方法,所有接口调用都必须在config接口获得结果之后
            // config 是一个客户端的异步操作,所以如果需要在页面加载时调用相关接口,则须把相关接口放在ready函数中调用来确保正确执行.对于用户触发是才调用的接口,则可以直接调用,不需要放在ready函数中
            wx.checkJsApi({
              // 判断当前客户端版本是否支持指定JS接口
              jsApiList: ["scanQRCode"],
              success: function (res) {
                // 以键值对的形式返回，可用true，不可用false。如：{"checkResult":{"scanQRCode":true},"errMsg":"checkJsApi:ok"}
                if (res.checkResult.scanQRCode === true) {
                  wx.scanQRCode({
                    // 微信扫一扫接口
                    desc: "扫描设备二维码",
                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                    success: function (res) {
                      let scanResult = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                      window.location.href = scanResult;
                    }
                  });
                } else {
                  alert("抱歉，当前客户端版本不支持扫一扫");
                }
              },
              fail: function (res) {
                // 检测getNetworkType该功能失败时处理
                alert("检测失败" + res);
              }
            });
          });
        })
        .catch(function (error) {
          alert("扫码失败" + error);
        });
    },
    clear () {
      this.keyword = ''
      this.devicePositionId = null
    },
    searchDevice (valPost) {
      let getdeviceId = parseInt(this.$route.query.deviceId);
      let getdeviceKeyword = this.$route.query.keyword;
      console.log(getdeviceId,getdeviceKeyword);
      let theDeviceId = null;
      let theSearhKeyword = null;
      if(valPost === 0){
        if(getdeviceId){
          theDeviceId = getdeviceId;
          this.devicePositionId = getdeviceId;
        }else{
          theDeviceId = null;
          this.devicePositionId = null;
        }
        if(getdeviceKeyword){
          theSearhKeyword = getdeviceKeyword;
          this.keyword = getdeviceKeyword;
        }else{
          theSearhKeyword = null;
          this.keyword = null;
        }
      }else{
        theDeviceId = this.devicePositionId;
        theSearhKeyword = this.keyword;
      }
      this.$http.httpPost('/app/apptbdevice/listDeviceByKeyWord', {
        keyword: theSearhKeyword,
        page: 1,
        devicePositionId: theDeviceId,
      }).then(res => {
        if (res.code === 0 && res.msg === 'success') {
          if (res.data.length == 0) {
            this.$message.info('查无此设备')
          }
          this.resultList = res.data
          this.page++
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    _initBScroll () {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.wrapper, {
          //开启点击事件 默认为false
          click: true,
          scrollY: true,
          probeType: 3
        })
        // 一些监听
        this.scroll.on('scroll', (pos) => {
          if (pos.y - this.scroll.maxScrollY < -50) {
            this.isShowTips = true
          } else {
            this.isShowTips = false
          }
        })

        this.scroll.on('touchEnd', pos => {
          // 1.2.1监听下拉
          if (pos.y >= 50) {
            console.log('下拉刷新')
          }
          // 1.2.2监听上拉
          if (this.scroll.maxScrollY > pos.y + 50) {
            this.loading = true

            // 发请求加载
            this.$http.httpPost('/app/apptbdevice/listDeviceByKeyWord', {
              keyword: this.keyword,
              page: this.page,
              devicePositionId: this.devicePositionId
            }).then(res => {
              this.loading = false
              if (res.code === 0 && res.msg === 'success') {
                if (res.data.length == 0) {
                  this.$message.info('没有更多数据了')
                  return
                }
                this.page++
                let arr = res.data
                this.resultList = this.resultList.concat(arr)
                this.$nextTick(() => {
                  this.scroll.refresh()
                  this.scroll.finishPullUp()
                })
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        })
      } else if (!this.$refs.wrapper) {
        return
      }
      else {
        this.scroll.refresh()
      }
    },
    toDeviceInfo (id) {
      this.$router.push({ name: 'deviceinfo', query: { code:id, deviceId: this.devicePositionId, keyword: this.keyword, permission: true } })
    },
    getDevicePositionList () {
      this.$http.httpGet('/app/tbDevicePosition/listAll').then(res => {
        if (res.code === 0) {
          this.positionList = res.data
        }
      })
    }
  },
  mounted () {
    this.getDevicePositionList()
    this.$nextTick(() => {
      this._initBScroll()
    })
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/style/global.scss';
.number-search {
  margin-top: 0;
  padding: 0;
  .search-input {
    .search-wrapper {
      position: relative;
      padding: 15px 20px;
      .wrapper-input {
        box-sizing: border-box;
        width: calc(100% - 5rem);
        height: 4rem;
        line-height: 4rem;
        border-radius: 6px 0 0 6px;
        border: 1px solid #ddd;
        background-color: #fff;
        // display: inline-block;
        float: left;
        input {
          height: 3rem;
          width: calc(100% - 2rem);
          border: none;
          padding: 0.5rem 1rem;
          font-size: 1.6rem;
          outline-style: none;
          color: #333;
          background-color: transparent;
        }
      }

      .wrapper-icon {
        position: relative;
        background-color: rgba(245, 209, 7, 0.801);
        width: 5rem;
        height: 4rem;
        display: inline-block;
        line-height: 4rem;
        text-align: center;
        border-radius: 0 6px 6px 0;
        a {
          color: #333;
          i {
            font-size: 3rem;
            font-weight: bold;
          }
        }
      }
    }
    .search-select {
      text-align: center;
      padding: 0 20px 10px;
      .el-select {
        width: 100%;
      }
    }
    .search-btn {
      margin-top: 0;
      padding: 0 20px;
      button {
        height: 3.2rem;
        font-weight: 700;
        display: inline-block;
        width: 40%;
      }
      .btn-left {
        float: left;
        background-color: rgb(207, 0, 0);
      }
      .btn-right {
        float: right;
        background-color: rgb(6, 175, 6);
      }
    }
  }
  .search-result {
    position: absolute;
    top: 16.5rem;
    bottom: 1rem;
    width: 100%;
    // height: 100%;
    overflow: hidden;
    .result-content {
      padding: 0 20px 10px;
      .result-item {
        position: relative;
        box-sizing: border-box;
        padding: 10px;
        border-radius: 0.5rem;
        margin-top: 1.6rem;
        height: 8rem;
        background-color: #f2f6fc;
        color: #303133;
        font-size: 1.6rem;
        box-shadow: 0 0.3rem 0.5rem #eee;
        .item-code {
          position: absolute;
          right: 10px;
          top: 8px;
          font-size: 1.4rem;
          color: #000;
        }
        .item-name {
          padding-top: 0.8rem;
          line-height: 2rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .item-location {
          height: 1.8rem;
          line-height: 1.8rem;
          font-size: 1.4rem;
          margin-top: 1.4rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .loading {
    position: fixed;
    bottom: 3rem;
    left: 45%;
    span {
      font-size: 1.4rem;
    }
  }
  .bottom-tip {
    width: 100%;
    height: 35px;
    line-height: 35px;
    text-align: center;
    color: #333;
    // background: #f2f2f2;
    position: absolute;
    bottom: -5px;
    font-size: 1.6rem;
    left: 0;
  }
}
/deep/ .el-input__inner::-webkit-input-placeholder {
  color: #666;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.el-select-dropdown__item {
  font-size: 14px !important;
  line-height: 34px;
  padding: 0 20px;
}
</style>
