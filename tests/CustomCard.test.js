import { mount } from '@vue/test-utils'
import CustomCard from '@components/tests/CustomCard.vue'

describe('CustomCard.vue', () => {
  let wrapper
  let expandContentButton
  let expandContentStatusMessage

  beforeEach(() => {
    wrapper = mount(CustomCard, {
      props: {
        cardData: {
          header: 'Un titre',
          content: 'Un paragraphe en guise de contenu',
          isExpanded: true
        }
      },
      slots: {
        'header': '<h1>Un titre</h1>',
        'content': `
          <div>
            <p>Contenu personnalisé</p>
          </div>
        `,
      }
    })

    expandContentButton = wrapper.find('[data-test="expand-button"]')
    expandContentStatusMessage = wrapper.find('[data-test="expand-status-message"]')
  })

  describe('Check slots exist', () => {
    test('Vérifie que les slots header et content sont correctement rendus.', () => {
      expect(wrapper.html()).toContain('Un titre')
      expect(wrapper.html()).toContain('Contenu personnalisé')
    })
  })

  describe('Check isExpanded prop', () => {
    test('Vérifie que le contenu du slot content reçoit et utilise correctement le prop isExpanded', () => {
      // Monte un composant en utilisant un slot qui réagit au prop isExpanded
      const wrapper = mount(CustomCard, {
        props: {
          cardData: {
            header: 'Un titre',
            content: 'Un paragraphe en guise de contenu',
            isExpanded: true
          }
        },
        slots: {
          'content': `<template #default="{ isExpanded }">
            <div data-test="content-slot-expanded-status">
              {{ isExpanded }}
            </div>
          </template>`
        }
      })
  
      const contentSlot = wrapper.find('[data-test="content-slot-expanded-status"]')
  
      // Vérifie que le slot reçoit bien le prop isExpanded avec la valeur true
      expect(contentSlot.text()).toBe('true')
    })
  })
  
  

  describe('Check content state', () => {
    test('Vérifie que cliquer sur le bouton bascule entre les états étendu et réduit, et que le message affiché change en conséquence', async () => {
      await expandContentButton.trigger("click")

      expect(wrapper.find('.expanded').exists()).toBe(false)
      expect(expandContentStatusMessage.text()).toBe('La carte est réduite')

      await expandContentButton.trigger("click")

      expect(wrapper.find('.expanded').exists()).toBe(true)
      expect(expandContentStatusMessage.text()).toBe('La carte est étendue')
    })
  })
})
