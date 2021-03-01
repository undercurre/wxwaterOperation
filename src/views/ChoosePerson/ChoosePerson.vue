<template>
  <div class="choose-person">
    <div class="header">
      <input type="text"
             class="header-input"
             v-model="keyword"
             placeholder="请输入用户名">
      <button class="header-btn btn"
              @click="searchByKeyword">搜索</button>
    </div>
    <div class="content">
      <user-list :userList="list"
                 :isMulti="isMulti"
                 @selectedHeaderPerson="selectedHeaderPerson"
                 @selectedHelpPerson="selectedHelpPerson"></user-list>
    </div>
    <div class="bottom"
         v-show="isMulti">
      <button class="btn"
              @click="identifyHelper">确定协助人</button>
    </div>
  </div>
</template>

<script>
import UserList from '../../components/UserList'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      userList: [],
      isMulti: false, // 是否可以多选
      checkedList: [], // 已经被选中的协助人
      headerPerson: '', // 负责人
      keyword: '', // 关键字
      list: [], // 存数据的数组
      queryConditions: {} // 存放查询用户列表的参数
    }
  },
  components: {
    UserList
  },
  methods: {
    // 选择协助人
    selectedHelpPerson (checkList) {
      this.checkedList = checkList
      this.$store.dispatch('changeCurHelper', this.checkedList)
    },
    // 负责人
    selectedHeaderPerson (headerPerson) {
      this.headerPerson = headerPerson
      const TEMP = {
        'assigned': 'changeCurAssigned',
        'header': 'changeCurCheckUser',
        'maintenancePerson': 'changeCurMaintenancePerson'
      }
      this.$store.dispatch(TEMP[this.$route.query.tag], this.headerPerson)
      // if (this.$route.query.tag === 'assigned') {
      //   this.$store.dispatch('changeCurAssigned', this.headerPerson)
      // } else if (this.$route.query.tag === 'header') {
      //   this.$store.dispatch('changeCurCheckUser', this.headerPerson)
      // } else if (this.$route.query.tag === 'maintenancePerson') {
      //   this.$store.dispatch('changeCurMaintenancePerson', this.headerPerson)
      // }
      // 选完后跳回原来那里
      window.history.back(-1)
    },
    getIsMulti () {
      if ((typeof this.$route.query.isMulti) !== 'boolean') {
        this.isMulti = eval(this.$route.query.isMulti.toLowerCase())
      } else {
        this.isMulti = this.$route.query.isMulti
      }
    },
    getUserList () {
      this.queryConditions = {
        id: this.$route.query.id,
        areaId: this.$route.query.areaId,
        departmentId: this.$route.query.departmentId
      }
      this.$http.httpPost('/app/apptbuserinfo/queryOrderAssistant', { areaId: this.queryConditions.areaId, id: this.queryConditions.id, departmentId: this.queryConditions.departmentId }).then(res => {
        if (res.code === 0 && res.msg === 'success') {
          // 如果是多选的检查人 不需要将被指派人也加到里列表里面
          if (this.isMulti == true) {
            let assignedId = this.$store.state.orderAssigned.id || this.$store.state.orderAssigned.assignUserId
            res.list = res.list.filter(item => {
              return item.id !== assignedId
            })
          }
          this.userList = res.list
          this.list = res.list
          this.checkedList = this.$store.state.orderHelper
        } else {
          this.$message.error('获取人员数据失败，原因：' + res.msg)
        }
      })
    },
    // 确定协助人
    identifyHelper () {
      // 这里的this.checkList放完之后要去重，会有重复数据
      let obj = []
      this.checkedList = this.checkedList.filter(item => {
        if (obj[item.id] !== 1) {
          obj[item.id] = 1
          return true
        } else {
          return false
        }
      })
      // 将数据存到vuex或其他地方中，然后跳转
      this.$store.dispatch('changeCurHelper', this.checkedList)
      window.history.back(-1)
    },
    searchByKeyword () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      if (!this.keyword) {
        // keyword为空
        this.list = this.userList
        return
      }
      this.timer = setTimeout(() => {
        const result = []
        this.userList.forEach(item => {
          if (item.username.indexOf(this.keyword) !== -1) {
            result.push(item)
          }
        })
        this.list = result
      }, 300);
    },
  },
  computed: {
    ...mapState(['is_search'])
  },
  mounted () {
    this.getIsMulti()
    this.getUserList()
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/style/global.scss";
.choose-person {
  background-color: #ffffff;
  .header {
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    box-sizing: border-box;
    height: 6rem;
    padding: 1rem;
    display: flex;
    z-index: 5;
    background: #fff;
    .header-input {
      flex: 4;
      margin-right: 2rem;
      padding-left: 1rem;
      border: none;
      background-color: #eee;
      outline: none;
      border-radius: 0.5rem;
      color: #666;
    }
    .header-btn {
      flex: 1;
      background-color: #67c23a;
    }
  }
  .content {
    padding-top: 6rem;
    padding-bottom: 6rem;
  }
  .bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    height: 6rem;
    text-align: center;
    button {
      width: 80%;
      margin-top: 1rem;
      height: 4rem;
      background-color: #67c23a;
      font-size: 1.4rem;
      font-weight: 700;
    }
  }
}
</style>
