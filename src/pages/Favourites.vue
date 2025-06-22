<script setup lang="ts">
import { onMounted } from 'vue';
import { useFavourites } from "../stores/favourites";
import MovieGrid from "../components/MovieGrid.vue";

const favStore = useFavourites();
onMounted(() => {
  favStore.loadFavouriteMovies();
});
</script>

<template>
  <div class="w-full min-h-screen p-8 text-white">
    <h1 class="text-3xl font-bold mb-6">My Favorites</h1>

    <div v-if="!favStore.favouriteMovies.length" class="text-gray-400">
      You haven’t added any shows to your favorites yet.
    </div>

    <MovieGrid v-else :movies="favStore.favouriteMovies" />
  </div>
</template>