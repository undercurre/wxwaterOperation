<template>
  <div>
    <back-box :id="this.$route.query.titleBarId" :front="this.typeId"></back-box>
    <div class="content">
      <title-bar class="titleBar" :title="'筛选条件'"></title-bar>
      <p>
        <span class="title">任务权限&nbsp;:&nbsp;</span>
        <el-select v-model="powerValue" placeholder="请选择" class="power" size="small">
          <el-option
              v-for="item in powerOptions[typeId]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </p>
      <p>
        <span class="title">{{ time[typeId] }}时间&nbsp;:&nbsp;</span>
        <nut-calendar
            :is-visible.sync="isVisible"
            :default-value="date1"
            type="range"
            :start-date="null"
            :end-date="null"
            :animation="`nutSlideUp`"
            @close="switchPickerClose('isVisible')"
            @choose="setChooseValue"
        >
        </nut-calendar>
        <a @click="changeVisible" class="time_displayer">
          <span class="border">{{ date1[0] }}</span>
          <span class="transition">至</span>
          <span class="border"> {{ date1[1] }}</span>
        </a>
      </p>
      <p v-if="!(typeId==3||typeId==6||typeId==2)">
        <span class="title">{{ people[typeId] }}&nbsp;:&nbsp;</span>
          <a class="power people_select"  :class="(typeId==5||typeId==4) ? 'leader':''"  @click="toChoose(1,true)">
            <span>{{ peopleValue1 }}</span>
          </a>
      </p>
      <p v-if="typeId==2">
        <span class="title">培训老师&nbsp;:&nbsp;</span>
        <el-input type="input"
                  class="power"
                  size="small"
                  v-model="trainTeacher"
        >
        </el-input>
      </p>
      <p v-if="typeId==6">
        <span class="title">{{ people[typeId][0] }}&nbsp;:&nbsp;</span>
        <a class="danger people_select" @click="toChoose(1,true)">
          <span>{{ peopleValue1 }}</span>
        </a>
        <span class="title">{{ people[typeId][1] }}&nbsp;:&nbsp;</span>
        <a class="danger people_select" @click="toChoose(2,true)">
          <span>{{ peopleValue2 }}</span>
        </a>
      </p>
      <p>
        <span class="title">任务关键词检索&nbsp;:&nbsp;</span>
        <el-input type="input"
            class="search"
            size="small"
            v-model="keyword"
            placeholder="请输入关键词"
            >
        </el-input>
      </p>
      <button class="button" @click="toRecord">{{ buttonText[typeId] }}</button>
    </div>
  </div>
</template>

<script>
import header from "@/views/Security/subcomponents/header";
import titleBar from "@/views/Security/subcomponents/titleBar";
let moment = require('moment');
export default {
  data(){
    return{
      wxtoken: "",
      //判别
      typeId: this.$route.query.typeId,//模块
      titleTarId: 0,//导航栏
      recordType: 0,//记录入口类型
      //数据仓库
      buttonText:{
        1 : "查询检查任务单",
        2 : "查询任务",
        3 : "查询任务",
        4 : "查询任务",
        5 : "查询任务",
        6 : "查询任务",
      },
      people:{
        1 : "检查人员",
        2 : "培训老师",
        3 : "",
        4 : "巡检人",
        5 : "主持人",
        6 : ["监护人","解除人"]
      },
      time:{
        1 : "整改",
        2 : "任务",
        3 : "任务",
        4 : "任务",
        5 : "任务",
        6 : "任务",
      },
      //日期选择器相关
      isVisible: false,
      date: null,
      dateWeek: null,
      date1: ['', ''],
      //下拉框相关
      powerOptions: [
          [],
          [{
            value: '1',
            label: '我创建的'
          }, {
            value: '2',
            label: '我参与的'
          }, {
            value: '3',
            label: '我整改的'
          }],
          [{
            value: '1',
            label: '我创建的'
          }, {
            value: '2',
            label: '我参与的'
          }],
          [{
            value: '1',
            label: '我创建的'
          }, {
            value: '2',
            label: '我参与的'
          }],
          [{
            value: '1',
            label: '我创建的'
          }, {
            value: '2',
            label: '我参与的'
          }, {
            value: '3',
            label: '我巡检的'
          }],
          [{
            value: '1',
            label: '我创建的'
          }, {
            value: '2',
            label: '我参与的'
          }, {
            value: '3',
            label: '我主持的'
          }],
          [{
            value: '1',
            label: '我创建的'
          }, {
            value: '2',
            label: '我参与的'
          }, {
            value: '3',
            label: '我执行的'
          }]

      ],
      //输入框绑定变量
      powerValue: '',//权限
      peopleValue1: '请选择',
      people1Id: null,
      peopleValue2: '请选择',
      people2Id: null,
      keyword: '',
      trainTeacher: ''
    }
  },
  mounted() {

  },
  created() {
    //预设日期
    this.setCalendar()
    //缓存输入
    this.getSessionStorage()
    //选人数据处理
    this.getcheckListStr()
  },
  methods:{
    //表单校验，权限必填
    formCheck(){
      let lock = true
      if (this.powerValue == ''){
        lock = false
        let that = this
        this.$dialog({
          title: "权限选择不能为空",
          noCancelBtn: true,
          onOkBtn(event) {  //确定按钮点击事件
            this.close(); //关闭对话框
          },
        });
      }
      return lock
    },
    //日期拾取器的相关方法
    switchPickerClose(param){
      console.log('close:' + param)
    },
    switchPicker(param) {
      this[`${param}`] = !this[`${param}`];
    },
    setChooseValue(param) {
      this.date1 = [...[param[0][3],param[1][3]]];
    },
    changeVisible(){
      this.isVisible = true;
    },
    setCalendar(){
      //获取当前时间
      let date=new Date();
      //获取当前月的第一天
            let monthStart = date.setDate(1);
      //获取当前月
            let currentMonth=date.getMonth();
      //获取到下一个月，++currentMonth表示本月+1，一元运算
            let nextMonth=++currentMonth;
      //获取到下个月的第一天
            let nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
      //一天时间的毫秒数
            let oneDay=1000*60*60*24;

      //获取当前月第一天和最后一天
            let firstDay = moment(monthStart).format("YYYY-MM-DD");
      //nextMonthFirstDay-oneDay表示下个月的第一天减一天时间的毫秒数就是本月的最后一天
            let lastDay = moment(nextMonthFirstDay-oneDay).format("YYYY-MM-DD");
      //装载
            this.date1[0] = firstDay;
            this.date1[1] = lastDay;
    },
    //跳往选人页面
    toChoose(boxId,singleSwitch){
      //跳转前缓存输入
      let queryList = {
        startDate: this.date1[0],
        endDate: this.date1[1],
        power: this.powerValue,
        peopleValue1: this.peopleValue1,
        peopleValue2: this.peopleValue2,
        people1Id: this.people1Id,
        people2Id: this.people2Id,
        keyword: this.keyword,
        trainTeacher: this.trainTeacher
      }
      sessionStorage.setItem("query", JSON.stringify(queryList))
      this.$router.push({ name: 'choosePerson', query: { titleId: 26, singleSwitch:singleSwitch, front: {name: 'security_query', typeId: this.typeId,titleBarId: this.$route.query.titleBarId, chooseId: boxId, checkData:null}}})
    },
    //缓存输入
    getSessionStorage(){
      this.typeId = sessionStorage.getItem('typeId')
      if (!this.typeId){
        this.typeId = this.$route.query.typeId
      }
      let queryList = JSON.parse(sessionStorage.getItem('query'));
      if (queryList) {
        this.powerValue = queryList.power;
        this.date1[0] = queryList.startDate;
        this.date1[1] = queryList.endDate;
        if (queryList.peopleValue1) {
          this.peopleValue1 = queryList.peopleValue1;
        } else {
          this.peopleValue1 = "请选择";
        }
        if (queryList.peopleValue2) {
          this.peopleValue2 = queryList.peopleValue2;
        } else {
          this.peopleValue2 = "请选择";
        }
        this.people1Id = queryList.people1Id;
        this.people2Id = queryList.people2Id;
        this.keyword = queryList.keyword;
        this.trainTeacher = queryList.trainTeacher
      }
    },
    //选人数据处理
    getcheckListStr(){
      if (this.$route.query.checkUserList) {
        if (this.$route.query.chooseId == 1) {
          this.peopleValue1 = this.$route.query.checkUserList[0].username
          this.people1Id = this.$route.query.checkUserList[0].id
        } else {
          this.peopleValue2 = this.$route.query.checkUserList[0].username
          this.people2Id = this.$route.query.checkUserList[0].id
        }
      }
    },
    //跳往记录页，携带输入数据
    toRecord(){
      let lock = this.formCheck()
      if (lock) {
        sessionStorage.removeItem("query")
        this.$router.push({
          name: 'security_record', query: {
            titleBarId: 7, typeId: this.typeId, remindSwitch: 1, recordType: 6, query: {
              startDate: this.date1[0],
              endDate: this.date1[1],
              power: this.powerValue,
              people1: this.people1Id,
              people2: this.people2Id,
              keyword: this.keyword,
              trainTeacher: this.trainTeacher
            }
          }
        })
      }
    }
  },
  components:{
    "back-box" : header,
    "titleBar" : titleBar,
  }
}
</script>

<style lang="scss" scoped>
.content{
  padding: 20px;
  .title-bar{
    margin-bottom: 20px;
  }
  p{
    margin-bottom: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .title{
    font-size: 16px;
    font-weight: 700;
    margin-left: 10px;
    white-space: nowrap;
  }
  .power{
    width: 70%;
  }
  .people_select{
    display: inline-block;
    box-sizing: border-box;
    font-size: 14px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    padding: 8px 8px 8px 14px;
    color: #606266;
  }
  .danger{
    width: 27%;
  }
  .transition{
    font-weight: 700;
    color: #BEB8B8;
    margin: 0 4px;
    font-size: 14px;
    flex-shrink: 1;
    flex-grow: 1;
    flex-basis: 18px;
  }
  .border{
    border-radius: 4px;
    padding: 6px;
    font-size: 14px;
    border: 1px solid #DCDFE6;
    flex-shrink: 1;
    flex-grow: 1;
    flex-basis: 88px;
    white-space: nowrap;
  }
  .search{
    width: 56%;
  }
  .button{
    font-weight: 700;
    font-size: 18px;
    display: block;
    border: none;
    width: 86%;
    height: 49px;
    margin: 0 auto;
    color: #FFFFFF;
    background-color: #00CC33;
    border-radius: 4px;
  }
  .leader{
    margin-left: 18px;
  }
  .time_displayer{
    display: flex;
    align-items: center;
  }
}
</style>