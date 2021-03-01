<template>
  <div>
    <back-box :id="this.titleBarId" :front="this.front"></back-box>
    <div class="header">
      <el-input ref="myInput" class="search_input" type="input" v-model="keyword" placeholder="请输入搜索关键字"></el-input>
      <button @click="search">搜索</button>
    </div>
    <div class="list">
      <nut-scroller
          :is-loading="isLoading"
          :type="'vertical'"
          @pulldown="pulldown"
          class="scroll"
      >
        <div class="scroll_item" v-for="item in userlist" :key="item.id" slot="list">
          <div class="shadow">
              <nut-checkbox v-if="!singleSwitch"
                  v-model="item.isSelected"
                  :label="item.id.toString()"
                  class="right"
                  @change="checkPush"
              ></nut-checkbox>
              <div class="right" @click="singleGetItem(singleResult)">
                <nut-radio v-if="singleSwitch"
                           size="large"
                    v-model="singleResult"
                    :label="item.id.toString()"
                >
                </nut-radio>
              </div>
              <nut-avatar
                    class="avatar"
                    size="large"
                    bg-icon
                    :bg-image="item.avatar"
                    v-if="!sectionSwitch"
              ></nut-avatar>
              <div class="text">
                <p class="name">{{ item.username||item.name }}</p>
              </div>
          </div>
        </div>
      </nut-scroller>
    </div>
    <div class="bottom">
      <button class="button" @click="confirm()">确定</button>
    </div>
  </div>
</template>

<script>
import header from "@/views/Security/subcomponents/header";
import axios from "axios"

export default {
  data(){
    return {
      //用户
      wxtoken: '',
      //判别码
      titleBarId: this.$route.query.titleId,
      front: this.$route.query.front,
      //滚动
      timer: null,
      isLoading: false,
      //搜索关键字
      keyword: '',
      //选中者列表
      checkUserList:[],
      //用户接口数据容器
      userlist: [],
      url: '',
      //部门选择
      sectionSwitch: null,
      //是否单选
      singleSwitch: this.$route.query.singleSwitch,
      //单选结果
      singleResult: '',
    }
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
  },
  mounted() {
    //设置获取焦点
    this.$nextTick(function() {
      this.$refs.myInput.focus()
    })
    //设置滚动高度
    this.setScrollHeight()
    //获取用户列表
    this.getUserList()
  },
  components:{
    "back-box" : header,
  },
  methods:{
    init(){
      this.wxtoken = sessionStorage.getItem('wxtoken')
      //把路由里已经选了的人插入已选容器中
      if (!this.singleSwitch) {
        this.checkUserList = this.$route.query.front.checkedData
      }else{
        try {
          if (this.$route.query.front.checkedData.length != 0) {
            this.singleResult = this.$route.query.front.checkedData[0].id.toString()
          }
        }catch (e) {
          
        }
      }
      console.log(this.front)
      //判断是否是安全检查的部门选择
      if(this.front.typeId==1&&this.front.roleId==0&&this.front.chooseId==2){
        this.url = process.env.VUE_APP_URL +"/waterOperation/app/tbdepartment/list-all"
        this.sectionSwitch = true;
      }else{
        this.url = process.env.VUE_APP_URL +"/waterOperation/app/apptbuserinfo/listCombo"
        this.sectionSwitch = false;
      }
      console.log(this.url)
    },
    focusFun() {
    },
    //搜索按钮
    search(value) {
      this.getUserList()
      //点击键盘中的’搜索‘时，失去焦点
      this.$refs.myInput.blur()
    },
    getUserList(){
      axios.get(this.url+"?token="+this.wxtoken,{
        params: {
          key: this.keyword.replace(/\s+/g,""),
          keyword: this.keyword.replace(/\s+/g,"")
      }}).then(result => {
        if(result.data.code === 0){
          if (result.data.list){
            this.userlist = result.data.list
          }else{
            this.userlist = result.data.data
          }
          console.log("数据获取成功")
          try {
            for (var i = 0; i < this.checkUserList.length; i ++){
              if (!this.checkUserList[i].attendUserId) {
                this.userlist.find((user) => user.id == this.checkUserList[i].id).isSelected = true
              }else{
                this.userlist.find((user) => user.id == this.checkUserList[i].attendUserId).isSelected = true
              }
            }
          }catch (e){

          }

        }else{
          console.log("数据获取失败")
        }
      })
    },
    //懒加载
    pulldown() {
      this.isLoading = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.isLoading = false;
        this.getUserList();
      }, 1500);
    },
    //选择
    checkPush(checked,val){
      if (checked){
        if (this.checkUserList) {
          if (!this.checkUserList.find((user) => user.id == val))
            this.checkUserList.push(this.userlist.find((user) => user.id == val))
        }
      }else{
        if (this.checkUserList) {
          this.checkUserList.forEach((item, index) => {
            if ((item.id == val) || (item.attendUserId == val)) {
              this.checkUserList.splice(index, 1)
            }
          })
        }
      }
      this.front.checkUserList = this.checkUserList
    },
    //装填单选结果
    singleGetItem(val){
      this.checkUserList = []
      function compare(user){
        return  user.id == val
      }
      this.checkUserList.push(this.userlist.find(compare))
    },
    //确认选择
    confirm(){
      sessionStorage.removeItem('header')
      this.$router.push({ name: this.front.name, query: {typeId: this.front.typeId,roleId: this.front.roleId,status: this.front.status,titleBarId: this.front.titleBarId, checkUserList:this.checkUserList, chooseId:this.front.chooseId, id: this.front.itemId, recordType: this.front.recordType, dangerPeoType: this.front.dangerPeoType, tableIndex: this.front.tableIndex}})
    },
    //设置滚动高度
    setScrollHeight(){
      document.getElementsByClassName('scroll')[0].style.height = (window.screen.height-89-51-40-76) + 'px'
    }
  },
  watch:{
    //监听关键字再次请求
    keyword(val){
      this.getUserList()
    },
    //监听单选按钮装填到checkUserList
    singleResult(val){
      this.singleGetItem(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  box-sizing: border-box;
  margin: 10px 20px 14px 30px;
  .search_input {
    border-radius: 4px;
    width: 72%;
    margin-right: 10px;
    font-size: 18px;
  }
  button{
    width: 24%;
    font-weight: 700;
    font-size: 18px;
    color: #ffffff;
    background-color: #00CC33;
    border: none;
    border-radius: 4px;
    padding: 10px;
  }
}
.list{
  .scroll{
    height: 600px;
    margin-bottom: 89px;
  }
  .scroll_item{
    margin-top: 16px;
    box-shadow: 0px -3px 5px rgba(201, 201, 201, 0.349019607843137);
  }
  .shadow{
    box-shadow: 0px 3px 5px rgba(201, 201, 201, 0.349019607843137);
    height: 60px;
    position: relative;
    .avatar{
      margin: 10px 20px;
    }
    .right{
      float: right;
      margin-top: 20.5px;
    }
    .text{
      height: 20px;
      line-height: 20px;
      position: absolute;
      left: 80px;
      top: 50%;
      margin-top: -10px;
      font-size: 18px;
      color: #7F7F7F;
    }
  }
}
.bottom{
  width: 100%;
  position: fixed;
  bottom: 0;
  background-color: #ffffff;
  .button{
    font-weight: 700;
    font-size: 18px;
    display: block;
    border: none;
    width: 86%;
    height: 49px;
    margin: 20px   auto;
    color: #FFFFFF;
    background-color: #00CC33;
    border-radius: 4px;
  }
}


</style>