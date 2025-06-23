import { createRouter, createWebHistory } from 'vue-router'
import { mount, flushPromises } from '@vue/test-utils'
import SignUpForm from '@components/tests/SignUpForm.vue'

describe('SignUpForm.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(SignUpForm)
  })

  // 1
  describe("Vérifie l'Affichage Initial", () => {
    test("vérifie que les champs du formulaire et le bouton 'S'inscrire' sont bien présents", async () => {
      // const emailInput = wrapper.find('[data-test="email-input"]')
      // const usernameInput = wrapper.find('[data-test="username-input"]')
      const submitButton = wrapper.find('[data-test="submit-button"]')
      const inputs = wrapper.findAll('input')

      expect(inputs).toHaveLength(2)
      expect(submitButton.exists()).toBe(true)

    })
    test("Vérifie qu'aucun message d'erreur n'est affiché au départ", async () => {
      const errorMessage = wrapper.find('[data-test="error-message"]')

      expect(errorMessage.exists()).toBe(false)
    })
  })

  // 2
  describe("Vérifie la Validation des Champs", () => {
    test("Vérifie que le message d'erreur 'Tous les champs sont requis' est affiché", async () => {
      const form = wrapper.find('[data-test="signup-form"]')
      
      await form.trigger('submit.prevent')
      
      const emit = wrapper.emitted('submit')
      const errorMessage = wrapper.find('[data-test="error-message"]')
      
      expect(emit).toBeUndefined()
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('Tous les champs sont requis.')
    })
  })

  // 3
  describe("Vérifie la Validation Asynchrone de l'Email ", () => {
    test("Vérifie que le message d'erreur 'Cet email est déjà pris' est affiché", async () => {
      const form = wrapper.find('[data-test="signup-form"]')
      const emailInput = wrapper.find('[data-test="email-input"]')
      const usernameInput = wrapper.find('[data-test="username-input"]')
      
      await usernameInput.setValue('fafa')
      await emailInput.setValue('test@test.com')
      
      await form.trigger('submit.prevent')
      await flushPromises()
      
      const errorMessage = wrapper.find('[data-test="error-message"]')
      
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('Cet email est déjà pris.')
    })
  })

  // 4
  describe("Vérifie la Soumission Réussie ", () => {
    test("Vérifie que l'événement submit est émis avec les bonnes données", async () => {
      const form = wrapper.find('[data-test="signup-form"]')
      // const submitButton = wrapper.find('[data-test="submit-button"]')
      const emailInput = wrapper.find('[data-test="email-input"]')
      const usernameInput = wrapper.find('[data-test="username-input"]')
      
      await usernameInput.setValue('fafa')
      await emailInput.setValue('autreEmail@test.com')
      
      await form.trigger('submit.prevent')
      await flushPromises()
      
      const emit = wrapper.emitted('submit')
  
      expect(emit).toHaveLength(1)
      expect(emit[0][0]).toEqual({
        username: 'fafa',
        email: 'autreEmail@test.com'
      })
    })
  })

  // 5
  describe("Test de l'Asynchronisme ", () => {
    test("Vérifie que la validation fonctionne correctement après le délai", async () => {
      jest.useFakeTimers()

      const form = wrapper.find('[data-test="signup-form"]')
      
      const emailInput = wrapper.find('[data-test="email-input"]')
      const usernameInput = wrapper.find('[data-test="username-input"]')
      
      usernameInput.setValue('fafa')
      emailInput.setValue('autreEmail@test.com')
      

      await form.trigger('submit.prevent')
      
      jest.advanceTimersByTime(1000)
      await flushPromises()
      
      const emit = wrapper.emitted('submit')

      expect(emit[0][0]).toEqual({
        username: 'fafa',
        email: 'autreEmail@test.com'
      })
    })
  })
})
