<script setup lang="ts">
import Years from '@/components/feelings/Years.vue'

const route = useRoute()

const year = computed(() => route.params.year)
// const month = computed(() => route.params.month)
</script>

<template>
  <main class="main">
    <Years v-if="!year" />
    <router-view></router-view>
  </main>
  
</template>
