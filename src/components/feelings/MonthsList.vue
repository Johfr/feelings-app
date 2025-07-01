<script setup lang="ts">
import { useMonths, useMonthNumber } from '@/composables/useDate'
import BackButton from '@/components/utils/BackButton.vue'
import CalendarMonthsTotalDays from '@/components/feelings/CalendarMonthsTotalDays.vue'

const route = useRoute()
const year = computed(() => route.params.year as string)
const routeYearNumber = Number(year.value)

</script>

<template>
  <BackButton routeName="WellBeingApp" :btnText="'Retour'" />
   <h1 class="title-h1 text-red-500 border-b border-solid border-red-500 mb-8"> {{ year }}</h1>

   <ul class="list">
    <li class="item" v-for="(month, monthIndex) of useMonths" :key="monthIndex">
      <RouterLink :to="{ path: `/well-being-app/${year}/${month}` }" class="item_link">
        <span class="block md:mb-5">
          {{ month }}
        </span>

        <CalendarMonthsTotalDays class="months-list_total-days" :month="useMonthNumber(month)" :yearNumber="routeYearNumber">
          <template v-slot:item="slotProps">
            <p v-if="slotProps.date" class="day_number">
              {{ slotProps.date }}
            </p>
          </template>
        </CalendarMonthsTotalDays>
      </RouterLink>
    </li>
   </ul>
</template>

<style scoped lang="scss">
.list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-16);
}
.item {
  width: calc(33% - var(--gap-16));
  text-align: left;
  margin-bottom: 25px;
  cursor: pointer;
  position: relative;
  
  @media (min-width: 960px) {
    width: calc(16% - var(--gap-16));
    // width: 100px;
    // height: 100px;
    // border: 1px solid #f1f1f1;
  }
}

.item_link {
  width: 100%;
  height: 100%;
  
  // @media (min-width: 960px) {
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  // }
}

.months-list_total-days {
  gap: 0;
  
  @media (min-width: 960px) {
    gap: var(--gap-16);
  }

  :deep(.day-item) {
    width: 14%;
    
    @media (min-width: 960px) {
      width: auto;
      height: auto;
      border: unset;
    }
  }

  .day_number {
    font-size: 8px;
  }
}
</style>