<script setup lang="ts">
import { RecurrentRoutine } from '@/types/RecurrentRoutine'

const props = defineProps<{
  title: string,
  routineSelected: RecurrentRoutine
}>()

const emit = defineEmits(['create', 'update', 'delete'])

const showForm = defineModel()
const showFormFn = () => {
  showForm.value = !showForm.value
}

const localroutineTitle = ref<string>(props?.routineSelected?.title)

watch(props, (newVal) => {
  console.log(newVal.routineSelected);
  
  localroutineTitle.value = props.routineSelected.title
})

const formSubmit = async () => {
  if (!props.routineSelected.id) {
    emit('create', localroutineTitle.value)
  } else {
    emit('update', { ...props.routineSelected, title: localroutineTitle.value})
  }
  showFormFn()
}
</script>

<template>
  <form>
    <section>
      <div class="flex items-center justify-between">
        <h3 class="title-h3">
          {{ title }}
        </h3>
      </div>
      
      <div class="flex flex-col mt-3">
        <label for="title">
          Titre :
        </label>
        <input type="text" name="" id="title" class="p-4" v-model="localroutineTitle" />
      </div>

      <div class="button-container">
        <button type="submit" class="submit" @click.prevent="formSubmit">Sauvegarder</button>
        <button type="button" @click="showFormFn">Annuler</button>
      </div>
    </section>
  </form>
</template>

<style scoped lang="scss">
form {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px;
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
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