<script setup lang="ts">
// Formulaire d'ajout de nouvelle tâche et d'update de nom de tâche

import Vbutton from '@/design-system/Vbutton.vue'
import { Todo } from '@/types/Todo'

defineProps<{
  item: Todo | undefined | null
}>()

const formModel = defineModel()
const newName = ref<string>('')
const closeForm = () => formModel.value = false

// Créer ou updater l'item ici ?
// Sécuriser le formulaire : item.name != '', name existe déjà
</script>

<template>
  <div class="form-container">
    <div class="overlay" @click="closeForm"></div>
    <form class="form" @submit.prevent>
      <label for="title">
        <input v-if="item.name" id="title" type="text" v-model="newName" />
        <input v-else id="title" type="text" placeholder="Nouvel item" v-model="newName" />
      </label>

      <slot name="actions" :slotProps="{item, newName}"></slot>
      
      <Vbutton @click="closeForm" :btnTitle="'fermer'" />
    </form>
  </div>
</template>

<style lang="scss">
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.overlay {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 5;
  background-color: rgba(255 255 255/0.1);
}
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  max-width: 320px;
  background-color: #ccc;
  border-radius: 12px;
  position: absolute;
  z-index: 5;
}
</style>