import { createRouter, createWebHistory } from 'vue-router'
import { mount, flushPromises } from '@vue/test-utils'
import UserProfile from '@components/tests/UserProfile.vue'

const routes = [
  { path: '/', name: 'Home' },
  { path: '/user/:userId', name: 'userProfile'},
  { path: '/user/:userId/edit', name: 'editProfile' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

describe('UserProfile.vue', () => {
  beforeEach(async () => {
    router.push({ name: 'userProfile', params: { userId: '222' } })
    await router.isReady()
  })

  describe('check edit link exists', () => {
    test("Vérifie que le lien 'Edit Profile' est correctement rendu", () => {
      const wrapper = mount(UserProfile, {
        global: {
          plugins: [router],
        }
      })
      
      const editButton = wrapper.find('[data-test="edit-link"]')

      expect(editButton.exists()).toBe(true)
    })
  })
  
  describe('check router navigation', () => {
    test("Simule un clic sur le lien et vérifie que la navigation vers la route /user/:userId/edit se produit avec le bon userId", async () => {
      const wrapper = mount(UserProfile, {
        global: {
          plugins: [router],
        }
      })

      const editButton = wrapper.find('[data-test="edit-link"]')

      await editButton.trigger('click')
      await flushPromises()

      expect(router.currentRoute.value.fullPath).toBe('/user/222/edit')
    })
  })

  describe('check edit link url', () => {
    test("Vérifie que le composant affiche correctement l'ID de l'utilisateur passé dans l'URL", async () => {
      const wrapper = mount(UserProfile, {
        global: {
          plugins: [router],
        }
      })
  
      const editButton = wrapper.find('[data-test="edit-link"]')
  
      // Vérifie que le `href` du router-link est bien configuré
      expect(editButton.attributes('href')).toBe('/user/222/edit')
    })
  })
})
