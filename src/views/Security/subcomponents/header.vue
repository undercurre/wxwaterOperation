<template>
  <div>
    <div class="back">
      <img src="../images/u3.png" @click="getBack" />
      <span>{{ title }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',//导航栏的标题
      backName: '',//要返回的路由name
      popstateLock: 0,//是否监听物理返回键
    }
  },
  created() {
    //先从header头部导航路由缓存中提出路由信息
    if (sessionStorage.getItem('header')) {
      this.id = JSON.parse(sessionStorage.getItem('header')).id//导航栏标题id
      this.front = JSON.parse(sessionStorage.getItem('header')).front//上一页的路由信息
      this.userId = JSON.parse(sessionStorage.getItem('header')).userId//用户ID
      this.itemId = JSON.parse(sessionStorage.getItem('header')).itemId//工单ID
    }else{
      //如果缓存里没有，也就是第一次进入路由，把当前路由的路由信息存入缓存
      let header = {
        id: this.id,
        front: this.front,
        userId: this.userId,
        itemId: this.itemId
      }
      sessionStorage.setItem('header', JSON.stringify(header))
    }
    try {
      this.id = this.id.toString()
      //在第一页系统入口没有id参数的传入，需要做抛错处理，因为在缓存读入的id是string类型，需要配合类型的转换
    }catch (e) {

    }
    //根据导航路由id决定路由title和返回路由的name
    switch (this.id){
      //导航到个人信息入口
      case '1': this.title = '安全检查系统菜单';
              this.backName = 'Security';
      break;
      case '2': this.title = '安全培训系统菜单';
              this.backName = 'Security';
      break;
      case '3': this.title = '安全演练系统菜单';
              this.backName = 'Security';
      break;
      case '4': this.title = '安全电子报表系统菜单';
              this.backName = 'Security';
      break;
      case '5': this.title = '安全会议系统菜单';
              this.backName = 'Security';
      break;
      case '6': this.title = '危险作业系统菜单';
              this.backName = 'Security';
      break;
      //导航到记录
      case '7': this.title = '任务记录';
              this.backName = 'enteredMenu';
      break;
      case '8': this.title = '整改任务';
              this.backName = 'enteredMenu';
      break;
      case '9': this.title = '签名任务';
              this.backName = 'enteredMenu';
      break;
      case '10': this.title = '巡检任务';
              this.backName = 'enteredMenu';
        break;
      case '11':  this.title = '执行任务';
        this.backName = 'enteredMenu';
        break;
      case '25':  this.title = '我的提醒记录';
        this.backName = 'enteredMenu';
        break;
      case '27':  this.title = "执行人签名";
        this.backName = 'enteredMenu';
        break;
      case '28':  this.title = "解除人签名";
        this.backName = 'enteredMenu';
        break;
      //  导航到任务详情
      case '12':  this.title = "任务详情";
                this.backName = 'security_record';
        break;
      //  导航到创建页
      case '13':  this.title = "创建安全检查任务";
        this.backName = 'enteredMenu';
        break;
      case '14':  this.title = "创建安全培训任务";
        this.backName = 'enteredMenu';
        break;
      case '15':  this.title = "创建安全演练任务";
        this.backName = 'enteredMenu';
        break;
      case '16':  this.title = "创建电子报表任务";
        this.backName = 'enteredMenu';
        break;
      case '17':  this.title = "创建安全会议任务";
        this.backName = 'enteredMenu';
        break;
      case '18':  this.title = "创建危险作业任务";
        this.backName = 'enteredMenu';
        break;
        //导航到查询
      case '19':  this.title = "安全检查单查询";
        this.backName = 'enteredMenu';
        break;
      case '20':  this.title = "安全培训任务查询";
        this.backName = 'enteredMenu';
        break;
      case '21':  this.title = "安全演练任务查询";
        this.backName = 'enteredMenu';
        break;
      case '22':  this.title = "电子报表任务查询";
        this.backName = 'enteredMenu';
        break;
      case '23':  this.title = "安全会议任务查询";
        this.backName = 'enteredMenu';
        break;
      case '24':  this.title = "危险作业任务查询";
        this.backName = 'enteredMenu';
        break;
      case '26':  this.title = "请选择";
        this.backName = '';
        break;
        //系统入口默认显示title
      default :  this.title = '安全系统菜单';
        this.backName = 'Security';
        break;
    }
  },
  mounted() {
    this.addPopstate()//在导航栏挂载的时候，对物理返回键进行监听
  },
  destroyed(){
    this.removePopstate()
  },
  methods: {
    addPopstate(){
      //判断是否H5路由
      if (window.history && window.history.pushState) {
        // 往历史记录里面添加一条新的当前页面的url
        history.pushState(null, null, document.URL);
        // 给 popstate 绑定一个方法 监听页面刷新，并绑定getBack()来控制
        window.addEventListener('popstate', this.getBack, false);//false阻止默认事件
      }
    },
    removePopstate(){
      //解除监听
      window.removeEventListener('popstate', this.getBack, false);//false阻止默认事件
    },
    //指挥路由
    getBack() {
      //把导航路由辨别码转成整形
      this.id = parseInt(this.id)
      if (!this.id) {
        //在没有传id的情况下，就是在系统首页，这个时候调用微信WeixinJSBridgeReady自带的API对返回键进行监听实现在首页返回关闭页面
        document.addEventListener(
            "WeixinJSBridgeReady",
            function() {
              WeixinJSBridge.call("closeWindow");
            },
            false
        );
        WeixinJSBridge.call("closeWindow");
      } else {
        //判断物理返回键是否监听
        if (!this.popstateLock) {
          let that = this //这里原来设置了对话框，后来没有了。
              //去除页面整体路由缓存
              sessionStorage.removeItem('router')
              if (that.id < 7) {
                //返回菜单页
                sessionStorage.removeItem('header')
                sessionStorage.removeItem('setUp')
                that.$router.push({name: that.backName})
              } else if (that.id <= 11 || that.id === 25 || that.id >= 27) {
                // 从记录返回到个人信息菜单入口
                that.$router.push({name: that.backName, query: {typeId: that.front}})
                sessionStorage.removeItem('header')
                sessionStorage.removeItem('record')
              } else if (that.id <= 12) {
                //从任务详情返回记录
                sessionStorage.removeItem('header')
                sessionStorage.removeItem('edit' + that.userId + that.itemId)
                that.$router.push({
                  name: that.backName,
                  query: {
                    typeId: that.front.typeId,
                    titleBarId: that.front.titleBarId,
                    recordType: that.front.recordType
                  }
                })
              } else if (that.id <= 24) {
                //从创建页和搜索页返回到个人信息菜单入口
                that.$router.push({name: that.backName, query: {typeId: that.front}})
                sessionStorage.removeItem('header')
                sessionStorage.removeItem('setUp')
              } else if (that.id === 26) {
                console.log(that.front)
                that.$router.push({
                  name: that.front.name,
                  query: {
                    typeId: that.front.typeId,
                    roleId: that.front.roleId,
                    status: that.front.status,
                    titleBarId: that.front.titleBarId,
                    checkUserList: that.front.checkedData,
                    chooseId: that.front.chooseId,
                    id: that.front.itemId,
                    recordType: that.front.recordType
                  }
                })
                sessionStorage.removeItem('header')
              }
          window.history.pushState(null, null, '#')
        }
      }
    }
  },
  watch:{
    popstateLock(val){
      //在父组件调用方法改变lock的值的时候控制路由的监听来避免preview的close路由调用
      if (val){
        this.addPopstate()
      }else{
        this.removePopstate()
      }
    }
  },
  props:[
      "id",
      "front",
      "userId",
      "itemId",
  ]
}
</script>

<style lang="scss" scoped>
.back {
  font-weight: 700;
  font-size: 20px;
  height: 51px;
  box-shadow: 0px 3px 5px rgba(201, 201, 201, 0.349019607843137);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  img {
    width: 34px;
    height: 34px;
    position: absolute;
    left: 20px;
    top: 8.5px;
  }

  span {
    margin: 64px;
    height: 51px;
    color: #333333;
    line-height: 51px;
  }
}
</style>