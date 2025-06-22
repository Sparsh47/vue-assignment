<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import {useFavourites} from "./stores/favourites";

const favStore = useFavourites();
favStore.loadFavouriteMovies();

</script>

<template>
  <Navbar />
  <div class="w-full max-w-7xl mx-auto">
    <router-view />
  </div>
</template>

<style scoped>
</style>
