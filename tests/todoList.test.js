import { mount } from '@vue/test-utils'
import TodoList from '@components/tests/TodoList.vue'



describe('TodoList', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(TodoList, {
      props: {
        tasks: [
          {
            name: 'lessive',
            completed: false
          },
          {
            name: 'manger',
            completed: true
          }
        ]
      }
    })
  })

  describe('all tasks exist', () => {
    test('Vérifie que toutes les tâches sont correctement affichées', async () => {

      const tasks = wrapper.findAll('[data-test="task"]')

      expect(tasks).toHaveLength(2)
    })
  })

  describe('update a task', () => {
    test('Vérifie la Mise à Jour des Tâches', async () => {
      const inputs = wrapper.findAll('input[type="checkbox"]')

      await inputs[0].setValue(true)

      const emitEvent = wrapper.emitted()
      const emitEventProperty = wrapper.emitted('task-updated')

      expect(inputs[0].element.checked).toBe(true)
      
      expect(emitEvent).toHaveProperty('task-updated')
      expect(emitEventProperty[0][0]).toEqual(
        {
          name: 'lessive',
          completed: true
        }
      )

    })
  })
    
  describe('check filter status', () => {
    test("Vérifie que toutes les tâches s'affiche", async () => {
      const select = wrapper.find('select')
      await select.setValue("all")
      
      const tasks = wrapper.findAll('[data-test="task"]')
      
      expect(tasks).toHaveLength(2)

    })
    test("Vérifie que seules les tâches 'completed' s'affichent", async () => {
      const select = wrapper.find('select')
      await select.setValue("completed")

      const tasks = wrapper.findAll('[data-test="task"]')
      
      expect(tasks).toHaveLength(1)

    })
    test("Vérifie que seules les tâches 'incomplete' s'affichent", async () => {
      const select = wrapper.find('select')
      await select.setValue("incomplete")
      
      const tasks = wrapper.findAll('[data-test="task"]')
      
      expect(tasks).toHaveLength(1)

    })
  })
})
