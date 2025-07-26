<script setup lang="ts">
import { useEmoji } from '@/composables/useEmoji'

const sortedEmoji = useEmoji.sort((a,b) => b.value - a.value)
</script>

<template>
  <section class="hidden mt-[50px] md:block md:md-0 md:w-[22%]">
    <h3 class="title-h3 mb-5">Emojis reference</h3>
    <table class="w-[100%] text-center">
      <thead>
        <tr>
          <th class="font-medium">Valeur</th>
          <th class="font-medium">Emojis</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(emoji, emojiIndex) of sortedEmoji" :key="emojiIndex" class="h-10">
          <td class="font-medium">{{ emoji.value }}</td>
          <td class="md:text-xl">{{ emoji.icon }}</td>
        </tr>
      </tbody>
    </table>
   </section>
</template>

<style scoped lang="scss">
</style>