import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@views/HomeView.vue'

import Apps from '@views/apps.vue'
import MonthsList from '@/components/feelings/MonthsList.vue'
import wellBeingApp from '@/components/feelings/wellBeingApp.vue'
import NotFound from '@views/NotFound.vue'
// import { useDayNoteStore } from '@/stores/dayNoteStore'
// import YearsList from '@/components/feelings/YearsList.vue'

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
          component: MonthsList,
        },
        {
          path: ':year/:month',
          name: 'month',
          component: wellBeingApp,
        },
        {
          path: ':year/:month/:date',
          name: 'date',
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
      path: '/dayNote',
      name: 'DayNote',
      component: HomeView,
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  ]
})

export default router
