import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/blog-list',
      name: '博客列表',
      component: () => import('../views/BlogList.vue')
    },
    {
      path: '/blog-edit',
      name: '博客编辑',
      component: () => import('../views/BlogEdit.vue')
    }
  ]
})

export default router
