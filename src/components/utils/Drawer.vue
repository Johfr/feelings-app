<script setup lang="ts">
const showDrawer = defineModel()

const showDrawerFn = ():void => {
  showDrawer.value = !showDrawer.value
}

</script>

<template>
  <section class="drawer-wrapper">
    <div class="drawer-overlay" v-if="showDrawer" @click="showDrawerFn"/>
    <div class="drawer-content" :class="{show : showDrawer}">
      <div class="close-button" @click="showDrawerFn">X</div>
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.drawer-wrapper {
  position: fixed;
  z-index: 5;
}
.drawer-content {
  position: fixed;
  right: -100%;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 3;
  background-color: #fff;
  transition: .6s ease;

  @media (min-width: 1024px) {
    right: -40%;
    width: 30%;
  }

  &.show {
    right: 0;
  }
}

.drawer-overlay {
  position: fixed;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  // width: 33%;
  background-color: rgba(0, 195, 255, 0.05);
}
</style>