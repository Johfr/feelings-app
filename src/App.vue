<script setup lang="ts">
import Navbar from '@/components/rgaa/navbar.vue'
import { NNotificationProvider } from 'naive-ui'

const setHour = () => {
  const hour = new Date().getHours()

  const body = document.querySelector('body')
  if (hour >= 12 && hour <18 ) {
    body.classList.add('afternoon')
  } else if (hour >= 18) {
    body.classList.add('night')
  }

  return hour
}

onMounted(() => setHour())

// TODO 
// Faire de l'app la page principale
</script>

<template>
  <n-notification-provider placement='top-left'>
  <RouterView />
  </n-notification-provider>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  /* nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  } */
}
</style>
