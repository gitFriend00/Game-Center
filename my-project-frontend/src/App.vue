<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="primary" density="comfortable" class="align-center"
      v-if="store.$state.userInformation.UserName != undefined">
      <button class="setting-btn ml-5 mr-2" @click="drawer = !drawer">
        <span class="bar bar1"></span>
        <span class="bar bar2"></span>
        <span class="bar bar1"></span>
      </button>

      <v-app-bar-title class="font-weight-thin">
        <button class="button" data-text="Awesome">
          <span class="actual-text">&nbsp;console&nbsp;</span>
          <span aria-hidden="true" class="hover-text">&nbsp;console&nbsp;</span>
        </button>
      </v-app-bar-title>
      <button class="Btn bg-compliment mr-5" @click="Logout()">

        <div class="sign"><svg viewBox="0 0 512 512">
            <path
              d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z">
            </path>
          </svg></div>

        <div class="text">Logout</div>
      </button>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" permanent
      v-if="store.$state.userInformation.UserName != undefined">
      <v-list>
      <v-list-item>Console.Org</v-list-item>
        <v-list-item 
          :title="`${store.userInformation.UserName}`" :subtitle="`${store.userInformation.Role}`">
          <template v-slot:prepend>
            <v-avatar>
            </v-avatar>
          </template>
        </v-list-item>
      </v-list> 
      

      <v-divider></v-divider>

      <v-list nav>
        <v-list-item @click="functionLoad(item)" :to="item.to" v-for="(item, index) in navItems" :key="index"
          :prepend-icon="item.icon" :title="item.title" link></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-overlay color="#033E41" v-model="loading" class="align-center justify-center">
      <span class="loader"></span>
    </v-overlay>

    <v-main class="d-flex flex-column">
      <router-view class="flex-grow-1" />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMainStore } from './stores'
import { useRouter } from 'vue-router'

const store = useMainStore()
const router = useRouter()

const drawer = ref(false)
const loading = ref(false)

const navItems = computed(() => {
  const role = store.$state.userInformation.Role
  const isCustomer = role === 'Customer'
  const isAdmin = role === 'Admin'
  const items = [
    {
      title: 'Home',
      icon: 'mdi-home',
      to: '/'
    }
  ]

  if (isAdmin) {
    items.push({
      title: 'GameCenter',
      icon: 'mdi-cart',
      to: '/gamecenter'
    })
  }

  if (isAdmin) {
    items.push({
      title: 'User Management',
      icon: 'mdi-account-group',
      to: '/usermanagement'
    })
  }

  if (isCustomer) {
    items.push({
      title: 'Store',
      icon: 'mdi-store',
      to: '/store'
    })
  }

  items.push({
    title: 'About',
    icon: 'mdi-information',
    to: '/about'
  })

  return items
})

async function functionLoad(item) {
  console.log(item, 'item')
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1300);
}

const Logout = () => {
  setTimeout(() => {
    store.$state.userInformation = {}
    router.push('/login')
  }, 300);
}

</script>

<style scoped>
@import "../src/style/appandloaders.css";

* {
  font-family: monospace !important;
}




</style>