
<template>
  <div class="device-object">
    <div class="object-wrapper">
      <div class="btn-up">
        <button class="btn"
                @click="fixedAssets">固定资产设备</button>
      </div>
      <div class="btn-down">
        <button class="btn"
                @click="nonFixedAssets">非固定资产设备</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    fixedAssets () {
      // 去扫码页面
      this.$router.push({ name: 'numbersearch' })
    },
    nonFixedAssets () {
      // 直接去填写
      this.$router.push({ name: 'createorder', query: { isFixedAssets: false } })
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/style/global.scss";
.device-object {
  height: 100%;
  padding: 0;
  position: relative;
  // background: #fff;
  .object-wrapper {
    position: relative;
    display: block;
    text-align: center;
    button {
      width: 80%;
      height: 7rem;
      background-color: rgb(4, 206, 4);
      font-size: 1.8rem;
    }
    .btn-up {
      height: 50vh;
      border-bottom: 1px #efefef solid;
      position: relative;
      button {
        margin: calc((50vh - 7rem) / 2) 0;
      }
    }

    .btn-down {
      margin-top: 0;
      button {
        margin: calc((50vh - 7rem - 1px) / 2) 0;
        background-color: orange;
      }
    }
  }
}
</style>
