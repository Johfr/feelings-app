<script setup lang="ts">
import { useDayNoteStore } from '@/stores/dayNoteStore'
import { DayMoments } from '@/types/DayMoments'
import { Day } from '@/types/Day'

const props = defineProps<{
  itemId: string,
  day: Day,
  moment: DayMoments
}>()

const emit = defineEmits(['create'])

const showForm = defineModel()
const showFormFn = () => {
  showForm.value = !showForm.value
}

const localColor = ref(props.moment.color)
const localContent = ref(props.moment.content)

const formSubmit = async () => {
  const momentUpdated = {
    moment: props.moment.moment,
    color: localColor.value,
    content: localContent.value
  }
  
  // create
  if (props.itemId === '-1') {
    const resp = await useDayNoteStore().create(props.day, momentUpdated)
    
    if (resp.status === 201) {
      showFormFn()
      emit('create')
    }
  }
  else {
    const resp = await useDayNoteStore().update(props.itemId, momentUpdated)
    
    if (resp.status === 200) {
      showFormFn()
    }
  }

}
</script>

<template>
  <form v-if="showForm">
    <h3 class="title-h3">
      Mettre à jour : {{ moment.moment }}
    </h3>
    <label for="input">
      Couleur :
    </label>
    <input type="text" name="" id="input" class="p-4" v-model="localColor">
    
    <label for="textarea">
      Contenu :
    </label for="textarea">
    <textarea v-model="localContent" id="textarea" class="p-4">
      {{ localContent }}
    </textarea>

    <div class="button-container">
      <button type="submit" class="submit" @click.prevent="formSubmit">Sauvegarder</button>
      <button type="button" @click="showFormFn">Annuler</button>
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
  background-color: #fff;
}

label {
  font-weight: 700;
  margin-top: 25px;
}

textarea {
  min-height: 200px;
}

textarea, input {
  border-bottom: 1px solid #f1f1f1;
}

.button-container {
  display: flex;
  margin-top: 50px;
}
</style>