import { mount } from '@vue/test-utils'
import ItemList from '@components/tests/ItemList.vue'

describe('ItemList.vue', () => {
  let wrapper
  
  beforeEach(() => {
    wrapper = mount(ItemList, {
      props: {
        list: [
          {
            name: "pomme",
            qty: 1,
            selected: false
          },
          {
            name: "poire",
            qty: 1,
            selected: false
          },
          {
            name: "pêche",
            qty: 4,
            selected: false
          },
        ]
      }
    })
  })

  describe('display list items', () => {
    test('Vérifie que la liste des éléments est correctement rendue', async () => {
      const allItems = wrapper.findAll('[data-test="item"]')
      expect(allItems).toHaveLength(3)
    })
  })

  describe('Select a item', () => {
    test("Vérifie que cliquer sur un élément émet l'événement item-selected avec l'objet correspondant.", async () => {
      const allItems = wrapper.findAll('[data-test="item"]')
      await allItems[0].trigger('click')

      const emit = wrapper.emitted()
      const emitItem = wrapper.emitted('item-selected')

      expect(emit).toHaveProperty('item-selected')
      expect(emitItem[0][0]).toEqual(
        {
          name: "pomme",
          qty: 1,
          selected: true
        }
      )
    })
  })

  describe('Check message after emit', () => {
    test("Vérifie que le message de sélection est correctement mis à jour lorsque l'événement est émis.", async () => {
      const allItems = wrapper.findAll('[data-test="item"]')
      
      await allItems[0].trigger('click')

      const infoMsg = wrapper.find('[data-test="info"]')

      expect(infoMsg.text()).toBe("pomme")
    })
  })
})