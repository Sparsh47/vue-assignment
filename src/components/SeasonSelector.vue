<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

interface Props {
  seasons: number[]
  selectedSeason: number | null
}

interface Emits {
  (e: 'update:selectedSeason', season: number): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = ref(false)

function selectSeason(season: number) {
  emit('update:selectedSeason', season)
  isOpen.value = false
}

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function closeDropdown() {
  isOpen.value = false
}
</script>

<template>
  <div v-if="seasons.length" class="flex items-center gap-4">
    <h2 class="text-2xl font-semibold">Episodes</h2>

    <div class="relative">
      <button
          @click="toggleDropdown"
          @blur="closeDropdown"
          class="relative bg-primary text-white px-4 py-2 pr-10 rounded-lg border border-red-500 focus:outline-none transition-colors duration-200 min-w-[120px] text-left"
      >
        <span v-if="selectedSeason" class="text-red-500">Season {{ selectedSeason }}</span>
        <span v-else class="text-gray-400">Select Season</span>

        <ChevronDownIcon
            class="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500 transition-transform duration-200"
            :class="{ 'rotate-180': isOpen }"
        />
      </button>

      <div
          v-if="isOpen"
          class="absolute top-full left-0 right-0 mt-1 bg-primary border-2 border-red-500 rounded-lg shadow-lg z-50 overflow-hidden"
      >
        <div
            v-for="season in seasons"
            :key="season"
            @mousedown="selectSeason(season)"
            class="px-4 py-2 hover:bg-red-500 hover:text-white cursor-pointer transition-colors duration-150"
            :class="{
              'bg-red-500 text-white': selectedSeason === season,
              'text-gray-300': selectedSeason !== season
            }"
        >
          Season {{ season }}
        </div>
      </div>
    </div>
  </div>
</template>