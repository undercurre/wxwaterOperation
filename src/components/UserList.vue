<template>
  <!-- 用户列表组件 -->
  <div class="user-list">
    <ul>
      <li class="list-item"
          v-for="(item, index) in userList"
          @click="handleClick($event,index)"
          :key="index">
        <div class="left">
          <div class="avatar">
            <img :src="item.avatar"
                 alt="头像">
          </div>
          <div class="info">
            <span class="name">{{item.username}}</span>
            <span class="phone">{{item.tel}}</span>
          </div>
        </div>
        <!-- 后面的checkbox可以用watch来进行获取值，需要绑定一个数组 -->
        <div class="right"
             @click="handleClick($event,index)"
             v-show="isMulti">
          <input type="checkbox"
                 name="user"
                 ref="checkbox"
                 :value="index">
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    userList: {
      type: Array
    },
    isMulti: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      checkList: [],
    }
  },
  computed: {
    ...mapState(['is_search'])
  },
  methods: {
    // 点击一整个工人信息框
    handleClick (e, index) {
      // e.cancelBubble = true
      // 先判断是否是单选
      if (this.isMulti === false) {
        this.checkList = []
        this.$emit('selectedHeaderPerson', this.userList[index])
      } else {
        // 多选
        let checkbox = this.$refs.checkbox
        if (checkbox[index].checked === false) {
          checkbox[index].checked = true
          this.checkList.push(this.userList[index])
        } else {
          // 将该index对应的用户移除已选择的数组
          this.checkList = this.checkList.filter((item) => {
            return item != this.userList[index]
          })
          checkbox[index].checked = false
        }
        this.$emit('selectedHelpPerson', this.checkList)
      }
    },

    // 进来时候应该判断有没有数据，有的话要打勾
    isCheckedOrNot () {
      let checkbox = this.$refs.checkbox // checked属性决定是否选中
      let data = this.$store.state.orderHelper
      let idx = [] // 要选中的那个的index
      if (data && this.isMulti == true) {
        // 有数据 且 多选
        // 对userList遍历
        this.userList.forEach((item, index) => {
          // 对data遍历
          data.forEach(dataItem => {
            // 解决后端人员命名不一致的bug
            if (dataItem.userName) {
              if (dataItem.userName == item.username) {
                // 拿到已经有了的index
                idx.push(index)
              }
            } else {
              if (dataItem.username == item.username) {
                // 拿到已经有了的index
                idx.push(index)
              }
            }
          })
        })
      }

      // 默认的为不勾中
      checkbox.forEach(item => {
        item.checked = false
      })

      // 通过这个idx将已经有的人员放到userlist里面并改变选择框的状态
      if (idx.length !== 0) {
        idx.forEach(item => {
          checkbox[item].checked = true
          this.checkList.push(this.userList[item])
        })
      }
    }
    // }
  },
  watch: {
    userList () {
      this.$nextTick(function () {
        this.isCheckedOrNot()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.user-list {
  ul {
    .list-item {
      margin-bottom: 1rem;
      padding: 1rem 0;
      padding-left: 2rem;
      border-top: 0.1rem solid #eee;
      border-bottom: 0.1rem solid #eee;
      box-shadow: 0 0.3rem 0.5rem #eee;
      position: relative;
      .left {
        display: flex;
        flex-direction: row;
        .avatar {
          width: 5rem;
          height: 5rem;
          img {
            border-radius: 50%;
            width: 5rem;
            height: 5rem;
          }
        }
        .info {
          font-size: 1.4rem;
          padding: 1rem 0 0 1rem;
          display: flex;
          flex-direction: column;
          .name {
            color: #333;
          }
          .phone {
            margin-top: 0.5rem;
            font-size: 1.2rem;
            color: #999;
          }
        }
      }
      .right {
        position: absolute;
        right: 1rem;
        top: 2rem;
        z-index: 5;
      }
    }
  }
}
</style>
