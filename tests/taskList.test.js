import { mount } from '@vue/test-utils'
import TaskList from '@components/tests/TaskList.vue'

describe('TaskList.vue', () => {
  let wrapper
  
  beforeEach(() => {
    wrapper = mount(TaskList, {
      props: {
        tasks: [
          {
            title: 'tache 1',
            completed: false
          },
          {
            title: 'tache 2',
            completed: false
          }
        ]
      }
    })
  })

  describe('display tasks', () => {
    test('Affiche toutes les taches', async () => {
      const allTasks = wrapper.findAll('span.item')
      expect(allTasks).toHaveLength(2)
    })
  })

  describe('Click on completed', () => {
    test('Marque une tache comme complétée', async () => {
      const title = wrapper.findAll('.item')
      const checkbox = wrapper.findAll('input.checkbox')

      await checkbox[0].trigger("click")

      expect(title[0].text()).toBe('tache 1')
      expect(checkbox[0].element.checked).toBe(true)
    })
  })
  
  describe('filter tasks', () => {
    test('Affiche uniquement les taches complétées', async () => {
      const filterButton = wrapper.find('button.filter-task-button')
      await filterButton.trigger("click")
      const allTasks = wrapper.findAll('span.item')

      expect(allTasks).toHaveLength(0)
    })
  })
})