<template>
  <div class="detail_container">
<!--    头部的路由标题栏 -->
    <back-box :id="this.titleBarId" :front="this.front" :userId="this.user.id" :itemId="this.itemId" ref="back"></back-box>
<!--    内容块 -->
    <div class="content">
<!--    信息块：基础信息标签 -->
      <title-bar class="titleBar" :title="'基础信息'"></title-bar>
      <ul class="base_box">
<!--        任务名称：通常第一行-->
        <li><p>
          <span class="title" v-if="name[typeId][0]&&((!elecTabPageType&&typeId==4)||(elecTabPageType==2))">{{ name[typeId][0] }}&nbsp;:&nbsp;</span>
          <span class="title" v-if="name[typeId][1]&&((elecTabPageType&&typeId==4)||(elecTabPageType==2))">{{ name[typeId][1] }}&nbsp;:&nbsp;</span>
          <span class="info">{{ taskName }}</span>
        </p></li>
<!--        工作内容：只有检查和危险作业有-->
<!--        <li v-if="content[typeId]&&typeId!=1"><p>-->
<!--          <span class="title">{{ content[typeId] }}&nbsp;:&nbsp;</span>-->
<!--          <span v-if="(status>=1&&roleId==0)||(roleId==1)" class="info">{{ taskContent }}</span>-->
<!--          <el-input type="textarea" v-model="taskContent" v-if="roleId==0&&status==0" resize="none" :rows="4" maxlength="500" class="edit_box box01"></el-input>-->
<!--        </p></li>-->
        <li v-if="typeId==1"><p>
          <span class="title">{{ content[typeId] }}&nbsp;:&nbsp;</span>
          <span>公司大楼、供水厂四至周围、厂区、宿舍、安全保卫、危化品、岗位安全、生产车间、电气设备、重大危险源、重点安全岗位、机械设备、车辆、施工工地、仓库、消防、环境卫生、用电、饭堂、丹灶加压泵站、管网</span>
        </p></li>
        <li><p v-if="typeId==1">
          <span class="title">其他&nbsp;:&nbsp;</span>
          <el-input v-if="roleId==0&&status==0" v-model="otherTaskContent" type="input" maxlength="50" resize="none" class="edit_box box01 other"></el-input>
          <span v-if="(status>=1&&roleId==0)||(roleId==1)" class="info">{{ otherTaskContent }}</span>
        </p></li>

        <!--        相关时间：安全检查没有，危险作业是特殊样式-->
        <div v-if="time[typeId][0]&&typeId!=6" class="time_box">
          <li><p><span class="title" v-if="time[typeId][0]&&((!elecTabPageType&&(typeId==4))||(typeId!=4))">{{ time[typeId][0] }}&nbsp;:&nbsp;</span>
                 <span class="title" v-if="time[typeId][1]&&((elecTabPageType&&(typeId==4))||(typeId!=4))">{{ time[typeId][1] }}&nbsp;:&nbsp;</span>

<!--            <nut-datepicker v-if="typeId==6&&(roleId==0&&status==0)"-->
<!--                :is-visible="isVisible2"-->
<!--                title="请选择日期时间"-->
<!--                type="datetime"-->
<!--                startDate="2015-01-01 00:00"-->
<!--                endDate="2030-12-30 11:59"-->
<!--                :defaultValue="datetime"-->
<!--                @close="switchPicker('isVisible2')"-->
<!--                @choose="setChooseValue2"-->
<!--            >-->
<!--            </nut-datepicker>-->
<!--            <nut-datepicker v-if="typeId==6&&(roleId==0&&status==0)"-->
<!--                            :is-visible="isVisible3"-->
<!--                            title="请选择日期时间"-->
<!--                            type="datetime"-->
<!--                            startDate="2015-01-01 00:00"-->
<!--                            endDate="2030-12-30 11:59"-->
<!--                            :defaultValue="datetime2"-->
<!--                            @close="switchPicker('isVisible3')"-->
<!--                            @choose="setChooseValue3"-->
<!--            >-->
<!--            </nut-datepicker>-->
<!--            <nut-calendar v-if="typeId==2&&(roleId==0&&status==0)"-->
<!--                :is-visible.sync="isVisible"-->
<!--                :default-value="date1"-->
<!--                type="range"-->
<!--                @close="switchPickerClose('isVisible')"-->
<!--                @choose="setChooseValue"-->
<!--            >-->
<!--            </nut-calendar>-->
<!--            <span class="danger_timer" v-if="typeId==6">-->
<!--              <a @click="changeVisible2">-->
<!--                <span :class=" (status==0&&roleId==0) ? 'border' : 'border_selected'">{{ datetime }}</span>-->
<!--              </a>-->
<!--              <img class="between" src="./images/u4636.svg">-->
<!--              <a @click="changeVisible3">-->
<!--                <span :class=" (status==0&&roleId==0) ? 'border' : 'border_selected'"> {{ datetime2 }}</span>-->
<!--              </a>-->
<!--            </span>-->
<!--            <a @click="changeVisible" v-if="typeId==2" class="time_displayer">-->
<!--              <span :class=" (status==0&&roleId==0) ? 'border' : 'border_selected'">{{ date1[0] }}</span>-->
<!--              <span class="transition">至</span>-->
<!--              <span :class=" (status==0&&roleId==0) ? 'border' : 'border_selected'">{{ date1[1] }}</span>-->
<!--            </a>-->

            <nut-datepicker
                v-if="isVisible5&&(roleId==0&&status==0)"
                :is-visible="isVisible5"
                title="请选择日期"
                type="date"
                startDate="2000-01-01"
                endDate="2060-12-31"
                :default-value=taskTime
                @close="switchPicker('isVisible5')"
                @choose="setChooseValue5"
                style="position: absolute"
            >
            </nut-datepicker>
            <a @click="changeVisible5" v-if="!(typeId==1||typeId==6)" class="time_calendar">
              <span  class="info" :class=" (status==0&&roleId==0) ? 'border' : 'border_selected'">{{ taskTime }}</span>
            </a>
          </p></li>

<!--          <li><p>-->
<!--            <nut-datepicker-->
<!--                :is-visible="isVisible6&&(roleId==0&&status==0)"-->
<!--                type="time"-->
<!--                title="请选择时间"-->
<!--                :minute-step="1"-->
<!--                :defaultValue="timeLeft"-->
<!--                @close="switchPicker('isVisible6')"-->
<!--                @choose="setChooseValue6"-->
<!--            >-->
<!--            </nut-datepicker>-->
<!--            <nut-datepicker-->
<!--                :is-visible="isVisible7&&(roleId==0&&status==0)"-->
<!--                type="time"-->
<!--                title="请选择时间"-->
<!--                :minute-step="1"-->
<!--                :defaultValue="timeRight"-->
<!--                @close="switchPicker('isVisible7')"-->
<!--                @choose="setChooseValue7"-->
<!--            >-->
<!--            </nut-datepicker>-->
<!--            <a @click="changeVisible6" v-if="(typeId==3||typeId==5)">-->
<!--              <span class="info time" :class=" ((typeId==3||typeId==5)&&status==0&&roleId==0) ? 'border' : ''">{{ timeLeft }}</span>-->
<!--            </a>-->
<!--            <img  v-if="(typeId==3||typeId==5)&&!(status==0&&roleId==0)" class="time_line" src="./images/u4928.svg" >-->
<!--            <span class="transition" v-if="(typeId==3||typeId==5)&&status==0&&roleId==0">至</span>-->
<!--            <a @click="changeVisible7" v-if="(typeId==3||typeId==5)">-->
<!--              <span class="info" :class=" ((typeId==3||typeId==5)&&status==0&&roleId==0) ? 'border' : ''">{{ timeRight }}</span>-->
<!--            </a>-->
<!--          </p></li>-->
        </div>

        <!--        额外信息： 培训费用，课时，班组名称-->
        <li v-if="extra[typeId][0]&&typeId!=6"><p>
          <span class="title" :class="(typeId==6&&!(status==0&&roleId==0))? 'partition':''">{{ extra[typeId][0] }}&nbsp;:&nbsp;</span>
          <span v-if="(status!=0&&roleId==0)||(roleId==1)" class="info">{{ taskExtra[0] }}</span>
          <el-input v-model="taskExtra[0]" v-if="status==0&&roleId==0&&typeId!=4" class="edit_box" :class="(extra[typeId][1])? 'box03':'box06'"></el-input>
          <el-select v-model="taskExtra[0]" placeholder="请选择" v-if="typeId==4&&status==0&&roleId==0">
            <el-option
                v-for="item in teamOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
          <span class="title leader" v-if="extra[typeId][1]">{{ extra[typeId][1] }}&nbsp;:&nbsp;</span>
          <span v-if="(extra[typeId][1]&&status!=0&&roleId==0)||(roleId==1&&typeId!=4)" class="info">{{ taskExtra[1] }}</span>
          <el-input v-model="taskExtra[1]" v-if="extra[typeId][1]&&status==0&&roleId==0" class="edit_box box03"></el-input>
        </p></li>

        <!--        相关地点：安全检查没有-->
        <li v-if="place[typeId]&&(!elecTabPageType||(typeId!=4))&&typeId!=6"><p>
          <span class="title">{{ place[typeId] }}地点&nbsp;:&nbsp;</span>
          <span v-if="(status!=0&&roleId==0)||(roleId==1)" class="info">{{ taskPlace }}</span>
          <el-input v-model="taskPlace" v-if="(status==0&&roleId==0)" class="edit_box box04" maxlength="50"></el-input>
        </p></li>

        <!--        关键成员： 培训老师  主持人  工作监护人-->
        <li v-if="vip[typeId][0]&&typeId!=6"><p>
          <span class="title" v-if="vip[typeId][0]&&((!elecTabPageType&&typeId==4)||(typeId!=4))">{{ vip[typeId][0] }}&nbsp;:&nbsp;</span>
          <span class="title" v-if="vip[typeId][2]&&((elecTabPageType&&typeId==4)||(typeId!=4))">{{ vip[typeId][2] }}&nbsp;:&nbsp;</span>
          <span v-if="((typeId==4)||((status!=0&&roleId==0)||(roleId==1)||(typeId==6)))" class="info" :class="(typeId==4||typeId==5) ? 'vip3' : ''">{{ taskVip }}</span>
          <el-input value="taskVip" v-model="taskVip" v-if="(status==0&&roleId==0)&&(typeId!=6)&&(typeId!=4)" class="edit_box box05" :class="(typeId==4||typeId==5) ? 'vip3' : ''" :readonly="(typeId!=2) ? 'readonly' : false"></el-input>
          <button v-if="vip[typeId][1]&&(roleId==0&&status==0)&&(typeId!=4)" class="choose" @click="toChoose(4,true,vipObj)">选择{{ vip[typeId][1] }}</button>
          <button v-if="vip[typeId][3]&&(roleId==0&&status==0)&&(typeId!=4)" class="choose" @click="toChoose(4,true,vipObj)">选择{{ vip[typeId][3] }}</button>
        </p></li>

        <!--        参加成员：-->
        <li v-if="typeId!=6"><p>
          <span class="title">{{ member[typeId][0] }}成员&nbsp;:&nbsp;</span>
          <span v-if="(status>=1&&roleId==0)||(roleId==1)" class="info">{{ taskMember }}</span>
          <el-input v-model="taskMember" type="textarea" v-if="status==0&&roleId==0" class="edit_box box02" readonly resize="none"></el-input>
          <button v-if="status==0&&roleId==0" class="choose" @click="toChoose(1,false, choseMemberList)">选择{{ member[typeId][1] }}</button>
        </p></li>

<!--        <li v-if="typeId==6"><p>-->
<!--          <span class="title">{{ member[typeId][0] }}成员&nbsp;:&nbsp;</span>-->
<!--          <el-table-->
<!--              :data="dangerMemberList"-->
<!--              style="width: 100%">-->
<!--            <el-table-column-->
<!--                type="index"-->
<!--                width="30">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                align="center"-->
<!--                label="姓名"-->
<!--            >-->
<!--              <template slot-scope="scope">-->
<!--                <el-input type="input" v-model="scope.row.comment" v-if="status==0&&roleId==0"></el-input>-->
<!--                <span v-if="!(status==0&&roleId==0)">{{ scope.row.comment }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                align="center"-->
<!--                label="操作"-->
<!--                width="100"-->
<!--                v-if="(status==0&&roleId==0)"-->
<!--            >-->
<!--              <template slot-scope="scope">-->
<!--                <el-button-->
<!--                    size="mini"-->
<!--                    type="danger"-->
<!--                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--          <img v-if="(status==0&&roleId==0)" @click="expandDangerMemberTable" class="expand_icon"  src="./images/u4821.svg">-->
<!--        </p></li>-->
        <!--        签发人-->
<!--        <li v-if="typeId==6&&status!=4&&status!=6&&(dangerPeoType!=2)||(dangerPeoType==1&&status!=4&&status!=6)||dangerPeoType==3"><p>-->
<!--          <span class="title">签发人&nbsp;:&nbsp;</span>-->
<!--          <span v-if="(roleId==0&&status!=0)||roleId==1" class="info vip3">{{ taskSign }}</span>-->
<!--          <el-input  v-model="taskSign" v-if="status==0&&roleId==0" class="edit_box box05 vip3" readonly></el-input>-->
<!--          <button v-if="roleId==0&&status==0" class="choose" @click="toChoose(5,true, taskSignObj)">选择</button>-->
<!--        </p></li>-->
        <!--        执行人-->
<!--        <li v-if="typeId==6"><p>-->
<!--          <span class="title">执行人&nbsp;:&nbsp;</span>-->
<!--          <el-input v-if="status==0&&roleId==0"  v-model="taskPerform"  class="edit_box box05 vip3" :readonly="(status==0)? false:true"></el-input>-->
<!--          <span v-if="(roleId==0&&status!=0)||roleId==1" class="info vip3">{{ taskPerform }}</span>-->
<!--        </p></li>-->
<!--        基本防护措施-->
<!--        <li v-if="typeId==6"><p>-->
<!--          <span class="title" v-if="status!=4&&status!=6">基本防护措施&nbsp;:&nbsp;</span>-->
<!--          <el-table-->
<!--              :data="tableData"-->
<!--              border-->
<!--              style="width: 100%"-->
<!--          >-->
<!--            <el-table-column-->
<!--                align="center"-->
<!--                prop="id"-->
<!--                label="序号"-->
<!--                width="70">-->

<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                align="center"-->
<!--                prop="step"-->
<!--                label="安全防护措施（含步骤）">-->

<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                v-if="(status!==6&&status!=4&&roleId==0)||(status==3&&roleId==1)"-->
<!--                align="center"-->
<!--                label="监护人确认"-->
<!--                width="70">-->
<!--              <template slot-scope="scope">-->
<!--                <div class="danger_confirm_icon">-->
<!--                  <a @click="changeConfStatus(scope.$index,2)">-->
<!--                    <img src="./images/u4863.svg" v-if="!scope.row.guardianConfirm">-->
<!--                    <img src="./images/u4863_selected.svg" v-if="scope.row.guardianConfirm">-->
<!--                  </a>-->
<!--                </div>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                v-if="roleId==1&&dangerPeoType==1&&status!==6&&status!=4&&status!=3"-->
<!--                align="center"-->
<!--                label="执行人确认"-->
<!--                width="70">-->
<!--              <template slot-scope="scope">-->
<!--                <div class="danger_confirm_icon">-->
<!--                  <a @click="changeConfStatus(scope.$index,1)">-->
<!--                    <img src="./images/u4863.svg" v-if="!scope.row.executeConfirm">-->
<!--                    <img src="./images/u4863_selected.svg" v-if="scope.row.executeConfirm ">-->
<!--                  </a>-->
<!--                </div>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                v-if="roleId==1&&dangerPeoType==3&&status!==6&&status!=4"-->
<!--                align="center"-->
<!--                label="解除人确认"-->
<!--                width="70">-->
<!--              <template slot-scope="scope">-->
<!--                <div class="danger_confirm_icon">-->
<!--                  <a @click="changeConfStatus(scope.$index,3)">-->
<!--                    <img src="./images/u4863.svg" v-if="!scope.row.releaseConfirm">-->
<!--                    <img src="./images/u4863_selected.svg" v-if="scope.row.releaseConfirm">-->
<!--                  </a>-->
<!--                </div>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--        </p></li>-->

<!--        基础信息按钮栏-->
        <li v-if="roleId==0&&status==0&&typeId!=6"><p>
          <el-popover
              ref="popover"
              placement="bottom"
              width="170"
              trigger="click"
              >
            <el-input placeholder="请填写作废理由" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" resize="none" v-model="reason">{{reason}}</el-input>
            <el-button type="danger" class="confirm" @click="invalidDialog">确认</el-button>
          </el-popover>
          <el-button class="button red" v-popover:popover>作废</el-button>
          <button class="button green" @click="confirmDialog">确认修改</button>
        </p></li>
      </ul>



      <ul class="process_box" v-if="(roleId==0||(roleId==1&&status>=2))&&status!=6||(typeId==6&&roleId==1&&status!=6)||(typeId==4)">
        <title-bar class="titleBar" :title="'进度信息'" v-if="!(typeId==4&&roleId==1&&(status!=3))&&((status==0)||status!=0||elecTabPageType==2)||(typeId==4&&roleId==1&&status>1&&status!=6&&elecTabPageType==1)"></title-bar>
        <!--        任务单-->
<!--        <li v-if="typeId==4&&elecTabPageType&&status!=3&&status!=6"><p>-->
<!--          <span class="title">任务单&nbsp;:&nbsp;</span>-->
<!--          <el-select v-model="taskValue" placeholder="请选择" v-if="(roleId==0&&status==0&&formType>=4)" class="vip3 box01">-->
<!--            <el-option-->
<!--                v-for="item in taskOptions"-->
<!--                :key="item.value"-->
<!--                :label="item.label"-->
<!--                :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--          <span v-if="(!(roleId==0&&status==0)&&formType>=2)||(formType==2||formType==3)" class="vip3">{{ taskValueStr }}</span>-->
<!--        </p></li>-->
<!--        <li v-show="taskValue==22"><p>-->
<!--          <span class="title">班时&nbsp;:&nbsp;</span>-->
<!--          <el-select v-model="clearExtra" placeholder="请选择" class="vip3 box01" v-if="status==0">-->
<!--            <el-option-->
<!--                v-for="item in clearExtraOptions"-->
<!--                :key="item.value"-->
<!--                :label="item.label"-->
<!--                :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--          <span v-if="status!=0" class="vip3">{{ clearExtra }}</span>-->
<!--        </p></li>-->
<!--        <li v-show="taskValue==25"><p>-->
<!--          <span class="title">周别&nbsp;:&nbsp;</span>-->
<!--          <el-select v-model="weekExtra" placeholder="请选择" class="vip3 box01" v-if="status==0">-->
<!--            <el-option-->
<!--                v-for="item in weekExtraOptions"-->
<!--                :key="item.value"-->
<!--                :label="item.label"-->
<!--                :value="item.value">-->
<!--            </el-option>-->
<!--            <span v-if="status!=0" class="vip3">{{ weekExtra }}</span>-->
<!--          </el-select>-->
<!--        </p></li>-->
        <!--      表格-->
        <li v-if="(typeId==4)"><p>
          <el-table ref="safeTable"
                    :span-method="objectSpanMethod"
              :header-cell-class-name="headerStyle"
              :cell-class-name="cellStyle"
              :data="tableData"
              border
              style="width: 100%">
            <el-table-column type="expand" width="1">
              <template slot-scope="props">
                <el-form inline class="demo-table-expand">
                  <el-form-item v-for="item in props.row.recordList" :label="item.key">
                    <el-input type="textarea" :row="2" resize="none" class="tableInput" v-if="status==0" v-model="item.value"></el-input>
                    <span v-if="status!=0">{{ item.value }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column v-if="formType>=2&&formType!=5"
                align="center"
                prop="project"
                label="项目"
                width="50"
            >
            </el-table-column>
            <el-table-column v-if="formType>=2&&formType<5"
                align="center"
                label="地点"
                             prop="content"
            >
            </el-table-column>
            <el-table-column v-if="formType>=5"
                             align="center"
                             label="检查内容"
                             prop="content"
            >
            </el-table-column>
            <el-table-column v-if="formType==2"
                align="center"
                label="数量"
                width="60"
                             prop="numStr"
            >
            </el-table-column>
            <el-table-column v-if="formType==3"
                             align="center"
                             label="卫生标准"
                             width="80"
                             prop="health"
            >
            </el-table-column>
            <el-table-column
                v-if="formType==1"
                align="center"
                prop="index"
                label="序号"
                width="50"
            >
            </el-table-column>
            <el-table-column v-if="formType==1"
                align="center"
                prop="content"
                label="具体内容"
            >
            </el-table-column>
            <el-table-column v-if="(formType==1)&&(roleId==0||(roleId==1&&status==2))"
                align="center"
                label="情况记录"
                width="120"
            >
              <template slot-scope="scope" v-if="(formType==1)&&(roleId==0||(roleId==1&&status==2))">
                <el-switch v-if="status==0&&scope.row.situationRecordArr[0]"
                           class="mb8"
                           width="22"
                    v-model="scope.row.situationRecordArr[2]"
                    active-color="#13ce66"
                    inactive-color="#7F7F7F"
                           active-value="1"
                           inactive-value="0"
                    :active-text=scope.row.situationRecordArr[1]
                    :inactive-text=scope.row.situationRecordArr[0]>
                </el-switch>
                <div v-if="(scope.row.situationRecordArr[2]=='1')&&status==2">{{ scope.row.situationRecordArr[1] }}</div>
                <div v-if="!(scope.row.situationRecordArr[2]=='1')&&status==2">{{ scope.row.situationRecordArr[0] }}</div>
                <el-button class="recordCondition" @click="toggleExpand(scope.row)">录入情况</el-button>
              </template>
            </el-table-column>
            <el-table-column v-if="formType==4&&((roleId==0)||(roleId==1&&status==2))"
                             align="center"
                             label="相关责任人是否落实巡检"
                             width="120"
            >
              <template slot-scope="scope">
                <el-switch v-if="scope.row.practicalArr[0]&&status==0"
                           width="22"
                           v-model="scope.row.practicalArr[2]"
                           active-color="#13ce66"
                           inactive-color="#7F7F7F"
                           :active-text=scope.row.practicalArr[1]
                           :inactive-text=scope.row.practicalArr[0]>
                </el-switch>
                <div v-if="status!=0&&(scope.row.practicalArr[2]=='true')">{{ scope.row.practicalArr[1] }}</div>
                <div v-if="status!=0&&!(scope.row.practicalArr[2]=='true')">{{ scope.row.practicalArr[0] }}</div>
              </template>
            </el-table-column>
            <el-table-column v-if="formType>=4&&((roleId==0)||(roleId==1&&status==2))"
                             align="center"
                             label="设备设施抽查情况"
                             width="120"
            >
              <template slot-scope="scope">
                <el-switch v-if="scope.row.spotCheckArr[0]&&status==0"
                           width="22"
                           v-model="scope.row.spotCheckArr[2]"
                           active-color="#13ce66"
                           inactive-color="#7F7F7F"
                           :active-text=scope.row.spotCheckArr[1]
                           :inactive-text=scope.row.spotCheckArr[0]>
                </el-switch>
                <div v-if="status!=0&&(scope.row.spotCheckArr[2]=='true')">{{ scope.row.spotCheckArr[1] }}</div>
                <div v-if="status!=0&&!(scope.row.spotCheckArr[2]=='true')">{{ scope.row.spotCheckArr[0] }}</div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="负责人"
                width="100"
                v-if="formType==3&&((roleId==0)||(roleId==1&&status!=0))"
            >
              <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="primary"
                    v-if="!headerList.find(user => user.id == scope.row.id)&&status==0"
                    @click="toChoose(3,true, fixPeopleObj,scope.row.id)">选择</el-button>
                <a @click="toChoose(3,true, fixPeopleObj,scope.row.id)" v-if="status==0&&headerList.find(user => user.id == scope.row.id)" class="border_fix"><span>{{ headerList.find(user => user.id == scope.row.id).username }}</span></a>
                <span v-if="headerList.find(user => user.id == scope.row.id)&&status!=0">{{ headerList.find(user => user.id == scope.row.id).username }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="(formType==2||formType==3)&&((roleId==0&&status!=0)||(roleId==1&&status==2))"
                             align="center"
                             label="巡检情况"
                             width="120"
            >
              <template slot-scope="scope">
                  <el-switch v-if="scope.row.spotCheckArr[0]&&status==1"
                             width="22"
                             v-model="scope.row.spotCheckArr[2]"
                             active-color="#13ce66"
                             inactive-color="#7F7F7F"
                             :active-text=scope.row.spotCheckArr[1]
                             :inactive-text=scope.row.spotCheckArr[0]>
                  </el-switch>
                  <div v-if="status!=1&&(scope.row.spotCheckArr[2]=='true')">{{ scope.row.spotCheckArr[1] }}</div>
                  <div v-if="status!=1&&!(scope.row.spotCheckArr[2]=='true')">{{ scope.row.spotCheckArr[0] }}</div>
              </template>
            </el-table-column>
          </el-table>
        </p></li>


        <!--        签发人-->
<!--        <li v-if="typeId==6&&status==0&&roleId==0"><p>-->
<!--          <span class="title">签发人&nbsp;:&nbsp;</span>-->
<!--          <el-button type="info" v-if="!isDangerSign" class="signButton">未签名</el-button>-->
<!--          <el-button type="primary" v-if="isDangerSign" class="signButton">已签名</el-button>-->
<!--        </p></li>-->


        <!--       已确定成员 -->
        <li v-if="roleId==0&&status==0&&typeId!=6"><p>
          <span class="title">已确定成员&nbsp;:&nbsp;</span>
          <span class="info">{{ confirmMember }}</span>
        </p></li>

        <!--        补充防护措施-->
<!--        <li v-if="typeId==6&&status!=4"><p>-->
<!--          <span class="title">补充防护措施&nbsp;:&nbsp;</span>-->
<!--          <el-table-->
<!--              :data="tableData2"-->
<!--              border-->
<!--              style="width: 100%"-->
<!--          >-->
<!--            <el-table-column-->
<!--                align="center"-->
<!--                prop="id"-->
<!--                label="序号"-->
<!--                width="70">-->

<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                align="center"-->
<!--                prop="step"-->
<!--                label="补充安全防护措施（含步骤）">-->
<!--              <template slot-scope="scope">-->
<!--                <el-input type="textarea" v-if="!scope.row.lock&&(status==0&&roleId==0)" v-model="scope.row.step" resize="none"></el-input>-->
<!--                <el-button type="success" class="expaConfBtn" v-if="!scope.row.lock&&(status==0&&roleId==0)" @click="expandConfirm(scope.row.id)">确认</el-button>-->
<!--                <span v-if="scope.row.lock||status>0||(status==0&&roleId==1)">{{ scope.row.step }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                v-if="(roleId==0&&status!==6&&status!=4)||(status==3&&roleId==1)"-->
<!--                align="center"-->
<!--                label="监护人确认"-->
<!--                width="70">-->
<!--              <template slot-scope="scope">-->
<!--                <div class="danger_confirm_icon">-->
<!--                  <a @click="changeConfStatus2(scope.$index,2)">-->
<!--                    <img src="./images/u4863.svg" v-if="!scope.row.guardianConfirm">-->
<!--                    <img src="./images/u4863_selected.svg" v-if="scope.row.guardianConfirm">-->
<!--                  </a>-->
<!--                </div>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                v-if="roleId==1&&dangerPeoType==1&&status!==6&&status!=4&&status!=3"-->
<!--                align="center"-->
<!--                label="执行人确认"-->
<!--                width="70">-->
<!--              <template slot-scope="scope">-->
<!--                <div class="danger_confirm_icon">-->
<!--                  <a @click="changeConfStatus2(scope.$index,1)">-->
<!--                    <img src="./images/u4863.svg" v-if="!scope.row.executeConfirm">-->
<!--                    <img src="./images/u4863_selected.svg" v-if="scope.row.executeConfirm">-->
<!--                  </a>-->
<!--                </div>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                v-if="roleId==1&&dangerPeoType==3&&status!==6&&status!=4"-->
<!--                align="center"-->
<!--                label="解除人确认"-->
<!--                width="70">-->
<!--              <template slot-scope="scope">-->
<!--                <div class="danger_confirm_icon">-->
<!--                  <a @click="changeConfStatus2(scope.$index,3)">-->
<!--                    <img src="./images/u4863.svg" v-if="!scope.row.releaseConfirm">-->
<!--                    <img src="./images/u4863_selected.svg" v-if="scope.row.releaseConfirm">-->
<!--                  </a>-->
<!--                </div>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--          <img @click="expandTable" class="expand_icon" v-if="(roleId==0&&status==0)" src="./images/u4821.svg">-->
<!--        </p></li>-->
<!--        会议记录-->
<!--        <li v-if="typeId==5&&status!=0&&status!=3">-->
<!--          <p>-->
<!--            <span class="title">会议记录&nbsp;:&nbsp;</span><el-input v-model="taskRecord" type="textarea" :rows="3" resize="none" v-if="status!=2" class="edit_box box01 box01" maxlength="200"></el-input>-->
<!--            <span v-if="status!=1">{{ taskRecord }}</span>-->
<!--          </p></li>-->
<!--     相关情况   -->
<!--        <li v-if="(status!=4&&status!=3&&status>=1)&&(typeId!=1)&&!(typeId==6&&roleId==1)&&(typeId!=4)||(typeId==4&&elecTabPageType==1&&((status==1&&roleId==0)||status==2))||(typeId==6&&status==3)||dangerPeoType==3">-->
<!--          <p>-->
<!--          <span class="title">{{ condition[typeId] }}&nbsp;:&nbsp;</span><el-input v-model="taskCondition" type="textarea" :rows="3" resize="none" v-if="!(status>1)&&dangerPeoType!=3" class="edit_box box01 box01" maxlength="200"></el-input>-->
<!--            <span v-if="status>1||dangerPeoType==3">{{ taskCondition }}</span>-->
<!--        </p></li>-->
<!--     工作结束时间-->
<!--        <li v-if="typeId==6&&((status!=0&&status!=4&&roleId==0)||(roleId==1&&status==3))||dangerPeoType==3"><p>-->
<!--          <nut-datepicker-->
<!--                          :is-visible="isVisible4"-->
<!--                          title="请选择日期时间"-->
<!--                          type="datetime"-->
<!--                          startDate="2000-11-10 12:08"-->
<!--                          endDate="2030-10-05 10:04"-->
<!--                          defaultValue="2018-11-02 11:08"-->
<!--                          @close="switchPicker('isVisible4')"-->
<!--                          @choose="setChooseValue4"-->
<!--          >-->
<!--          </nut-datepicker>-->
<!--          <span class="title">工作结束时间&nbsp;:&nbsp;</span>-->
<!--          <a @click="changeVisible4">-->
<!--            <span :class=" (status==1) ? 'border' : 'border_selected'">{{ datetime3 }}</span>-->
<!--          </a>-->
<!--        </p></li>-->
<!--        解除人-->
<!--        <li v-if="typeId==6&&((status!=4&&status>=1&&roleId==0)||(roleId==1&&status==3))"><p>-->
<!--          <span class="title">解除人&nbsp;:&nbsp;</span>-->
<!--          <span v-if="status!=1" class="info vip3">{{ taskRemove }}</span>-->
<!--          <el-input value="taskSign" v-model="taskRemove" v-if="status==1" class="edit_box box05 vip3"></el-input>-->
<!--        </p></li>-->
<!--        图片附件-->
        <div class="extra_box" v-if="typeId!=1&&!(typeId!=6&&status==3)&&!(typeId==6&&status==4)&&recordType!=3&&roleId!=1">
          <li><p>
            <span class="title">附件&nbsp;:&nbsp;</span>
            <vue-preview :slides="thumbsList" v-if="status>=1" class="imgPrev"></vue-preview>
            <nut-imagepicker v-if="(status==0||status==1)&&!(formType==3&&status==1)"
                             v-loading.fullscreen.lock="fullscreenLoading"
                @imgMsg="imgMsg"
                :animation=true
                :width="90"
                :height="90"
                :margin="20"
                :imgList.sync="imgList"
                :max="4"
                :ismultiple="true"
                delMode="longtap"
                :longTapTime="longTapTime"
                class="imagePicker"
            >
          </nut-imagepicker>
          </p></li>

<!--          <li v-if="typeId==4&&((status==1&&roleId==0)||status==2)&&reportFormId==2">-->
<!--            <p><span class="title">附件&nbsp;:&nbsp;</span></p>-->
<!--            <p v-for="(item,index) in tableData" @click="getImgLink(index)">-->
<!--              <span class="star" v-if="status==1">*</span><span class="title">环节{{ index | transfer }}&nbsp;:&nbsp;</span>-->
<!--              <vue-preview :slides="thumbsList[index]" class="imgPrev"></vue-preview>-->
<!--              <nut-imagepicker v-if="status==1"-->
<!--                               @imgMsg="imgMsg"-->
<!--                               v-loading.fullscreen.lock="fullscreenLoading"-->
<!--                               animation="true"-->
<!--                               :width="90"-->
<!--                               :height="90"-->
<!--                               :margin="20"-->
<!--                               :imgList.sync="imgList[index]"-->
<!--                               :max="2"-->
<!--                               :ismultiple="true"-->
<!--                               delMode="longtap"-->
<!--                               :longTapTime="longTapTime"-->
<!--                               class="imagePicker"-->

<!--              >-->
<!--              </nut-imagepicker>-->
<!--            </p>-->
<!--          </li>-->
        </div>
<!--        整改-->
        <div class="fix_box" v-if="((status>=2&&status<=4)||(status==1&&roleId==0))&&typeId==1">
          <el-table
              :data="fixTableData"
              style="width: 100%"
          >
            <el-table-column
                align="center"
                label="检查情况"
                width="250"
            >
              <template slot-scope="scope">
                <el-input type="input" v-model="scope.row.content" v-if="status==1"></el-input>
                <span v-if="status!=1">{{ scope.row.content }}</span>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="隐患类型"
                width="110"
            >
              <template slot-scope="scope">
                <el-select v-model="scope.row.type" placeholder="请选择" v-if="status==1">
                  <el-option
                      v-for="item in hiddenLevelOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
                <span v-if="status!=1">{{ scope.row.type }}</span>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="隐患级别"
                width="110"
            >
              <template slot-scope="scope">
                <el-select v-model="scope.row.level" placeholder="请选择" v-if="status==1">
                  <el-option
                      v-for="item in hiddenTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
                <span v-if="status!=1">{{ scope.row.level }}</span>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="检查情况附件"
            >
              <template slot-scope="scope">
                <div @click="removePopstate"><vue-preview v-if="status!=1" :slides="scope.row.thumbsList_front" class="imgPrev_fix" @close="addPopstate"></vue-preview></div>
                <div @click="getFixImgIndex(scope.$index,0)">
                  <nut-imagepicker v-if="status==1"
                                   v-loading.fullscreen.lock="fullscreenLoading"
                                   @imgMsg="imgMsg"
                                   :animation=true
                                   :width="50"
                                   :height="50"
                                   :imgList.sync="scope.row.imgList"
                                   :max="1"
                                   :ismultiple="true"
                                   delMode="longtap"
                                   :longTapTime="longTapTime"
                                   class="imagePicker_fix"
                  >
                  </nut-imagepicker>
                </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="整改部门"
                width="100"
            >
              <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="primary"
                    v-if="!scope.row.department&&status==1"
                    @click="toChoose(2,true, fixSectionObj,scope.$index)">选择</el-button>
                <a @click="toChoose(2,true, fixSectionObj,scope.$index)" v-if="status==1&&scope.row.department" class="border_fix"><span>{{ scope.row.department }}</span></a>
                <span v-if="scope.row.department&&status!=1">{{ scope.row.department }}</span>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="负责人"
                width="100"
            >
              <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="primary"
                    v-if="!scope.row.username&&status==1"
                    @click="toChoose(3,true, fixPeopleObj,scope.$index)">选择</el-button>
                <a @click="toChoose(3,true, fixPeopleObj,scope.$index)" v-if="status==1&&scope.row.username" class="border_fix"><span>{{ scope.row.username }}</span></a>
                <span v-if="scope.row.username&&status!=1">{{ scope.row.username }}</span>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="计划完成时间"
                width="260"
            >
              <template slot-scope="scope">
                <el-date-picker v-if="status==1"
                                class="calendar"
                                v-model="scope.row.planCompletionTime"
                                value-format="yyyy-MM-dd"
                                type="date"
                                placeholder="选择日期">
                </el-date-picker>
                <span class="info" v-if="status>=2">{{ scope.row.planCompletionTime.substr(5,10) }}</span>
              </template>
            </el-table-column>
            <el-table-column
                v-if="(status==3&&beginRectification)||(status==4)"
                align="center"
                label="整改完成时间"
                width="260"
            >
              <template slot-scope="scope">
                <el-date-picker v-if="beginRectification&&!pathsended"
                                class="calendar"
                                v-model="scope.row.time"
                                value-format="yyyy-MM-dd"
                                type="date"
                                placeholder="选择日期">
                </el-date-picker>
                <span class="info" v-if="status==4||(status==3&&pathsended)">{{ scope.row.time.substr(5,10) }}</span>
              </template>
            </el-table-column>
            <el-table-column
                v-if="(status==3&&beginRectification)||beginRectification||(status==4)"
                align="center"
                label="整改结果"
                width="200"
            >
              <template slot-scope="scope">
                <el-input type="input" v-model="scope.row.result" v-if="status==3&&isRectification&&!pathsended"></el-input>
                <span v-if="!(status==3&&isRectification&&!pathsended)">{{ scope.row.result }}</span>
              </template>
            </el-table-column>
            <el-table-column
                v-if="(status==3&&beginRectification)||beginRectification||(status==4)"
                align="center"
                label="整改结果附件"
            >
              <template slot-scope="scope">
                <div @click="removePopstate"><vue-preview v-if="(pathsended&&(status!=1))||status==4" :slides="scope.row.thumbsList_last" class="imgPrev_fix" @close="addPopstate"></vue-preview></div>
                <div @click="getFixImgIndex(scope.$index,1)">
                  <nut-imagepicker v-if="beginRectification&&!pathsended"
                                   v-loading.fullscreen.lock="fullscreenLoading"
                                   @imgMsg="imgMsg"
                                   :animation=true
                                   :width="50"
                                   :height="50"
                                   :imgList.sync="scope.row.imgList"
                                   :max="1"
                                   :ismultiple="true"
                                   delMode="longtap"
                                   :longTapTime="longTapTime"
                                   class="imagePicker_fix"
                  >
                  </nut-imagepicker>
                </div>
              </template>
            </el-table-column>
            <el-table-column
                v-if="(status==3&&beginRectification)||beginRectification||(status==4)"
                align="center"
                label="负责人确认"
                width="70">
              <template slot-scope="scope">
                <div class="danger_confirm_icon">
                  <a @click="fixTableChangeStatus(scope.$index)">
                    <img src="./images/u4863.svg" v-if="!scope.row.isConfirm">
                    <img src="./images/u4863_selected.svg" v-if="scope.row.isConfirm">
                  </a>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <img v-if="status==1" @click="expandFixTable" class="expand_icon_fix"  src="./images/u4821.svg">
<!--          <li><p><span class="title">整改部门&nbsp;:&nbsp;</span><el-input v-model="fixSection" type="input" class="edit_box box03" disabled></el-input><button class="choose" @click="toChoose(2,true, fixSectionObj)">选择部门</button></p></li>-->
<!--          <li><p><span class="title">负责人&nbsp;:&nbsp;</span><el-input v-model="fixPeople" type="input" class="edit_box box03 vip3" disabled></el-input><button class="choose" @click="toChoose(3,true, fixPeopleObj)">选择负责人</button></p></li>-->
<!--        </div>-->

<!--        <div class="fix_box" v-if="((((status==3||status==4)&&(roleId==0))||(status==4&&roleId==1)||(this.isRectification))&&(status<5))&&(typeId==1)">-->
<!--          <li><p><span class="title">整改部门&nbsp;:&nbsp;</span><span>{{ fixSection }}</span><span class="title leader">负责人&nbsp;:&nbsp;</span><span>{{ fixPeople }}</span></p></li>-->
<!--          <li v-if="status!=3||this.beginRectification"><p><span class="title">整改时间&nbsp;:&nbsp;</span>-->
<!--            <el-date-picker v-if="this.isRectification&&status!=4"-->
<!--                            class="calendar"-->
<!--                            v-model="fixTime"-->
<!--                            value-format="yyyy-MM-dd"-->
<!--                            type="date"-->
<!--                            placeholder="选择日期">-->
<!--            </el-date-picker><span v-if="(!this.beginRectification&&typeId==1)||status==4" class="info">{{ fixTime }}</span></p></li>-->
<!--          <li v-if="this.beginRectification||(roleId==0&&status==3)||status==4"><p><span class="title">整改结果&nbsp;:&nbsp;</span><el-input v-model="fixResult" type="textarea" :rows="3" resize="none" maxlength="500" v-if="this.isRectification&&status!=4" class="edit_box box01"></el-input><span v-if="(!this.beginRectification&&typeId==1)||status==4" class="info">{{ fixResult }}</span></p></li>-->
<!--        -->
        </div>



      </ul>
<!--      所属部门-->
      <p v-if="(typeId==2||typeId==5)&&roleId==1&&((!this.isConfirm)&&(this.recordType==3))||(typeId==3&&roleId==1&&status<=1)"><span class="title">所属部门&nbsp;:&nbsp;</span><span>{{ section }}</span></p>

<!--      作废理由-->
      <p v-if="(status==5&&typeId==1)||(status==3&&typeId!=1&&typeId!=6)||(typeId==6&&status==4)"><span class="title">作废理由&nbsp;:&nbsp;</span><span>{{ reason }}</span></p>
<!--      签名-->
      <div class="signature_box" v-if="(((roleId==1)&&(status==0)&&(recordType==3)||(dangerPeoType==3))&&(!isConfirm)&&(recordType!=5)&&(typeId!=6))||(isRectification==1&&status==3&&!pathsended)&&(typeId!=6)">
        <title-bar class="titleBar" :title="'电子签名'"></title-bar>
        <el-button @click="drawer = true"  class="drawerBtn">
          <p>点击进入签名</p>
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

<!--      底部按钮-->
      <div class="bottom_button"
           v-loading.fullscreen.lock="fullscreenLoading">
        <button :class="(bottomButtonColor) ? 'green' : 'gray'" @click="changeTaskStatus">{{ bottomButtonText[typeId][status] }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import header from "@/views/Security/subcomponents/header";
import titleBar from "@/views/Security/subcomponents/titleBar";
import axios from "axios";
import {dataUrlToBlob, blobToFile, compress} from '@/utils/common';
import record from "@/views/Security/record";
import {Message} from "element-ui";
import store from "@/store";


export default {
  data(){
    return{
      //用户
      wxtoken: "",
      user:{
        id: 4,
      },
      //签名框弹出控锁
      drawer: false,
      //安全电子报表的表ID
      taskValue: '',
      //对应上述ID的表名
      taskValueStr: '',
      //安全电子报表：任务单，下拉框容器
      taskOptions: [],
      // switchValue: false,
      //相关时间显示控制
      isVisible: false,
      isVisible2: false,
      isVisible3: false,
      isVisible4: false,
      isVisible5: false,
      isVisible6: false,
      isVisible7: false,
      //相关时间数据容器
      date: null,
      dateWeek: null,
      date1: ['2018-12-22', '2019-01-08'],
      datetime: '2018-11-02 11:08',
      datetime2: '2018-11-02 11:08',
      datetime3: '2018-11-02 11:08',
      //签发人按钮，判断签发人是否签名
      isDangerSign: false,
      //整改表数据
      fixTableData: [],
      //普通表数据：电子报表、基础防护措施
      tableData: [],
      //普通报表上传对象
      tableDataObj: {},
      //危险作业的额外基础防护措施表数据
      tableData2: [],
      //额外防护措施表上传对象
      addTableDataObj: {},
      //preview附件查看数据表
      thumbsList: [],
      //附件上传组件
      longTapTime: 1000,//长按时间
      imgList: [],//拾取数据
      imgReceipt: [],//上传收集
      //各状态码
      titleBarId: '',//导航栏
      front: this.$route.query.front,//上一页数据
      itemId: '', // 该详情的工单ID
      typeId: '', // 模块
      roleId: '', // 用户类型 0为创建者 1为参与者
      status: '', // 任务状态
      recordType: '',//记录入口类型
      oldStatus: '',//任务的旧状态
      forwardStep: 1,//状态前进数
      beginRectification: false,//是否开始整改
      elecTabPageType: 2,//电子报表页面类型 0为班前五分钟和每周你我他 1为安全，消防，卫生 2为非报表
      reportFormId: 1,//电子报表表id
      formType: 0,//电子报表表类型 1为每周你我他和班前五分钟 2为消防 3是卫生 4安全月度 5安全生产 6安全运行日巡检
      isConfirm: false,//该用户是否签名确认
      idInTask: null,//该用户在任务中的id
      isRectification: false,//该用户是否为整改负责人
      dangerPeoType: null,//1为执行者2为签发人3为解除人
      pathsended: null,//签名是否已经完成（这里针对双签机制）

      //输入输出数据承载
      taskName: '',//工单主题/名称
      taskContent: '公司大楼、供水厂四至周围、厂区、宿舍、安全保卫、危化品、岗位安全、生产车间、电气设备、重大危险源、重点安全岗位、机械设备、车辆、施工工地、仓库、消防、环境卫生、用电、饭堂、丹灶加压泵站、管网',
      otherTaskContent: '',//安全检查：其他
      taskTime: "",//工单时间
      taskPlace: "",//工单地址
      timeLeft: '',//时间左按钮
      timeRight: '',//时间右按钮
      taskExtra: ["",""],//工单额外信息
      taskVip: "",//工单关键人物
      vipObj: '',//关键人物对象
      taskSign: "",//工单签发者
      taskSignObj: "",//工单签发者对象
      taskRemove: "",//工单解除者
      taskMember: "",//工单参与者
      choseMemberList: [],//参与者列表
      confirmMember: "",//工单已确认人员
      taskCondition: '',//工单相关情况
      taskRecord: '',//工单相关记录
      fixSection: "",//整改部门
      fixSectionObj: {},//整改部门对象
      fixPeople: "",//整改负责人
      fixPeopleObj: "",//整改负责人对象
      fixTime: "",//整改时间
      fixResult: "待上传",//整改结果
      section: "",//工单所属部门
      reason: "",//工单作废理由
      signData: '',//签名数据
      // elecType: '',//
      userList: [],//工单用户列表
      taskPerform: '',//工单执行人
      taskPerformObj: '',//执行人对象
      dangerMemberList: [],//危险作业参与者列表
      imgLink: '',//环节图，当前选取环节
      imgFixIndex: '',//当前选取整改行
      imgFixType: '',//当前选取整改类型 0为检查情况附件 1为整改结果附件
      headerList: [],//电子报表负责人id列表
      //底部按钮的灰绿色转换开关 1是绿色 2是灰色
      bottomButtonColor: 1,
      // //危险作业时间开关
      // dangerTimerSwitch: 0,
      spanArr: [],//电子报表，安全措施合并单元格数组
      responsibleSpanArr: [],//电子报表负责人合并单元格数组
      fullscreenLoading: false,//全屏缓冲
      intervalId: null,//定时器
      clearExtra: null,//安全巡检 的 班次/周数
      //数据仓库
      name: {
        1: ["任务名称",""],
        2: ["培训内容",""],
        3: ["演练内容",""],
        4: ["会议主题","巡检任务"],
        5: ["会议主题",""],
        6: ["任务名称",""]
      },
      member: {
        1: ["检查组","协助人"],
        2: ["培训","成员"],
        3: ["参会","参会人"],
        4: ["参会","参会人"],
        5: ["参会","参会人"],
        6: ["工作","执行人"]
      },
      place: {
        1: "",
        2: "培训",
        3: "演练",
        4: "会议",
        5: "会议",
        6: "工作"
      },
      time: {
        1: ["",""],
        2: ["培训时间",""],
        3: ["演练时间",""],
        4: ["会议时间","巡检日期"],
        5: ["会议时间",""],
        6: ["计划工作时间",""]
      },
      vip: {
        1: ["",""],
        2: ["培训老师",""],
        3: ["",""],
        4: ["班（组）长","","巡检人","巡检人"],
        5: ["主持人","主持人"],
        6: ["工作监护人",""]
      },
      content: {
        1: "检查任务",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "工作内容"
      },
      extra:{
        1: ["",""],
        2: ["培训费用","课时"],
        3: ["",""],
        4: ["班组名称",""],
        5: ["",""],
        6: ["部门","班组"],
      },
      bottomButtonText:{
        1: ["开始检查","结束检查","发送整改任务","整改中","已完结","已作废","被移除"],

        2: ["培训结束","完成活动","已完结","已作废",,,"被移除"],

        3: ["演练结束","完成活动","已完结","已作废",,,"被移除"],

        4: ["任务指派","报表提交","已完结","已作废",,,"被移除"],

        5: ["会议结束","完成活动","已完结","已作废",,,"被移除"],

        6: ["资料录入","资料录入","待解除","已完结","已作废",,"被移除"],
      },
      condition: {
        1: "检查情况",
        2: "完成情况",
        3: "演练总结",
        4: "备注",
        5: "会议记录",
        6: "完成情况"
      },
      invalidStep: {
        1: 5,
        2: 3,
        3: 3,
        4: 3,
        5: 3,
        6: 4
      },
      url: {
        1: process.env.VUE_APP_URL +"/waterOperation/app/appTbSafetyCheck/info",
        2: process.env.VUE_APP_URL +"/waterOperation/app/tbSafetyTrain/info",
        3: process.env.VUE_APP_URL +"/waterOperation/app/tbSafetySkits/info",
        4: process.env.VUE_APP_URL +"/waterOperation/app/appTbElectronicReport/info",
        5: process.env.VUE_APP_URL +"/waterOperation/app/tbSafetyMeeting/info",
        6: process.env.VUE_APP_URL +"/waterOperation/app/appTbDangerousTask/info"
      },
      dataStr: {
        1: "safetyMeetingVo",
        2: "safetyTrainVo",
        3: "tbSafetySkits",
        4: "electronicReportVo",
        5: "safetyMeetingVo",
        6: "appTbDangerousTask"
      },
      updateUrl: {
        1: process.env.VUE_APP_URL +"/waterOperation/app/appTbSafetyCheck/save",
        2: process.env.VUE_APP_URL +"/waterOperation/app/tbSafetyTrain/save",
        3: process.env.VUE_APP_URL +"/waterOperation/app/tbSafetySkits/saveOrUpdate",
        4: process.env.VUE_APP_URL +"/waterOperation/app/appTbElectronicReport/save",
        5: process.env.VUE_APP_URL +"/waterOperation/app/tbSafetyMeeting/saveOrUpdate",
        6: process.env.VUE_APP_URL +"/waterOperation/app/appTbDangerousTask/save"
      },
      signUrl:{
        1: process.env.VUE_APP_URL +"/waterOperation/app/appTbSafetyCheck/sign",
        2: process.env.VUE_APP_URL +"/waterOperation/app/tbSafetyTrain/sign",
        3: process.env.VUE_APP_URL +"/waterOperation/app/tbSafetySkits/sign",
        4: process.env.VUE_APP_URL +"/waterOperation/app/appTbElectronicReport/sign",
        5: process.env.VUE_APP_URL +"/waterOperation/app/tbSafetyMeeting/sign",
        6: process.env.VUE_APP_URL +"/waterOperation/app/appTbDangerousTask/sign"
      },
      clearExtraOptions: [{
        label: '零时班',
        value: 1
      }, {
        label: '日班',
        value: 2
      }, {
        label: '夜班',
        value: 3
      }],
      weekExtra: null,
      hiddenLevelOptions: [{
        label: '一般',
        value: '一般'
      },{
        label: '较大',
        value: '较大'
      },{
        label: '重大',
        value: '重大'
      }],
      hiddenTypeOptions: [{
        label: '现场类',
        value: '现场类'
      },{
        label: '基础类',
        value: '基础类'
      },],
      weekExtraOptions: [{
        label: '第一周',
        value: 1
      }, {
        label: '第二周',
        value: 2
      }, {
        label: '第三周',
        value: 3
      }, {
        label: '第四周',
        value: 4
      }, {
        label: '第五周',
        value: 5
      }],
      teamOptions: [
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
    }
  },
  mounted() {
  },
  created() {
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
    //初始化
    this.init()
    // this.webSocket()
    //拿缓存
    this.getSessionStorage()
    //从选人取回数据
    this.getcheckListStr(this.$route.query.chooseId,this.$route.query.tableIndex)
  },
  destroyed() {
  },
  methods: {
    //监听物理返回
    addPopstate(){
      this.$refs.back.popstateLock = 0
    },
    //移除物理返回监听
    removePopstate(){
      this.$refs.back.popstateLock = 1
    },
    webSocket(){
      let params = {
        itemId: this.itemId,
        pageId: this.typeId,
      }
        if ("WebSocket" in window)
        {
          // 打开一个 web socket
          var ws = new WebSocket('ws://shuichang.xinglian.info/waterOperation/websocket/' + JSON.stringify(params));


          ws.onmessage = function (evt)
          {
            var received_msg = evt.data;
            if (received_msg){
              this.getDetail()
            }
            alert('接受')
          };
        }

        else
        {
          // 浏览器不支持 WebSocket
          alert("您的浏览器不支持 WebSocket!");
        }
    },
    //初始化
    init(){
      //如果不是安全检查模块将任务内容置空
      if (this.typeId != 1)
        this.inputTaskContent = ''
      //从缓存中获取用户的相关信息和模块辨别码
      this.wxtoken = sessionStorage.getItem('wxtoken')
      this.user.id = parseInt(sessionStorage.getItem('userId'))
      this.typeId = sessionStorage.getItem('typeId')
      axios.get(process.env.VUE_APP_URL+'/waterOperation/app/apptbuserinfo/info/'+this.user.id).then(result => {
        this.user.username = result.data.appTbUserInfo.username
      })
      //如果路由中有status，那么这个是通过通知选择卡进入的，设置好该有的参数
     if(this.$route.query.status){
        this.typeId = this.$route.query.status.toString()//从卡片中拿到工单状态
        this.itemId = this.$route.query.id//工单id
        this.titleBarId = '12'//导航栏显示任务详情
        this.recordType = '5'//从提醒记录入口进入
        //前一页的数据
        this.front = {
          typeId : this.$route.query.status.toString(),
          titleBarId: '25',
          recordType: '5',
        }
        //如果卡片参数携带isSign为1时，将改变记录入口为签名入口
        if (this.$route.query.isSign == 1){
          this.recordType = '3'
          this.front.recordType = '3'
        }
        //缓存路由和模块辨识码
        let remindRouter = {
          front: this.front,
          itemid: this.itemId,
          id: 12,
          userId: this.user.id
        }
        sessionStorage.setItem("typeId",this.typeId)
        sessionStorage.setItem("router",JSON.stringify(remindRouter))
      }else {
       //如果是刷新或者弹窗等等不正常操作回到详情页面，获取缓存
       let routerSession = JSON.parse(sessionStorage.getItem('router'))
       if (routerSession) {
         //缓存存在，且有上一页数据
         if (routerSession.front) {
           this.front = routerSession.front
           this.titleBarId = routerSession.titleId
           this.itemId = routerSession.id
           this.recordType = routerSession.front.recordType
           try {
             this.dangerPeoType = JSON.parse(routerSession.front).dangerPeoType
           }catch (e) {

           }
         } else {
           //缓存存在，但没有上一页数据
           this.typeId = routerSession.typeId
           this.roleId = routerSession.roleId
           this.status = routerSession.status
           this.recordType = routerSession.recordType
           this.titleBarId = 12
           this.itemId = routerSession.id
           this.dangerPeoType = routerSession.dangerPeoType
           this.front = {
             typeId: routerSession.typeId,
             titleBarId: routerSession.titleBarId,
             roleId: routerSession.roleId,
             status: routerSession.status,
             dangerPeoType: routerSession.dangerPeoType
           }
         }
       } else {
         //缓存不存在，则通过路由去拿各种判别码
         //如果路由中有上一页的信息
         if (this.$route.query.front) {
           this.front = JSON.parse(this.$route.query.front)
           this.titleBarId = this.$route.query.titleId
           this.typeId = this.front.typeId
           this.itemId = this.$route.query.id
           this.recordType = this.front.recordType
           this.dangerPeoType = this.front.dangerPeoType
           //如果路由中有记录入口
         } else if (this.$route.query.recordType){
           this.typeId = this.$route.query.typeId
           this.roleId = this.$route.query.roleId
           this.status = this.$route.query.status
           this.titleBarId = '12'
           this.dangerPeoType = this.$route.query.dangerPeoType
           this.front = {
             typeId: this.$route.query.typeId,
             titleBarId: this.$route.query.titleBarId,
             recordType: this.$route.query.recordType,
             roleId: this.$route.query.roleId,
             status: this.$route.query.status,
             dangerPeoType: this.$route.query.dangerPeoType
           }
           this.recordType = this.query.recordType
           this.itemId = this.$route.query.id
         }
       }
      //把路由信息缓存起来
       sessionStorage.setItem("router", JSON.stringify(this.$route.query))
     }
    },
    initSignBox(){
    },
    // dataRefreh(){
    //   if (this.intervalId != null) {
    //     return;
    //   }
    //   // 计时器为空，操作
    //   this.intervalId = setInterval(() => {
    //         axios.get(this.url[this.typeId]+"/"+this.itemId ).then(result => {
    //           let editList = JSON.parse(sessionStorage.getItem('edit'+this.user.id+this.itemId));
    //           try {
    //             if (result.data[``+this.dataStr[this.typeId]].status != editList.status){
    //               sessionStorage.removeItem('edit'+this.user.id+this.itemId)
    //               location.reload()
    //             }
    //           }catch (e){
    //
    //           }
    //           var confirmStr = '';
    //           var confirmArr = [];
    //           for (var i=0;i<result.data[``+this.dataStr[this.typeId]].userList.length;i++) {
    //             try {
    //               if (result.data[``+this.dataStr[this.typeId]].userList[i].isConfirm)
    //
    //                 confirmArr.push(result.data[``+this.dataStr[this.typeId]].userList[i].comment)
    //             }catch (e){
    //
    //             }
    //           }
    //           confirmStr = confirmArr.join(',')
    //           this.confirmMember = confirmStr
    //         }) //加载数据函数
    //   }, 1000);
    // },
    // // 停止定时器
    // stopRefreh() {
    //   clearInterval(this.intervalId); //清除计时器
    //   this.intervalId = null; //设置为null
    // },

    //获取工单详情
    getDetail(){
      let userId = this.user.id
      function compareId(user){
        return user.attendUserId == userId
      }
      axios.get(this.url[this.typeId]+"/"+this.itemId ).then(result => {
        if (result.data.code === 0) {
          //得到工单数据
          let detail = result.data[``+this.dataStr[this.typeId]]
          //判断角色roleId
          if (detail.createUserId == this.user.id) {
            this.roleId = 0//为创建者
            if (this.recordType == 3)
              this.roleId = 1//签名的时候是参与者
          } else {
            this.roleId = 1//参与者
          }
          if (this.dangerPeoType == 1 || this.dangerPeoType == 3){
            this.roleId = 1//危险作业解除者和执行者均为参与者
          }
          //工单状态码获取
          this.status = detail.status
          if (this.recordType == 3) {
            //签名的时候，同时赋值到旧状态，避免状态被改变
            this.oldStatus = this.status
            //签名的状态都为0
            this.status = 0
          }
          //参与者列表
          this.userList = detail.userList
          //是否已经签名确认以及提取该用户在该工单中的工作ID
          try {
            if (this.typeId==6){
              this.isConfirm = detail.userList.find((user) => user.type == this.dangerPeoType).isConfirm
              this.idInTask = detail.userList.find((user) => user.type == this.dangerPeoType).id
            }else {
              this.isConfirm = detail.userList.find(compareId).isConfirm
              this.idInTask = detail.userList.find(compareId).id
            }
          }catch (event){
            console.log("没有成员")
          }
          //安全电子报表任务类型判别
          if (this.typeId==4) {
            this.elecTabPageType = detail.type//报表类型
            this.reportFormId = detail.reportFormId//报表id
            this.tableData = detail.stepList//插入数据容器
            for (var i = 0; i < this.tableData.length; i ++){
              //插入index用于合并
              this.tableData[i].index = i+1
              //插入username准备负责人的选取
              if (!this.tableData[i].username){
                this.tableData[i].username = null
              }
            }
            //进行第一列合并
            this.getSpanArr(this.tableData);
            //报表类型（有两种类型编码）
            this.formType = detail.formType
            //卫生表中headlist存在时，获取headlist
            if (detail.headList)
              this.headerList = detail.headList
            else
              this.headerList = []
            //如果是卫生表，进行负责人列合并
            if (this.formType == 3){
              this.getResponsibleSpanArr(this.tableData)
            }
          }
          if (this.typeId==1){
            //整改情况表，获取附件preview数据列
            detail.situationList.forEach((item1) => {
              item1.thumbsList_front = []
              item1.thumbsList_last = []
              item1.fileList.forEach((item2, index) => {
                item2.w = 600;   //设置以大图浏览时的宽度
                item2.h = 400;     //设置以大图浏览时的高度
                item2.src = process.env.VUE_APP_FILEURL + item2.comment;  //大图
                item2.msrc = process.env.VUE_APP_FILEURL + item2.comment;  //小图
                item2.alt = 'picture' + (index + 1);
                item2.title = '附件' + (index + 1);
                if (item2.type == 0){
                  //检查情况附件
                  item1.thumbsList_front.push(item2)
                }else{
                  //整改结果附件
                  item1.thumbsList_last.push(item2)
                }
              })
            })
            //是否为整改者
            try {
              this.userList.forEach(item => {
                if (item.attendUserId == userId){
                  if (this.isRectification){//如果本身是整改者又是创建者
                    if (this.isRectification < item.isRectification) {
                      this.isRectification = item.isRectification
                      this.isConfirm = item.isConfirm
                      this.idInTask = item.id
                    }
                  }else{
                    this.isRectification = item.isRectification
                    this.isConfirm = item.isConfirm
                    this.idInTask = item.id
                  }
                }
              })
            }catch (event){
              console.log("没有成员")
            }
            if (this.isRectification==1) {//整改者只获取自己的整改任务行
              detail.situationList.forEach( item => {
                if (item.userId == this.user.id){
                  this.fixTableData.push(item)
                  console.log(this.fixTableData)
                }
              })
            }else {
              this.fixTableData = detail.situationList//创建者能看到整个整改表
            }
            this.fixTableDataAll = detail.situationList//整个整改表
            //其他
            this.otherTaskContent = detail.other//安全检查：其他
            //整改结果
            this.fixResult = detail.rectificationResult
            //整改部门

            //整改状态
            this.beginRectification = detail.begin
            //整改时间
            this.fixTime = detail.rectificationDate
          }
          //通过任务状态改变布局
          this.getSecondStatus()
          //任务名称或者会议主题
          if (this.typeId!=4)
            this.taskName = detail.name||detail.content||detail.topic
          if (this.typeId==4)
            this.taskName = detail.parentName
          //任务内容
          if (this.typeId==1||this.typeId==6)
            this.taskContent = detail.task||detail.jobContent
          //参会成员
          //已确定成员
          //整改负责人
          if (this.typeId==1) {
            this.userList.forEach(item => {
              if (item.isRectification == 0) {
                this.choseMemberList.push(item)
              }
            })
          }else{
            this.userList.forEach(item => {
              if (item.attendUserId != detail.createUserId){
                this.choseMemberList.push(item)
              }
            })
          }
          var attendStr = '';
          var confirmStr = '';
          var attendArr = [];
          var confirmArr = [];
          for (var i=0;i<this.choseMemberList.length;i++){
            if (this.choseMemberList[i].isConfirm)
              confirmArr.push(this.choseMemberList[i].comment)
            if (this.choseMemberList[i].isRectification) {
              this.fixPeople = this.choseMemberList[i].comment
            }else{
              if (this.choseMemberList[i])
                attendArr.push(this.choseMemberList[i].comment)
            }
          }
          attendStr = attendArr.join(',')
          confirmStr = confirmArr.join(',')
          this.taskMember = attendStr
          this.confirmMember = confirmStr
          //相关情况
          if (this.status!=1)
            this.taskCondition = detail.completion||detail.checkSituation||detail.remark
          //会议记录
          if (this.typeId==5)
            this.taskRecord = detail.record
          //附件图片
            detail.fileList.forEach((item, index) => {
                  item.w = 600;   //设置以大图浏览时的宽度
                  item.h = 400;     //设置以大图浏览时的高度
                  item.src = process.env.VUE_APP_FILEURL + item.comment;  //大图
                  item.msrc = process.env.VUE_APP_FILEURL + item.comment;  //小图
                  item.alt = 'picture' + (index + 1);
                  item.title = '附件' + (index + 1);
                })
            if (this.typeId==4&&this.reportFormId==2){
              detail.fileList.forEach((item) => {
                if (!this.thumbsList[item.link])
                  this.thumbsList[item.link] = []
                  this.thumbsList[item.link].push(item)
              })
            }else {
              this.thumbsList = detail.fileList
            }
          //作废理由
          this.reason = detail.invalidReason
          //相关时间
          // if (this.typeId==2) {
          //   this.taskTime = detail.date+" 至 "+detail.endDate
          //   this.date1[0] = detail.startDate
          //   this.date1[1] = detail.endDate
          // }
          // if (this.typeId==3||this.typeId==5) {
          //   this.timeLeft = detail.startTime.substr(0,detail.startTime.length-3)
          //   this.timeRight = detail.endTime.substr(0,detail.endTime.length-3)
          //   this.taskTime = detail.date
          // }
          // if (this.typeId==4)
          //   this.taskTime = detail.date
          // if (this.typeId==6) {
          //   this.datetime = detail.planStartTime.substr(0,detail.planStartTime.length-3)
          //   this.datetime2 = detail.planEndTime.substr(0,detail.planStartTime.length-3)
          //   try {
          //     this.datetime3 = detail.workEndTime.substr(0,detail.planStartTime.length-3)
          //   }catch (e) {
          //
          //   }
          // }
          if (this.typeId!=1&&this.typeId!=6){
            this.taskTime = detail.date
          }
          //额外信息框
          if (this.typeId!=6)
            this.taskExtra[0] = detail.cost
          if (this.typeId==4)
            this.taskExtra[0] = detail.team
          if (this.typeId==6)
            this.taskExtra[0] = detail.department
            this.taskExtra[1] = detail.classHour || detail.team
          //任务地点
          this.taskPlace = detail.location || detail.workplace
          //关键人物
          if (this.typeId!=4){
            this.taskVip = detail.trainTeacher||detail.presenterUser||detail.createUser
            if (this.typeId==5) {
              this.taskVip = detail.userList.find((user) => user.isHost == 1).comment
            }
            if (this.typeId==6) {
              axios.get(process.env.VUE_APP_URL+'/waterOperation/app/apptbuserinfo/info/'+detail.createUserId).then(result => {
                this.taskVip = result.data.appTbUserInfo.username
              })
            }
          }

          if (this.typeId==4)
              this.taskVip = detail.createUser

          //所属部门
          if (this.typeId == 2)
            this.section = detail.department

          if (this.typeId==6){
            this.dangerMemberList = []
            for (var i = 0; i < detail.userList.length; i ++){
              if (detail.userList[i].type==0) {
                //工仔
                this.dangerMemberList.push(detail.userList[i])
              }
              if (detail.userList[i].type==1) {
                //执行人
                this.taskPerform = detail.userList[i].comment
                this.taskPerformObj = detail.userList[i]
              }
              if (detail.userList[i].type==2) {
                //签发人
                this.taskSign = detail.userList[i].comment
                this.taskSignObj = detail.userList[i]
                //签发按钮
                if (detail.userList[i].isConfirm)
                  this.isDangerSign = 1
              }
              if (detail.userList[i].type==3)
                this.taskRemove = detail.userList[i].comment
            }
            //基本防护措施
            this.tableData = detail.baseStepList
            //补充防护措施
            this.tableData2 = detail.addStepList
            try {
              this.tableData2.forEach((item) => {
                item.lock = true
              })
            }catch (e) {
              console.log("没有补充")
            }
          }
          //安全电子报表
          if (this.typeId==4){
            this.tableData = detail.stepList
            for (var i = 0; i < this.tableData.length; i ++){
              this.tableData[i].index = i+1
            }
            this.getSpanArr(this.tableData);
            if (this.formType == 3){
              if (this.roleId==1){
                var displayId = []
                var newTableData = []
                this.headerList.forEach(fixer => {
                  if(fixer.userId == this.user.id) {
                    displayId.push(fixer.id)
                  }
                })
                console.log(displayId)
                displayId.forEach(displayer => {
                  this.tableData.forEach(item => {
                    if (item.id == displayer) {
                      newTableData.push(item)
                    }
                  })
                })
                this.tableData = newTableData
              }
              this.getResponsibleSpanArr(this.tableData)
            }
            //设置下拉框默认值
            this.taskValue = detail.reportFormId
            this.taskValueStr = detail.childName
            try {
              this.clearExtra = detail.num
              this.weekExtra = detail.num
            }catch (e) {

            }
            //下拉框
            axios.get(process.env.VUE_APP_URL +"/waterOperation/app/appTbElectronicReportForm/combo", {
              params: {}
            }).then(result => {
              if (result.data.code === 0) {
                if (this.reportFormId>3&&this.reportFormId<=10) {
                  for (var i = 0; i < result.data.list[2].childList.length; i++) {
                    let obj = {};
                    obj.value = result.data.list[2].childList[i].id;
                    obj.label = result.data.list[2].childList[i].name;
                    this.taskOptions.push(obj);
                  }
                }else if (this.reportFormId>11&&this.reportFormId<=18){
                  for (var i = 0; i < result.data.list[3].childList.length; i++) {
                    let obj = {};
                    obj.value = result.data.list[3].childList[i].id;
                    obj.label = result.data.list[3].childList[i].name;
                    this.taskOptions.push(obj);
                  }
                }else if (this.reportFormId>19){
                  for (var i = 0; i < result.data.list[4].childList.length; i++) {
                    let obj = {};
                    obj.value = result.data.list[4].childList[i].id;
                    obj.label = result.data.list[4].childList[i].name;
                    this.taskOptions.push(obj);
                  }
                }
                console.log("数据获取成功")
              } else {
                console.log("数据获取失败")
              }
            })
          }
          console.log("数据获取成功")
        }else{
          console.log("数据获取失败")
        }
      })
    },
    //根据typeId模块识别和status工单状态以及用户的角色roleId把工单的按钮颜色，文本和锁等进行动态更改
    getSecondStatus(){
      switch (this.typeId){
        case '1':
            switch (this.status){
              case 0:
                  if (this.roleId == 1) {
                    if ((!this.isConfirm)&&(this.recordType==3)) {
                      this.bottomButtonText[this.typeId][this.status] = "确认签名"
                      this.forwardStep = 0
                    } else {
                      this.bottomButtonText[this.typeId][this.status] = "待开始"
                      this.bottomButtonColor = 0
                    }
                  }
                  break;
              case 1:
                  if (this.roleId == 1){
                    this.bottomButtonText[this.typeId][this.status] = "已开始"
                    this.bottomButtonColor = 0
                  }
                  break;
              case 2:
                  if (this.roleId == 1){
                    this.bottomButtonText[this.typeId][this.status] = "整改中"
                    this.bottomButtonColor = 0
                  }
                  break;
              case 3:
                  this.bottomButtonColor = 0
                  if (this.roleId == 1){
                    this.bottomButtonText[this.typeId][this.status] = "整改中"
                    if (this.isRectification && !this.beginRectification){
                      this.bottomButtonText[this.typeId][this.status] = "开始整改"
                      this.bottomButtonColor = 1
                      this.forwardStep = 0
                    }
                    if (this.isRectification && this.beginRectification){
                      this.bottomButtonText[this.typeId][this.status] = "结束整改"
                      this.bottomButtonColor = 1
                      if (this.fixTableData[0].path){
                        this.bottomButtonText[this.typeId][this.status] = "整改中"
                        this.bottomButtonColor = 0
                        this.pathsended = true
                      }
                    }
                  }
                  break
              case 4:
                  this.bottomButtonColor = 0;
                  break;
              case 5:
                  this.bottomButtonColor = 0;
                  break;
              case 6:
                  this.bottomButtonColor = 0;
                  break;
            }
            break;
        case '2':
            switch (this.status){
              case 0:
                  if (this.roleId == 1){
                    if ((!this.isConfirm)&&(this.recordType == 3)){
                      this.bottomButtonText[this.typeId][this.status] = "确认签名"
                    } else {
                      this.bottomButtonText[this.typeId][this.status] = "待开始"
                      this.bottomButtonColor = 0
                    }
                  }
                  break;
              case 1:
                  if (this.roleId == 1){
                    this.bottomButtonText[this.typeId][this.status] = "已开始"
                    this.bottomButtonColor = 0
                  }
                  break;
              case 2:
                  this.bottomButtonColor = 0
                  break;
              case 3:
                  this.bottomButtonColor = 0
                  break;
              case 6:
                  this.bottomButtonColor = 0
                  break;
            }
            break;
        case '3':
          switch (this.status){
            case 0:
              if (this.roleId == 1){
                if ((!this.isConfirm)&&(this.recordType==3)){
                  this.bottomButtonText[this.typeId][this.status] = "确认签名"
                } else {
                  this.bottomButtonText[this.typeId][this.status] = "待开始"
                  this.bottomButtonColor = 0;
                }
              }
              break;
            case 1:
              if (this.roleId == 1){
                this.bottomButtonText[this.typeId][this.status] = "已开始"
                this.bottomButtonColor = 0
              }
              break;
            case 2:
              this.bottomButtonColor = 0
              break;
            case 3:
              this.bottomButtonColor = 0
              break;
            case 6:
              this.bottomButtonColor = 0
              break;
            }
            break;
        case '4':
          if(this.formType==3)
            this.forwardStep = -1;
          else
            this.forwardStep = 0
          switch (this.status){
            case 0:
              if (this.roleId==1){
                if ((!this.isConfirm)&&(this.recordType==3)){
                  this.bottomButtonText[this.typeId][this.status] = "确认签名"
                } else {
                  this.bottomButtonText[this.typeId][this.status] = "待开始"
                  this.bottomButtonColor = 0;
                }
              }
              break;
            case 1:
              this.forwardStep = 0
              if (this.roleId == 1){
                this.bottomButtonText[this.typeId][this.status] = "已开始"
                this.bottomButtonColor = 0
              }
              break;
            case 2:
              this.bottomButtonColor = 0
              break;
            case 3:
              this.bottomButtonColor = 0
              break;
            case 6:
              this.bottomButtonColor = 0
              break;
            }
            break;
        case '5':
          switch (this.status){
            case 0:
              if (this.roleId==1){
                if ((!this.isConfirm)&&(this.recordType==3)){
                  this.bottomButtonText[this.typeId][this.status] = "确认签名"
                } else {
                  this.bottomButtonText[this.typeId][this.status] = "待开始"
                  this.bottomButtonColor = 0;
                }
              }
              break;
            case 1:
              if (this.roleId == 1){
                this.bottomButtonText[this.typeId][this.status] = "已开始"
                this.bottomButtonColor = 0
              }
              break;
            case 2:
              this.bottomButtonColor = 0
              break;
            case 3:
              this.bottomButtonColor = 0
              break;
            case 6:
              this.bottomButtonColor = 0
              break;
            }
            break;
        case '6':
          this.forwardStep = 1
          switch (this.status){
            case 0:
              if (this.roleId==1){
                if ((!this.isConfirm)&&(this.recordType==3||this.recordType==7||this.recordType==8)) {
                  this.bottomButtonText[this.typeId][this.status] = "确认签名"
                  this.forwardStep = 0
                } else {
                  this.bottomButtonText[this.typeId][this.status] = "待开始"
                  this.bottomButtonColor = 0;
                }
              }
              break;
            case 1:
              if (this.roleId == 1){
                this.bottomButtonText[this.typeId][this.status] = "进行中"
                this.bottomButtonColor = 0
              }
              break;
            case 2:
              this.bottomButtonColor = 0
              if (this.roleId == 1 && this.dangerPeoType != 3){
                this.bottomButtonText[this.typeId][this.status] = "进行中"
              }
              if (this.roleId == 1 && this.dangerPeoType == 3){
                this.bottomButtonText[this.typeId][this.status] = "完结任务"
                this.bottomButtonColor = 1
              }
              break;
            case 3:
              this.bottomButtonColor = 0
              break;
            case 4:
              this.bottomButtonColor = 0
              break;
            case 6:
              this.bottomButtonColor = 0
              break;
          }
          break;
      }
    },
    //报表标题行颜色分割,以及把展开列隐藏
    headerStyle({row, column, rowIndex, columnIndex}){
      if (columnIndex === 0) {
        return 'column00Header'
      }else if (columnIndex === 1){
        return 'index';
      }else if (columnIndex === 2){
        return 'content';
      }else if (columnIndex === 3){
        return 'condition';
      }else if (columnIndex === 4){
        return 'inspect'
      }
      return '';
    },
    //隐藏首列展开列
    cellStyle({row, column, rowIndex, columnIndex}){
      if (columnIndex === 0){
        return 'column00'
      }
    },
    //列表展开
    toggleExpand(row) {
      this.$refs.safeTable.toggleRowExpansion(row)
    },
    //作废操作
    invalidDialog(){
      let that = this
      if (this.typeId!=6) {
        this.$dialog({
          title: "确认执行作废操作？",
          onOkBtn(event) {
            that.$http.post(that.updateUrl[that.typeId], {
              id: that.itemId,
              invalidReason: that.reason,
              status: that.invalidStep[that.typeId],
              createUserId: that.user.id,
            }).then(result => {
              if (result.status === 200) {
                console.log("数据上传成功")
              } else {
                console.log("数据上传失败")
              }
            })
            sessionStorage.removeItem('edit' + that.user.id + that.itemId)
            location.reload()
            this.close()
          }
        });
      }else{
        this.tableDataObj.list = this.tableData
        this.$dialog({
          title: "确认执行作废操作？",
          onOkBtn(event) {
            that.$http.post(that.updateUrl[that.typeId], {
              id: that.itemId,
              invalidReason: that.reason,
              status: that.invalidStep[that.typeId],
              createUserId: that.user.id,
              content: JSON.stringify(that.tableDataObj)
            }).then(result => {
              if (result.status === 200) {
                console.log("数据上传成功")
              } else {
                console.log("数据上传失败")
              }
            })
            sessionStorage.removeItem('edit' + that.user.id + that.itemId)
            location.reload()
            this.close()
          }
        });
      }
    },
    //确认修改
    confirmDialog(){
      //userList 处理
      let members = null
      if (this.typeId!=6) {
        members = this.userList
        members.forEach((item) => {
          if (item.attendUserId) {
            item.attendUserId = item.attendUserId
            item.comment = item.comment
            item.id = item.id
          } else {
            item.attendUserId = item.id
            item.comment = item.username
            item.id = null
          }
        })
      }else{
          members = []
          this.dangerMemberList.forEach((item) => {
            members.push(item)
          })
          if (this.taskSignObj.attendUserId){

          } else {
            this.taskSignObj.comment = this.taskSignObj.username
            this.taskSignObj.attendUserId = this.taskSignObj.id
            this.taskSignObj.id = null
          }
          members.push(this.taskSignObj)
          members.push(this.taskPerformObj)
          this.addTableDataObj.list = this.tableData2
      }
      let that = this
      if (this.typeId!=4) {
        if (this.typeId!=6){
          this.$dialog({
            title: "确认修改完成？",
            onOkBtn(event) {
              that.$http.post(that.updateUrl[that.typeId], {
                createUserId: that.user.id,
                id: that.itemId,
                task: that.taskContent,
                userList: members,
                date: that.taskTime,
                startTime: that.timeLeft + ':00',
                endTime: that.timeRight + ':00',
                startDate: that.date1[0],
                endDate: that.date1[1],
                cost: that.taskExtra[0],
                classHour: that.taskExtra[1],
                location: that.taskPlace,
                trainTeacher: that.taskVip,
                team: that.taskExtra[0],
                other: that.otherTaskContent,
                status: 0,
              }).then(result => {
                if (result.data.code === 0) {
                  sessionStorage.removeItem('edit' + that.user.id + that.itemId)
                  console.log("数据上传成功")
                } else {
                  console.log("数据上传失败")
                }
              })
              this.close()
            }
          });
        }else{
          this.$dialog({
            title: "确认修改完成？",
            onOkBtn(event) {
              that.$http.post(that.updateUrl[that.typeId], {
                createUserId: that.user.id,
                id: that.itemId,
                userList: members,
                workplace: that.taskPlace,
                status: 0,
                jobContent: that.taskContent,
                planStartTime: that.datetime+':00',
                planEndTime: that.datetime2+':00',
                department: that.taskExtra[0],
                team: that.taskExtra[1],
                supplementProtectiveMeasures: JSON.stringify(that.addTableDataObj),
              }).then(result => {
                if (result.data.code === 0) {
                  sessionStorage.removeItem('edit' + that.user.id + that.itemId)
                  console.log("数据上传成功")
                } else {
                  console.log("数据上传失败")
                }
              })
              this.close()
            }
          });
        }
      } else {
        this.tableDataObj.formType = this.formType
        this.tableDataObj.stepList = this.tableData
        this.$dialog({
          title: "确认修改完成？",
          onOkBtn(event) {
            that.$http.post(that.updateUrl[that.typeId], {
              createUserId: that.user.id,
              id: that.itemId,
              task: that.taskContent,
              userList: members,
              date: that.taskTime,
              startTime: that.timeLeft + ':00',
              endTime: that.timeRight + ':00',
              startDate: that.date1[0],
              endDate: that.date1[1],
              cost: that.taskExtra[0],
              classHour: that.taskExtra[1],
              location: that.taskPlace,
              trainTeacher: that.taskVip,
              team: that.taskExtra[0],
              other: that.otherTaskContent,
              status: 0,
              content: JSON.stringify(that.tableDataObj),
              reportFormId: that.reportFormId
            }).then(result => {
              if (result.data.code === 0) {
                sessionStorage.removeItem('edit' + that.user.id + that.itemId)
                console.log("数据上传成功")
              } else {
                console.log("数据上传失败")
              }
            })
            this.close()
          }
        });
      }
    },
    //签名
    uploadSign(){
      //转码
      let signFormData = new FormData();
      let blobSign = dataUrlToBlob(this.signData);
      let fileSign = blobToFile(blobSign, 'sign');
      signFormData.append('file', blobSign);
      this.openFullScreen()
      var signback
          axios.post(process.env.VUE_APP_URL +'/waterOperation/app/apptbfileinfo/uploadSignImage',signFormData).then(result => {
            if (result.data.code === 0) {
              signback = result
              if (this.isConfirm) {
                this.fixTableData.forEach(item => {
                    item.path = result.data.data.path
                  this.fixTableDataAll.forEach(situation => {
                    if (situation.id == item.id) {
                      situation = item
                    }
                  })
                })
                this.$http.post(this.updateUrl[this.typeId], {
                  situationList: this.fixTableDataAll,
                  id: this.itemId,
                  status: this.status
                }).then(result => {
                  if (result.data.code === 0) {
                    this.closeFullScreen()
                    sessionStorage.removeItem('edit' + this.user.id + this.itemId)
                    location.reload()
                    console.log("数据上传成功")
                  } else {
                    console.log("数据上传失败")
                  }
                })
              } else {
                this.$http.post(this.signUrl[this.typeId], {
                  attendUserId: result.data.data.uploadUserId,
                  createTime: result.data.data.createTime,
                  fileInfoId: result.data.data.id,
                  path: result.data.data.path,
                  isConfirm: 1,
                  comment: this.user.username,
                  id: this.idInTask,
                }).then(result => {
                  if (result.data.code === 0) {
                    this.fixTableData.forEach(item => {
                        item.beforePath = signback.data.data.path
                      this.fixTableDataAll.forEach(situation => {
                        if (situation.id == item.id) {
                          situation = item
                        }
                      })
                    })
                    this.$http.post(this.updateUrl[this.typeId], {
                      situationList: this.fixTableDataAll,
                      id: this.itemId,
                      status: this.status
                    }).then(result => {
                      if (result.data.code === 0) {
                        this.closeFullScreen()
                        sessionStorage.removeItem('edit' + this.user.id + this.itemId)
                        location.reload()
                        console.log("数据上传成功")
                      } else {
                        console.log("数据上传失败")
                      }
                    })
                    console.log("数据上传成功")
                  } else {
                    console.log("数据上传失败")
                  }
                })
              }
            }
          })
    },
    //点击底部按钮进入一下个工单状态
    changeTaskStatus(){
      //userlist加入解除者
      if (this.typeId==6&&this.status==1){
        let RemoveObj = {
          comment: this.taskRemove,
          id: null,
          attendUserId: null,
          type: 3
        }
        this.userList.push(RemoveObj)
      }
      //电子报表报表对象封装
      if (this.typeId==4){
        this.tableDataObj.formType = this.formType
        this.tableDataObj.stepList = this.tableData
        this.tableDataObj.headList = this.headerList
      }
      //危险作业双表对象封装
      if (this.typeId==6){
        this.tableDataObj.list = this.tableData
        this.addTableDataObj.list = this.tableData2
      }
      //如果这个时候底部按钮是灰色的则直接跳出该步骤
      if (this.bottomButtonColor == 0){
        return
      }
      //提示框提醒表单提交
      let that = this
      this.$dialog({
        title: "确认"+that.bottomButtonText[that.typeId][that.status]+"?",
        onOkBtn(event){
          that.openFullScreen()
          if (that.roleId==1 && that.isRectification){
            that.userList.find((user) => (user.attendUserId == that.user.id)).isConfirm = 1
          }
          if ((that.roleId==1&&that.status==0&&that.typeId!=6)||(that.roleId==1&&that.isRectification==1&&that.status==3)){
            that.uploadSign()
            if (that.recordType==3)
              that.status = that.oldStatus
          }else if (that.typeId==4||that.typeId==6){
            that.$http.post(that.updateUrl[that.typeId], {
              status: 2+that.forwardStep,
              id: that.itemId,
              checkSituation: that.taskCondition,
              fileList: that.imgReceipt,
              rectificationDate: that.fixTime,
              rectificationResult: that.fixResult,
              rectificationDepartmentId: that.fixSectionObj.id,
              userList: that.userList,
              completion: that.taskCondition,
              record: that.taskRecord,
              remark: that.taskCondition,
              workEndTime: that.datetime3+':00',
              content: JSON.stringify(that.tableDataObj),
              supplementProtectiveMeasures: JSON.stringify(that.addTableDataObj),
              situationList: that.fixTableData,
              parentName: that.taskName
            }).then(result => {
              if (result.status === 200) {
                if (result.data.code == 500){
                  this.$dialog({
                    title: result.data.msg,
                    closeBtn: true,  //显式右上角关闭按钮
                    onOkBtn(event) {  //确定按钮点击事件
                      this.close(); //关闭对话框
                    },
                    noCancelBtn: true
                  })
                }else {
                  console.log("数据上传成功")
                  sessionStorage.removeItem('edit' + that.user.id + that.itemId)
                  that.closeFullScreen()
                  that.getDetail()
                }
              } else {
                console.log("数据上传失败")
              }
            })
          }else{
            if (that.typeId==1){
              that.fixTableData.forEach(item => {
                item.imgList = null
              })
            }
            that.$http.post(that.updateUrl[that.typeId], {
              status: that.status + that.forwardStep,
              id: that.itemId,
              checkSituation: that.taskCondition,
              fileList: that.imgReceipt,
              rectificationDate: that.fixTime,
              rectificationResult: that.fixResult,
              rectificationDepartmentId: that.fixSectionObj.id,
              userList: that.userList,
              completion: that.taskCondition,
              record: that.taskRecord,
              remark: that.taskCondition,
              workEndTime: that.datetime3+':00',
              supplementProtectiveMeasures: JSON.stringify(that.addTableDataObj),
              situationList: that.fixTableData,
            }).then(result => {
              if (result.status === 200) {
                console.log("数据上传成功")
                sessionStorage.removeItem('edit'+that.user.id+that.itemId)
                that.closeFullScreen()
                location.reload()
              } else {
                console.log("数据上传失败")
              }
            })
          }
          this.close()
        }
      });
    },
    //时间拾取器控制
    switchPickerClose(param){
    },
    switchPicker(param) {
      this[`${param}`] = !this[`${param}`];
    },
    setChooseValue(param) {
      this.date1 = [...[param[0][3],param[1][3]]];
    },
    setChooseValue2(param) {
      this.datetime = param[5];
    },
    setChooseValue3(param) {
      this.datetime2 = param[5];
    },
    setChooseValue4(param) {
      this.datetime3 = param[5];
    },
    setChooseValue5(param) {
      this.taskTime = param[3];
    },
    setChooseValue6(param) {
      this.timeLeft = param[2];
    },
    setChooseValue7(param) {
      this.timeRight = param[2];
    },
    changeVisible(){
      this.isVisible = true;
    },
    changeVisible2(){
      this.isVisible2 = true;
    },
    changeVisible3(){
      this.isVisible3 = true;
    },
    changeVisible4(){
      this.isVisible4 = true;
    },
    changeVisible5(){
      this.isVisible5 = true;
    },
    changeVisible6(){
      this.isVisible6 = true;
    },
    changeVisible7(){
      this.isVisible7 = true;
    },
    //加载中
    openFullScreen() {
      this.fullscreenLoading = true;
    },
    closeFullScreen() {
      this.fullscreenLoading = false
    },
    //普通列表合并数组生成
    getSpanArr(data) {
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i == 0) {
          this.spanArr.push(1);
          this.pos = 0
        } else {
          if (this.formType == 1) {
            return
          } else {
            if (data[i].project == data[i - 1].project) {
              this.spanArr[this.pos] += 1;
              this.spanArr.push(0);
            } else {
              this.spanArr.push(1);
              this.pos = i;
            }
          }
        }
      }
    },
    //卫生巡检表负责人合并数组生成
    getResponsibleSpanArr(data){
      this.responsibleSpanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i == 0) {
          this.responsibleSpanArr.push(1);
          this.pos = 0
        } else {
            if (data[i].id == data[i - 1].id) {
              this.responsibleSpanArr[this.pos] += 1;
              this.responsibleSpanArr.push(0);
            } else {
              this.responsibleSpanArr.push(1);
              this.pos = i;
            }
        }
      }
    },
    //合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.formType!=1&&this.formType!=5){
        if (columnIndex === 1) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      }
      if (this.formType==3){
        if (columnIndex === 4){
          const _row = this.responsibleSpanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      }
    },
    //危险作业基本表打钩
    changeConfStatus(index,type){
      switch (type) {
        case 1:
          this.tableData[index].executeConfirm  = !this.tableData[index].executeConfirm
          if (this.tableData[index].executeConfirm)
            this.tableData[index].executeConfirm = 1
          else
            this.tableData[index].executeConfirm = 0
          break
        case 2:
          this.tableData[index].guardianConfirm = !this.tableData[index].guardianConfirm
          if (this.tableData[index].guardianConfirm)
            this.tableData[index].guardianConfirm = 1
          else
            this.tableData[index].guardianConfirm = 0
          break
        case 3:
          this.tableData[index].releaseConfirm = !this.tableData[index].releaseConfirm
          if (this.tableData[index].releaseConfirm)
            this.tableData[index].releaseConfirm = 1
          else
            this.tableData[index].releaseConfirm = 0
          break
      }
    },
    //危险作业补充表打钩
    changeConfStatus2(index,type){
      switch (type) {
        case 1:
          this.tableData2[index].executeConfirm  = !this.tableData2[index].executeConfirm
          if (this.tableData2[index].executeConfirm)
            this.tableData2[index].executeConfirm = 1
          else
            this.tableData2[index].executeConfirm = 0
          break
        case 2:
          this.tableData2[index].guardianConfirm = !this.tableData2[index].guardianConfirm
          if (this.tableData2[index].guardianConfirm)
            this.tableData2[index].guardianConfirm = 1
          else
            this.tableData2[index].guardianConfirm = 0
          break
        case 3:
          this.tableData2[index].releaseConfirm = !this.tableData2[index].releaseConfirm
          if (this.tableData2[index].releaseConfirm)
            this.tableData2[index].releaseConfirm = 1
          else
            this.tableData2[index].releaseConfirm = 0
          break
      }
    },
    //整改表整改签名生效打钩
    fixTableChangeStatus(index){
      if (!this.isRectification||this.status!=3||this.pathsended) {
        return
      }
      this.fixTableData[index].isConfirm = !this.fixTableData[index].isConfirm
      if (this.fixTableData[index].isConfirm)
        this.fixTableData[index].isConfirm = 1
      else
        this.fixTableData[index].isConfirm = 0
    },
    //危险作业扩充列表按钮事件
    expandTable(){
      const item = {};
      if (this.tableData2 == null){
        this.tableData2 = []
      }
      if (this.tableData2.length) {
        item.id = this.tableData2[this.tableData2.length - 1].id + 1;
      }else{
        item.id = this.tableData.length+1
      }
      item.step = "";
      item.executeConfirm = false;
      item.guardianConfirm = false;
      item.releaseConfirm = false;
      item.lock = false
      this.tableData2.push(item)
    },
    expandDangerMemberTable(){
      let obj = {
        comment: null,
        type: 0
      }
      this.dangerMemberList.push(obj)
    },
    //安全检查整改表扩充列表事件
    expandFixTable(){
      let obj = {
          content: null,
          department: null,
          departmentId: null,
          userId: null,
          username: null,
          safetyCheckId: this.itemId,
          fileList: [],
          imgList: [],
          time: null,
          result: '待上传',
          path: null,
          beforePath: null,
          type: null,
          level: null,
          planCompletionTime: null,
      }
      this.fixTableData.push(obj)
    },
    //危险作业补充表扩充后内容填写确认按钮
    expandConfirm(id){
      let index = id-this.tableData.length-1
      this.tableData2[index].lock = !this.tableData2[index].lock;
    },
    //签名确认
    confirm(canvas, data) {
      let proImg = document.querySelector('.confirmSign img');
      if (proImg){
        this.drawer = false
      }else {
        let img = document.createElement('img');
        img.src = data;
        this.signData = data;
        document.querySelector('.confirmSign').appendChild(img);
        this.drawer = false
      }
    },
    //签名重签
    clear() {
      let img = document.querySelector('.confirmSign img');
      if (img) {
        img.remove();
      }
    },
    //存缓存
    setSessionStorage(){
      let editList = {
        situationList: this.situationList,
        idInTask: this.idInTask,
        recordType: this.recordType,
        userId: this.user.id,
        itemId: this.itemId,
        taskName: this.taskName,
        inputTaskContent: this.taskContent,
        choseMember: this.taskMember,
        fixSection: this.fixSection,
        fixPeople: this.fixPeople,
        startDate: this.date1[0],
        endDate: this.date1[1],
        taskTime: this.taskTime,
        timeLeft: this.timeLeft,
        timeRight: this.timeRight,
        extraInfo1: this.taskExtra[0],
        extraInfo2: this.taskExtra[1],
        location: this.taskPlace,
        taskVip: this.taskVip,
        status: this.status,
        roleId: this.roleId,
        invalidReason: this.reason,
        titleId: this.titleBarId,
        front: this.front,
        typeId: this.typeId,
        taskCondition: this.taskCondition,
        thumbsList: this.thumbsList,
        userList: this.userList,
        fixPeopleObj: this.fixPeopleObj,
        fixSectionObj: this.fixSectionObj,
        imgList: this.imgList,
        fixTime: this.fixTime,
        fixResult: this.fixResult,
        isConfirm: this.isConfirm,
        datetime: this.datetime,
        datetime2: this.datetime2,
        taskSign: this.taskSign,
        elecTabPageType: this.elecTabPageType,
        formType: this.formType,
        reportFormId: this.reportFormId,
        taskValue: this.taskValue,
        dangerPeoType: this.dangerPeoType,
        fixTableData: this.fixTableData,
        otherTaskContent: this.otherTaskContent,
        confirmMember: this.confirmMember,
        tableData: this.tableData,
        taskOptions: this.taskOptions,
        dangerMemberList: this.dangerMemberList,
        taskPerform: this.taskPerform,
        taskPerformObj: this.taskPerformObj,
        headerList: this.headerList
      }
      sessionStorage.setItem("edit"+this.user.id+this.itemId, JSON.stringify(editList))
    },
    //跳往选人页
    toChoose(boxId,singleSwitch,checkedData,tableIndex){
      this.setSessionStorage()
      this.$router.push({ name: 'choosePerson', query: { titleId: 26, singleSwitch: singleSwitch, front: {name: 'security_detail', typeId: this.typeId, roleId: this.roleId, status: this.status,titleBarId: this.front.titleBarId, chooseId: boxId, itemId: this.itemId, recordType: this.front.recordType,dangerPeoType: this.dangerPeoType, checkedData: checkedData, tableIndex: tableIndex}}})
    },
    //拿缓存
    getSessionStorage(){
      let editList = JSON.parse(sessionStorage.getItem('edit'+this.user.id+this.itemId));
      if (editList) {
        this.recordType = editList.recordType
        this.taskName = editList.taskName
        this.taskContent = editList.inputTaskContent;
        this.fixSection = editList.fixSection;
        this.fixPeople = editList.fixPeople;
        if (editList.choseMember) {
          this.taskMember = editList.choseMember;
        } else {
        }
        this.situationList = editList.situationList;
        this.date1[0] = editList.startDate;
        this.date1[1] = editList.endDate;
        this.taskTime = editList.taskTime;
        this.timeLeft = editList.timeLeft;
        this.timeRight = editList.timeRight;
        this.taskExtra[0] = editList.extraInfo1;
        this.taskExtra[1] = editList.extraInfo2;
        this.taskPlace = editList.location;
        this.taskVip = editList.taskVip;
        this.roleId = editList.roleId;
        this.status = editList.status;
        this.reason = editList.invalidReason
        this.typeId = editList.typeId
        this.itemId = editList.itemId
        this.titleBarId = editList.titleId
        this.front = editList.front
        this.taskCondition = editList.taskCondition
        this.thumbsList = editList.thumbsList
        this.userList = editList.userList
        this.fixPeopleObj = editList.fixPeopleObj
        this.fixSectionObj = editList.fixSectionObj
        this.fixTime = editList.fixTime
        this.fixResult = editList.fixResult
        this.imgList = editList.imgList
        this.isConfirm = editList.isConfirm
        this.idInTask = editList.idInTask
        this.datetime = editList.datetime
        this.datetime2 = editList.datetime2
        this.datetime2 = editList.datetime2
        this.taskSign = editList.taskSign
        this.elecTabPageType = editList.elecTabPageType
        this.reportFormId = editList.reportFormId
        this.formType = editList.formType
        this.dangerPeoType = editList.dangerPeoType
        this.fixTableData = editList.fixTableData
        this.otherTaskContent = editList.otherTaskContent
        this.confirmMember = editList.confirmMember
        this.tableData = editList.tableData
        this.taskOptions = editList.taskOptions
        this.taskValue = editList.taskValue
        this.dangerMemberList = editList.dangerMemberList
        this.taskPerform = editList.taskPerform
        this.taskPerformObj = editList.taskPerformObj
        this.headerList = editList.headerList
        this.getSecondStatus()
      }else{
        this.getDetail()
      }
    },
    //选人页数据返回处理
     getcheckListStr(chooseId,tableIndex){
      var str = '';
      var arr = [];
      let checkUserList = this.$route.query.checkUserList
       try {
         for (var i = 0; i < checkUserList.length; i++) {
           if (checkUserList[i].username)
             arr.push(checkUserList[i].username)
           if (checkUserList[i].name)
             arr.push(checkUserList[i].name)
           if (checkUserList[i].comment)
             arr.push(checkUserList[i].comment)
         }
         str = arr.join(',')
         if (chooseId == 1) {
           this.taskMember = str
           if (this.typeId==4 || this.typeId==5) {
             if (!(this.$route.query.checkUserList.find((user) => user.id == this.vipObj.id) || this.$route.query.checkUserList.find((user) => user.attendUserId == this.vipObj.id))) {
               this.taskVip = ''
               this.vipObj = null
             }
           }
         } else if (chooseId == 2) {
           this.fixTableData[tableIndex].department = str
         } else if (chooseId == 3) {
           if (this.typeId==1)
            this.fixTableData[tableIndex].username = str
           if (this.typeId==4) {
             var tag = this.headerList.find(user => user.id == tableIndex)
             var one = {}
             one.username = str
             one.comment = str
             one.userId = this.$route.query.checkUserList[0].id
             one.id = tableIndex
             one.attendUserId = this.$route.query.checkUserList[0].id
             one.isCheck = 2
             if (this.userList.find(user => user.attendUserId == this.$route.query.checkUserList[0].id))
               if (this.userList.find(user => user.attendUserId == this.$route.query.checkUserList[0].id).isCheck == 0)
                 this.userList.find(user => user.attendUserId == this.$route.query.checkUserList[0].id).isCheck = 2
             else
               this.userList.push(one)
             if (tag) {
               tag.username = str
               tag.userId = this.$route.query.checkUserList[0].id
             }else{
               this.headerList.push(one)
             }
           }
         } else if (chooseId == 5) {
           this.taskSign = str
         } else {
           this.taskVip = str
         }
       }catch (e){

       }
       this.setSessionStorage()
       this.getcheckList(chooseId,tableIndex)
    },
    //选人对象处理
    getcheckList(chooseId,tableIndex){
      if (chooseId==1) {
        this.choseMemberList = this.$route.query.checkUserList
        console.log(this.choseMemberList)
        console.log(this.userList)
        this.choseMemberList.forEach(item => {
          if (!(this.userList.find(user => user.attendUserId == item.id)||this.userList.find(user => user.attendUserId == item.attendUserId))){
            this.userList.push(item)
          }
        })
      }
      if (chooseId==2) {
        try {
          this.fixTableData[tableIndex].departmentId = this.$route.query.checkUserList[0].id
        }catch (e) {
        }
      }
      if (chooseId==3) {
        try {
          if (this.typeId == 1) {
            this.fixTableData[tableIndex].userId = this.$route.query.checkUserList[0].id
            this.$route.query.checkUserList[0].attendUserId = this.$route.query.checkUserList[0].id
            this.$route.query.checkUserList[0].id = null
            this.$route.query.checkUserList[0].comment = this.$route.query.checkUserList[0].username
            this.$route.query.checkUserList[0].isRectification = 1
            this.userList.push(this.$route.query.checkUserList[0])
          }
        }catch (e) {

        }
      }
      if (chooseId == 4){
        this.vipObj = this.$route.query.checkUserList[0]
        switch (this.typeId){
          case '4':
            this.userList.forEach((item) => {
              item.isCheck = 0
            });
            this.vipObj.isCheck = 1;
            this.userList.push(this.vipObj);
            break;
          case "5":
            this.userList.forEach((item) => {
              item.isHost = 0
            });
            this.vipObj.isHost = 1;
            this.userList.push(this.vipObj);
            break;
        }
      }
      if (chooseId == 5){
        this.taskSignObj = this.$route.query.checkUserList[0]
        this.userList.forEach((item,index) => {
          if (item.type == 2){
            this.userList.splice(index,1)
          }
        });
        this.taskSignObj.type = 2;
        this.userList.push(this.taskSignObj)
      }
    },
    //拿到当前编辑环节图环节
    getImgLink(index){
      this.imgLink = index
    },
    //拿到当前编辑的整改表表行和整改类型：检查情况/整改结果
    getFixImgIndex(index,type){
      this.imgFixIndex = index
      this.imgFixType = type
    },
    //图片上传
    imgMsg(data){
      if(data.code == 2) {
        let base64Data,blobData,imgFile
        let imgFormData = new FormData()
        let image = new Image()
        image.src = URL.createObjectURL(data.msg[0])
        let that = this
        image.onload = function () {
          base64Data = compress(image) // 压缩并获取到base64数据
          blobData = dataUrlToBlob(base64Data)
          imgFile = blobToFile(blobData, 'image')
          imgFormData.append('file', imgFile)
          that.openFullScreen()
          axios.post(process.env.VUE_APP_URL +"/waterOperation/app/apptbfileinfo/upload", imgFormData , {timeout: 1000000}).then(result => {
            if (result.status === 200) {
                var item = {}
                item.comment = result.data.data.path
                item.createTime = result.data.data.createTime
                item.fileInfoId = result.data.data.id
                item.safetyCheckId = that.itemId
                item.link = that.imgLink
                item.type = that.imgFixType
                if (that.typeId != 1) {
                  that.imgReceipt.push(item)
                } else {
                  item.id = null
                  that.fixTableData[that.imgFixIndex].fileList.push(item)
                }
              console.log("附件数据上传成功")
              that.closeFullScreen()
            } else {
              console.log("附件数据上传失败")
            }
          })
        }
      }
    }
  },
  watch:{
    //监听所有输入，对数据进行缓存
    taskValue(val){
      //当下拉框数据每一次变化时对相应的安全报表的信息进行请求
      if (this.status==0) {
        axios.get(process.env.VUE_APP_URL + "/waterOperation/app/appTbElectronicReportForm/info/" + val).then(result => {
          if (result.data.code == 0) {
            this.formType = result.data.info.formType
            this.tableData = result.data.info.stepList
            for (var i = 0; i < this.tableData.length; i++) {
              this.tableData[i].index = i + 1
            }
            //表项合并
            this.getSpanArr(this.tableData);
            //当下拉框选中的是卫生表的时候，formtype为3，调用该方法进行负责人表项的合并
            if (this.formType == 3) {
              this.getResponsibleSpanArr(this.tableData)
            }
            console.log("数据获取成功")
          } else {
            console.log("数据获取失败")
          }
        })
      }else{

      }
      //装填相应的变量
      this.reportFormId = val
      this.setSessionStorage()
    },
    taskContent(){
      this.setSessionStorage()
    },
    taskName(){
      this.setSessionStorage()
    },
    taskCondition(){
      this.setSessionStorage()
    },
    imgList(){
      this.setSessionStorage()
    },
    fixTime(){
      this.setSessionStorage()
    },
    fixResult(){
      this.setSessionStorage()
    },
    taskVip(){
      this.setSessionStorage()
    },
    taskPerform(){
      this.taskPerformObj.comment = this.taskPerform
      this.setSessionStorage()
    },
  },
  filters:{
    //电子报表环节图中文数字转换
     transfer: function(value){
        switch(value){
          case 0:
            return "一";
          case 1:
            return "二";
          case 2:
            return "三";
          case 3:
            return "四";
          case 4:
            return "五";
          case 5:
            return "六";
          case 6:
            return "七";
          case 7:
            return "八";
          case 8:
            return "九";
          case 9:
            return "十";
        }
     }
  },
  components:{
    // eslint-disable-next-line vue/no-unused-components
    "back-box" : header,
    // eslint-disable-next-line vue/no-unused-components
    "titleBar" : titleBar,
    // eslint-disable-next-line vue/no-unused-components
  }
}
</script>

<style lang="scss">
.detail_container{
  .content {
    margin: 30px 16px;
    .time_box{
      p{
      }
    }
    p {
      font-size: 18px;
      line-height: 24px;
      margin-bottom: 30px;
      display: flex;
      justify-content: flex-start;
      .time_displayer{
        display: flex;
        align-items: center;
        font-size: 15px;
      }
      .tableInput{
        width: 100%;
      }
      .other{
        margin-left: 36px;
      }
      .tableResult{
        font-size: 13px;
        margin: 0 10px;
      }
      .demo-table-expand label {
        font-size: 13px;
        color: #333333;
      }
      .demo-table-expand .el-form-item {
        margin-bottom: 0px;
        width: 100%;
        .el-form-item__content{
          width: 100%;
        }
      }
      .recordCondition{
        color: #ffffff;
        background-color: #F65555;
        padding: 4px 8px;
        font-size: 12px;
      }
      .star{
        color: #F23737;
      }
      .title{
        font-weight: 700;
        white-space: nowrap;
      }
      .partition{
        margin-left: 36px;
      }
      .signButton{
        font-size: 16px;
      }
      .expaConfBtn{
        width: 100%;
      }
      .expand_icon{
        display: block;
        margin: 2px auto;
      }
      .danger_confirm_icon{
        a{
          img{
            vertical-align: middle;
          }
        }
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
      .transition{
        font-weight: 700;
        color: #BEB8B8;
        margin: 0 8px;
        flex-shrink: 1;
        flex-basis: 18px;
      }
      .border{
        padding: 4px;
        border: 1px solid #DCDFE6;
        border-radius: 8px;
        flex-shrink: 1;
        flex-grow: 1;
        flex-basis: 88px;
        white-space: nowrap;
      }
      .border_selected{
        flex-shrink: 1;
        flex-grow: 1;
        flex-basis: 88px;
        white-space: nowrap;
      }
      .vip3{
        margin-left: 18px;
      }
      .leader{
        margin-left: 20px;
      }
      .info {
        font-weight: 400;
      }
      .edit_box{
        vertical-align: top;
        font-size: 18px;
        font-weight: 400;
        color: #333333;
        border: none;
        border-radius: 4px;
        outline: none;
        resize: none;
      }
      .box01{
        width: 70%;
      }
      .box02{
        width: 42%;
        height: 61px;
        margin-right: 8px;
      }
      .box03{
        width: 24%;
        height: 28px;
        margin-top: -6px;
      }
      .box06{
        width: 40%;
        height: 28px;
        margin-top: -6px;
      }
      .box05{
        width: 40%;
        height: 28px;
        margin-right: 8px;
        margin-top: -4px;
      }
      .box04{
        width: 72%;
        height: 40px;
        margin-top: -8px;
        line-height: 40px;
      }
      .choose{
        width: 22%;
        height: 32px;
        border: none;
        background-color: #0099FF;
        font-size: 12px;
        border-radius: 4px;
        color: #FFFFFF;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .button{
        width: 32%;
        height: 50px;
        border: none;
        font-weight: 700;
        font-size: 18px;
        color: #FFFFFF;
        border-radius: 4px;
      }
      .red{
        background-color: #CC0033;
        margin-left: 34px;
      }
      .green{
        background-color: #00CC33;
        position: absolute;
        right: 50px;
      }
      .imgPrev{
        margin-left: 36px;
        figure{
          display: inline-block;
          margin: 0 20px 0 0;
          img{
            width: 94px;
            height: 94px;

          }
        }
      }
      .imagePicker{
        margin-left: 36px;
        .add-icon{
          border: none;
          background-color: #E4E4E4;
          i{
            svg{
              color: #7F7F7F;
            }
          }
        }
      }
      .calendar{
        margin-top: -30px;
        width: 65%;
      }
      .time{
        width: 65%;
        margin-left: 90px;
        margin-top: -10px;
      }
      .time_line{
        margin: auto 10px;
        height: 1px;
        width: 20px;
      }
    }

    .titleBar{
     margin-bottom: 15px;
    }
    .bottom_button{
      button{
        font-weight: 700;
        font-size: 18px;
        display: block;
        border: none;
        width: 86%;
        height: 49px;
        margin: 0 auto;
        color: #FFFFFF;
        border-radius: 4px;
      }
      .gray{
        background-color: rgba(127, 127, 127, 1);
      }
      .green{
        background-color: #00CC33;
      }
    }
  }
  .imgPrev_fix{
    figure{
      display: inline-block;
      margin: 0 20px 0 0;
      img{
        width: 60px;
        height: 60px;
      }
    }
  }
  .fix_box{
    margin-bottom: 30px;
  }
  .expand_icon_fix{
    display: block;
    margin: 2px auto;
  }
  .imagePicker_fix{
    .add-icon{
      border: none;
      background-color: #E4E4E4;
      i{
        svg{
          color: #7F7F7F;
        }
      }
    }
  }
  .border_fix{
    border: 1px solid #333333;
    border-radius: 8px;
    padding: 2px;
  }
  .drawerBtn{
    margin-top: -15px;
    width: 100%;
    background-color: #eeeeee;
    color: #5E5E5E;
    border: none;
    margin-bottom: 30px;
    border-radius: 0;
  }
  .confirmSign{
    img{
      width: 100%;
      height: 300px;
    }
  }
  .signature_box{
    p{
      margin: 20px 0;
      font-size: 16px;
    }
  }
  .signaturenter {
    width: 100%;
    .el-drawer__header{
      height: 5%;
      margin: 0;
      padding: 0;
    }
    .el-drawer__body{
      height: 95%;
    }
    .nut-signature {
      height: 90%;
      .nut-signature-inner {
        width: 100%;
        height: 100%;
        margin: 0;
      }
      .nut-button{
        width: 50%;
        display: block;
        float: left;
        height: 36px;
        font-size: 24px;
      }
    }
    .el-collapse-item__header{
      font-size: 16px;
    }
  }
}
@media screen and (orientation:portrait) {
  .detail_container {
    .confirmSign{
      img{
        height: 300px;
        width: 300px;
        transform: rotate(-90deg);
      }
    }
    .el-drawer__container {
      .el-drawer__header {
        width: 0;
        height: 0;

        .el-drawer__close-btn {
          width: 0;
          height: 0;

          .el-dialog__close {
            position: absolute;
            bottom: 20px;
            right: 20px;
          }
        }
      }

      .el-drawer__body {
        height: 100%;

        .nut-signature {
          height: 100%;
          .nut-signature-inner {
            width: 88%;
            float: right;
          }

          .nut-button {
            float: left;
            display: block;
            width: 10%;
            height: 50%;
            padding: 0;

            span {
              display: block;
              transform: rotate(90deg);
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
}
</style>