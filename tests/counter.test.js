import { mount } from '@vue/test-utils'
import Counter from '@components/tests/Counter.vue'

test('émet un évènement lorsque le bouton est cliqué', () => {
  const wrapper = mount(Counter)

  wrapper.find('button').trigger('click')
  wrapper.find('button').trigger('click')

  const incrementEvent = wrapper.emitted()

  expect(incrementEvent).toHaveProperty('increment')
})

test('Vérifie l\'argument (valeur) de l\évènement emit', () => {
  const wrapper = mount(Counter)

  wrapper.find('button').trigger('click')
  wrapper.find('button').trigger('click')

  const incrementEvent = wrapper.emitted('increment')

  expect(incrementEvent[0]).toEqual([{
    count: 1
  }])
  // expect(incrementEvent[1]).toEqual([{
  //   count: 2
  // }])
})