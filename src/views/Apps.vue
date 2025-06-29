<script setup lang="ts">
import YearsList from '@/components/feelings/YearsList.vue'
import Drawer from '@/components/utils/Drawer.vue';
import Sidebar from '@/components/utils/Sidebar.vue';

const route = useRoute()

const year = computed(() => route.params.year)
// const month = computed(() => route.params.month)
// const showDrawer = ref(true)
</script>

<template>
  <main class="main">
    <!-- <Sidebar v-model="showDrawer" /> -->
    
    <YearsList v-if="!year" />
    <router-view></router-view>
  </main>
  
</template>
