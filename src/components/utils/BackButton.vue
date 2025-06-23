<script setup lang="ts">
const router = useRouter()
defineProps<{
  routeName: string,
  btnText: string
}>()
</script>
<template>
   <button class="back-button" @click="router.push({ name: routeName })">
    {{ btnText }}
   </button>
</template>