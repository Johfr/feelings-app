import { createRouter, createWebHistory } from 'vue-router'
import { mount, flushPromises } from '@vue/test-utils'
import AdminPanel from '@components/tests/AdminPanel.vue'

const routes = [
  { path: '/', name: 'Home' },
  { path: '/admin', name: 'AdminPanel', component: AdminPanel },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

describe('AdminPanel.vue', () => {
  beforeEach(async () => {
    router.push('/')
    await router.isReady()
  })
  describe('check router redirection from props', () => {
    test("Simule un utilisateur non authentifié ou sans rôle admin", async () => {
      const wrapper = mount(AdminPanel, {
        global: {
          plugins: [router],
        },
        props: {
          user: {
            role: 'user',
            authenticated: false,
          },
          tasks: [{
            name: 'ranger',
          },]
        }
      })

      await flushPromises()

      const activeRoute = router.currentRoute.value.fullPath

      expect(activeRoute).toBe('/')

    })
  })

  describe('check admin tasks', () => {
    test("Vérifie l'Affichage des Tâches pour un Admin Authentifié", async () => {
      const wrapper = mount(AdminPanel, {
        global: {
          plugins: [router],
        },
        props: {
          user: {
            role: 'admin',
            authenticated: true,
          },
          tasks: [
            {
              name: 'travailler',
            },
            {
              name: 'ranger',
            },
            {
              name: 'manger',
            },
          ]
        }
      })

      const tasks = wrapper.findAll('[data-test="tasks"]')

      expect(tasks).toHaveLength(3)

    })
  })

  describe('check router navigation', () => {
    test("Vérifie la Navigation vers /admin pour un Admin Authentifié", async () => {
      router.push('/admin')
      await router.isReady()

      const wrapper = mount(AdminPanel, {
        global: {
          plugins: [router],
        },
        props: {
          user: {
            role: 'admin',
            authenticated: true,
          },
          tasks: [
            {
              name: 'travailler',
            },
            {
              name: 'ranger',
            },
            {
              name: 'manger',
            },
          ]
        }
      })
      await flushPromises()
      
      const currentRoute = router.currentRoute.value.fullPath

      expect(currentRoute).toBe('/admin')
    })
  })
  
  // describe('check router navigation', () => {
  //   test("Simule un utilisateur non authentifié ou sans rôle admin", async () => {
  //   })
  // })
})
