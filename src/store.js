import Vue from 'vue'
import Vuex from 'vuex'

const CUR_ASSIGNED = 'cur_assigned'
const CUR_HELPER = 'cur_helper'
const CUR_CHECKUSER = 'cur_checkuser'
const CUR_ROLELIST = 'cur_rolelist'
const CUR_MAINTENANCE_PERSON = 'cur_mainTenance_person'
const IS_SEARCH = 'is_search'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    orderAssigned: {}, // 工单负责人信息
    orderHelper: [], // 工单协助人
    orderCheckUser: [], //检查人
    roleList: [], // 职位
    maintenancePerson: {}, // 保养负责人
    is_search: false // 是否处于搜索框输入的状态
  },
  mutations: {
    [CUR_ASSIGNED](state, assigned) {
      state.orderAssigned = assigned
    },
    [CUR_HELPER](state, helper) {
      state.orderHelper = helper
    },
    [CUR_CHECKUSER](state, checkuser) {
      state.orderCheckUser = checkuser
    },
    [CUR_ROLELIST](state, roleList) {
      state.roleList = roleList
    },
    [CUR_MAINTENANCE_PERSON](state, maintenancePerson) {
      state.maintenancePerson = maintenancePerson
    },
    [IS_SEARCH](state, is_search) {
      state.is_search = is_search
    }
  },
  actions: {
    changeCurAssigned(ctx, assigned) {
      ctx.commit(CUR_ASSIGNED, assigned)
    },
    changeCurHelper(ctx, helper) {
      ctx.commit(CUR_HELPER, helper)
    },
    changeCurCheckUser(ctx, checkuser) {
      ctx.commit(CUR_CHECKUSER, checkuser)
    },
    changeCurRoleList(ctx, roleList) {
      ctx.commit(CUR_ROLELIST, roleList)
    },
    changeCurMaintenancePerson(ctx, maintenancePerson) {
      ctx.commit(CUR_MAINTENANCE_PERSON, maintenancePerson)
    },
    toggleIsSearch(ctx, is_search) {
      ctx.commit(IS_SEARCH, is_search)
    }
  }
})
