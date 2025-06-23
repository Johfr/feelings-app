<script setup lang="ts">
defineProps<{btnTitle: string}>()
</script>

<template>
  <button type="button" class="btn">
    {{btnTitle}}
  </button>
</template>

<style lang="scss">

</style>