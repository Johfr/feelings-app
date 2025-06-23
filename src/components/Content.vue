<script setup lang="ts">
import { useTodoStore } from '@/stores/todoStore'
import { Day } from '@/types/Day';
import { Todo } from '@/types/Todo';
import Form from '@/components/utils/Form.vue'
import Pencil from '@/assets/svg/pencil.svg?component'
import { useColorStore } from '@/stores/colorStore'
import { Colors } from '@/types/Colors'

const store = useColorStore()
store.loadColors()
const colorsData = computed((): Colors[] => store.colorItems)

// const colorsTranscription = [
//   {
//     color: 'blue',
//     hexadecimal : '#ffc0cb'
//   },
//   {
//     color: 'orange',
//     hexadecimal : '#ffc0cb'
//   },
//   {
//     color: 'yellow',
//     hexadecimal : '#ffc0cb'
//   },
//   {
//     color: 'pink',
//     hexadecimal : '#ffc0cb'
//   },
//   {
//     color: 'red',
//     hexadecimal : '#ffc0cb'
//   },
//   {
//     color: 'brown',
//     hexadecimal : '#ffc0cb'
//   },
//   {
//     color: 'violet',
//     hexadecimal : '#ffc0cb'
//   },
//   {
//     color: 'green',
//     hexadecimal : '#ffc0cb'
//   },
//   {
//     color: 'black',
//     hexadecimal : '#ffc0cb'
//   },
//   {
//     color: 'white',
//     hexadecimal : '#ffc0cb'
//   },
// ]

const props = defineProps<{
  daySelected: Day
}>()

const day = ref<Todo>()

useTodoStore().findOne(props.daySelected).then((todoFind: Todo) => {
  if (todoFind) {
    day.value = todoFind
  }
  else {
    day.value =  {
      id: props.daySelected.id,
      day: props.daySelected.dayNumber,
      month: props.daySelected.monthNumber,
      year: props.daySelected.year,
      moments: [
        {
          moment: "morning",
          color: "",
          content: ""
        },
        {
          moment: "afternoon",
          color: "",
          content: ""
        },
        {
          moment: "night",
          color: "",
          content: ""
        }
      ]
    }
  }
})

// mets à jour le contenu de la popin après un create
const updateData = () => {  
  useTodoStore().findOne(props.daySelected).then((todoFind: Todo) => {
    if (todoFind) {
      day.value = todoFind
    }
  })
}

const formSection = ref<string>('')
const showForm = ref<boolean>(false)

const showFormFn = (section: string) => {
  showForm.value = true
  formSection.value = section
}
</script>

<template>
  <section class="content-section" v-if="day">
    <h1 class="title-h1">
      {{ day.day }}/{{ day.month  + 1}}/{{ day.year }}
    </h1>

    <div class="mt-10" v-for="(moment, momentIndex) in day.moments" :key="momentIndex">
      <section>
        <h2 class="title-h2">
          {{ moment.moment }}:
          <span title="Modifier">
            <Pencil class="svg" @click="showFormFn(moment.moment)" />
          </span>
        </h2>
      </section>

      <Transition name="slide-fade">
        <Form v-if="showForm && formSection === moment.moment" v-model="showForm" :itemId="day.id || '-1'" :moment="moment" :day="{ dayNumber: day.day, monthNumber: day.month, year: day.year }" @create="updateData" />
      </Transition>
      
      <div class="flex items-center" v-if="moment.color">
        <div class="color-block" :class="moment.color" />
        <p>
          {{ colorsData.find(color => color.color === moment.color).meaning }}
        </p>
      </div>
      
      <p v-if="moment.content">
        {{ moment.content }}
      </p>
      <p v-else>...</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.content-section {
  position: relative;
  // @media (min-width: 960px) {
  // }
}

.color-block {
  min-width: 20px;
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
</style>