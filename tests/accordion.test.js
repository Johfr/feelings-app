import { createRouter, createWebHistory } from 'vue-router'
import { mount, flushPromises } from '@vue/test-utils'
import Accordion from '@components/tests/Accordion.vue'

describe('Accordion.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(Accordion, {
      props: {
        title: 'ranger'
      }
    })
  })

  describe("Vérifie l'Affichage Initial", () => {
    test("Vérifie que le titre est affiché correctement", async () => {

      const title = wrapper.find('[data-test="accordion-title"]')

      expect(title.text()).toBe('ranger')

    })
  })

  describe("Vérifie le Comportement au Clic", () => {
    test("Vérifie que le contenu devient visible après le clic", async () => {
      const title = wrapper.find('[data-test="accordion-title"]')

      await title.trigger('click')
      
      const content = wrapper.find('[data-test="accordion-content"]')

      expect(content.exists()).toBe(true)
    })

    test("Vérifie que l'événement toggle est émis avec la bonne valeur (true)", async () => {
      const title = wrapper.find('[data-test="accordion-title"]')

      await title.trigger('click')
      
      const emit = wrapper.emitted('toggle')

      expect(emit[0][0]).toEqual(true)
    })
  })
  
  describe("Vérifie le Fermeture de l'Accordion", () => {
    test("Vérifie que l'événement toggle est émis avec la bonne valeur (false)", async () => {
      const title = wrapper.find('[data-test="accordion-title"]')

      await title.trigger('click')
      await title.trigger('click')
      
      const content = wrapper.find('[data-test="accordion-content"]')
      expect(content.exists()).toBe(false)
      
      const emit = wrapper.emitted('toggle')

      expect(emit[1][0]).toEqual(false)
    })
  })
})
