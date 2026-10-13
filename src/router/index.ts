import { campaignLevel, levelIdFromString, LevelKind } from '@/assets/data/levels'
import { isEqual } from 'lodash'
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history:
    process.env.VUE_APP_HASH_ROUTER === 'true'
      ? createWebHashHistory(process.env.BASE_URL)
      : createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/components/HomePage/index.vue'),
      meta: {
        preventSound: true,
      },
    },
    {
      path: '/levels',
      name: 'levels',
      component: () => import('@/components/LevelMapPage/index.vue'),
    },
    {
      path: '/level/:id',
      name: 'level',
      component: () => import('@/components/GamePage/index.vue'),
      beforeEnter: (route) => {
        const id = levelIdFromString(route.params.id as string)
        if (id.kind !== LevelKind.Campaign || campaignLevel(id.index) == null) {
          return { name: 'levels' }
        }
      },
      props: (route) => {
        return {
          levelId: levelIdFromString(route.params.id as string),
        }
      },
    },
    {
      path: '/lab',
      name: 'lab',
      component: () => import('@/components/GamePage/index.vue'),
      props: { levelId: { kind: LevelKind.Lab } },
    },
    {
      path: '/info',
      component: () => import('@/components/EncyclopediaPage/index.vue'),
      children: [
        {
          path: '',
          component: () => import('@/components/EncyclopediaPage/EncyclopediaMainPage.vue'),
        },
        {
          path: '/info/:entry',
          component: () => import('@/components/EncyclopediaPage/EncyclopediaArticle.vue'),
        },
      ],
    },
    {
      path: '/register',
      name: 'register',
      redirect: '/levels',
    },
    {
      path: '/login',
      name: 'login',
      redirect: '/levels',
    },
    {
      path: '/myaccount',
      name: 'myaccount',
      redirect: '/levels',
    },
    {
      path: '/savedlevels',
      name: 'savedlevels',
      redirect: '/levels',
    },
    {
      path: '/options',
      name: 'options',
      component: () => import('@/components/OptionsPage/index.vue'),
    },
    {
      path: '/rocks/:id',
      name: 'rocks',
      component: () => import('@/components/RockTalkPage/index.vue'),
    },
    {
      path: '/dev/rock_talk',
      component: () => import('@/components/RockTalkPage/RockDemo.vue'),
    },
    {
      path: '/dev/cells',
      component: () => import('@/components/RockTalkPage/CellsDemo.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('@/components/NotFoundPage/index.vue'),
    },
  ],
})

// preserve feature flags in the route
router.beforeEach((to, from, next) => {
  const mergedQuery = { ...from.query, ...to.query }
  if (!isEqual(to.query, mergedQuery)) {
    next({ ...to, query: { ...from.query, ...to.query } })
  } else {
    next()
  }
})

export default router
