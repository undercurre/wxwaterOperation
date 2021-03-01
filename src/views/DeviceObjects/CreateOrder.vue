<template>
  <div class="create-order">
    <div class="form-wrapper">
      <el-form label-width="90px"
               label-position="right"
               :rules="rules"
               ref="form"
               :model="formLabelAlign">
        <el-form-item label="设备名称:"
                      prop="deviceName">
          <!-- 固定资产时候直接获取 -->
          <div class="fixed"
               v-if="isFixedAssets === true">
            <input type="text"
                   class="fixed-device-name"
                   v-model="formLabelAlign.deviceName"
                   disabled>
            <button class="fixed-btn btn"
                    @click.prevent="toSeeMore">查看详情</button>
          </div>
          <!-- 非固定资产手填 -->
          <div class="notfixed"
               v-else>
            <el-input v-model="formLabelAlign.deviceName"
                      placeholder="请输入设备名"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="工单类型:">
          <el-radio-group v-model="formLabelAlign.orderType">
            <el-radio :label="0">维修</el-radio>
            <el-radio :label="1">保养</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择部门:"
                      prop="departmentId"
                      v-if="isFixedAssets === false">
          <el-select v-model="formLabelAlign.departmentId"
                     style="width:100%"
                     placeholder="请选择设备使用部门">
            <el-option v-for="item in options"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id"
                       :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在位置:"
                      v-if="isFixedAssets === true"
                      style="margin-top: 20px;">
          <el-input v-model="formLabelAlign.devicePosition"
                    disabled
                    placeholder="设备所在位置"></el-input>
        </el-form-item>
        <el-form-item label="详细位置:"
                      :prop="!isFixedAssets ? 'location' : ''">
          <el-input v-model="formLabelAlign.location"
                    type="textarea"
                    rows="3"
                    maxlength="100"
                    placeholder="设备位置，100字以内"></el-input>
        </el-form-item>
        <el-form-item label="工单描述:"
                      style="margin-top: 20px;">
          <el-input v-model="formLabelAlign.description"
                    type="textarea"
                    rows="6"
                    maxlength="500"
                    placeholder="工单描述，500字以内"></el-input>
        </el-form-item>

        <el-form-item label="附件:"
                      style="margin-top: 2rem;">
          <div class="upload">
            <UploadImage ref="uploadImage"
                         @changeIsPicSuccess="changeIsPicSuccess"
                         @getFileIds="getFileIds"></UploadImage>
          </div>
        </el-form-item>
        <div class="form-submit">
          <el-button class="btn"
                     :disabled="btnDisabled"
                     :loading="submitTag !== 'normal'"
                     @click.prevent="createOrder">
            <span v-if="submitTag === 'normal'">创建工单</span>
            <span v-else-if="submitTag === 'uploadImg'">图片上传中</span>
            <span v-else>创建中</span>
          </el-button>
          <div class="tips">注：工单将推送给对应部门的设备负责人</div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { debounce } from '../../utils/common'
import UploadImage from '../../components/UploadImage'
export default {
  data () {
    return {
      isFixedAssets: false, // 是否是固定资产，默认为是
      code: '',
      formLabelAlign: {
        deviceName: '',
        description: '',
        orderType: 0,
        location: '',
        id: '',
        departmentId: '',
        devicePosition: ''
      },
      assetsType: '', // 资产类型
      fileList: [], // 上传的文件列表
      file: null,
      fileIds: [], // 文件id
      rules: {
        deviceName: [
          { required: true, message: '请输入设备名', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '请输入设备位置', trigger: 'blur' }
        ],
        departmentId: [
          { required: true, message: '请选择设备所属部门', trigger: 'blur' }
        ]
      },
      options: [],
      submitTag: 'normal',
      process: 0, // 进度
      btnDisabled: false
    }
  },
  components: {
    UploadImage
  },
  methods: {
    // 获取设备资产类型
    getAssetsType () {
      // eval(a.toLowerCase()) 将a转为Boolean类型的
      if ((typeof this.$route.query.isFixedAssets) !== 'boolean') {
        this.isFixedAssets = eval(this.$route.query.isFixedAssets.toLowerCase())
      } else {
        this.isFixedAssets = this.$route.query.isFixedAssets
      }
      if (this.isFixedAssets === true) {
        // 固定资产
        this.assetsType = 0
        // 固定资产还要通过code拿数据
        this.code = this.$route.query.code
        this.$http.httpGet('/app/apptbdevice/queryDeviceByCode', { code: this.code }).then(res => {
          if (res.code === 0 && res.msg === 'success') {
            let data = res.data
            this.formLabelAlign.deviceName = data.name
            this.formLabelAlign.location = data.location
            this.formLabelAlign.devicePosition = data.devicePosition || '无'
            this.formLabelAlign.id = data.id
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.assetsType = 1
        // 获取地区的部门
        let areaId = sessionStorage.getItem('areaId')
        if (areaId == 'null' || areaId == '') {
          this.$message.error('未分配地区，查询部门信息失败')
        } else {
          this.$http.httpGet('/app/tbdepartment/list-all', {
            areaId
          }).then(res => {
            if (res.code === 0 && res.msg === 'success') {
              this.options = res.data
            } else {
              this.$message.error('获取部门信息失败，原因:' + res.msg)
            }
          })
        }
      }
    },
    createOrder: debounce(function () {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 非固定资产的提交
          if (this.submitTag === 'normal') {
            this.submitTag = 'creating'
            if (this.assetsType === 1) {
              this.$http.httpPost('/app/apptborder/addDeviceOrder', {
                "assetType": this.assetsType,
                "description": this.formLabelAlign.description,
                "deviceName": this.formLabelAlign.deviceName,
                "location": this.formLabelAlign.location,
                "orderType": this.formLabelAlign.orderType,
                "fileIds": this.fileIds,
                "departmentId": this.formLabelAlign.departmentId
              }).then(res => {
                if (res.code === 0 && res.msg === 'success') {
                  this.$message({
                    message: '创建成功',
                    type: 'success'
                  });
                  this.$refs.uploadImage.clearFile()
                  this.formLabelAlign = {
                    "description": '',
                    "deviceName": '',
                    "location": '',
                    "orderType": 0,
                  }
                  this.back()
                } else {
                  this.$message({
                    message: `创建失败，错误信息:${res.msg}`,
                    type: 'error'
                  });
                }
                this.submitTag = 'normal'
                this.btnDisabled = true
              })
            } else {
              // 固定资产的提交
              this.$http.httpPost('/app/apptborder/addDeviceOrder', {
                "assetType": this.assetsType,
                "description": this.formLabelAlign.description,
                "deviceName": this.formLabelAlign.deviceName,
                "location": this.formLabelAlign.location,
                "orderType": this.formLabelAlign.orderType,
                "deviceId": this.formLabelAlign.id,
                "fileIds": this.fileIds
              }).then(res => {
                if (res.code === 0 && res.msg === 'success') {
                  this.$message({
                    message: '创建成功',
                    type: 'success'
                  });
                  this.$refs.uploadImage.clearFile()
                  this.formLabelAlign.description = ''
                  this.formLabelAlign.orderType = 0
                  this.back()
                } else {
                  this.$message({
                    message: '创建失败：' + res.msg,
                    type: 'error'
                  });
                }
                this.submitTag = 'normal'
                this.btnDisabled = true
              })
            }
          }
        } else {
          // 校验没通过
          this.$message({
            message: '校验不通过',
            type: 'error'
          });
        }
      })
    }),
    // 回到工单列表页面
    back () {
      const curUserId = sessionStorage.getItem('userId')
      setTimeout(() => {
        this.$router.push({
          name: 'record',
          query: {
            createUserId: curUserId
          }
        })
      }, 1000);
    },
    toSeeMore () {
      this.$router.push({
        name: 'deviceinfo',
        query: {
          id: this.formLabelAlign.id,
          permission: false
        }
      })
    },
    changeIsPicSuccess (flag) {
      this.submitTag = flag ? 'normal' : 'uploadImg'
    },
    getFileIds (fileIds) {
      this.fileIds = fileIds
    }
  },
  created () {
    this.$nextTick(() => {
      this.getAssetsType()
    })
  }
}
</script>

<style lang="scss">
@import '@/assets/style/global.scss';
.create-order {
  width: 100%;
  padding: 0;
  background: #fff;
  .form-wrapper {
    .el-form {
      padding: 15px 15px;
      .el-form-item__label {
        // font-weight: 700;
        font-size: 14px;
        color: #000;
      }
      .el-form-item {
        margin-bottom: 10px;
        .fixed {
          position: relative;
          .fixed-device-name {
            border: none;
            outline: none;
            font-size: 1.6rem;
            background-color: inherit;
            cursor: not-allowed;
          }
          input:disabled {
            color: #333;
            opacity: 0.8;
            -webkit-text-fill-color: #333;
          }
          .fixed-btn {
            position: absolute;
            right: 0;
            top: 0;
            width: 8rem;
            height: 3rem;
            font-size: 1.2rem;
            color: #fff;
            background: #409eff;
          }
        }
      }
      .form-submit {
        text-align: center;
        width: 100%;
        z-index: 99;
        border-top: 1px #efefef solid;
        border-bottom: 1px #efefef solid;
        button {
          width: 80%;
          height: 4rem;
          margin: 10px 0;
          background-color: #67c23a;
          font-size: 1.6rem;
          font-weight: bold;
          &:hover,
          &:active {
            color: #fff;
          }
        }
        .tips {
          font-size: 1.4rem;
          color: #ccc;
          // margin-top: 1rem;
          padding-bottom: 0.5rem;
        }
      }
    }
  }
}
.el-radio.is-disabled {
  border-color: #e4e7ed;
  color: #333;
  opacity: 0.8;
  -webkit-text-fill-color: #333;
  cursor: not-allowed;
}
</style>
