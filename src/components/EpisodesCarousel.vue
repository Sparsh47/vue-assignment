<script setup lang="ts">
import { ref } from 'vue'
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/vue/24/outline";

type Episode = {
  id: number;
  name: string;
  season: number;
  number: number;
  airdate: string;
  summary: string | null;
  image: { medium: string; original: string } | null;
}

interface Props {
  episodes: Episode[]
  selectedEpisodeId: number | null
}

interface Emits {
  (e: 'selectEpisode', episode: Episode): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const scrollPosition = ref(0)

function scroll(direction: 'left' | 'right') {
  const container = document.getElementById('episodes-carousel')
  if (container) {
    const scrollAmount = window.innerWidth < 768 ? 250 : 300
    const newPosition = direction === 'left'
        ? Math.max(0, scrollPosition.value - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, scrollPosition.value + scrollAmount)

    container.scrollTo({ left: newPosition, behavior: 'smooth' })
    scrollPosition.value = newPosition
  }
}

function selectEpisode(episode: Episode) {
  emit('selectEpisode', episode)
}

function resetScroll() {
  scrollPosition.value = 0
  const container = document.getElementById('episodes-carousel')
  if (container) {
    container.scrollTo({ left: 0, behavior: 'smooth' })
  }
}

defineExpose({ resetScroll })
</script>

<template>
  <div v-if="episodes.length" class="relative px-2 sm:px-4 md:px-8 lg:px-12">
    <button
        @click="scroll('left')"
        class="absolute left-0 sm:-left-2 md:-left-4 lg:-left-8 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full cursor-pointer hover:bg-red-500 hover:bg-opacity-80 duration-150 ease-in-out transition-all focus:outline-none flex items-center justify-center z-10"
    >
      <ChevronLeftIcon class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
    </button>

    <div
        id="episodes-carousel"
        class="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-8 sm:px-10 md:px-12 lg:px-16"
    >
      <div
          v-for="episode in episodes"
          :key="episode.id"
          @click="selectEpisode(episode)"
          class="flex-shrink-0 cursor-pointer group rounded-lg"
          :class="[
            'w-60 sm:w-72 md:w-80 lg:w-80',
            { 'border border-red-500': selectedEpisodeId === episode.id }
          ]"
      >
        <div class="relative h-36 sm:h-40 md:h-48 rounded-lg overflow-hidden bg-gray-800">
          <img
              v-if="episode.image"
              :src="episode.image.medium"
              :alt="episode.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ease-in-out"
          />

          <div v-else class="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
            <div class="text-gray-400 text-center">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              <p class="text-xs sm:text-sm">No Image</p>
            </div>
          </div>

          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

          <div class="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 text-white">
            <div class="text-xs sm:text-sm font-medium text-red-500 mb-1">
              S{{ episode.season }}: E{{ episode.number }}
            </div>

            <h3 class="font-bold text-sm sm:text-base md:text-lg leading-tight mb-1 sm:mb-2 line-clamp-2">
              {{ episode.name }}
            </h3>

            <div class="text-xs sm:text-sm text-gray-300 mb-1 sm:mb-2">
              {{ new Date(episode.airdate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) }}
            </div>

            <div v-if="episode.summary"
                 class="text-xs text-gray-300 line-clamp-2 leading-relaxed hidden sm:block"
                 v-html="episode.summary.replace(/<[^>]*>/g, '').substring(0, 100) + (episode.summary.length > 100 ? '...' : '')">
            </div>
          </div>

          <div v-if="selectedEpisodeId === episode.id"
               class="absolute top-1 right-1 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center">
            <svg class="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <button
        @click="scroll('right')"
        class="absolute right-0 sm:-right-2 md:-right-4 lg:-right-8 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full cursor-pointer hover:bg-red-500 hover:bg-opacity-80 duration-150 ease-in-out transition-all focus:outline-none flex items-center justify-center z-10"
    >
      <ChevronRightIcon class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
    </button>
  </div>
</template>