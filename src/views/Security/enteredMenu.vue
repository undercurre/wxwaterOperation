<template>
  <div class="test_container">
<!--    导航栏-->
    <back-box :id="this.typeId"></back-box>
    <div class="content">
<!--      标题栏-->
      <div class="title">
        <p>
          <img src="./images/u603.svg" />
          <i>{{ menu.username }}的{{ title.substr(0,6) }}菜单</i>
        </p>
      </div>
<!--      第一列表项别表 我的××××-->
      <span class="headline">我的{{ title }}&nbsp;:</span>
      <div class="my">
        <ul>
          <li @click="nextRecord('7',1,0)">
            <img class="text_icon" src="./images/u572.png">
            <span>我创建的</span>
            <img class="line" src="./images/u574.svg">
          </li>
          <li @click="nextRecord('7',1,1)">
            <img class="text_icon" src="./images/u572.png">
            <span>我参与的</span>
            <img class="line" src="./images/u574.svg">
          </li>
          <li @click="nextRecord(recordType.toString(),1,2)" v-if="need">
            <img class="text_icon" src="./images/u572.png">
            <span>要我{{ need }}的</span>
            <div class="red_box">
              <img class="circle" src="./images/u586.svg">
<!--              安全检查：要我整改的-->
              <span class="num" v-if="typeId==1">{{ menu.rectificationNum }}</span>
<!--              电子报表：要我巡检的-->
              <span class="num" v-if="typeId==4">{{ menu.checkNum }}</span>
<!--              危险作业：要我执行的-->
              <span class="num" v-if="typeId==6">{{ menu.executeNum }}</span>
            </div>
            <img class="line" src="./images/u574.svg">
          </li>
          <li @click="nextRecord('9',1,3,2)">
            <img class="text_icon" src="./images/u572.png">
            <span>要我签名的</span>
            <div class="red_box">
              <img class="circle" src="./images/u586.svg">
              <span class="num">{{ menu.signNum }}</span>
            </div>
          </li>
        </ul>
      </div>
<!--  ××××任务管理-->
      <span class="headline">{{ title.substr(0,6) }}管理&nbsp;:</span>
      <div class="manager">
        <ul>
          <li @click="nextSetUp(parseInt(typeId)+12)">
            <img class="text_icon" src="./images/u572.png">
            <span>创建{{ title.substr(0,6) }}</span>
            <img class="line" src="./images/u574.svg">
          </li>
          <li @click="nextRecord('25',0,5,4)">
            <img class="text_icon" src="./images/u572.png">
            <span>我的提醒记录</span>
            <img class="line" src="./images/u574.svg">
          </li>
          <li @click="nextQuery(parseInt(typeId)+18)">
            <img class="text_icon" src="./images/u572.png">
            <span>{{ title }}查询</span>
          </li>
        </ul>
      </div>

<!--      <span class="headline" v-if="typeId==6">危险作业相关签名&nbsp;:</span>-->
<!--      <div class="sign" v-if="typeId==6">-->
<!--        <ul>-->
<!--          <li @click="nextRecord('27',0,7,1)">-->
<!--            <img class="text_icon" src="./images/u572.png">-->
<!--            <span>执行人签名</span>-->
<!--            <div class="red_box">-->
<!--              <img class="circle" src="./images/u586.svg">-->
<!--              <span class="num">{{ menu.executeSignNum }}</span>-->
<!--            </div>-->
<!--            <img class="line" src="./images/u574.svg">-->
<!--          </li>-->
<!--          <li @click="nextRecord('28',0,8,3)">-->
<!--            <img class="text_icon" src="./images/u572.png">-->
<!--            <span>解除者签名</span>-->
<!--            <div class="red_box">-->
<!--              <img class="circle" src="./images/u586.svg">-->
<!--              <span class="num">{{ menu.releaseSignNum }}</span>-->
<!--            </div>-->
<!--          </li>-->
<!--        </ul>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script>
import header from "@/views/Security/subcomponents/header";
import axios from  "axios"
import $http from "@/utils/http";

export default {
  data(){
    return{
      //系统模块判别码
      typeId: null,
      //该系统的标题
      title: '',
      //是否需要第三行，要我××的
      need: true,
      //传入下一页顶部导航栏，用于从header组件中的本地数据仓库中更换导航栏的字符串
      recordType: 8,//8为整改任务
      //接口数据容器：系统菜单数据
      menu: {},
      //本地数据仓库
      //菜单接口url
      url: {
        1: process.env.VUE_APP_URL +"/waterOperation/app/appTbSafetyCheck/menu",
        2: process.env.VUE_APP_URL +"/waterOperation/app/tbSafetyTrain/menu",
        3: process.env.VUE_APP_URL +"/waterOperation/app/tbSafetySkits/menu",
        4: process.env.VUE_APP_URL +"/waterOperation/app/appTbElectronicReport/menu",
        5: process.env.VUE_APP_URL +"/waterOperation/app/tbSafetyMeeting/menu",
        6: process.env.VUE_APP_URL +"/waterOperation/app/appTbDangerousTask/menu"
      }
    }
  },
  created() {
    //页面初始化
    this.init()
    //获取菜单数据
    this.getMenu()
  },
  methods: {
    init(){
      //获取系统模块辨别码typeId，优先从缓存中获取，再从路径中获取
      if (sessionStorage.getItem('typeId')) {
        this.typeId = sessionStorage.getItem('typeId')
      }else {
        this.typeId = this.$route.query.typeId
        sessionStorage.setItem('typeId', this.typeId.toString())
      }
      //如果缓存中已经有存有菜单信息就先把缓存中的菜单信息装载进数据容器中
      if (sessionStorage.getItem('menu'))
        this.menu = sessionStorage.getItem('menu')
      //配置axios请求拦截器，加入token请求头
      axios.interceptors.request.use(
          config => {
            config.headers['token'] = sessionStorage.getItem('wxtoken') // 请求头带上
            return config
          },
          error => {
            return Promise.reject(error)
          }
      )
      //根据模块辨别码对系统标题进行还有所需要的第三列特殊选择项进行字符串填充
      switch (this.typeId){
        case '1': this.title = '安全检查任务';
          this.need  = '整改'
          break;
        case '2': this.title = '安全培训任务'
          this.need  = false;
          break;
        case '3': this.title = '安全演练任务';
          this.need  = false;
          break;
        case '4': this.title = '安全电子报表任务';
          this.need  = '巡检';
          this.recordType = 10;//告诉导航栏将要在下一页要显示的导航栏字符串，10为巡检任务
          break;
        case '5': this.title = '安全会议任务';
          this.need  = false;
          break;
        case '6': this.title = '危险作业任务';
          this.need  = '执行'
          this.recordType = 11;//告诉导航栏将要在下一页要显示的导航栏字符串，11为执行任务
          break;
        default:
          break;
      }
    },
    //请求菜单数据
    getMenu(){
      axios.get(this.url[this.typeId]).then(result => {
        if(result.data.code === 0){
          this.menu = result.data.menu
          //装载到容器后立即缓存
          sessionStorage.setItem('menu',JSON.stringify(result.data.menu))
        }else{
          console.log("数据获取失败")
        }
      })
    },
    //进入记录页（titleTarId：下一页导航栏辨别码；remindSwitch：是否是提醒记录，0为提醒记录，1为普通记录，recordType：记录类型，0为我创建的，1为我参与的，2为要我××的，3为要我签名的，5为我的提醒记录；dangerPeoType：危险作业人物分类，根据后台的判别，1为执行人，2为签发人，3为解除人，4为创建人）
    nextRecord(titleTarId,remindSwitch,recordType,dangerPeoType){
      sessionStorage.removeItem('header')
      this.$router.push({ name: 'security_record', query: { titleBarId:titleTarId, typeId:this.typeId, remindSwitch: remindSwitch, recordType:recordType, dangerPeoType: dangerPeoType } })
    },
    //进入创建页
    nextSetUp(titleTarId){
      titleTarId = titleTarId.toString()
      sessionStorage.removeItem('header')
      this.$router.push({ name: 'security_setUp', query: { titleBarId:titleTarId, typeId:this.typeId } })
    },
    //进入搜索页
    nextQuery(titleTarId){
      sessionStorage.removeItem('header')
      this.$router.push({ name: 'security_query', query: { titleBarId:titleTarId, typeId:this.typeId } })
    },
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    'back-box': header
  }
}
</script>

<style lang="scss" scoped>


.test_container {
  font-weight: 700;
  font-size: 20px;
  .content {
    color: #7F7F7F;
    .my,.manager,.sign{
      box-shadow: 1px 2px 6px rgba(148, 148, 148, 0.349019607843137);
      margin-bottom: 30px;
    }
    li{
      height: 50px;
      width: 94%;
      margin: 0 auto;
    }
    span{
      font-size: 16px;
      vertical-align: top;
      line-height: 50px;
    }
    .title {
      width: 80%;
      height: 49px;
      border-radius: 60px;
      box-shadow: 1px 2px 6px rgba(148, 148, 148, 0.349019607843137);
      margin: 20px auto 30px;
      padding-right: 10px;
      img{
        float: left;
      }
      p{
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      i{
        margin-left: 6px;
        color: #5E5E5E;
        font-size: 20px;
        line-height: 49px;
        vertical-align: center;
      }
    }

    .headline {
      font-size: 16px;
      font-weight: normal;
      margin-left: 10px;
    }

    .text_icon {
      width: 28px;
      height: 28px;
      float: left;
      margin: 11px 20px 11px 6px;
    }

    .line{
      display: block;
      width: 100%;
      margin: 0 auto;
    }

    .red_box{
      float: right;
      position: relative;
      font-size: 0;
    }
    .circle{
      width: 28px;
      height: 28px;
      margin: 11px 6px 11px 0px;
    }

    .num{
      width: 16px;
      font-size: 16px;
      color: #ffffff;
      position: absolute;
      left: 50%;
      margin-left: -11px;
      top: 1px;
      text-align: center;
    }
  }
}
</style>