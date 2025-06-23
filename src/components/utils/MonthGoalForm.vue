<script setup lang="ts">

const props = defineProps<{
  id: string | undefined,
  goal:string | undefined
}>()

const emit = defineEmits(['create', 'update'])

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
</script>

<template>
  <form >
    <section>
      <h3 class="title-h3">
        Mettre à jour l'objectif
      </h3>
      
      <div class="flex flex-col">
        <label for="title">
          Titre :
        </label>
        <textarea type="text" name="" id="title" class="p-4" v-model="localGoal">
          {{ localGoal }}
        </textarea>
      </div>

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