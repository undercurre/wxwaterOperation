import Vue from 'vue'
import Router from 'vue-router'
import VueCookies from 'vue-cookies'
import axios from 'axios'
import store from './store'

import { Message } from 'element-ui'
import $http from "@/utils/http";

let Base64 = require('js-base64').Base64

Vue.use(Router)
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/choosePerson',
      name: 'choosePerson',
      component: () => import('./views/Security/choosePerson.vue'),
      meta: {
        title: '人员选择',
      }
    },
      {
        path: '/Security/query',
        name: 'security_query',
        component: () => import('./views/Security/query.vue'),
        meta: {
          title: "搜索",
        }
      },
      {
        path: '/Security/setUp',
        name: 'security_setUp',
        component: () => import('./views/Security/setUp.vue'),
        meta: {
          title: "创建",
        }
      },
      {
        path: '/Security/detail',
        name: 'security_detail',
        component: () => import('./views/Security/detail.vue'),
          meta: {
            title: "详情"
          }
      },
      {
        path: '/Security/record',
        name: 'security_record',
        component: () => import('./views/Security/record.vue'),
        meta: {
          title: '记录'
        }
      },
      {
          path: '/Security/enteredMenu',
          name: 'enteredMenu',
          component: () => import('./views/Security/enteredMenu.vue'),
          meta: {
              title: '系统菜单'
          }
      },
    {
      path: '/Security',
      name: 'Security',
      component: () => import('./views/Security/menu.vue'),
      meta: {
        title: '安全系统菜单'
      }
    },
    {
      path: '/deviceinfo',
      name: 'deviceinfo',
      component: () => import('./views/DeviceInfo/DeviceInfo.vue'),
      meta: {
        title: '设备信息'
      }
    },
    {
      path: '/numbersearch',
      name: 'numbersearch',
      component: () => import('./views/NumberSearch/NumberSearch.vue'),
      meta: {
        title: '编号查询'
      }
    },
    {
      path: '/deviceobject',
      name: 'deviceobject',
      component: () => import('./views/DeviceObjects/DeviceObjects.vue'),
      meta: {
        title: '设备类别'
      }
    },
    {
      path: '/createorder',
      name: 'createorder',
      component: () => import('./views/DeviceObjects/CreateOrder'),
      meta: {
        title: '创建工单'
      }
    },
    {
      path: '/record',
      name: 'record',
      component: () => import('./views/Record/Record'),
      meta: {
        title: '工单记录',
        keepAlive: true
      }
    },
    {
      path: '/remindrecord',
      name: 'remindrecord',
      component: () => import('./views/Record/ReminderRecord'),
      meta: {
        title: '提醒记录'
      }
    },
    {
      path: '/viewplan',
      name: 'viewplan',
      component: () => import('./views/Maintenance/ViewPlan'),
      meta: {
        title: '查看计划'
      }
    },
    {
      path: '/editplan',
      name: 'editplan',
      component: () => import('./views/Maintenance/EditPlan'),
      meta: {
        title: '编辑计划',
        keepAlive: true
      }
    },
    {
      path: '/orderquery',
      name: 'orderquery',
      component: () => import('./views/OrderQuery/OrderQuery'),
      meta: {
        title: '工单查询',
        keepAlive: true
      }
    },
    {
      path: '/choose',
      name: 'choose',
      component: () => import('./views/ChoosePerson/ChoosePerson'),
      meta: {
        title: '人员选择',
        keepAlive: false
      }
    },
    {
      path: '/details',
      component: () => import('./views/Details/Details'),
      meta: {
        // keepAlive: true,
        title: '工单详情'
      },
      children: [
        {
          path: 'edit',
          name: 'edit',
          meta: {
            keepAlive: true,
            title: '工单详情(编辑)'
          },
          component: () => import('./views/Details/Children/Edit')
        },
        {
          path: 'unedit',
          name: 'unedit',
          meta: {
            keepAlive: true,
            title: '工单详情(查看)'
          },
          component: () => import('./views/Details/Children/UnEdit')
        },
        {
          path: '/',
          redirect: 'edit'
        }
      ]
    }
  ],
  // 路由跳转没有回到顶部的问题
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 通过url的token来注册
  let token = sessionStorage.getItem('wxtoken') || ''
  // 如果session和query都没有token，需要去授权
  if (token == '' && !to.query.token) {
    // 去授权
    let url =
      process.env.VUE_APP_AUTHORIZEURL +
      escape('http://shuichang.xinglian.info' + to.fullPath)
    // window.location.href = process.env.VUE_APP_AUTHORIZEURL + uri
    window.location.replace(url)
  } else {
    if (token) {
      // 说明已经有了token，可以直接过去了       
      if (to.name === 'deviceinfo' && !to.query.token) {
        window.location.href =
          process.env.VUE_APP_URL + to.fullPath + '&token=' + token
      } else {
        next()
      }
    } else {
      // 说明第一次进来，session中没有token
      token = to.query.token
      if (!token || !/\S/.test(token)) {
        Message({
          message: '用户未注册或未激活（没有token）',
          type: 'error'
        })
      } else {
        // 第一次拿着token进来要做的事情
        let userIdToken = token.slice(
          token.indexOf('.') + 1,
          token.lastIndexOf('.')
        )
        // 拿到userId和roleList
        let data = JSON.parse(Base64.decode(userIdToken))
        let userId = data.sub
        let roleList = data.roleList.split(',')
        let areaId = data.areaId

        sessionStorage.setItem('wxtoken', token, 30 * 60)
        sessionStorage.setItem('userId', userId)
        sessionStorage.setItem('roleList', JSON.stringify(roleList))
        sessionStorage.setItem('areaId', areaId)
        store.dispatch('changeCurRoleList', roleList)
        next()
      }
    }
  }
})

export default router
