import { mount, flushPromises } from '@vue/test-utils'
import SearchBar from '@components/tests/SearchBar.vue'

describe("SearchBar", () => {
  let wrapper
  let input

  beforeEach(() => {
    wrapper = mount(SearchBar, {
      props: {
        results: [
          {
            name: "toto"
          },
          {
            name: "tata"
          }
        ]
      }
    })
    
    input = wrapper.find('[data-test="search-input"]')
  })
  
  // 1
  describe("Vérification Initiale", () => {
    test("vérifie que le champ de recherche (input) est présent et que la liste des résultats est vide au départ", async () => {

      const wrapper = mount(SearchBar, {
        props: {
          results: []
        }
      })
      const results = wrapper.findAll('[data-test="result-item"]')
      expect(input.exists()).toBe(true)
      expect(results).toHaveLength(0)
    })
  })
  
  // 2
  describe("Test de la Recherche", () => {
    test("Simule une saisie dans le champ de recherche, et vérifiez que la liste affiche les résultats filtrés correspondants", async () => {
      
      await input.setValue('toto')

      const results = wrapper.findAll('[data-test="result-item"]')

      expect(results).toHaveLength(1)
    })
  })
  
  // 3
  describe("Vérification de l'Émission de l'Événement", () => {
    const testCases = [
      { value: 'toto', expected: 'toto' },
      { value: 'tata', expected: 'tata' },
    ];

    test.each(testCases)(
      "l'événement update:query est émis avec la bonne valeur '$expected' lorsque '$value' est saisi",
      async ({ value, expected }) => {
        await input.setValue(value)

        const emit = wrapper.emitted()
        const emitProperty = wrapper.emitted('update:query')

        expect(emit).toHaveProperty('update:query')
        expect(emitProperty).toHaveLength(1)
        expect(emitProperty[0][0]).toEqual(expected)
      }
    )
  })
  
  // 4
  describe("Vérification de la Liste des Résultats", () => {
    test("les éléments de la liste des résultats sont correctement affichés selon la saisie dans le champ de recherche", async () => {
      
      await input.setValue('t')

      const results = wrapper.findAll('[data-test="result-item"]')

      expect(results).toHaveLength(2)
      expect(results[0].text()).toBe('toto')
      expect(results[1].text()).toBe('tata')
    })
  })
})