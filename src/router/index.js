import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import petugas from '../views/datapetugas.vue'
import data_pelanggaran from '../views/data_pelanggaran.vue'
import data_siswa from '../views/data_siswa.vue'
import input_pelanggaran from '../views/input_pelanggaran.vue'
import poin_siswa from '../views/poin_siswa.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Pengaduan from '../views/Pengaduan.vue'


import Navbar from '../views/layouts/Navbar.vue'
import Footer from '../views/layouts/Footer.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  // {
  //   path: '/',
  //   name: 'home',
  //   components: {default: Home, header: Navbar, footer: Footer},
  //   meta: { 
  //     requiresAuth: true
  //   }
  // },
  {
    path: '/Pengaduan',
    name: 'Pengaduan',
    components: {default: Pengaduan, header: Navbar, footer: Footer},
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/petugas',
    name: 'petugas',
    components: {default: petugas, header: Navbar, footer: Footer},
    meta: 
    {
      requiresAuth: true
    }
  },
  {
    path: '/data_siswa',
    name: 'data_siswa',
    components: {default: data_siswa, header: Navbar, footer: Footer},
    meta:
    {
      requiresAuth: true
    }
  },
  {
    path: '/data_pelanggaran',
    name: 'data_pelanggaran',
    components: {default: data_pelanggaran, header: Navbar, footer: Footer},
    meta:
    {
      requiresAuth: true
    }
  },
  {
    path: '/input_pelanggaran',
    name: 'input_pelanggaran',
    components: {default: input_pelanggaran, header: Navbar, footer: Footer},
    meta:
    {
      requiresAuth: true
    }
  },
  {
    path: '/poin_siswa',
    name: 'poin_siswa',
    components: {default: poin_siswa, header: Navbar, footer: Footer},
    meta:
    {
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'profile',
    components: {default: Profile, header: Navbar, footer: Footer},
    meta: { 
      requiresAuth: true
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login') 
  } else {
    next() 
  }
})

export default router
