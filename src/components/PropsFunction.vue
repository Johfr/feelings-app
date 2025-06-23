<script setup lang="ts">
defineProps<{
  onAction: (payload: string) => void
  payload: string
}>()
</script>

<template>
  <button @click="onAction(payload)">
    Clique-moi (action parent)
  </button>
  <div>
    Parent : 
    <code>
      function showAlert(payload: string) {
        // alert('Bouton cliqué avec : ' + payload)
        GetPreviousNextMonth('next')
      }
      <Test @onAction="showAlert" :payload="'Salut !'" />
    </code>

  </div>
</template>
