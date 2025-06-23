import { createRouter, createWebHistory } from 'vue-router'
import { mount } from '@vue/test-utils'
import Navbar from '@components/tests/Navbar.vue'

const routes = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/authenticated', name: 'Authenticated' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

describe('Navbar.vue', () => {
  beforeEach(async () => {
    // Assurez-vous que le routeur est prêt avant chaque test
    router.push('/')
    await router.isReady()
  })

  describe('check all links exist', () => {
    test("Vérifie que les liens de navigation sont correctement rendus", () => {
      const wrapper = mount(Navbar, {
        global: {
          plugins: [router],
        },
        props: {
          userAuthenticated: true,
        }
      })
      const links = wrapper.findAllComponents({ name: 'RouterLink' })

      expect(links).toHaveLength(3)  // Vérifie qu'il y a bien 3 liens
    })
  })

  describe('check link with active-link class', () => {
    test("Vérifie que le lien actif reçoit la classe active-link", async () => {
      const wrapper = mount(Navbar, {
        global: {
          plugins: [router],
        },
        props: {
          userAuthenticated: true,
        },
      })
      
      router.push('/')
      await router.isReady()

      const homeLink = wrapper.find('#home')
    
      expect(homeLink.classes()).toContain('router-link-active')  // Classe par défaut pour le lien actif
    })
  })

  describe('check userAuthenticated prop exist', () => {
    test("Vérifie que le lien de déconnexion est affiché uniquement si userAuthenticated est true.", () => {
      const wrapper = mount(Navbar, {
        global: {
          plugins: [router],
        },
        props: {
          userAuthenticated: true,
        }
      })

      const logoutButton = wrapper.find('.logout')

      expect(logoutButton.exists()).toBe(true)
    })
  })

  describe('check userAuthenticated prop not exist', () => {
    test("Vérifie que le lien de déconnexion est masqué si userAuthenticated est false.", () => {
      const wrapper = mount(Navbar, {
        global: {
          plugins: [router],
        },
        props: {
          userAuthenticated: false,
        }
      })

      const logoutButton = wrapper.find('.logout')

      expect(logoutButton.exists()).toBe(false)
    })
  })

  describe('check router navigation', () => {
    test("Simule un clic sur un lien et vérifie que la navigation vers la route correcte se produit.", async () => {
      const wrapper = mount(Navbar, {
        global: {
          plugins: [router],
        },
        props: {
          userAuthenticated: true,
        },
      })

      const homeLink = wrapper.find('#home')

      await homeLink.trigger('click')

      expect(router.currentRoute.value.fullPath).toBe('/')
    })
  })
})
