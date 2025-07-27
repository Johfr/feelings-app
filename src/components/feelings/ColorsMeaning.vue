<script setup lang="ts">
import Pencil from '@/assets/svg/pencil.svg?component'
import Popin from '@/components/utils/Popin.vue'
import ColorsForm from '@/components/utils/ColorsForm.vue'
import { useColorStore } from '@/stores/colorStore'
import { Colors } from '@/types/Colors'

const store = useColorStore()
store.loadColors()

const showPopin = ref<boolean>(false)

const colorsData = computed((): Colors[] => store.colorItems)
const colorSelected = ref<Colors[]>()
const formType = ref<string>('')

const showPopinFn = ():void => {
  showPopin.value = !showPopin.value
}


const showFormFn = (type: string, data: Colors = null): void => {
  showPopinFn()
  if (type === 'one') {
    colorSelected.value = [data]
  }
  else {
    colorSelected.value = colorsData.value
  }
  
  formType.value = type
}


// const findColor = (color: Colors) => {
//   showPopinFn()
  
//   store.findOne(color)
//   .then(resp => {
//     // console.log(resp)
//     colorFind.value = resp
//   })
// }

</script>

<template>
  <!-- md:flex md:flex-col items-start md:flex-wrap -->
  <section class=" md:max-w-[26%]  mt-[50px]">
    <h3 class="title-h3 mb-5">Colors reference</h3>
      <button class="color_icon --full-update" @click="showFormFn('all')" title="Tout modifier" >
        <span>
          Modifier tout
        </span>

        <Pencil class="svg"/>
      </button>
    <div class="relative md:flex md:flex-row-reverse items-start">

      <ul class="color_list">
        <li class="color_item" v-for="(color, colorIndex) of colorsData" :key="colorIndex">

          <div class="color_block" :class="color.color">
            <span title="Modifier" class="hidden md:block">
              <Pencil class="svg" @click="showFormFn('one', color)" />
            </span>
          </div>

          <div class="color_meaning">
            {{ color.color }} : {{ color.meaning }} ({{ color.point }} point)
          </div>

        </li>
      </ul>

      <Transition name="slide-fade">
        <Popin v-if="showPopin" v-model="showPopin">
          <!-- Créer le form d'update -->
          <ColorsForm :colors="colorSelected" :formType="formType" v-model="showPopin" />
        </Popin>
      </Transition>
    </div>
  </section>
</template>

<style scoped lang="scss">
.color_icon {
  padding: 0;
  // margin-bottom: 16px;
  // margin-left: auto;

  // @media (min-width: 960px) {
  //   position: absolute;
  //   top: -10px;
  //   right: 0;
  // }
}
.color_list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-10);
}
.color_item {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  width: calc(50% - 10px);
  font-size: 10px;
  
  @media (min-width: 960px) {
    align-items: center;
    flex-direction: row;
    width: 100%;
    font-size: 16px;
  }

  .color_block {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 10px;
    width: 10px;
    height: 10px;
    margin-right: 10px;
    border-radius: 50%;
  
    // @media (min-width: 960px) {
    //   min-width: 20px;
    //   width: 20px;
    //   height: 20px;
    // }
  }
  .color_meaning {
    font-size: 12px;
  
    @media (min-width: 960px) {
      font-size: 14px;
    }
  }
}
</style>