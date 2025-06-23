import { createRouter, createWebHistory } from 'vue-router'
import { mount, flushPromises } from '@vue/test-utils'
import ModalDialog from '@components/tests/ModalDialog.vue'

describe('ModalDialog.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(ModalDialog, {
      props: {
        title: 'ranger'
      },
      slots: {
        default: '<p>ranger</p>'
      }
    })
  })

  describe("Vérifie l'Affichage Initial", () => {
    test("Vérifie que le contenu du slot est bien rendu", async () => {
      const slotContent = wrapper.html()

      expect(slotContent).toContain('<p>ranger</p>')

    })
  })

  describe("Vérifie la Fermeture par le Bouton", () => {
    test("Vérifie que l'événement close est émis", async () => {
      const button = wrapper.find('[data-test="close-button"')
      await button.trigger('click')
      // const emit = wrapper.emitted()
      // expect(emit).toHaveProperty('close')

      // s'assurer que l'événement est émis exactement une seule fois et détecter des erreurs potentielles
      const closeEvent = wrapper.emitted('close')
      expect(closeEvent).toHaveLength(1)

    })
  })

  describe("Vérifie la Fermeture par Clic sur l'Overlay", () => {
    test("Vérifie que l'événement close est émis", async () => {
      const overlay = wrapper.find('[data-test="overlay"]')
      await overlay.trigger('click')
      
      // const emit = wrapper.emitted()
      // expect(emit).toHaveProperty('close')
      const closeEvent = wrapper.emitted('close')
      expect(closeEvent).toHaveLength(1)

    })
  })

  describe("Vérifie que la Modale ne se Ferme pas en Cliquant à l'Intérieur", () => {
    test("Vérifie que l'événement close n'est pas émis", async () => {
      const h2 = wrapper.find('h2')
      await h2.trigger('click')
      
      const emit = wrapper.emitted('close')
      expect(emit).toBe(undefined)

    })
  })
})
