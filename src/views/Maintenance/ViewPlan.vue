<template>
  <div class="maintenance-plan">
    <div class="plan-wrapper">
      <div class="plan-content">
        <ul class="info-list">
          <li class="list-item">
            <span class="item-left">设备名称：</span>
            <span class="item-right first">{{ deviceName }}</span>
            <!-- 第一个显示按钮 -->
            <button class="btn item-btn" @click.prevent="toSeeMore">
              查看详情
            </button>
          </li>
          <li class="list-item">
            <span class="item-left">保养周期(天)：</span>
            <span class="item-right">{{ mockData.cycle }}</span>
          </li>
          <li class="list-item">
            <span class="item-left">保养内容：</span>
            <span class="item-right">{{ mockData.maintainContent }}</span>
          </li>
          <li class="list-item">
            <span class="item-left">上次保养时间：</span>
            <span class="item-right">{{ mockData.lastMaintainTime }}</span>
          </li>
          <li class="list-item">
            <span class="item-left">保养负责人：</span>
            <span class="item-right">{{ mockData.maintainUser }}</span>
          </li>
<!--          <li class="list-item">-->
<!--            <span class="item-left">负责人电话：</span>-->
<!--            <span class="item-right phone">-->
<!--              <a-->
<!--                :href="'tel:' + this.mockData.maintainUserTel"-->
<!--                :class="this.mockData.maintainUserTel == '无' ? '' : 'phone'"-->
<!--              >-->
<!--                {{ mockData.maintainUserTel }}-->
<!--              </a>-->
<!--            </span>-->
<!--          </li>-->
          <li class="list-item">
            <span class="item-left">设备投入时间：</span>
            <span class="item-right">{{ mockData.useTime }}</span>
          </li>
          <li class="list-item">
            <span class="item-left">计划状态：</span>
            <span class="item-right">{{ status }}</span>
          </li>
        </ul>
      </div>
      <div class="plan-bottom">
        <div class="view">
          <div class="btn-down">
            <button
              class="btn trans"
              v-show="mockData.maintainStatus === 0"
              @click="modifyingPlan"
            >
              修改计划
            </button>
            <button
              class="btn start"
              v-show="mockData.maintainStatus !== 0"
              @click="enablePlan"
            >
              启用计划
            </button>
            <button
              class="btn stop"
              v-show="mockData.maintainStatus === 0"
              @click="deactivatePlan"
            >
              停用计划
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isIOS } from "../../utils/validate";
export default {
  data() {
    return {
      mockData: {
        id: "",
        name: "",
        cycle: "",
        lastMaintainTime: "",
        maintainUser: "",
        maintainUserTel: "",
        useTime: "",
        maintainStatus: "",
      },
      deviceName: "",
      code: "",
    };
  },
  methods: {
    async initData() {
      this.deviceName = this.$route.query.deviceName;
      this.code = this.$route.query.code;
      // 拿到保养信息
      await this.$http
        .httpGet("/app/apptbdevice/maintainPlan", { id: this.$route.query.id })
        .then(res => {
          if (res.code === 0 && res.msg === "success") {
            this.mockData = res.data;
            // 这里要先把保养负责人存进去vuex
            this.$store.dispatch("changeCurMaintenancePerson", {
              username: this.mockData.maintainUser,
              tel: this.mockData.maintainUserTel,
              id: this.mockData.maintainUserId,
            });

            // 遍历对象
            for (let item in this.mockData) {
              if (this.mockData[item] === null) {
                this.mockData[item] = "无";
              }
            }
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    // 修改计划
    modifyingPlan() {
      // 转到editplan 并且 需要设备id和code
      this.$router.push({
        name: "editplan",
        query: {
          id: this.$route.query.id,
          code: this.code,
          editType: "2",
        },
      });
    },
    // 启用
    enablePlan() {
      this.$http
        .httpPost("/app/apptbdevice/maintainPlan", {
          cycle: this.mockData.cycle,
          id: this.mockData.id,
          maintainStatus: 0,
          maintainUserId: this.mockData.maintainUserId,
          useTime: this.mockData.useTime,
        })
        .then(res => {
          if (res.code === 0 && res.msg === "success") {
            this.$message.success("计划已启用");

            isIOS()
              ? setTimeout(() => {
                  window.location.reload();
                }, 500)
              : setTimeout(() => {
                  window.location.href =
                    window.location.href + "&timer=" + 1000 * Math.random();
                }, 500);
            // if (isIOS()) {
            //   setTimeout(() => { window.location.reload() }, 500)
            // } else {
            //   setTimeout(() => { window.location.href = window.location.href + "&timer=" + 1000 * Math.random() }, 500)
            // }
          } else {
            this.$message.error("错误! " + res.msg);
          }
        });
    },
    // 停用
    deactivatePlan() {
      this.$confirm("此操作将停用设备，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .httpPost("/app/apptbdevice/maintainPlan", {
              cycle: this.mockData.cycle,
              id: this.mockData.id,
              maintainStatus: 1,
              maintainUserId: this.mockData.maintainUserId,
              useTime: this.mockData.useTime,
            })
            .then(res => {
              if (res.code === 0 && res.msg === "success") {
                this.$message.success("计划已停用");
                setTimeout(() => {
                  window.history.go(0);
                }, 1000);
              } else {
                this.$message.error("错误! " + res.msg);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消停用设备",
          });
        });
    },
    toSeeMore() {
      this.$router.push({
        name: "deviceinfo",
        query: { id: this.mockData.id, permission: false },
      });
    },
  },
  computed: {
    status() {
      return this.mockData.maintainStatus === 0 ? "进行中" : "已停用";
    },
  },
  mounted() {
    this.initData();
  },
};
</script>

<style lang="scss">
@import "@/assets/style/global.scss";
.maintenance-plan {
  padding: 15px 20px;
  .plan-wrapper {
    .plan-content {
      .info-list {
        .list-item {
          // height: 40px;
          line-height: 30px;
          margin-bottom: 10px;
          position: relative;
          .first {
            // margin-left: 20px;
            padding-right: 8rem;
          }
          .item-left {
            font-size: 15px;
            flex: 110px 0 0;
          }
          .item-btn {
            position: absolute;
            top: 0;
            right: 0;
            width: 8rem;
            height: 3rem;
            font-size: 1.2rem;
            color: #fff;
            background-color: #409eff;
          }
          .phone {
            color: rgb(11, 144, 252);
          }
        }
      }
    }
    .plan-bottom {
      position: fixed;
      width: 100%;
      bottom: 0;
      left: 0;
      z-index: 99;
      border-top: 1px #efefef solid;
      .view {
        .btn-up {
          .create {
            font-weight: 700;
            width: calc(100% - 40px);
            font-size: 1.4rem;
            height: 40px;
            margin: 10px 20px;
            padding: 0 20px;
            background-color: rgb(5, 168, 5);
          }
        }
        .btn-down {
          display: flex;
          justify-content: center;
          align-items: center;

          button {
            height: 60px;
            margin: 0 0;
            font-weight: 700;
            border-radius: 0;
            -webkit-border-radius: 0;
            -moz-border-radius: 0;
          }
          .stop {
            flex: 1;
            background: rgb(184, 6, 6);
          }
          .start {
            flex: 1;
            margin: 0 0;
            background: rgb(230, 230, 32);
            color: #000;
          }
          .trans {
            flex: 1;
            background-color: rgb(5, 168, 5);
          }
        }
      }
    }
  }
}
.el-message-box {
  width: 33rem;
}
</style>
