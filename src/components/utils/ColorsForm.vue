<script setup lang="ts">
import { Colors } from '@/types/Colors'
// import { useColorStore } from '@/stores/colorStore'

// const store = useColorStore()
// store.loadColors()

const props = defineProps<{
  colors: Colors[],
  // color: Colors[] | null,
  formType: string
}>()

const emit = defineEmits(['create'])

const showForm = defineModel()
const showFormFn = () => {
  showForm.value = !showForm.value
}

// const colorFind = ref<Colors>()

// const findColor = (color: Colors) => {
//   showFormFn()
  
//   store.findOne(color)
//   .then(resp => {
//     // console.log(resp)
//     colorFind.value = resp
//   })
// }

const localColor = ref(props.colors[0].color)
const localMeaning = ref(props.colors[0].meaning)

const formSubmit = async () => {
  const colorUpdated = {
    color: localColor.value,
    meaning: localMeaning.value,
    type: props.colors[0].type,
    point: props.colors[0].point,
  }
  
  // create
  // if (props.itemId === '-1') {
  //   const resp = await useDayNoteStore().create(props.day, colorUpdated)
    
  //   if (resp.status === 201) {
  //     showFormFn()
  //     emit('create')
  //   }
  // }
  // else {
  //   const resp = await useDayNoteStore().update(props.itemId, colorUpdated)
    
  //   if (resp.status === 200) {
  //     showFormFn()
  //   }
  // }
}
</script>

<template>
  <form v-for="(color, colorId) of colors" :key="colorId">
    <section>
      <h3 class="title-h3">
        Mettre à jour : {{ color.color }}
      </h3>
      
      <div class="flex flex-col">
        <label :for="'input-' + colorId">
          Couleur : {{ localColor }}
        </label>
        <input type="text" name="" :id="'input-' + colorId" class="p-4" v-model="localColor">
        
        <label :for="'content-' + colorId">
          Contenu :
        </label>
        <input type="text" name="" :id="'content-' + colorId" class="p-4" v-model="localMeaning">
      </div>

      <div class="button-container">
        <button type="submit" class="submit" @click.prevent="formSubmit">Sauvegarder</button>
        <button type="button" @click="showFormFn">Annuler</button>
      </div>
    </section>
  </form>
</template>

<style scoped lang="scss">
.popin-content {
  padding: 0;
}

form {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: #fff;
  // position: absolute;
  // top: 0;
  // left: 0;
  // right: 0;
  // bottom: 0;
  // border-bottom: 1px dotted;

  // &:not(:last-child) {
  //   margin-bottom: 32px;
  // }

  &:nth-child(odd) {
    background-color: #f1f1f1;
  }
}

label {
  font-weight: 700;
  margin-top: 25px;
}

textarea {
  min-height: 200px;
}

textarea, input {
  border-bottom: 1px solid #f1f1f1;
}

.button-container {
  display: flex;
  margin-top: 50px;
}
</style>