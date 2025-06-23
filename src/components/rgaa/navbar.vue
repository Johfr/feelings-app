<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute()
const navLinks = [
  {
    name: 'Home',
    url: '/',
    type: 'link',
  },
  {
    name: 'More',
    url: '/more',
    type: 'button',
    child: [
      {
        name: 'WellBeingApp',
        url: '/well-Being-App',
        type: 'link',
      },
      {
        name: 'About2',
        url: '/about2',
        type: 'link',
      },
      {
        name: 'About3',
        url: '/about3',
        type: 'link',
      },
    ]
  },
  {
    name: 'Contact',
    url: '/contact',
    type: 'button',
    child: [
      {
        name: 'Linkedin',
        url: '/linkedin',
        type: 'link',
      },
      {
        name: 'Email',
        url: '/email',
        type: 'link',
      },
    ]
  },
]


let parentLinkActive = ref(null)

watch(route, () => {
  navLinks.forEach(link => {
    if (link.child) {
      link.child.find(child => {        
        if (child.name === route.name) {
          parentLinkActive.value = link.name
        }
      })
    } else {
      parentLinkActive.value = null
    }
  })
}, {
  immediate: true
})

// utilisation des refs pour rendre le code plus clair ?
// const liRefs = ref<HTMLElement[]>([])

const menuOpen = ref<string>('')

const showMenu = (event: MouseEvent) => {
  const target = event.target as HTMLElement | null
  const buttonClicked = target.innerText
  
  //Early return : ferme le sous menu au click sur le même bouton
  if(menuOpen.value === buttonClicked) {
    closeSubMenu()
    return
  }
  
  navLinks.forEach(link => {
    if (link.type === 'button' && link?.child.length > 0 && link.name === buttonClicked) {
      menuOpen.value = link.name
    }
  })
}

const closeSubMenu = () => {
    menuOpen.value = ''
}

// feat: femrer les sous menu à la perte du focus du bouton actif
const closeSubMenuOnFocusOut = (event: FocusEvent) => {
  const target = event.target as HTMLElement | null

  if(!target.closest("nav button")) {
    closeSubMenu()
  }
}

const handler = (event: MouseEvent) => {
  const target = event.target as HTMLElement | null

  if(!target.closest("nav ul li")) {
    closeSubMenu()
  }
}
// ferme les sous menu au clique sur la page
document.addEventListener('click', handler)

onUnmounted(() => document.removeEventListener('click', handler))
</script>

<template>
  <nav>
    <div class="logo">
      <RouterLink to="/">
        <!-- https://static.vecteezy.com/system/resources/previews/047/656/219/non_2x/abstract-logo-design-for-any-corporate-brand-business-company-vector.jpg -->
        <img src="../../assets/logo.png" alt="retour à l'accueil" title="home">
      </RouterLink>
    </div>
    <ul class="nav-list" @keyup.esc="closeSubMenu" role="menu">
      <li
        class="nav-link"
        v-for="(link, linkId) in navLinks" :key="linkId"
        role="menuitem"
      >
        <!-- @focusout="closeSubMenuOnFocusOut" -->

        <RouterLink class="nav-link_link" :aria-current="link.name === parentLinkActive" v-if="link.type === 'link'" :to="link.url" :title="link.name">
          {{ link.name }}
        </RouterLink>

        <button class="nav-link_link" :class="{'router-link-parent-active' : parentLinkActive === link.name}" v-else :aria-current="link.name === parentLinkActive" :aria-expanded="link.name === menuOpen" :aria-controls="'menu-' + link.name" @click="showMenu" :title="link.name">
          {{ link.name }}
        </button>

        <div class="sub-menu-container" :id="'menu-' + link.name" v-show="menuOpen === link.name">
          <ul class="sub-menu-list" v-if="link.child" role="menu">
            <li class="sub-menu-item" v-for="(child, childId) in link.child" :key="childId" :title="link.name">
              <RouterLink :to="child.url" role="menuitem">
                {{ child.name }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  // box-shadow: 0px 5px 10px #f3f3f3;
  background-color: #FFF;

  @media (min-width: 1024px) {
    position: fixed;
    top: 0;
    left: 65px;
    right: 65px;
    z-index: 3;
  }
}

.logo {
  width: 100px;
  height: 100px;

  img {
    height: 100%;
  }
}

.nav-list {
  display: flex;
  align-items: center;

  .nav-link {
    position: relative;

    &_link {
      // text-transform: uppercase;

      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}

.sub-menu-container {
  width: 150px;
  // width: 100%;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  // box-shadow: 0px 10px 10px #f3f3f3;
  background-color: #fff;

  // .sub-menu-list {
  //   width: 100%;
  // }
}

.sub-menu {
  &-item {
    padding: 16px;
  }
}

a[aria-current=true], a.router-link-active, button[aria-current=true], button.router-link-parent-active {
  font-weight: 700;
  // font-size: 18px;
}

button {
  padding: 0;
  font-size: 16px;
  color: #000;
  border-radius: unset;
  transition: .4s ease;
}

.router-link-parent-active {
  font-weight: 700;
}
</style>