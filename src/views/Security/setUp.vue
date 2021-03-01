<template>
  <div class="setUp_container">
<!--    导航栏-->
    <back-box :id="this.titleBarId" :front="this.typeId"></back-box>
    <ul class="content">
<!--     任务标题：任务名称/培训内容/会议主题等等-->
      <li><p>
<!--        本地有个name的二维类数组，通过模块辨别码拿出其中不同模块的任务标题Label，如果是电子报表父级的formtype为1，即当是每周安全你我他的时候，标题应该是第一个的会议主题，其他的报表是第二个的巡检任务-->
        <span class="title" v-if="!(parentType==1)">{{ name[typeId][0] }}&nbsp;:&nbsp;</span>
        <span class="title" v-if="parentType==1">{{ name[typeId][1] }}&nbsp;:&nbsp;</span>
<!--在电子报表模块和危险作业模块隐藏该输入框，其他模块则需要该输入框-->
        <el-input v-if="!(typeId==4||typeId==6)" v-model="inputTheme" class="theme" type="input" maxlength="50"></el-input>
<!--        在电子报表模块则需要该下拉框-->
        <el-select v-model="inputTheme" placeholder="请选择" v-if="typeId==4">
          <el-option
              v-for="item in nameOptions1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
<!--        在危险作业模块则需要该下拉框-->
        <el-select v-model="inputTheme" placeholder="请选择" v-if="typeId==6">
          <el-option
              v-for="item in nameOptions2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </p></li>
<!--      安全检查任务内容-->
      <li v-if="typeId==1"><p>
        <span class="title">{{ content[typeId] }}&nbsp;:&nbsp;</span>
        <span class="default_content">公司大楼、供水厂四至周围、厂区、宿舍、安全保卫、危化品、岗位安全、生产车间、电气设备、重大危险源、重点安全岗位、机械设备、车辆、施工工地、仓库、消防、环境卫生、用电、饭堂、丹灶加压泵站、管网</span>
      </p></li>
<!--      <li v-if="typeId==6"><p>-->
<!--        <span class="title">{{ content[typeId] }}&nbsp;:&nbsp;</span>-->
<!--        <el-input v-model="inputTaskContent" resize="none" :rows="4" class="taskContent" type="textarea" maxlength="500"></el-input>-->
<!--      </p></li>-->
<!--      安全检查才有的那个 其他-->
      <li><p v-if="typeId==1">
        <span class="title">其他&nbsp;:&nbsp;</span>
        <el-input v-model="otherTaskContent" class="theme other" type="input" maxlength="50"></el-input>
      </p></li>
<!--      时间输入块-->
      <div v-if="!(typeId==1||typeId==6)">
        <li><p>
          <span class="title" v-if="!(parentType==1)">{{ time[typeId][0] }}&nbsp;:&nbsp;</span>
          <span class="title" v-if="parentType==1">{{ time[typeId][1] }}&nbsp;:&nbsp;</span>
<!--        本地有个time的二维类数组，通过模块辨别码拿出其中不同模块的任务标题Label，如果是电子报表父级的formtype为1，即当是每周安全你我他的时候，标题应该是第一个的会议时间，其他的报表是第二个的巡检日期-->
<!--          <nut-datepicker v-if="typeId==6"-->
<!--                          :is-visible="isVisible1"-->
<!--                          title="请选择日期时间"-->
<!--                          type="datetime"-->
<!--                          startDate="2015-01-01 00:00"-->
<!--                          endDate="2030-12-30 11:59"-->
<!--                          :defaultValue='datetime1'-->
<!--                          @close="switchPicker('isVisible1')"-->
<!--                          @choose="setChooseValue1"-->
<!--          >-->
<!--          </nut-datepicker>-->
<!--          <nut-datepicker v-if="typeId==6"-->
<!--                          :is-visible="isVisible2"-->
<!--                          title="请选择日期时间"-->
<!--                          type="datetime"-->
<!--                          startDate="2015-01-01 00:00"-->
<!--                          endDate="2030-12-30 11:59"-->
<!--                          :defaultValue='datetime2'-->
<!--                          @close="switchPicker('isVisible2')"-->
<!--                          @choose="setChooseValue2"-->
<!--          >-->
<!--          </nut-datepicker>-->
<!--          <span class="danger_timer" v-if="typeId==6">-->
<!--              <a @click="changeVisible1">-->
<!--                <span class="border">{{ datetime1 }}</span>-->
<!--              </a>-->
<!--              <img class="between" src="./images/u4636.svg">-->
<!--              <a @click="changeVisible2">-->
<!--                <span class="border"> {{ datetime2 }}</span>-->
<!--              </a>-->
<!--          </span>-->
<!--          <nut-calendar v-if="typeId==2"-->
<!--                        :is-visible.sync="isVisible"-->
<!--                        :default-value="date1"-->
<!--                        type="range"-->
<!--                        @close="switchPickerClose('isVisible')"-->
<!--                        @choose="setChooseValue"-->
<!--          >-->
<!--          </nut-calendar>-->
<!--          <a @click="changeVisible"  v-if="typeId==2" class="time_displayer">-->
<!--            <span class="border">{{ date1[0] }}</span>-->
<!--            <span class="transition">至</span>-->
<!--            <span class="border"> {{ date1[1] }}</span>-->
<!--          </a>-->
<!--          日期拾取器-->
          <el-date-picker v-if="!(typeId==1||typeId==6)"
                          class="calendar"
                          v-model="inputTaskCalendar"
                          type="date"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </p></li>
<!--        <li v-if="!(typeId==2||typeId==4||typeId==6)"><p>-->
<!--          <el-time-picker-->
<!--              class="time"-->
<!--              is-range-->
<!--              value-format="HH:mm:00"-->
<!--              v-model="inputTaskTime"-->
<!--              range-separator="至"-->
<!--              start-placeholder="开始时间"-->
<!--              end-placeholder="结束时间"-->
<!--              placeholder="选择时间范围">-->
<!--          </el-time-picker>-->
<!--        </p></li>-->
      </div>
<!--      额外信息：在安全培训模块的培训费用以及费用/安全电子报表模块中的班组名称-->
      <li v-if="typeId==2||typeId==4"><p>
<!--        第一个额外信息的Label，这个Label的危险作业模块样式三元判断是因为当初危险作业的部门和班组这两个信息需要录入，才需要的，现在因为水厂需求的更改，危险作业模块不再需要这一块了-->
        <span class="title" :class="(typeId==6)? 'ext_ml':''">{{ extra[typeId][0] }}&nbsp;:&nbsp;</span>
<!--        这个是第一个额外信息的输入框，只有在培训模块出现-->
        <el-input v-model="inputExtra1" class="theme extra extra_margin" type="input" v-if="typeId!=4"></el-input>
<!--        这个是电子报表的班组名称下拉选择框-->
        <el-select v-model="inputExtra1" placeholder="请选择" v-if="typeId==4">
          <el-option
              v-for="item in teamOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
<!--        这个是第二个额外信息的Label，只会在安全培训模块出现，因为安全电子报表模块只有一个班组名称额外信息-->
        <span class="title" v-if="!(typeId==4)">{{ extra[typeId][1] }}&nbsp;:&nbsp;</span>
<!--        这是第二个额外信息的输入框-->
        <el-input v-if="!(typeId==4)" v-model="inputExtra2" class="theme extra" type="input"></el-input>
      </p></li>
<!--      地点：安全检查模块以及安全电子报表的安全生产五分钟还有危险作业被修改需求后也都没有这个地点的录入需求，所以需要判断这三个状态的时候隐藏这一块，然后调出本地数据仓库的place通过模块辨别码拿到对应的Label字符串-->
      <li v-if="!(typeId==1 || parentType==1 || typeId==6)"><p><span class="title">{{ place[typeId] }}地点&nbsp;:&nbsp;</span>
<!--        地点输入框-->
        <el-input v-model="inputPlace" class="theme" type="input" maxlength="50"></el-input>
      </p></li>
<!--      关键人物：即是巡检人，培训老师，主持人，首先也是用模块辨别码剔除不需要这一块的模块-->
      <li v-if="!(typeId==1||typeId==3||parentType==0||typeId==6)"><p>
<!--        然后从本地数据仓库中调出vip类数组用模块辨别码typeId拿到相应的Label-->
          <span class="title">{{ vip[typeId][0] }}&nbsp;:&nbsp;</span>
<!--        在安全会议模块中这个输入框只是用于显示不能手动输入所以readonly-->
          <el-input v-if="!(typeId==6||typeId==4)" v-model="inputVip" class="extra vip" :class="(typeId==5||typeId==4) ? 'leader':''" :readonly="(typeId == 5||typeId == 4) ? 'readonly' : false"></el-input>
          <span v-if="typeId==6" class="info">{{ user.username }}</span>
          <span v-if="typeId==4" class="info">{{ user.username }}</span>
        <button class="choose vipChoose" v-if="typeId==5" @click="toChoose(1,true, checkedVip)">选择{{ vip[typeId][1] }}</button>
        </p></li>
      <!--      成员-->
      <li v-if="typeId!=6"><p>
        <span class="title">{{ member[typeId][0] }}成员&nbsp;:&nbsp;</span>
        <el-input v-model="choseMember" readonly resize="none" :rows="2" class="member" type="textarea"></el-input>
        <button class="choose" @click="toChoose(2,false, checkedMember)">选择{{ member[typeId][1] }}</button>
      </p></li>
<!--      <li v-if="typeId==6&&false"><p>-->
<!--        <span class="title">{{ member[typeId][0] }}成员&nbsp;:&nbsp;</span>-->
<!--            <el-table-->
<!--                :data="dangerMemberList"-->
<!--                style="width: 100%">-->
<!--              <el-table-column-->
<!--                  type="index"-->
<!--                  width="30">-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                  align="center"-->
<!--                  label="姓名"-->
<!--                  >-->
<!--                <template slot-scope="scope">-->
<!--                  <el-input type="input" v-model="scope.row.name"></el-input>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                  align="center"-->
<!--                  label="操作"-->
<!--                  width="100">-->
<!--                <template slot-scope="scope">-->
<!--                  <el-button-->
<!--                      size="mini"-->
<!--                      type="danger"-->
<!--                      @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--            </el-table>-->
<!--        <img @click="expandTable" class="expand_icon"  src="./images/u4821.svg">-->
<!--      </p></li>-->
      <!--      任务单-->
<!--      <li v-if="typeId==4&&parentType==1"><p>-->
<!--        <span class="title">任务单&nbsp;:&nbsp;</span>-->
<!--        <el-select v-model="taskForm" placeholder="请选择">-->
<!--          <el-option-->
<!--              v-for="item in nameOptions4"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value">-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--      </p></li>-->
<!--      <li v-show="childType==22"><p>-->
<!--        <span class="title">班时&nbsp;:&nbsp;</span>-->
<!--        <el-select v-model="clearExtra" placeholder="请选择" class="vip3 box01">-->
<!--          <el-option-->
<!--              v-for="item in clearExtraOptions"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value">-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--      </p></li>-->
<!--      <li v-show="childType==25"><p>-->
<!--        <span class="title">周别&nbsp;:&nbsp;</span>-->
<!--        <el-select v-model="weekExtra" placeholder="请选择" class="vip3 box01">-->
<!--          <el-option-->
<!--              v-for="item in weekExtraOptions"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value">-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--      </p></li>-->
<!--      表格：安全电子报表-->
      <li v-if="typeId==4"><p>
          <el-table
              :span-method="objectSpanMethod"
              :header-cell-class-name="headerStyle"
              :data="tableData"
              border
              style="width: 100%"
          >
            <el-table-column v-if="tableHeader1"
                align="center"
                prop="item1"
                :label=this.tableHeader1
                width="70"
            >
            </el-table-column>
            <el-table-column v-if="tableHeader2"
                  align="center"
                  prop="item2"
                  :label=this.tableHeader2

            >
            </el-table-column>
            <el-table-column v-if="tableHeader3"
                align="center"
                header-align="center"
                prop="item3"
                :label=this.tableHeader3
                width="100"
            >
            </el-table-column>
          </el-table>
      </p></li>
      <!--        签发人-->
<!--      <li v-if="typeId==6&&false"><p>-->
<!--        <span class="title">签发人&nbsp;:&nbsp;</span>-->
<!--        <el-input value="taskSign" v-model="signer"  class="sign_box ml" readonly></el-input>-->
<!--        <button class="choose" @click="toChoose(3,true, checkedSigner)">选择</button>-->
<!--      </p></li>-->
<!--      &lt;!&ndash;        执行人&ndash;&gt;-->
<!--      <li v-if="typeId==6&&false"><p>-->
<!--        <span class="title">执行人&nbsp;:&nbsp;</span>-->
<!--        <el-input value="taskPerformer" v-model="performer"  class="sign_box ml"></el-input>-->
<!--      </p></li>-->
      <!--        基本防护措施-->
<!--      <li v-if="typeId==6&&false"><p>-->
<!--        <el-table-->
<!--            :data="tableData"-->
<!--            border-->
<!--            style="width: 100%"-->
<!--        >-->
<!--          <el-table-column-->
<!--              align="center"-->
<!--              prop="index"-->
<!--              label="序号"-->
<!--              width="70">-->

<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--              align="center"-->
<!--              prop="content"-->
<!--              label="安全防护措施（含步骤）">-->

<!--          </el-table-column>-->
<!--        </el-table>-->
<!--      </p></li>-->
<!--      <li>-->
<!--        <p><span class="title">附件&nbsp;:&nbsp;</span>-->
<!--          <nut-imagepicker-->
<!--              @imgMsg="imgMsg"-->
<!--              v-loading.fullscreen.lock="fullscreenLoading"-->
<!--              animation="true"-->
<!--              :width="90"-->
<!--              :height="90"-->
<!--              :margin="20"-->
<!--              :imgList.sync="imgList"-->
<!--              :max="2"-->
<!--              :ismultiple="true"-->
<!--              delMode="longtap"-->
<!--              :longTapTime="longTapTime"-->
<!--              class="imagePicker"-->

<!--          >-->
<!--          </nut-imagepicker>-->
<!--        </p>-->
<!--      </li>-->
<!--      签名-->
      <div class="signature_box" v-if="typeId!=6">
        <el-button @click="drawer = true"  class="drawerBtn">
          <p><span>点击进入签名</span></p>
<!--          签名后的预览区-->
          <div class="confirmSign">
          </div>
        </el-button>
        <el-drawer
            class="signaturenter"
            :visible.sync="drawer"
            size="100%">
          <nut-signature
              line-width="5"
              @confirm="confirm"
              @clear="clear"
              align="center"
          ></nut-signature>
        </el-drawer>
      </div>

<!--      创建按钮-->
      <button class="button" @click="confirmSetUp">创建</button>
<!--      标注-->
      <div class="bottomText">注&nbsp;:&nbsp;创建后检查任务推送给对应的{{ member[typeId][0] }}成员签名确认</div>
    </ul>
  </div>
</template>

<script>
import header from "@/views/Security/subcomponents/header";
import axios from "axios"
import {blobToFile, dataUrlToBlob} from "@/utils/common";
let moment = require('moment');

export default {
  data(){
    return{
      wxtoken: "",
      //用户本身
      user:{
        username: '',
        id: '',
      },
      signer:"",//签发人名字字符串容器
      checkedSigner: [],//签发人对象容器
      //主判别
      typeId: this.$route.query.typeId,//在路由传过来的模块辨别码
      titleBarId: this.$route.query.titleBarId,//在路由传过来的导航栏标题码
      parentType: null,//电子报表的父级（第一个）下拉框 0为普通单：安全班前五分钟 1为二级单：卫生/安全
      childType: null,//电子报表的子级（第二个下拉框）
      childStr: '',//电子报表的子级字符串
      formType: 0,//电子表单类型
      // datetime1: "2020-09-22 11:30",
      // datetime2: "2020-09-23 11:30",
      // isVisible: false,
      // isVisible1: false,
      // isVisible2: false,
      tableData: [],//报表数据
      nameOptions1: [],//电子报表下拉框
      nameOptions2: [],//危险作业下拉框
      // nameOptions4: [],//任务单
      tableHeader1: '序号',//列表头第一列字符
      tableHeader2: '具体内容',//列表头第二列字符
      tableHeader3: '数量',//列表头第三列字符
      tableSpanArr: [],//合并单元格方法生成的参数数组
      //输入采集的数据
      inputTheme: '',//任务名称
      inputTaskContent: '公司大楼、供水厂四至周围、厂区、宿舍、安全保卫、危化品、岗位安全、生产车间、电气设备、重大危险源、重点安全岗位、机械设备、车辆、施工工地、仓库、消防、环境卫生、用电、饭堂、丹灶加压泵站、管网',//任务内容
      inputTaskCalendar: '',//日期
      // inputTaskTime: ['',''],//时分秒
      inputExtra1: '',//额外信息1
      inputExtra2: '',//额外信息2
      inputPlace: '',//地点
      choseMember: '',//参会成员
      checkedMember: [],//已选成员
      inputVip: '',//任务关键人
      checkedVip: [],//已选vip对象
      // taskForm: '',//任务单
      // date: null,
      // dateWeek: null,
      // date1: ['2020-09-21', '2020-10-21'],
      // stepList: [],//危险作业的表单
      taskType: '',//电子报表任务类型
      // dangerMemberList: [],//危险作业参与人员
      // performer: '',//危险作业执行者
      otherTaskContent: '',//安全检查的其他
      drawer: false,//签名侧拉框弹出锁
      dangerCreater: {},//危险作业创建者
      signPath: null,//签名路径
      signFileId: null,//签名文件在文件系统中的ID
      fullscreenLoading: false,//全屏锁
      imgList: [],//图片上传缓存
      longTapTime: 1000,//图片上传
      imgReceipt: [],//图片上传存储数组
      //数据仓库
      teamOptions: [//班组名称下拉框本地数据
        {
          value: '运行一班',
          label: '运行一班'
        },
        {
          value: '运行二班',
          label: '运行二班'
        },
        {
          value: '运行三班',
          label: '运行三班'
        },
        {
          value: '运行四班',
          label: '运行四班'
        },
        {
          value: '机电维修班',
          label: '机电维修班'
        },
        {
          value: '化验班',
          label: '化验班'
        },
        {
          value: '管网班',
          label: '管网班'
        },
        {
          value: '丹灶泵站运行班',
          label: '丹灶泵站运行班'
        },
      ],
      content: {//内容
        1: "检查任务",
        6: "工作内容"
      },
      name: {//主题
        1: ["任务名称",""],
        2: ["培训内容",""],
        3: ["演练内容",""],
        4: ["会议主题","巡检任务"],
        5: ["会议主题",""],
        6: ["任务名称",""]
      },
      time: {//时间
        1: ["",""],
        2: ["培训时间",""],
        3: ["演练时间",""],
        4: ["会议时间","巡检日期"],
        5: ["会议时间",""],
        6: ["计划工作时间",""],
      },
      place: {//地点
        1: "",
        2: "培训",
        3: "演练",
        4: "会议",
        5: "会议",
        6: "工作"
      },
      member: {//参与人
        1: ["检查组","协助人"],
        2: ["培训","成员"],
        3: ["参会","参会人"],
        4: ["参会","参会人"],
        5: ["参会","参会人"],
        6: ["工作","执行人"]
      },
      vip: {//关键人物
        1: ["", ""],
        2: ["培训老师", ""],
        3: ["", ""],
        4: ["巡检人", ""],
        5: ["主持人", "主持人"],
        6: ["工作监护人", "工作监护人"]
      },
      extra: {//额外信息
        2: ["培训费用","课时"],
        4: ["班组名称",""],
        6: ["部门","班组"],
      },
      url: {//保存工单数据接口url
        1: process.env.VUE_APP_URL +"/waterOperation/app/appTbSafetyCheck/save",
        2: process.env.VUE_APP_URL +"/waterOperation/app/tbSafetyTrain/save",
        3: process.env.VUE_APP_URL +"/waterOperation/app/tbSafetySkits/saveOrUpdate",
        4: process.env.VUE_APP_URL +"/waterOperation/app/appTbElectronicReport/save",
        5: process.env.VUE_APP_URL +"/waterOperation/app/tbSafetyMeeting/saveOrUpdate",
        6: process.env.VUE_APP_URL +"/waterOperation/app/appTbDangerousTask/save"
      },
      combo: {//下拉框接口url
        4: process.env.VUE_APP_URL +"/waterOperation/app/appTbElectronicReportForm/combo",
        6: process.env.VUE_APP_URL +"/waterOperation/app/appTbDangerousOperation/combo"
      },
      list: {//表单数据接口
        4: process.env.VUE_APP_URL +"/waterOperation/app/appTbElectronicReportForm/info",
        6: process.env.VUE_APP_URL +"/waterOperation/app/appTbDangerousOperation/combo"
      },
      signUrl:{//签名接口
        1: process.env.VUE_APP_URL +"/waterOperation/app/appTbSafetyCheck/sign",
        2: process.env.VUE_APP_URL +"/waterOperation/app/tbSafetyTrain/sign",
        3: process.env.VUE_APP_URL +"/waterOperation/app/tbSafetySkits/sign",
        4: process.env.VUE_APP_URL +"/waterOperation/app/appTbElectronicReport/sign",
        5: process.env.VUE_APP_URL +"/waterOperation/app/tbSafetyMeeting/sign",
        6: process.env.VUE_APP_URL +"/waterOperation/app/appTbDangerousTask/sign"
      },
      // clearExtra: null,
      // clearExtraOptions: [{
      //   label: '零时班',
      //   value: 1
      // }, {
      //   label: '日班',
      //   value: 2
      // }, {
      //   label: '夜班',
      //   value: 3
      // }],
      // weekExtra: null,
      // weekExtraOptions: [{
      //   label: '第一周',
      //   value: 1
      // }, {
      //   label: '第二周',
      //   value: 2
      // }, {
      //   label: '第三周',
      //   value: 3
      // }, {
      //   label: '第四周',
      //   value: 4
      // }, {
      //   label: '第五周',
      //   value: 5
      // }],
    }
  },
  created() {
    this.init()//页面初始化
    this.getcheckListStr(this.$route.query.chooseId)//如果在选人那里跳过来，用这个方法从路由拿到选人那一块的数据
  },
  methods:{
    //初始化页面
    init(){
      if (this.typeId != 1)
      this.inputTaskContent = ''//如果不是安全检查，任务内容要置空
      //配置一个请求拦截器对请求头加入token
      axios.interceptors.request.use(
          config => {
            config.headers['token'] = sessionStorage.getItem('wxtoken') // 请求头带上
            return config
          },
          error => {
            return Promise.reject(error)
          }
      )
      //在缓存里拿到token和userId
      this.wxtoken = sessionStorage.getItem('wxtoken')
      this.user.id = sessionStorage.getItem('userId')
      //然后请求用户信息
      axios.get(process.env.VUE_APP_URL+'/waterOperation/app/apptbuserinfo/info/'+this.user.id).then(result => {
        this.user.username = result.data.appTbUserInfo.username
      })
      //设置页面的默认日期
      this.setCalendar()
      //从缓存中拿数据
      this.getSessionStorage()
      //拿到相应的表数据
      this.getOption()
    },
    //图片拾取器
    imgMsg(data){
      //nutui组件中的图片拾取器的事件类型，2为拾取
      if(data.code == 2) {
        let imgFormData = new FormData()
        //把图片扔进formdata
        imgFormData.append('file',data.msg[0])
        //打开全屏缓冲组件
        this.openFullScreen()
        //上传图片
        axios.post(process.env.VUE_APP_URL +"/waterOperation/app/apptbfileinfo/upload", imgFormData , {timeout: 1000000}).then(result => {
          if (result.data.code === 0) {
            //上传回传的信息封装进imgReceipt中等待赋值到表单更新接口的filelist中
            let item = {}
            item.comment = result.data.data.path
            item.createTime = result.data.data.createTime
            item.fileInfoId = result.data.data.id
            this.imgReceipt.push(item)
            console.log("附件数据上传成功")
            //关闭全屏缓冲组件
            this.closeFullScreen()
          } else {
            console.log("附件数据上传失败")
          }
        })
      }
    },
    //签名的确认按钮处理
    confirm(canvas, data) {
      //拿到confirmSign中的img元素
      let proImg = document.querySelector('.confirmSign img');
      if (proImg){
        //如果已有签名，则新签名无效，直接关闭侧弹框
        this.drawer = false
      }else {
        //如果没有签名，则在confirmSign中插入新的img来显示签了的名，达到预览效果
        let img = document.createElement('img');
        img.src = data;
        this.signData = data;
        document.querySelector('.confirmSign').appendChild(img);
        this.drawer = false
      }
    },
    //签名重签按钮处理
    clear() {
      //拿到confirmSign元素后移除里面的
      let img = document.querySelector('.confirmSign img');
      if (img) {
        img.remove();
      }
    },
    //提取需要的默认日期
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
      this.datetime1 = firstDay + " 00:00";
      this.datetime2 = lastDay + " 00:00";
    },
    //表单校验
    formCheck(){
      let lock = true
      //校验判断
      if (
          this.inputTheme == ''
      ){
        lock = false
        let that = this
        //判断是否工单的层级 parentType = 1 的时候，工单信息为第二层：安全电子报表
        if (!(that.parentType == 1)) {
          this.$dialog({
            title: that.name[that.typeId][0]+"不能为空",
            noCancelBtn: true,
            onOkBtn(event) {  //确定按钮点击事件
              this.close(); //关闭对话框
            },
          });
        }else{
          this.$dialog({
            title: that.name[that.typeId][1]+"不能为空",
            noCancelBtn: true,
            onOkBtn(event) {  //确定按钮点击事件
              this.close(); //关闭对话框
            },
          });
        }
      }
      return lock
    },
    // switchPickerClose(param){
    //   console.log('close:' + param)
    // },
    // setChooseValue(param) {
    //   this.date1 = [...[param[0][3],param[1][3]]];
    // },
    // changeVisible(){
    //   this.isVisible = true;
    // },
    //插入/更新缓存
    setSessionStorage(){
      let setUpList = {
        titleBarId: this.titleBarId,
        topic: this.inputTheme,
        task: this.inputTaskContent,
        date: this.inputTaskCalendar,
        time: this.inputTaskTime,
        startDate: this.date1[0],
        endDate: this.date1[1],
        extrainfo1: this.inputExtra1,
        extrainfo2: this.inputExtra2,
        location: this.inputPlace,
        vip: this.inputVip,
        choseMember: this.choseMember,
        checkedMember: this.checkedMember,
        signer: this.signer,
        startTime: this.datetime1,
        endTime:  this.datetime2,
        checkedVip: this.checkedVip,
        checkedSigner: this.checkedSigner,
        nameOptions1: this.nameOptions1,
        nameOptions2: this.nameOptions2,
        // nameOptions4: this.nameOptions4,
        childStr: this.childStr,
        formType: this.formType,
        reportFormId: this.childType,
        stepList: this.stepList,
        dangerMemberList: this.dangerMemberList,
        performer: this.performer,
        other: this.otherTaskContent,
      }
      sessionStorage.setItem("setUp", JSON.stringify(setUpList))
    },
    //跳到选择人员页面
    toChoose(chooseId,singleSwitch,checkedData){
      //去除当前的header缓存
      sessionStorage.removeItem('header')
      //将当前页面的信息缓存
      this.setSessionStorage()
      //titleId : 用于header导航栏的显示
      //singleSwitch ：是否单选
      //front ：当前需要传过去的信息 {
      //                            name: 页面的路由名
      //                            typeId: 模块辨别码
      //                            titleBarId: 当前页面的导航栏
      //                            chooseId: 选的是什么，1为安全电子报表巡检人2为工单参与者3为危险作业签发人
      //                            checkedData: 已经选了的人
      this.$router.push({ name: 'choosePerson', query: { titleId: 26,singleSwitch: singleSwitch, front: {name: 'security_setUp', typeId: this.typeId, titleBarId: this.titleBarId, chooseId: chooseId, checkedData:checkedData}}})
    },
    // setChooseValue1(param) {
    //   this.datetime1 = param[5];
    // },
    // setChooseValue2(param) {
    //   this.datetime2 = param[5];
    // },
    // changeVisible1(){
    //   this.isVisible1 = true;
    // },
    // changeVisible2(){
    //   this.isVisible2 = true;
    // },
    // switchPicker(param) {
    //   this[`${param}`] = !this[`${param}`];
    // },
    //从路由中拿到选人的字符串
    getcheckListStr(chooseId){
      var str = '';
      var arr = [];
      //拿到choosePerson传过来的路由信息的checkUserList
      if (this.$route.query.checkUserList) {
        //遍历checkUserList，把选到的人的名字放进数组
        for (var i = 0; i < this.$route.query.checkUserList.length; i++) {
          arr.push(this.$route.query.checkUserList[i].username)
        }
      }
      //拼接字符串
      str = arr.join(',')
      if (chooseId == 1) {
        //选巡检人
        this.inputVip = str
        this.checkedVip = this.$route.query.checkUserList
        //如果该巡检人不是已经选择的参与者
        if (this.checkedMember.find((user) => user.id == this.checkedVip[0].id) == undefined) {
          //将他加入参与者数组
          this.checkedMember.push(this.checkedVip[0])
        }
        //置空temp数组，并重新赋值和拼接字符串，再赋值choseMember
        arr = []
        for (var i = 0; i < this.checkedMember.length; i++) {
          arr.push(this.checkedMember[i].username)
        }
        str = arr.join(',')
        this.choseMember = str
      }else if(chooseId == 2){
        //选参与者
        this.choseMember = str
        this.checkedMember = this.$route.query.checkUserList
        if (this.typeId == 4 || this.typeId == 5) {
          //如果在安全电子报表或安全会议中的关键人物被在选参与者时撤掉，则重置空vip字符和数组
          if (this.$route.query.checkUserList.find((user) => user.id == this.checkedVip[0].id) == undefined) {
            this.inputVip = ''
            this.checkedVip = []
          }
        }
      }else{
        //选签发者
        this.signer = str
        this.checkedSigner = this.$route.query.checkUserList
      }
      //修改后的数据进行缓存
      this.setSessionStorage()
    },
    //提取缓存
    getSessionStorage(){
      this.typeId = sessionStorage.getItem('typeId')
      if (!this.typeId){
        this.typeId = this.$route.query.typeId
      }
      let setUpList = JSON.parse(sessionStorage.getItem('setUp'));
      if (setUpList) {
        this.titleBarId = setUpList.titleBarId;
        this.inputTheme = setUpList.topic;
        this.inputTaskContent = setUpList.task;
        this.inputTaskCalendar = setUpList.date;
        this.inputTaskTime = setUpList.time;
        this.date1[0] = setUpList.startDate;
        this.date1[1] = setUpList.endDate;
        this.inputExtra1 = setUpList.extrainfo1;
        this.inputExtra2 = setUpList.extrainfo2;
        this.inputPlace = setUpList.location;
        this.inputVip = setUpList.vip;
        this.signer = setUpList.signer;
        this.datetime1 = setUpList.startTime;
        this.datetime2 = setUpList.endTime;
        this.checkedVip = setUpList.checkedVip
        this.checkedSigner = setUpList.checkedSigner
        this.nameOptions1 = setUpList.nameOptions1
        this.nameOptions2 = setUpList.nameOptions2
        this.nameOptions4 = setUpList.nameOptions4
        this.checkedMember = setUpList.checkedMember
        this.stepList = setUpList.stepList
        this.childType = setUpList.reportFormId
        this.childStr = setUpList.childStr
        this.performer = setUpList.performer
        this.dangerMemberList = setUpList.dangerMemberList
        if (setUpList.choseMember) {
          this.choseMember = setUpList.choseMember;
        } else {
          this.choseMember = "";
        }
        if (setUpList.signer) {
          this.signer = setUpList.signer;
        } else {
          this.signer = "";
        }
        this.otherTaskContent = setUpList.other
      }
    },
    //新增危险作业人员列表行
    expandTable(){
      let obj = {
        name: null
      }
      this.dangerMemberList.push(obj)
    },
    //危险作业人员删除按钮处理
    handleDelete(index, row) {
      this.dangerMemberList.splice(index,1)
    },
    //确认创建
    confirmSetUp(){
      //表单校验
      let lock = this.formCheck()
      if (lock) {
        //模块辨识：危险作业和安全电子报表这两个模块创建的时候需要上传数据表信息以及处理特有的数据表对象，需要独立进行上传
        //普通创建
        if ((this.typeId != 6) && (this.typeId != 4)) {
          //签名
          this.uploadSign().then(() => {
            //拿到选人数据后进行userlist的上传准备
            let members = this.checkedMember
            members.forEach((item) => {
              item.attendUserId = item.id
              item.comment = item.username
              item.id = null
            })
            //如果是安全会议，需要定义主持人，但是其他模块该find会underfined
            try {
              members.find((member) => member.attendUserId == this.checkedVip[0].id).isHost = 1
            }catch (e) {

            }
            //构造创建者
            let createUser = {
              comment: this.user.username,
              id: null,
              attendUserId: this.user.id,
              isRectification: 2,
              fileInfoId: this.signFileId,
              path: this.signPath,
              isConfirm: 1
            }
            //加入成员列表
            members.push(createUser)
            //发送post
            axios.post(this.url[this.typeId], {
              name: this.inputTheme,
              task: this.inputTaskContent,
              userList: members,
              trainTeacher: this.inputVip,
              startDate: this.date1[0],
              endDate: this.date1[1],
              cost: this.inputExtra1,
              classHour: this.inputExtra2,
              location: this.inputPlace,
              date: this.inputTaskCalendar,
              startTime: this.inputTaskTime[0],
              endTime: this.inputTaskTime[1],
              content: this.inputTheme,
              topic: this.inputTheme,
              team: this.inputVip,
              workplace: this.inputPlace,
              dangerousOperationId: this.inputTheme,
              jobContent: this.inputTaskContent,
              planStartTime: this.datetime1 + ':00',
              planEndTime: this.datetime2 + ':00',
              departmentId: this.inputExtra1,
              reportFormId: this.childType,
              createUserId: this.user.id,
              other: this.otherTaskContent,
              presenterUser: this.taskVip,
              status: 0
            }).then(result => {
              if (result.data.code === 0) {
                console.log("数据上传成功")
                //清掉缓存
                sessionStorage.removeItem("setUp")
                sessionStorage.removeItem('header')
                //然后路由到记录页：提醒记录
                this.$router.push({
                  name: 'security_record',
                  query: { titleBarId: 25, typeId: this.typeId, remindSwitch: 0, recordType: 5 }
                })
              } else {
                console.log("数据上传失败")
              }
            })
          })
          //危险作业特殊处理
        } else if (this.typeId == 6) {
          //处理userList
          let members = []
          this.dangerMemberList.forEach((item) => {
            item.attendUserId = null
            item.comment = item.name
            item.id = null
            item.type = 0
            members.push(item)
          })
          let performerObj = {
            comment: this.performer,
            id: null,
            attendUserId: null,
            type: 1
          }
          members.push(performerObj)
          // this.checkedSigner[0].attendUserId = this.checkedSigner[0].id
          // this.checkedSigner[0].id = null
          // this.checkedSigner[0].comment = this.checkedSigner[0].username
          // this.checkedSigner[0].type = 2
          this.dangerCreater.comment = this.user.username
          this.dangerCreater.id = null
          this.dangerCreater.attendUserId = this.user.id
          this.dangerCreater.type = 4
          this.dangerCreater.isConfirm = 1
          members.push(this.dangerCreater)
          // members.push(this.checkedSigner[0])
          //下拉框字符串获取
          let OptionName = this.nameOptions2.find((option) => option.value == this.inputTheme).label
          axios.post(this.url[this.typeId], {
            name: OptionName,
            content: this.stepList,
            task: this.inputTaskContent,
            userList: members,
            trainTeacher: this.inputVip,
            startDate: this.date1[0],
            endDate: this.date1[1],
            cost: this.inputExtra1,
            classHour: this.inputExtra2,
            location: this.inputPlace,
            date: this.inputTaskCalendar,
            startTime: this.inputTaskTime[0],
            endTime: this.inputTaskTime[1],
            topic: this.inputTheme,
            team: this.inputExtra2,
            workplace: this.inputPlace,
            dangerousOperationId: this.inputTheme,
            jobContent: this.inputTaskContent,
            planStartTime: this.datetime1 + ':00',
            planEndTime: this.datetime2 + ':00',
            department: this.inputExtra1,
            reportFormId: this.childType,
            createUserId: this.user.id,
            status: 0
          }).then(result => {
            console.log(result)
            if (result.status === 200) {
              console.log("数据上传成功")
              sessionStorage.removeItem("setUp")
              sessionStorage.removeItem('header')
              this.$router.push({
                name: 'security_record',
                query: {titleBarId: 25, typeId: this.typeId, remindSwitch: 0, recordType: 5}
              })
            } else {
              console.log("数据上传失败")
            }
          })
          //安全电子报表处理
        } else {
          //签名
          this.uploadSign().then( () => {
            //userlist
            let members = []
            this.checkedMember.forEach((item) => {
              members.push(item)
            })
            members.forEach((item) => {
              item.attendUserId = item.id
              item.comment = item.username
              item.id = null
            })
            try {
              members.find(member => member.attendUserId == this.checkedVip[0].id).isCheck = 1
            }catch (e) {

            }
            let OptionName = this.nameOptions1.find((option) => option.value == this.inputTheme).label
            this.taskType = this.nameOptions1.find((option) => option.value == this.inputTheme).type
            axios.post(this.url[this.typeId], {
              content: JSON.stringify(this.stepList),
              parentName: OptionName,
              task: this.inputTaskContent,
              userList: members,
              trainTeacher: this.inputVip,
              startDate: this.date1[0],
              endDate: this.date1[1],
              cost: this.inputExtra1,
              classHour: this.inputExtra2,
              location: this.inputPlace,
              date: this.inputTaskCalendar,
              startTime: this.inputTaskTime[0],
              endTime: this.inputTaskTime[1],
              topic: this.inputTheme,
              team: this.inputExtra1,
              workplace: this.inputPlace,
              dangerousOperationId: this.inputTheme,
              jobContent: this.inputTaskContent,
              planStartTime: this.datetime1 + ':00',
              planEndTime: this.datetime2 + ':00',
              departmentId: this.inputExtra1,
              reportFormId: this.childType,
              createUserId: this.user.id,
              status: 0,
              type: this.taskType,
              childName: this.childStr,
              num: this.clearExtra||this.weekExtra
            }).then(result => {
              console.log(result)
              if (result.status === 200) {
                sessionStorage.removeItem("setUp")
                sessionStorage.removeItem('header')
                this.$router.push({
                  name: 'security_record',
                  query: {titleBarId: 25, typeId: this.typeId, remindSwitch: 0, recordType: 5}
                })
                console.log("数据上传成功")
              } else {
                console.log("数据上传失败")
              }
            })
          })
        }
      }
    },
    //上传签名
    async uploadSign(){
      let signFormData = new FormData();
      let blobSign = dataUrlToBlob(this.signData);
      let fileSign = blobToFile(blobSign, 'sign');
      signFormData.append('file', blobSign);
      this.openFullScreen()
      //签名上传
      await axios.post(process.env.VUE_APP_URL +'/waterOperation/app/apptbfileinfo/uploadSignImage',signFormData).then(result => {
        if(result.status === 200){
          this.signFileId = result.data.data.id
          this.signPath = result.data.data.path
          this.closeFullScreen()
          console.log("数据上传成功")
        }else{
          console.log("数据上传失败")
        }
      })
    },
    //打开全屏
    openFullScreen() {
      this.fullscreenLoading = true
    },
    //关闭全屏
    closeFullScreen() {
      this.fullscreenLoading = false
    },
    //拿下拉框
    getOption(){
      axios.get(this.combo[this.typeId],{
        params: {
        }}).then(result => {
          console.log(result)
        if (result.data.code === 0) {
          if (this.nameOptions2.length>0 || this.nameOptions1.length>0){
            //如果有数据就不作为
          }else {
            for (var i = 0; i < result.data.list.length; i++) {
              let obj = {};
              obj.value = result.data.list[i].id;
              obj.label = result.data.list[i].name;
              obj.type = result.data.list[i].type
              if (this.typeId == 4) {
                //安全电子报表数据装填
                this.nameOptions1.push(obj);
              } else {
                //危险作业基本措施数据装填
                this.nameOptions2.push(obj);
              }
            }
            //缓存数据
            this.setSessionStorage()
          }
        } else {
          console.log("数据获取失败")
        }
      })
    },
    //根据列表index调整颜色
    headerStyle({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        return 'index'
      } else if (columnIndex === 1) {
        return 'content';
      } else {
        return 'condition';
      }
    },
    //合并列表单元格：合并数组生成
    getSpanArr(data) {
      this.tableSpanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.tableSpanArr.push(1);
          this.pos = 0
        } else {
          if (this.childType == 21||this.childType == 26) {
            if (data[i].item2 == data[i - 1].item2) {
              this.tableSpanArr[this.pos] += 1;
              this.tableSpanArr.push(0);
            } else {
              this.tableSpanArr.push(1);
              this.pos = i;
            }
          } else {
            if (data[i].item1 == data[i - 1].item1) {
              this.tableSpanArr[this.pos] += 1;
              this.tableSpanArr.push(0);
            } else {
              this.tableSpanArr.push(1);
              this.pos = i;
            }
          }
        }
      }
    },
    //合并列表单元格：合并方法
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.tableSpanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
  },
  components:{
    // eslint-disable-next-line vue/no-unused-components
    "back-box" : header,
  },
  watch: {
    inputTheme(val) {
      if (this.typeId == 4) {
        if (val == 1) {
          this.parentType = 0
          this.childType = 1
          this.formType = 1
        } else if (val == 2) {
          this.parentType = 0
          this.childType = 2
          this.formType = 1
        } else if (val == 3) {
          this.parentType = 1
          this.formType = 2
        } else if (val == 11) {
          this.parentType = 1
          this.formType = 3
        } else {
          this.parentType = 1
        }
        this.nameOptions4 = []
        this.tableData = []
        axios.get(this.combo[this.typeId], {
          params: {}
        }).then(result => {
          console.log(result)
          if (result.data.code === 0) {
            if (this.typeId==6)
              this.stepList = result.data.list
            for (var i = 0; i < result.data.list.length; i++) {
              if (result.data.list[i].id == val && result.data.list[i].childList) {
                for (var j = 0; j < result.data.list[i].childList.length; j++) {
                  let obj = {};
                  obj.value = result.data.list[i].childList[j].id;
                  obj.label = result.data.list[i].childList[j].name;
                  this.nameOptions4.push(obj);
                }
              }
            }
          } else {
            console.log("数据获取失败")
          }
        })
      }
      if (this.typeId == 6) {
        this.tableData = []
        axios.get(this.combo[this.typeId], {
          params: {}
        }).then(result => {
          console.log(result)
          if (result.data.code === 0) {
            this.stepList = result.data.list[val-1].content
            console.log(this.stepList)
            for (var i = 0; i < result.data.list[val-1].stepList.length; i++) {
              let obj = {};
              obj.index = result.data.list[val-1].stepList[i].id;
              obj.content = result.data.list[val-1].stepList[i].step;
              obj.confirm = result.data.list[val-1].stepList[i].confirm;
              this.tableData.push(obj);
            }
            console.log("数据获取成功")
            console.log(this.tableData)
          } else {
            console.log("数据获取失败")
          }
        })
      }
      this.setSessionStorage()
    },
    taskForm(val) {
      this.childType = val
      if (val == 20) {
        this.formType = 4
      } else if (val == 21||val == 26) {
        this.formType = 5
      } else if (val == 22||val == 25) {
        this.formType = 6
      }
    },
    //监听输入框的输入，把输入数据缓存下来
    inputTaskContent(val) {
      this.setSessionStorage()
    },
    inputTaskCalendar(val){
      this.setSessionStorage()
    },
    inputTaskTime(val){
      this.setSessionStorage()
    },
    date1(val){
      this.setSessionStorage()
    },
    inputExtra1(val){
      this.setSessionStorage()
    },
    inputExtra2(val){
      this.setSessionStorage()
    },
    inputPlace(val){
      this.setSessionStorage()
    },
    inputVip(val){
      this.setSessionStorage()
    },
    choseMember(val){
      this.setSessionStorage()
    },
    signer(val){
      this.setSessionStorage()
    },
    datetime1(val){
      this.setSessionStorage()
    },
    datetime2(val){
      this.setSessionStorage()
    },
    performer(val){
      this.setSessionStorage()
    },
    otherTaskContent(val){
      this.setSessionStorage()
    },
    //监听子下拉框把相应的任务列表导入tabledata
    childType(val) {
      try {
        this.childStr = this.nameOptions4.find((option) => option.value == val).label
      }catch (e) {

      }
      this.tableData = []
      axios.get(this.list[this.typeId] + "/" + val, {
        params: {}
      }).then(result => {
        console.log(result)
        if (result.data.code === 0) {
          if (this.typeId==6)
            this.stepList = result.data.info
          if (this.typeId==4)
            this.stepList = result.data.info
          for (var i = 0; i < result.data.info.stepList.length; i++) {
            let obj = {};
            obj.item1 = result.data.info.stepList[i].project;
            obj.item2 = result.data.info.stepList[i].content;
            obj.item3 = result.data.info.stepList[i].health;
            if (this.formType == 1) {
              obj.item1 = i + 1
            }
            if (this.formType == 2) {
              obj.item3 = result.data.info.stepList[i].numStr;
            }
            this.tableData.push(obj);
          }
          this.getSpanArr(this.tableData)
          console.log("数据获取成功")
        } else {
          console.log("数据获取失败")
        }
      })
    },
    //监听表单的类型，对表单列项的字符进行修改
    formType(val) {
      switch (val) {
        case 1:
          this.tableHeader1 = "序号"
          this.tableHeader2 = "具体内容"
          this.tableHeader3 = false
          break
        case 2:
          this.tableHeader1 = "项目"
          this.tableHeader2 = "地点"
          this.tableHeader3 = "数量"
          break
        case 3:
          this.tableHeader1 = "地点"
          this.tableHeader2 = "检查项目"
          this.tableHeader3 = "卫生标准"
          break
        case 4:
          this.tableHeader1 = "项目"
          this.tableHeader2 = "地点"
          this.tableHeader3 = false
          break
        case 5:
          this.tableHeader1 = false
          this.tableHeader2 = "检查内容"
          this.tableHeader3 = false
          break
        case 6:
          this.tableHeader1 = "项目"
          this.tableHeader2 = "检查内容"
          this.tableHeader3 = false
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  padding: 30px 20px 0 20px;
  p{
    display: flex;
    justify-content: flex-start;
    margin-bottom: 30px;
    .imagePicker{
      margin-left: 86px;
      margin-top: -20px;
      /deep/.add-icon{
        border: none;
        background-color: #E4E4E4;
        i{
          svg{
            color: #7F7F7F;
          }
        }
      }
    }
  }
  .default_content{
    line-height: 1.6;
  }
  .other{
    margin-left: 36px;
  }
  .title{
    font-size: 18px;
    font-weight: 700;
    white-space: nowrap;
  }
  .theme{
  }
  .taskContent{
    width: 70%;
    vertical-align: top;
    margin-top: -6px;
  }
  .member{
    width: 42%;
  }
  .choose{
    height: 32px;
    border: none;
    background-color: #0099FF;
    font-size: 10px;
    border-radius: 4px;
    color: #FFFFFF;
    margin-left: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
  .bottomText{
    color: #AEAEAE;
    font-size: 12px;
    width: 86%;
    margin: 4px auto;
    text-align: center;
  }
  .extra{
  }
  .extra_margin{
    margin-right: 10px;
  }
  .sign_box{
    width: 40%;
  }
  .vip{
  }
  .vipChoose{
    vertical-align: middle;
  }
  .calendar{
    width: 100%;
  }
  .time{
    width: 70%;
    margin-left: 88px;
    margin-top: -10px;
  }
  .transition{
    font-weight: 700;
    color: #BEB8B8;
    margin: 0 4px;
    font-size: 18px;
    flex-shrink: 1;
    flex-grow: 1;
    flex-basis: 18px;
  }
  .border{
    border-radius: 4px;
    padding: 2px;
    border: 1px solid #DCDFE6;
    font-size: 16px;
    flex-shrink: 1;
    flex-grow: 1;
    flex-basis: 88px;
    white-space: nowrap;
  }
  .leader{
    margin-left: 18px;
  }
  .danger_timer{
    margin-top: 20px;
    display: block;
    a:nth-child(1){
      margin-right: 6px;
    }
    a:nth-child(3){
      margin-left: 6px;
    }
  }
  .between{
    transform: rotate(90deg);
    padding-left: 8px;
  }
  .info {
    font-weight: 400;
    font-size: 18px;
  }
  .ml{
    margin-left: 18px;
  }
  .ext_ml{
    margin-left: 34px;
  }
  .expand_icon{
    display: block;
    margin: 2px auto;
  }
  /deep/.el-date-editor .el-range-separator{
    width: auto;
  }
  .time_displayer{
    display: flex;
  }
}
</style>
