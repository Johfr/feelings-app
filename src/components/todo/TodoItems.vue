<script setup lang="ts">
import { Todo } from '@/types/Todo'

defineProps<{
  item: Todo
}>()

</script>

<template>
  <li>
    <slot name="title"></slot>
    <slot name="actions"></slot>
  </li>

</template>

<style lang="scss">
.--done {
  text-decoration: line-through;
}
</style>