import { createRouter, createWebHistory } from 'vue-router'
import { mount, flushPromises } from '@vue/test-utils'
import Dashboard from '@components/tests/Dashboard.vue'

const routes = [
  { path: '/dashboard', name: 'dashboard' },
  { path: '/login', name: 'login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

describe('Dashboard.vue', () => {
  beforeEach(async () => {
    router.push('/dashboard')
    await router.isReady()
  })

  describe('check component redirection', () => {
    test("Vérifie que la redirection vers /login se produit si user.authenticated est false.", async () => {
      const wrapper = mount(Dashboard, {
        global: {
          plugins: [router],
        },
        props: {
          user: {
            authenticated: false
          },
        }
      })

      await flushPromises()
      expect(router.currentRoute.value.fullPath).toBe('/login')
    })
  })

  describe('check welcome message', () => {
    test("Vérifie que le message de bienvenue est affiché si user.authenticated est true.", async () => {
      const wrapper = mount(Dashboard, {
        global: {
          plugins: [router],
        },
        props: {
          user: {
            authenticated: true,
            name: "joh"
          },
        }
      })
      const msg = wrapper.find("h1")
      expect(msg.text()).toBe('Welcome, joh!')
    })
  })

  describe('check if user is well logged and redirect to dashboard', () => {
    test("Vérifie que la navigation se fait bien vers /dashboard après authentification.", async () => {
      const wrapper = mount(Dashboard, {
        global: {
          plugins: [router],
        },
        props: {
          user: {
            authenticated: true
          },
        }
      })

      expect(router.currentRoute.value.fullPath).toBe('/dashboard')
    })
  })
})