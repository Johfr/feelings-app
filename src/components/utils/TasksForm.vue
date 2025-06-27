<script setup lang="ts">
import ConfirmBox from '@/components/utils/ConfirmBox.vue'

const props = defineProps<{
  id: string | undefined,
  goal:string | undefined
}>()

const emit = defineEmits(['create', 'update', 'delete'])

const showForm = defineModel()
const showFormFn = () => {
  showForm.value = !showForm.value
}

const localGoal = ref<string>(props?.goal || null)

const formSubmit = async () => {
  if (!props.id) {
    emit('create', localGoal.value)
  } else {
    emit('update', props.id, localGoal.value)
  }
}

const showConfirm = ref(false)

const showConfirmFn = () => {
  showConfirm.value = !showConfirm.value
}

const deleteGoal = () => {
  emit('delete', props.id, localGoal.value)
}
</script>

<template>
  <form >
    <section>
      <div class="flex items-center justify-between">
        <h3 class="title-h3">
          Mettre à jour l'objectif
        </h3>

        <button v-if="props.id" type="button" class="delete-button" title="supprimer l'objectif" @click="showConfirmFn">
          Supprimer
        </button>
      </div>
      
      <div class="flex flex-col mt-3">
        <label for="title">
          Titre :
        </label>
        <textarea type="text" name="" id="title" class="p-4" v-model="localGoal">
          {{ localGoal }}
        </textarea>
      </div>

      <Transition name="slide-fade">
        <ConfirmBox v-if="showConfirm" v-model="showConfirm" @confirm="deleteGoal" />
      </Transition>

      <div class="button-container">
        <button type="submit" class="submit" @click.prevent="formSubmit">Sauvegarder</button>
        <button type="button" @click="showFormFn">Annuler</button>
      </div>
    </section>
  </form>
</template>

<style scoped lang="scss">
.popin-content {
  padding: 0;
}

form {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px;
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