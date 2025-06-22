<script setup lang="ts">
import { defineProps } from 'vue';
import ShowCard from './ShowCard.vue';
import {useFavourites} from "../stores/favourites";

interface Movie {
  id: number | string;
  title: string;
  posterUrl?: string;
  imageUrl?: string;
  rating: number;
}

const props = defineProps<{ movies: Movie[] }>();
const favStore = useFavourites();
</script>

<template>
  <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
    <ShowCard
        v-for="movie in props.movies"
        :key="movie.id"
        :id="movie.id"
        :imageUrl="movie.posterUrl ?? movie.imageUrl ?? ''"
        :title="movie.title"
        :rating="movie.rating"
        :isFavorite="!!favStore.favouriteMovies.find(s => s.id === movie.id)"
        @add-fav="favStore.addToFavouriteMovies($event)"
        @remove-fav="favStore.removeFromFavouriteMovies(movie.id)"
    />
  </div>
</template>