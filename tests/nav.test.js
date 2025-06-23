import { mount } from '@vue/test-utils'
import Nav from '@components/tests/Nav.vue'

const wrapper = mount(Nav)

test('contient le lien vers le profil', () => {

  const profilLink = wrapper.get('#profile')

  expect(profilLink.text()).toBe('Mon profil')
})

test('contient la class active', () => {
  const profilLink = wrapper.get('#profile')
  expect(profilLink.classes()).toContain('active')
})

test('ne contient pas le lien admin par défaut', () => {

  // Vérifier que l'élément n'existe pas par défaut
  const adminLink = wrapper.find('#admin')
  expect(adminLink.exists()).toBe(false)
})

// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     json: () => Promise.resolve({ admin: true }),
//   })
// )
// function flushPromises() {
//   return new Promise(resolve => Promise.resolve().then(resolve));
// }

test('contient le lien admin', async () => {
  jest.useFakeTimers()
  const wrapper = mount(Nav)
  jest.advanceTimersByTime(1000)
  await wrapper.vm.$nextTick()
  // await flushPromises()

  const adminLink = await wrapper.find('#admin')

  expect(adminLink.exists()).toBe(true)
})