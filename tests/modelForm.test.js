import { mount } from '@vue/test-utils'
import ModelForm from '@components/tests/ModelForm.vue'

test('remplit le formulaire', async () => {
  const wrapper = mount(ModelForm, {
    props: {
      modelValue: "test"
    }
  });

  const input = await wrapper.find('input') //.setValue('text');

  expect(input.element.value).toBe('test')
  // vous pouvez ici vérifier plusieurs choses comme la soumission du formulaire
})