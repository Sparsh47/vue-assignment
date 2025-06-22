<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { PlusIcon, StarIcon, XMarkIcon } from '@heroicons/vue/24/solid';

const props = defineProps<{
  id: number | string;
  imageUrl: string;
  title: string;
  rating: number;
  isFavorite: boolean;
}>();

const emit = defineEmits<{
  (e: 'add-fav', payload: { id: number | string; title: string; imageUrl: string; rating: number }): void;
  (e: 'remove-fav', payload: number | string): void;
}>();

const normalizedRating = computed(() => {
  const raw = props.rating > 5 ? props.rating / 2 : props.rating;
  return Math.min(Math.max(raw, 0), 5);
});
const fullStars = computed(() => Math.floor(normalizedRating.value));
const hasHalfStar = computed(() => normalizedRating.value - fullStars.value >= 0.5);
const emptyStars = computed(() => 5 - fullStars.value - (hasHalfStar.value ? 1 : 0));

function onFavClick() {
  if (props.isFavorite) {
    emit('remove-fav', props.id);
  } else {
    emit('add-fav', { id: props.id, title: props.title, imageUrl: props.imageUrl, rating: props.rating });
  }
}
</script>

<template>
  <router-link :to="`/shows/${props.id}`">
    <div class="w-full rounded-2xl overflow-hidden shadow-lg text-white relative">
      <img :src="props.imageUrl" :alt="props.title" class="w-full h-[400px] md:h-80 object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10 z-10"></div>
      <button
          @click.prevent="onFavClick"
          class="absolute top-2 right-2 z-20 bg-white/30 hover:bg-red-500/20 p-2 rounded-full focus:outline-none cursor-pointer"
          :aria-label="props.isFavorite ? 'Remove from favorites' : 'Add to favorites'"
      >
        <component :is="props.isFavorite ? XMarkIcon : PlusIcon" class="h-5 w-5 text-white" />
      </button>
      <div class="absolute bottom-4 left-4 z-20">
        <h3 class="text-lg font-semibold truncate w-full pr-4">{{ props.title }}</h3>
        <div class="flex items-center mt-1 space-x-1">
          <template v-for="n in fullStars" :key="`star-full-${n}`">
            <StarIcon class="h-4 w-4 text-yellow-400" />
          </template>
          <template v-if="hasHalfStar">
            <div class="relative h-4 w-4">
              <StarIcon class="absolute inset-0 h-4 w-4 text-yellow-400" />
              <div class="absolute inset-y-0 left-0 h-4 w-2 overflow-hidden">
                <StarIcon class="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </template>
          <template v-for="n in emptyStars" :key="`star-empty-${n}`">
            <StarIcon class="h-4 w-4 text-gray-600" />
          </template>
        </div>
      </div>
    </div>
  </router-link>
</template>