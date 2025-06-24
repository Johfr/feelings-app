<script setup lang="ts">
import { months, monthNumber } from '@/composables/UseDate'
import BackButton from '@/components/utils/BackButton.vue'
import MonthsTotalDays from '@/components/feelings/MonthsTotalDays.vue'

const route = useRoute()
const year = computed(() => route.params.year as string)

</script>

<template>
  <BackButton routeName="WellBeingApp" :btnText="'Retour'" />
   <h1 class="title-h1 text-red-500 border-b border-solid border-red-500 mb-8"> {{ year }}</h1>

   <ul class="list">
    <li class="item" v-for="(month, monthIndex) of months" :key="monthIndex">
      <RouterLink :to="{ path: `/well-being-app/${year}/${month}` }" class="item_link">
        <span class="block md:mb-5">
          {{ month }}
        </span>

        <MonthsTotalDays class="months-total-days" :month="month" :yearNumber="year">
          <template v-slot:item="slotProps">
            <p class="day_number">
              {{ slotProps.dayNumber }}
            </p>
          </template>
        </MonthsTotalDays>
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

.months-total-days {
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