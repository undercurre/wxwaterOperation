<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>

</script>

<style lang="scss">
@media screen and (orientation:portrait) {
  .setUp_container{
    font-size: 14px;
    line-height: 1.5;
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
        height: 0 !important;

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
#app {
  width: 100%;
  height: 100%;
  background: #fff;
  .el-loading-mask {
    position: fixed;
    .el-loading-spinner {
      top: 40%;
      i {
        font-size: 2rem;
      }
      .el-loading-text {
        margin-top: 2rem;
        font-size: 1.6rem;
      }
    }
  }
}
.el-popover{
    .confirm{
      width: 100%;
    }
}
.el-table__expanded-cell{
  padding: 10px !important;
}
.el-table {
  .index {
    background: #6988E9;
    color: #ffffff;
  }
  .content {
    background: #EC9939;
    color: #ffffff;
  }
  .condition{
    background: #ED1818;
    color: #ffffff;
  }
  .inspect{
    background: #F65555;
    color: #ffffff;
  }
  .column00{
    opacity: 0;
  }
  .column00Header{
    background-color: #6988E9;
    border-right: none;
  }
  .mb8{
    margin-bottom: 8px;
  }
}
.cell {
  .el-switch {
    .el-switch__core {
      height: 14px;
    }

    .el-switch__core::after {
      width: 12px;
      height: 12px;
      margin-top: -1px;
    }

    .el-switch__label {
      color: #7F7F7F;
      margin: 4px;
      white-space: nowrap;
      *{
        font-size: 8px !important;
      }
    }
  }
  .is-checked{
    .el-switch__core::after{
      margin-left: -13px !important;
      margin-top: -1px !important;
    }
  }
}
.nut-vert-scroll {
  .scroll_item {
    .shadow {
      .nut-checkbox {
        .nut-checkbox-label {
          font-size: 0;
        }
      }
    }
  }
}
.signature_box {
  p {
    margin: 30px;
    font-size: 16px;
  }
  .drawerBtn {
    margin-top: -15px;
    width: 100%;
    background-color: #eeeeee;
    color: #5E5E5E;
    border: none;
    margin-bottom: 30px;
    border-radius: 0;
    display: flex;
    justify-content: center;
  }
  .confirmSign {
    img {
      width: 100%;
      height: 300px;
    }
  }
  .signaturenter {
    width: 100%;
    .el-drawer__header {
      height: 5%;
      margin: 0;
      padding: 0;
    }
    .el-drawer__body {
      height: 95%;
    }
    .nut-signature {
      height: 90%;
      .nut-signature-inner {
        width: 100%;
        height: 100%;
        margin: 0;
      }
      .nut-button {
        width: 50%;
        display: block;
        float: left;
        height: 36px;
        font-size: 24px;
      }
    }
    .el-collapse-item__header {
      font-size: 16px;
    }
  }
}
</style>
