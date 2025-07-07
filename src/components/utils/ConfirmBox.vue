<script setup lang="ts">

defineProps<{
  title?: string
}>()

const emit = defineEmits(['confirm'])

const showConfirm = defineModel()

const showConfirmFn = () => {
  showConfirm.value = !showConfirm.value
}

const confirm = () => {
  emit('confirm')
}
</script>

<template>
  <section class="confirm-box">
    <div class="flex items-center justify-between">
      <h3 class="title-h3 mb-5">
        {{ title || 'Confirmer la suppression définitive ?' }}
      </h3>
    </div>

    <div class="button-container">
      <button type="submit" class="submit" @click.prevent="confirm">Confimer</button>
      <button type="button" @click="showConfirmFn">Annuler</button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.confirm-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 4;
}
</style>