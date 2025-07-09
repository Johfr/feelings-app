<script setup lang="ts">
import { useMonthName } from '@/composables/useDate'
import { CurrentRoutine } from '@/types/CurrentRoutine'
import CalendarIcon from '@/assets/svg/calendar.svg?component'
import ArrowIcon from '@/assets/svg/arrow.svg?component'

defineProps<{
  routinesSelected: CurrentRoutine[],
  specificDate: {date : number, month : number, year : number},
  onUpdate: (arg?: any) => void,
  onCancel: (arg?: any) => void
}>()

let showMultipleDropdown = defineModel()

const emit = defineEmits(['update', 'cancel', 'show', 'formatDate'])

const formatDate = (event: Event) => {
  emit('formatDate', event)
}

const toggleShowMultipleDropdown = () => {
  showMultipleDropdown.value = !showMultipleDropdown.value
}
</script>

<template>
  <button type="button" v-show="routinesSelected.length > 0" class="relative">
    <p class="cursor-pointer" @click="toggleShowMultipleDropdown">
      Déplacer {{ routinesSelected.length }} tâche(s)
      <CalendarIcon class="svg" title="reprogrammer"/>
    </p>
    <div v-show="showMultipleDropdown" class="dropdown-overlay" @click="toggleShowMultipleDropdown"></div>
    <div v-show="showMultipleDropdown" class="dropdown">
      <h3 class="border-b-1 border-b-gray-300 border-b-solid mb-2">Date d'échéance</h3>
      <button type="button" class="w-[100%] text-left my-1" @click="onUpdate('nextDay')">Demain</button>
      <button type="button" class="w-[100%] text-left my-1" @click="onUpdate('twoNextDay')">Après demain</button>

      <!-- Bouton icon calendrier -->
      <form>
        <label for="date-picker" class="button block w-[100%] relative text-left">
          <span>
            Une date spécifique
            <ArrowIcon class="svg"/>
          </span>

          <input id="date-picker" type="date" @change="formatDate">
        </label>
      </form>

      <!-- Dropdown icon calendrier -->
      <form v-show="specificDate?.date" class="date-form border-t-1 border-t-gray-300 border-solid text-center mt-3 pt-2 pb-5">
        <p class="title-h2">Déplacer au :</p>
        <span>
          {{ specificDate.date }} {{ useMonthName(specificDate.month - 1) }} {{ specificDate.year }}
        </span>
        <button type="button" class="submit w-[100%] mt-3" @click="onUpdate('specificDate')">Valider</button>
        <button type="button" class="w-[100%]" @click="onCancel">Annuler</button>
      </form>
    </div>
  </button>
</template>

<style scoped lang="scss">
.dropdown {
  width: 200px;
  min-height: 10px;
  padding: 5px;
  background-color: #fff;
  border: 1px solid #ccc;
  position: absolute;
  top: 100%;
  right: 0;
  border-radius: 5px;
  z-index: 5;
}

button[type='button'].submit {
  color: #fff;
}
button[type='button'], label {
  padding: 0;
  color: #000;
  border-radius: 5px;
  padding: 5px;

  &:hover {
    background-color: #f1f1f1;
  }
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 195, 255, 0.05);
  z-index: 4;
}

input[type='date']::-webkit-calendar-picker-indicator {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 4;
}
input[type='date'] {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  opacity: 0;
  cursor: pointer;
  box-sizing: border-box;
}

</style>