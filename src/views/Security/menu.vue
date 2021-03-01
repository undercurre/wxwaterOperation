<template>
  <div class="menu_container">
<!--    导航栏-->
    <back-box></back-box>
<!--    菜单容器-->
    <div class="menu_box">

        <div class="sec_me_box box_01" @click="nextPage('1')">
            <img class="speaial" src="./images/u543.png">
            <span class="text">安全检查</span>
        </div>


        <div class="sec_me_box box_02"  @click="nextPage('2')">
            <img class="speaial" src="./images/u548.png">
          <span class="text">安全培训</span>
        </div>

        <div class="sec_me_box box_03"  @click="nextPage('3')">
            <img class="img" src="./images/u556.png">
          <span class="text">安全演练</span>
        </div>


        <div class="sec_me_box box_04"  @click="nextPage('4')">
            <img class="speaial" src="./images/u552.svg">
            <span class="text">安全电子报表</span>
        </div>

        <div class="sec_me_box box_05"  @click="nextPage('5')">
            <img class="img" src="./images/u560.png">
            <span class="text">安全会议</span>
        </div>


        <div class="sec_me_box box_06"  @click="nextPage('6')">
            <img class="img" src="./images/u564.png">
            <span class="text fb">危险作业</span>
        </div>

    </div>
  </div>
</template>
<script>
import header from "@/views/Security/subcomponents/header";

export default {
  data() {
    return{
    }
  },
  created() {
    sessionStorage.removeItem('typeId')
    //系统菜单返回到这一页的时候，需要同时删掉缓存中的模块辨别码
  },
  methods: {
    //进入下一页：系统菜单，参数为模块辨别码：1为安全检查，2为安全培训，3为安全演练，4为安全电子报表，5为安全会议，6为危险作业
    nextPage(id){
      sessionStorage.removeItem('header')//删除缓存中的导航栏路由
      this.$router.push({ name: 'enteredMenu', query: { typeId:id } })
    }
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    'back-box': header
  }
}
</script>

<style lang="scss" scoped>
.menu_container {
  font-weight: 700;
  font-size: 20px;

  .menu_box {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 26px;

    //security_meun_box
    .sec_me_box {
      display: flex;
      flex-direction: column;
      width: 45%;
      height: 170px;
      border-radius: 8px;
      box-shadow: 1px 2px 4px rgba(215, 215, 215, 0.780392156862745);
      text-align: center;
      margin-bottom: 26px;
      position: relative;

      .img {
        margin: 20px auto;
      }

      .speaial{
        position: absolute;
        left: 50%;
      }

      .text {
        display: block;
        width: 120px;
        color: #F3F8F3;
        position: absolute;
        bottom: 16px;
        left: 50%;
        margin-left: -60px;
      }
      //font-black
      .fb {
        color: #313131;
      }
    }

    .box_01 {
      background-color: #36AB60;

      img {
        width: 139px;
        height: 93px;
        margin-left: -69.5px;
        margin-top: 20px;
      }

    }

    .box_02 {
      background-color: #E98F36;

      img {
        width: 118px;
        height: 87px;
        margin-left: -50px;
        margin-top: 24px;
      }
    }

    .box_03 {
      background-color: #D81E06;

      img {
        width: 80px;
        height: 84px;
      }
    }

    .box_04 {
      background-color: #A4579D;
      white-space:nowrap;
      img {
        width: 160px;
        height: 160px;
        margin-left: -82px;
        margin-top: -16px;
      }
    }

    .box_05 {
      background-color: #1195DB;

      img {
        width: 81px;
        height: 85px;
      }
    }

    .box_06 {
      background-color: #F4EA29;

      img {
        width: 81px;
        height: 85px;
      }
    }
  }
}
</style>