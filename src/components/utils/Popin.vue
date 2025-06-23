<script setup lang="ts">
const showPopin = defineModel()

const closePopin = ():void => {
  showPopin.value = !showPopin.value
}
</script>

<template>
  <div class="popin-container">
    <div v-if="showPopin" class="popin-overlay" @click="closePopin" />
    <div v-if="showPopin" class="popin">
      <div class="popin-button" @click="closePopin">X</div>
      <slot />
    </div>
  </div>
</template>

<style>
.popin-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: fixed;
  /* top: var(--navbarHeight); */
  top: 0;
  left: -20px;
  right: -20px;
  bottom: 0;
  
  @media (min-width: 960px) {
    top: 50%;
    transform: translateY(-50%);
  }
}
.popin-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.popin {
  width: 90%;
  position: relative;
  z-index: 2;
  overflow-y: scroll;
  border: 1px solid #f1f1f1;
  background-color: #fff;
  border-radius: 32px;
  overflow: hidden;

  @media (min-width: 960px) {
    width: 450px;
    height: calc(100vh - 400px);
  }
}

.popin-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 25px;
  min-height: 25px;
  font-weight: 700;
  border: 1px solid;
  border-radius: 50%;
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  z-index: 2;
}

</style>