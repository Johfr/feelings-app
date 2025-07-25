<script setup lang="ts">
import ConfirmBox from '@/components/utils/ConfirmBox.vue'
import { NSpace, NDynamicTags } from 'naive-ui'

const props = defineProps<{
  id: string | undefined,
  goal: string | undefined,
  tags: string[]
}>()

const emit = defineEmits(['create', 'update', 'delete'])

const showForm = defineModel<boolean>()
const showFormFn = () => {
  showForm.value = !showForm.value
}

const localGoal = ref<string>(props?.goal || null)
const tags = ref<string[]>(props.tags || [])

const formSubmit = async () => {
  if (!props.id) {
    emit('create', tags.value)
  } else {
    emit('update', props.id, tags.value)
  }
}

const showConfirm = ref(false)

const showConfirmFn = () => {
  showConfirm.value = !showConfirm.value
}

const deleteGoal = () => {
  emit('delete', props.id, localGoal.value)
}
</script>

<template>
  <form >
    <section>
      <div class="flex items-center justify-between">
        <h3 class="title-h3">
          Mes Tags
        </h3>

        <button v-if="props.id" type="button" class="delete-button" title="supprimer l'objectif" @click="showConfirmFn">
          Tout supprimer
        </button>
      </div>
      
      <div>

        <section class="flex flex-col mt-3">
          <!-- <p class=" text-sm mt-5">
            Ton mois est une quête. Choisis ton archétype. Remplis des quêtes quotidiennes. Gagne des points de compétence.
            Transforme ton mental et tes habitudes
          </p> -->

          <!-- <label for="tags">
            Tags : Dynamic Tags Naive
          </label> -->

          <p class="italic text-sm mt-5">
            Cible tes objectifs et définis les aspects de ta personne que tu veux voir évoluer (max 3 à 5 tags pour ne pas t'éparpiller, c'est déjà un bon début)
          </p>

          <p class="italic text-sm text-blue-500">
            (Tu pourras tagger tes todos avec et suivre ton évolution)
          </p>

          <p class="text-sm my-2">
            Choisis les skills ou les personnalités que tu veux développer : yogiste (pour les étirements, gainage), développeur (pour le code), culturiste (pour la muscu ou le workout) etc. 
          </p>

          <small class="italic text-xs mt-2 mb-2">
            Exemple: Projet pro, sport, développement personnel, musique, création, souplesse etc.
          </small>
          
          <n-space vertical>
            <n-dynamic-tags v-model:value="tags" type="info" />
          </n-space>
        </section>

        <Transition name="slide-fade">
          <ConfirmBox v-if="showConfirm" v-model="showConfirm" @confirm="deleteGoal" />
        </Transition>

        <div class="button-container">
          <button type="submit" class="submit" @click.prevent="formSubmit">Sauvegarder</button>
          <button type="button" @click="showFormFn">Annuler</button>
        </div>
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
  width: 100%;
  padding: 16px;
  background-color: #fff;
}

.button-container {
  display: flex;
  margin-top: 50px;
}
</style>