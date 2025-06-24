import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@views/HomeView.vue'

import Apps from '@views/apps.vue'
import Years from '@/components/feelings/Years.vue'
import Months from '@/components/feelings/Months.vue'
import wellBeingApp from '@/components/feelings/wellBeingApp.vue'

// import Article from '@views/Article.vue'
import NotFound from '@views/NotFound.vue'
import { useTodoStore } from '@/stores/todoStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/well-being-app',
      name: 'WellBeingApp',
      component: Apps,
      children: [
        {
          path: ':year',
          name: 'year',
          component: Months,
        },
        {
          path: ':year/:month',
          name: 'month',
          component: wellBeingApp,
        },
      ]
    },
    // {
    //   path: '/well-being-app/:year',
    //   name: 'WellBeingAppMonths',
    //   component: Apps,
    // },
    // {
    //   path: '/well-being-app/:year/:month',
    //   name: 'month',
    //   component: Apps,
    // },
    {
      path: '/about2',
      name: 'About2',
      component: HomeView,
    },
    {
      path: '/about3',
      name: 'About3',
      component: HomeView,
    },
    {
      path: '/contact',
      name: 'Contact',
      component: HomeView,
    },
    {
      path: '/linkedin',
      name: 'Linkedin',
      component: HomeView,
    },
    {
      path: '/email',
      name: 'Email',
      component: HomeView,
    },
    {
      path: '/todo',
      name: 'Todo',
      component: HomeView,
    },
    // {
    //   path: '/todo/article',
    //   name: 'Article',
    //   component: Article,
    //   props: route => ({ id: route.params.id, asCreateTodoButton: false }),
    //   beforeEnter: async (to, from, next) => {
    //     const store = useTodoStore()
    //     if (store.todoItems.length === 0) {
    //       await store.loadTodos()
    //     }
    //     next()
    //   },
    //   children: [
    //     {
    //       path: ':id',
    //       name: 'article-detail',
    //       component: Article
    //     }
    //   ]
    // },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  ]
})

export default router
