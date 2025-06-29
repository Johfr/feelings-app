import { mount } from '@vue/test-utils'
import DayNoteApp from '@components/tests/DayNote.vue'

test('affiche une tâche', () => {
  const wrapper = mount(DayNoteApp)

  const todo = wrapper.get('[data-test="todo"]')

  expect(todo.text()).toBe('Apprendre Vue.js 3 en utilisant jest')
})

test('créé une tâche', async () => {
  const wrapper = mount(DayNoteApp)
  expect(wrapper.findAll('[data-test="todo"]')).toHaveLength(1)

  await wrapper.get('[data-test="new-todo"]').setValue('New todo')
  await wrapper.get('[data-test="form"]').trigger('submit')

  expect(wrapper.findAll('[data-test="todo"]')).toHaveLength(2)
})


test('marque une tâche comme terminée', async () => {
  const wrapper = mount(DayNoteApp)

  await wrapper.get('[data-test="todo-checkbox"]').setValue(true)

  expect(wrapper.get('[data-test="todo"]').classes()).toContain('completed')
})

test('marque une tâche comme terminée', async () => {
  const wrapper = mount(DayNoteApp)

  const label = wrapper.get('[data-test="label"]')
  
  expect(label.text()).toBe('Créer une tache')
})