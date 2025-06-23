import { mount } from '@vue/test-utils'
import CounterWithLimit from '@components/tests/CounterWithLimit.vue'

describe('CounterWithLimit', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(CounterWithLimit, {
      props: {
        max: 10,
        min: -4
      }
    })
  })

  describe('check counter Initial value', () => {
    test("Vérifie l'Affichage Initial du Compteur", () => {
      const counterValue = wrapper.find('span')

      expect(counterValue.text()).toBe('0')
    })
    test("Vérifie que le message d'erreur n'est pas affiché", () => {
      const errorMsg = wrapper.find('[data-test="error-message"]')

      expect(errorMsg.exists()).toBe(false)
    })
  })

  describe('check incrementation', () => {
    test("Simule plusieurs clics sur le bouton 'Incrémenter'", async () => {
      const incrementButton = wrapper.find('[data-test="increment"]')

      for (let i = 0; i < 4; i++) {
        await incrementButton.trigger('click')
      }

      const counterValue = wrapper.find('span')

      expect(counterValue.text()).toBe('4')
    })

    test("Vérifie que le compteur s'incrémente correctement jusqu'à la valeur maximale (max)", async () => {
      const incrementButton = wrapper.find('[data-test="increment"]')

      for (let i = 0; i < 11; i++) {
        await incrementButton.trigger('click')
      }

      const counterValue = wrapper.find('span')
      const errorMsg = wrapper.find('[data-test="error-message"]')

      expect(counterValue.text()).toBe('10')
      expect(errorMsg.exists()).toBe(true)
    })
  })

  describe('check decrementation', () => {
    test("Simule plusieurs clics sur le bouton 'décrémenter'", async () => {
      const decrementButton = wrapper.find('[data-test="decrement"]')

      for (let i = 0; i < 5; i++) {
        await decrementButton.trigger('click')
      }

      const counterValue = wrapper.find('span')
      const errorMsg = wrapper.find('[data-test="error-message"]')

      expect(errorMsg.exists()).toBe(true)
      expect(counterValue.text()).toBe('-4')
    })
  })

  describe('check error message ', () => {
    test("Vérifie la Réinitialisation du Message d'Erreur", async () => {
      const decrementButton = wrapper.find('[data-test="decrement"]')
      const incrementButton = wrapper.find('[data-test="increment"]')

      for (let i = 0; i < 5; i++) {
        await decrementButton.trigger('click')
      }

      const counterValue = wrapper.find('span')
      const errorMsg = wrapper.find('[data-test="error-message"]')

      expect(errorMsg.exists()).toBe(true)
      expect(counterValue.text()).toBe('-4')
      
      // retourne dans l'intervalle min-max
      for (let i = 0; i < 3; i++) {
        await incrementButton.trigger('click')
      }
      
      const errorMsgUpdated = wrapper.find('[data-test="error-message"]')
      expect(counterValue.text()).toBe('-1')
      expect(errorMsgUpdated.exists()).toBe(false)
    })
  })
})