<script setup lang="ts">
const showSidebar = defineModel()

const showSidebarFn = ():void => {
  showSidebar.value = !showSidebar.value
}

</script>

<template>
  <section class="sidebar-wrapper">
    <!-- <div class="sidebar-overlay" v-if="showSidebar" @click="showSidebarFn"/> -->
    <div class="sidebar-content" :class="{show : showSidebar}">
      <div class="close-button" @click="showSidebarFn">X</div>
      <h1>Sidebar</h1>
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.sidebar-wrapper {
  width: 400px;
  height: 100vh;
  position: fixed;
  left: 0;
  z-index: 5;
}
// .sidebar-content {
//   position: fixed;
//   left: 100%;
//   top: 0;
//   bottom: 0;
//   width: 100%;
//   z-index: 3;
//   background-color: #fff;
//   transition: .6s ease;

//   @media (min-width: 1024px) {
//     left: 0;
//     width: 400px;
//   }

//   &.show {
//     left: 0;
//   }
// }

// .sidebar-overlay {
//   position: fixed;
//   right: 0;
//   left: 0;
//   top: 0;
//   bottom: 0;
//   // width: 33%;
//   background-color: rgba(0, 195, 255, 0.05);
// }
</style>