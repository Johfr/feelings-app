import { mount } from '@vue/test-utils'
import EmailForm from '@components/tests/EmailForm.vue'

test('émet un évènement lorsque le bouton est cliqué', () => {
  const wrapper = mount(EmailForm)

  wrapper.find('button').trigger('click')

  const incrementEvent = wrapper.emitted()

  expect(incrementEvent).toHaveProperty('submit')
})

test('Définit la valeur de l\'input', async () => {
  const wrapper = mount(EmailForm)

  const input = wrapper.get('[data-test="email"]')
  await input.setValue('test@test.com')

  expect(input.element.value).toBe('test@test.com')
})

test('Vérifie l\'argument (valeur) de l\évènement emit', async () => {
  const wrapper = mount(EmailForm)

  const input = wrapper.get('[data-test="email"]')
  await input.setValue('test@test.com')
  wrapper.find('button').trigger('click')

  const incrementEvent = wrapper.emitted('submit')

  expect(incrementEvent[0][0]).toEqual('test@test.com')
})