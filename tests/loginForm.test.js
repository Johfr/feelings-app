import { mount } from '@vue/test-utils'
import LoginForm from '@components/tests/LoginForm.vue'

describe('LoginForm.vue', () => {
  let wrapper
  // let errorMessage // inutile car son existence dépend d'autres condition après un trigger
  let username
  let password
  let submitButton
  
  beforeEach(() => {
    wrapper = mount(LoginForm)
    username = wrapper.find('[data-test="username"]')
    password = wrapper.find('[data-test="password"]')
    submitButton = wrapper.find('[data-test="submit"]')
    // errorMessage = wrapper.find('[data-test="error-message"]') // inutile car son existence dépend d'autres condition après un trigger
  })

  describe('Input form exist', () => {
    test('les champs username et password existent', async () => {
      expect(username.exists()).toBe(true)
      expect(password.exists()).toBe(true)
    })
  })

  describe('Check error message', () => {
    test("Une erreur s'affiche si l'un des champs n'est pas rempli", async () => {
      await submitButton.trigger("click")
      const errorMessage = wrapper.find('[data-test="error-message"]') // Pour s'assurer qu'il existe bien et que son état a été mis à jour

      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('Tous les champs doivent être remplis')
    })
  })
  
  describe('No error message', () => {
    test("Aucun message d'erreur ne s'affiche", async () => {
      username.setValue('Jane Doe')
      password.setValue('123456')

      await submitButton.trigger("click")
      const errorMessage = wrapper.find('[data-test="error-message"]')

      expect(errorMessage.exists()).toBe(false)
    })
  })
  
  describe('Submitting form', () => {
    test("Les données sont émises via un emit du composant", async () => {
      username.setValue('Jane Doe')
      password.setValue('123456')

      await submitButton.trigger("click")
      
      const formEvent = wrapper.emitted()
      const emittedData = wrapper.emitted('submit')
    
      expect(formEvent).toHaveProperty('submit')

      expect(emittedData[0][0]).toEqual({
        username: 'Jane Doe',
        password: '123456',
      })
    })
  })
})