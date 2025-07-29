<script setup lang="ts">

const props = defineProps<{
  formTitle: string,
  itemId: string | null,
  itemTitle: string | null,
  hasTags?: boolean
}>()

const emit = defineEmits(['create', 'update', 'delete'])

const showForm = defineModel()
const showFormFn = () => {
  showForm.value = !showForm.value
}

const localTitle = ref<string>(props?.itemTitle)

watch(props, (newVal) => {
  localTitle.value = props.itemTitle
})

const formSubmit = async () => {
  const isNew = !props.itemId
  
  if (isNew) {
    emit('create', localTitle.value)
  } else {
    emit('update', localTitle.value)
  }
  showFormFn()
}

const typing = ref<boolean>(false)
const happinessCounter = ref<number>(0)
let typingTimeout: ReturnType<typeof setTimeout> | null = null

const animateInput = (e: Event) => {
  typing.value = true
  const target = e.target as HTMLInputElement | null
  happinessCounter.value = target.value.length
  // Réinitialise le timer à chaque touche
  if (typingTimeout) clearTimeout(typingTimeout)
  typingTimeout = setTimeout(() => {
    typing.value = false
    typingTimeout = null
  }, 2000)
}

watch(showForm, (newVal) => {
  happinessCounter.value = localTitle.value?.length
}, {
  immediate: true
})
</script>

<template>
  <form>
    <section>
      <div class="flex items-center justify-between">
        <h3 class="title-h3">
          {{ formTitle }}
        </h3>
      </div>
      
      <p class="relative overflow-hidden">
        Bonheur :
         <!-- {{ happinessCounter }} -->
        
        <Transition name="slide-up">
          <span class="absolute" :key="happinessCounter">{{ happinessCounter }}</span>
        </Transition>
      </p>
      
      <div class="flex flex-col mt-3 relative">
        <label for="title">
          Titre :
        </label>
        <textarea type="text" name="" id="title" class="p-4" v-model="localTitle" @input="animateInput"> 
          {{ localTitle }}
        </textarea>

        <div v-if="hasTags">
          RecurrentRoutine | CurrentRoutine | Haiku
        </div>
                
        <div v-for="(i, iId) of 10" :key="iId" class="number-animated-wrapper">
          <span v-if="typing" class="number-animated" :class="i">
            +1
          </span>
        </div>
        
      </div>

      <div class="button-container">
        <button type="submit" class="submit" @click.prevent="formSubmit">Sauvegarder</button>
        <button type="button" @click="showFormFn">Annuler</button>
      </div>
    </section>
  </form>
</template>

<style scoped lang="scss">
form {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px;
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
}

label {
  font-weight: 700;
  // margin-top: 25px;
}

textarea {
  min-height: 200px;
}

textarea, input {
  border-bottom: 1px solid #f1f1f1;
}

.number-animated-wrapper {
  position: absolute;
  bottom: 0;
  right: 0;
  opacity: 0;
}

@for $i from 1 through 10 {
  .number-animated-wrapper:nth-child(3n + #{$i}) {
    right: calc(10px + #{$i * 40}px );
    animation: slideUp 2s ease-in-out #{$i * 0.6}s infinite normal forwards;
    animation: name duration timing-function delay iteration-count direction fill-mode;
  }
}

@keyframes slideUp {
  from {
    bottom: 0;
    opacity: 0.2;
    color: red;
  }
  to {
    bottom: 100%;
    opacity: 0.6;
    color: pink;
  }
}

.button-container {
  display: flex;
  margin-top: 50px;
}
</style>