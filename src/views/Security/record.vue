<template>
  <div class="record_container">
    <title-bar :id="this.titleBarId" :front="this.typeId"></title-bar>
    <nut-infiniteloading
        @loadmore="onInfinite"
        :is-show-mod="true"
        :has-more="isHasMore"
        :is-loading="isLoading"
        :threshold="200"
    >
      <ul class="list" >
        <div class="item list-item" v-for="item in list" :key="item.id" @click="toDetail(item.id)">
          <div class="headline">
            <span class="name" v-if="remindSwitch">{{ item.content||item.name||item.topic }}</span>
            <span class="name" v-if="!remindSwitch">{{ item.remind }}</span>
            <span class="time common" v-if="remindSwitch">{{ item.createTime }}</span>
            <span class="time remind" v-if="!remindSwitch">{{ item.createTime }}</span>
          </div>
          <div class="info">
            <p>
              <span class="title" v-if="remindSwitch">{{ title[typeId][0] }}&nbsp;:&nbsp;</span>
              <span class="title" v-if="!remindSwitch">{{ remind[typeId][0] }}&nbsp;:&nbsp;</span>
              <span class="content" v-if="remindSwitch">{{ item.state }}</span>
              <span class="time remind" v-if="!remindSwitch">{{ item.name||item.topic||item.content }}</span>
            </p>
            <p class="abstract" v-if="typeId!=6">
              <span v-if="remindSwitch" class="title">{{ title[typeId][1] }}&nbsp;:&nbsp;</span>
              <span v-if="!remindSwitch" class="title">{{ remind[typeId][1] }}&nbsp;:&nbsp;</span>
              <span v-if="!(typeId==6)&&remindSwitch" class="content">{{ item.date||item.task }}</span>
              <span v-if="!remindSwitch" class="content">{{ item.task }}</span>
              <span v-if="typeId==2&&!remindSwitch" class="content">{{ item.date }}</span>
              <span v-if="(typeId==3||typeId==5)&&!remindSwitch" class="content">{{ item.date }}</span>
              <span v-if="typeId==4&&!remindSwitch" class="content">{{ item.date }}</span>
            </p>
            <p v-if="(title[typeId][2][0] && (item.location||item.workplace) && !(item.type === 1) || !remindSwitch)&&(typeId!=6)">
              <span v-if="remindSwitch" class="title">{{ title[typeId][2][0]}}&nbsp;:&nbsp;</span>
              <span v-if="!remindSwitch" class="title">{{ remind[typeId][2]}}&nbsp;:&nbsp;</span>
              <span v-if="remindSwitch" class="content">{{ item.location }}</span>
              <span v-if="!remindSwitch&&(typeId==1)" class="content ml12">{{ item.createUser }}</span>
              <span v-if="!remindSwitch" class="content">{{ item.location }}</span>
            </p>
            <p v-if="(item.type === 1)">
              <span class="title">{{ title[typeId][2][1]}}&nbsp;:&nbsp;</span>
              <span class="content">{{ item.team }}</span>
            </p>
            <p v-if="title[typeId][3][0] && !(item.type === 1) || (!remindSwitch&&remind[typeId][3])">
              <span v-if="remindSwitch" class="title">{{ title[typeId][3][0]}}&nbsp;:&nbsp;</span>
              <span v-if="!remindSwitch" class="title">{{ remind[typeId][3]}}&nbsp;:&nbsp;</span>
              <span v-if="remindSwitch&&(typeId<4)&&(typeId==2)" class="content">{{ item.trainTeacher }}</span>
              <span v-if="remindSwitch&&(typeId<4)&&(typeId!=2)" class="content">{{ item.createUser }}</span>
              <span v-if="remindSwitch&&(typeId==4)" class="content ml5">{{ item.createUser }}</span>
              <span v-if="remindSwitch&&((typeId==5)||(typeId==6))" class="content ml12">{{ item.createUser }}</span>
              <span v-if="!remindSwitch" class="content" :class="(typeId==5) ? 'ml12':''">{{ item.trainTeacher||item.checkUsers||item.presenterUser }}</span>
              <span v-if="(typeId==4||typeId==6)&&!remindSwitch" class="content" :class="(typeId==4) ? 'ml5':'ml12'">{{ item.createUser }}</span>
            </p>
            <p v-if="(item.type === 1)">
              <span class="title">{{ title[typeId][3][1] }}&nbsp;:&nbsp;</span>
              <span class="content ml12" v-if="typeId==2">{{ item.trainTeacher }}</span>
              <span class="content ml12" v-if="typeId!=2">{{ item.checkUsers }}</span>
            </p>
          </div>
          <div class="bottom">
            <img class="line" src="./images/u38.svg">
            <span class="detail">详情</span>
            <img class="right" src="./images/u132.png">
          </div>
        </div>
      </ul>
    </nut-infiniteloading>
  </div>
</template>

<script>
import header from "@/views/Security/subcomponents/header";
import axios from "axios";
import $http from "@/utils/http";
export default {
  data(){
    return {
      wxtoken: "",
      // 判别码
      typeId: null, //模块
      titleBarId: null, //导航栏
      remindSwitch: null, //用于判断是否为提醒记录
      recordType: null, //记录入口
      dangerPeoType: null,//危险任务人物类型
      //接口限制条件
      attendUserId: null,
      createUserId: null,
      rectificationUserId: null,
      checkUserId: null,
      hostUserId: null,
      removeUserId: null,
      executeUserId: null,
      startDate: null,
      endDate: null,
      keyword: null,
      trainTeacher: null,
      //加载更多，分页处理
      limit: 4,
      page: 1,
      totalPage: 1,
      isHasMore: true,
      isLoading: false,
      isErr: false,
      timer: null,
      //用户
      userId: null,
      //数据仓库

      title: {
        1 : ["检查状态","检查任务",["",""],["检查人员",""]],
        2 : ["任务状态","任务时间",["任务地点",""],["培训老师",""]],
        3 : ["任务状态","任务时间",["任务地点",""],["",""]],
        4 : ["任务状态","任务时间",["任务地点","班组名称"],["班(组)长","巡检人"]],
        5 : ["任务状态","任务时间",["任务地点",""],["主持人",""]],
        6 : ["任务状态",null,[null,null],["创建者",""]],
      },
      remind: {
        1 : ["任务名称","检查内容","发起人","检查人员"],
        2 : ["任务内容","任务时间","任务地点","培训老师"],
        3 : ["任务主题","任务时间","任务地点"],
        4 : ["任务主题","任务时间","任务地点","班(组)长"],
        5 : ["任务主题","任务时间","任务地点","主持人"],
        6 : ["任务名称",null,null,"创建者"],
      },
      interface: {
        1: [process.env.VUE_APP_URL +"/waterOperation/app/appTbSafetyCheck/createList",
            process.env.VUE_APP_URL +"/waterOperation/app/appTbSafetyCheck/attendList",
            process.env.VUE_APP_URL +"/waterOperation/app/appTbSafetyCheck/rectificationList",
            process.env.VUE_APP_URL +"/waterOperation/app/appTbSafetyCheck/signList",
            "",
            process.env.VUE_APP_URL +"/waterOperation/app/appTbSafetyCheckLog/list",
            process.env.VUE_APP_URL +"/waterOperation/app/appTbSafetyCheck/list"
        ],
        2: [process.env.VUE_APP_URL +"/waterOperation/app/tbSafetyTrain/createList",
            process.env.VUE_APP_URL +"/waterOperation/app/tbSafetyTrain/attendList",
            "",
            process.env.VUE_APP_URL +"/waterOperation/app/tbSafetyTrain/signList",
            "",
            process.env.VUE_APP_URL +"/waterOperation/app/appTbSafetyTrainLog/list",
            process.env.VUE_APP_URL +"/waterOperation/app/tbSafetyTrain/list"
        ],
        3: [process.env.VUE_APP_URL +"/waterOperation/app/tbSafetySkits/createList",
            process.env.VUE_APP_URL +"/waterOperation/app/tbSafetySkits/attendList",
            "",
            process.env.VUE_APP_URL +"/waterOperation/app/tbSafetySkits/signList",
            "",
            process.env.VUE_APP_URL +"/waterOperation/app/appTbSafetySkitsLog/list",
            process.env.VUE_APP_URL +"/waterOperation/app/tbSafetySkits/list"
        ],
        4: [process.env.VUE_APP_URL +"/waterOperation/app/appTbElectronicReport/createList",
            process.env.VUE_APP_URL +"/waterOperation/app/appTbElectronicReport/attendList",
            process.env.VUE_APP_URL +"/waterOperation/app/appTbElectronicReport/checkList",
            process.env.VUE_APP_URL +"/waterOperation/app/appTbElectronicReport/signList",
            "",
            process.env.VUE_APP_URL +"/waterOperation/app/appTbElectronicReportLog/list",
            process.env.VUE_APP_URL +"/waterOperation/app/appTbElectronicReport/list"
        ],
        5: [process.env.VUE_APP_URL +"/waterOperation/app/tbSafetyMeeting/createList",
            process.env.VUE_APP_URL +"/waterOperation/app/tbSafetyMeeting/attendList",
            process.env.VUE_APP_URL +"/waterOperation/app/tbSafetyMeeting/hostList",
            process.env.VUE_APP_URL +"/waterOperation/app/tbSafetyMeeting/signList",
            "",
            process.env.VUE_APP_URL +"/waterOperation/app/appTbSafetyMeetingLog/list",
            process.env.VUE_APP_URL +"/waterOperation/app/tbSafetyMeeting/list"
        ],
        6: [process.env.VUE_APP_URL +"/waterOperation/app/appTbDangerousTask/createList",
            process.env.VUE_APP_URL +"/waterOperation/app/appTbDangerousTask/attendList",
            process.env.VUE_APP_URL +"/waterOperation/app/appTbDangerousTask/executeList",
            process.env.VUE_APP_URL +"/waterOperation/app/appTbDangerousTask/signList",
            "",
            process.env.VUE_APP_URL +"/waterOperation/app/appTbDangerousTaskLog/list",
            process.env.VUE_APP_URL +"/waterOperation/app/appTbDangerousTask/list",
            process.env.VUE_APP_URL +"/waterOperation/app/appTbDangerousTask/executeSignList",
            process.env.VUE_APP_URL +"/waterOperation/app/appTbDangerousTask/releaseSignList"
        ],
      },
      //接口数据容器
      list: [],
      //计时器
      intervalId: null
    }
  },
  created() {
    //初始化
    this.init()
    //定时器刷新请求
    // this.dataRefreh()
    //获取列表
    this.getList()
  },
  destroyed() {
    //停止刷新
    this.stopRefreh()
  },
  methods: {
    //初始化
    init(){
      //先从缓存里拿，缓存没有再从路由拿
      if (sessionStorage.getItem('typeId')) {
        this.typeId = sessionStorage.getItem('typeId')
      }else{
        this.typeId = this.$route.query.typeId
      }
      this.titleBarId = this.$route.query.titleBarId+""
      this.remindSwitch = this.$route.query.remindSwitch
      this.recordType = this.$route.query.recordType
      this.dangerPeoType = this.$route.query.dangerPeoType
      if(sessionStorage.getItem('record')) {
        let record = JSON.parse(sessionStorage.getItem('record'))
        this.recordType = record.recordType
        this.remindSwitch = record.remindSwitch
        this.titleBarId = record.titleBarId
      }else {
        let record = {}
        record.recordType = this.recordType
        record.remindSwitch = this.remindSwitch
        record.titleBarId = this.titleBarId
        record.dangerPeoType = this.dangerPeoType
        sessionStorage.setItem('record',JSON.stringify(record))
      }
      //请求拦截器
      axios.interceptors.request.use(
          config => {
            config.headers['token'] = sessionStorage.getItem('wxtoken') // 请求头带上
            return config
          },
          error => {
            return Promise.reject(error)
          }
      )
      this.wxtoken = sessionStorage.getItem('wxtoken')
      this.userId = sessionStorage.getItem('userId')
    },
      // 开启计时器
    dataRefreh(){
      if (this.intervalId != null) {
        return;
      }
      // 计时器为空，操作
      this.intervalId = setInterval(() => {
        this.getList()
      }, 1000);
    },
    // 停止定时器
    stopRefreh() {
      clearInterval(this.intervalId); //清除计时器
      this.intervalId = null; //设置为null
    },
    // 获取记录
    getList(){
      if (this.recordType == 6)
        this.getQuery()
      axios.get(this.interface[this.typeId][this.recordType],{
        params: {
          limit: this.limit,
          order: this.order,
          order_field: this.order_field,
          page: this.page,
          userId: this.userId,
          attendUserId: this.attendUserId,
          createUserId: this.createUserId,
          rectificationUserId: this.rectificationUserId,
          startDate: this.startDate,
          endDate: this.endDate,
          keyword: this.keyword,
          trainTeacher: this.trainTeacher,
          checkUserId: this.checkUserId,
          hostUserId: this.hostUserId,
          removeUserId: this.removeUserId
        }}).then(result => {
        if(result.data.code === 0){
          this.totalPage = result.data.page.totalPage
          this.list = this.list.concat(result.data.page.list);
            console.log("数据获取成功")
        }else{
            console.log("数据获取失败")
        }
      })
    },
    //跳往详情页
    toDetail(id){
      sessionStorage.removeItem('header')
      this.$router.push({ name: 'security_detail', query: { id: id, titleId: '12', front: JSON.stringify({typeId: this.typeId,titleBarId: this.titleBarId, recordType: this.recordType, dangerPeoType: this.dangerPeoType})} })
    },
    //分页加载
    onInfinite () {
      this.isLoading = true;
      this.timer = setTimeout(() => {
        if (this.page <= this.totalPage) {
          this.page = this.page + 1;
          this.getList();
        } else {
          this.isHasMore = false;
        }
        this.isLoading = false;
      }, 100);
    },
    //注销定时器
    destroyed() {
      clearTimeout(this.timer);
    },
    //获取查询页路由过来的数据
    getQuery(){
            this.startDate = this.$route.query.query.startDate;
            this.endDate = this.$route.query.query.endDate;
            this.keyword = this.$route.query.query.keyword;
            if (this.typeId==2)
            this.trainTeacher = this.$route.query.query.trainTeacher;
            if (this.$route.query.query.power == 1){
              this.createUserId = this.userId;
            }else if (this.$route.query.query.power == 2){
              this.attendUserId = this.userId;
            }else if (this.$route.query.query.power == 3){
              this.rectificationUserId = this.userId;
              this.checkUserId = this.userId
              this.hostUserId = this.userId
              this.executeUserId = this.userId
            }
            if (this.$route.query.query.people1){
              if (this.typeId==1)
              this.checkUserId = this.$route.query.query.people1
              if (this.typeId==6)
              this.createUserId = this.$route.query.query.people1
              if (this.typeId==5)
              this.hostUserId = this.$route.query.query.people1
              if (this.typeId==4)
              this.checkUserId = this.$route.query.query.people1
            }
            if (this.typeId == 6){
              this.removeUserId = this.$route.query.query.people2
            }
      }
  },
  components: {
    'titleBar' : header,
  }
}
</script>

<style lang="scss" scoped>
.record_container {
  .item {
    width: 86%;
    margin: 20px auto;
    background-color: #F2F2F2;
    padding: 16px;
    box-shadow: 3px 3px 3px rgba(228, 228, 228, 0.349019607843137);
    border-radius: 6px;
    .headline {
      line-height: 14px;
      .name {
        color: #333333;
        font-size: 14px;
        font-weight: 700;
      }
      .time {
        color: #AEAEAE;
        font-size: 12px;
        font-weight: 400;
      }
      .common{
        float: right;
      }
      .remind{
        display: block;
        margin-top: 2px;
        font-size: 10px;
      }
    }
  }
  .info{
    margin: 20px 0;
    font-size: 13px;
    line-height: 24px;
    .title{
      font-weight: 700;
    }
    .content{
      font-weight: 400;
    }
    .ml12{
      margin-left: 12px;
    }
    .ml5{
      margin-left: 5px;
    }
    .abstract{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .bottom {
    display: block;
    height: 22px;
    position: relative;
    .line {
      display: block;
      width: 100%;
      height: 1px;
      background-color: #7F7F7F;
      margin-bottom: 10px;
    }
    .right {
      width: 22px;
      height: 22px;
      position: absolute;
      top: 12px;
      right: 0;
    }
    .detail {
      font-size: 14px;
      color: #0099FF;
      position: absolute;
      top: 16px;
      left: 4px;
    }
  }
}
</style>