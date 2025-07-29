<script setup lang="ts">
import { useDayNoteStore } from '@/stores/dayNoteStore'
import { DayMoments } from '@/types/DayMoments'
import { Day } from '@/types/Day'

import { useColorStore } from '@/stores/colorStore'
import { Colors } from '@/types/Colors'

const store = useColorStore()
store.loadColors()
const colorsData = computed((): Colors[] => store.colorItems)

// LOCALSTORAGE
const saveDraft = () => {
  localStorage.setItem(`note_${props.day.date}_${props.moment.moment}`, localContent.value)
}
const loadDraft = () => {
  return localStorage.getItem(`note_${props.day.date}_${props.moment.moment}`) || props.moment.content
}
const clearDraft = () => {
  localStorage.removeItem(`note_${props.day.date}_${props.moment.moment}`)
}

const props = defineProps<{
  itemId: string,
  day: Day,
  moment: DayMoments
}>()

const emit = defineEmits(['create'])

const showForm = defineModel()
const toggleShowForm = () => {
  showForm.value = !showForm.value
}

const localColor = ref(props.moment.color)
const localContent = ref(loadDraft())
const isColorExist = computed(() => {
  const colorExist = colorsData.value.filter(item => localColor.value.toLowerCase() === item.color.toLowerCase())
  if (colorExist.length > 0 || localColor.value === '') return true
  return false
})

const formSubmit = async () => {
  const momentUpdated = {
    moment: props.moment.moment,
    color: localColor.value.toLowerCase(),
    content: localContent.value,
    colorPoint: colorsData.value.filter(item => localColor.value === item.color)[0]?.point 
  }  
  
  // create
  if (props.itemId === '-1') {
    const resp = await useDayNoteStore().create(props.day, momentUpdated)
    
    if (resp.status === 201) {
      emit('create')
      closeForm()
    }
  }
  else { // update
    const resp = await useDayNoteStore().update(props.itemId, momentUpdated)
    
    if (resp.status === 200) {
      closeForm()
    }
  }

}

const closeForm = () => {
  toggleShowForm()
  clearDraft()
}

</script>

<template>
  <form v-if="showForm">
    <h3 class="title-h3">
      Mettre à jour : {{ moment.moment }}
    </h3>
    <label for="input">
      Couleur : 
      <small class="text-xs text-red-500 font-normal">{{ !isColorExist ? "cette couleur n'existe pas" : '' }}</small>
    </label>
    <input type="text" name="" id="input" class="p-4" v-model="localColor">
    
    <label for="textarea">
      Contenu :
    </label for="textarea">
    <textarea v-model="localContent" id="textarea" class="p-4" @input="saveDraft()">
      {{ localContent }}
    </textarea>

    <div class="button-container">
      <button type="submit" class="submit disabled:opacity-50 disabled:cursor-not-allowed" @click.prevent="formSubmit" :disabled="!isColorExist">Sauvegarder</button>
      <button type="button" @click="closeForm">
        Annuler {{ loadDraft() ? '(supprime les données non sauvegardées)' : '' }}
      </button>
    </div>
  </form>
</template>

<style scoped lang="scss">
form {
  display: flex;
  flex-direction: column;
  padding: 16px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  background-color: #fff;

  @media (min-width: 768px) {
    top: 38px;
    left: 20px;
    right: 20px;
    bottom: 20px;
  }
}

label {
  font-weight: 700;
  margin-top: 25px;
}

textarea {
  min-height: 300px;
}

textarea, input {
  border-bottom: 1px solid #f1f1f1;
}

.button-container {
  display: flex;
  margin-top: 50px;
}
</style>