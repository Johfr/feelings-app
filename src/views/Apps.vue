<script setup>
import Years from '@/components/Years.vue'
// import Months from '@/components/Months.vue'
// import wellBeingApp from '@/components/wellBeingApp.vue'
const route = useRoute()

const year = computed(() => route.params.year)
// const month = computed(() => route.params.month)
</script>

<template>
  <main class="main">
    <Years v-if="!year" />
    <!-- 
    <Months v-if="year && !month"/>
    <wellBeingApp v-if="year && month"/> -->
    <router-view></router-view>
  </main>
  
</template>
