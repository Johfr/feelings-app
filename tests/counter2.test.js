import { mount } from '@vue/test-utils'
import Counter2 from '@components/tests/Counter2.vue'

let wrapper
let countResult
let incrementButton
let decrementButton

describe('Counter2.vue', () => {
  beforeEach(() => {
    wrapper = mount(Counter2)
    countResult = wrapper.get('span')
    incrementButton = wrapper.find('.increment')
    decrementButton = wrapper.find('.decrement')
  })

  describe('Affichage initial', () => {
    test('le nombre initial affiché est 0', () => {
      expect(parseInt(countResult.text())).toBe(0)
    })
  })

  describe('Incrémentation', () => {
    test('Vérifie que cliquer sur "Increment" augmente le nombre de 1', async () => {
      await incrementButton.trigger('click')

      expect(parseInt(countResult.text())).toBe(1)
    })
  })


  describe('Décrémentation', () => {
    test('Vérifie que cliquer sur "Decrement" diminue le nombre de 1', async () => {
      await incrementButton.trigger('click') // Pour s'assurer que ça part de 1
      await decrementButton.trigger('click')

      expect(parseInt(countResult.text())).toBe(0)
    })
  })
})