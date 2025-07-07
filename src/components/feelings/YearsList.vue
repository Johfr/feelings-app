<script setup lang="ts">
const firstYearCreation = 2025
const years = ref<number[]>([])
const activeYear = new Date().getFullYear()

const yearsCalendar = () => {
  for (let year = firstYearCreation; year < firstYearCreation + 20; year++) {    
    years.value.push(year)
  }
}
yearsCalendar()
</script>

<template>
  <h1 class="title-h1">Journal du capitaine ! 21 days</h1>
   <p>
    Choisir une année :
   </p>
   <ul class="list">
    <li class="item" v-for="(year, yearIndex) of years" :key="yearIndex">
      <RouterLink :to="{ path: `/well-being-app/${year}` }" class="item_link" :class="{'font-bold' : activeYear === year}">
        {{ year }}
      </RouterLink>
    </li>
   </ul>
</template>

<style scoped lang="scss">
.list {
  display: flex;
  flex-wrap: wrap;
}
.item {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  cursor: pointer;
  position: relative;
}

.item_link {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>