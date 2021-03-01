
<template>
  <div class="record"
       v-loading="loading"
       element-loading-text="拼命加载中..."
       v-loading.lock="true">
    <div v-for="(item, index) in orderData"
         :key="index">
      <order-record :recordType="2"
                    :recordData="item"></order-record>
    </div>
    <div class="no-order"
         v-if="Object.keys(orderData).length == 0">
      <span>未查询到符合条件的工单</span>
    </div>
  </div>
</template>

<script>
import OrderRecord from '../../components/OrderRecord'
import dic from '../../utils/dictionary'
export default {
  data () {
    return {
      orderData: {},
      loading: true
    }
  },
  components: {
    OrderRecord
  },
  // 解决keep-alive的冲突
  beforeRouteEnter (to, from, next) {
    if (from.name == 'orderquery') {
      next(vm => {
        // 通过 `vm` 访问组件实例
        vm.getQuery()
      })
    } else {
      next()
    }
  },
  methods: {
    // 获取到传过来的参数
    async getQuery () {
      let query = this.$route.query
      let unEdit = this.$route.query.unEdit
      // // 修正query.status的类型
      if (typeof query.status === 'object') {
        query.status = query.status.join(',')
      }
      this.orderData = []
      // 根据获取的数据请求符合条件的工单
      await this.$http.httpGet('/app/apptborder/list', query).then(res => {
        this.loading = false
        if (res.code === 0 && res.msg === 'success') {
          this.orderData = res.data

          // 对紧急程度处理一下
          this.orderData.forEach(item => {
            item.level = dic.levelDic[item.level]
            item.orderType = dic.orderTypeDic[item.type]
          })

          // 判断是不是不可以编辑的
          if (unEdit == '1') {
            this.orderData.forEach(item => {
              item.unEdit = true
            })
          }
        } else {
          this.$message.error('获取数据失败: ' + res.msg)
        }
      })
    }
  },
  mounted () {
    this.getQuery()
  },
  activated () {
    // 创建工单后跳转过来后，再返回创建工单再过来就会刷新
    this.getQuery()
  }
}
</script>

<style scoped lang="scss">
.no-order {
  padding-top: 3rem;
  text-align: center;
  span {
    font-size: 1.8rem;
  }
}
</style>
