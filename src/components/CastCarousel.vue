<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/vue/24/outline";

type CastMember = {
  person: { id: number; name: string; image: { medium: string } | null }
  character: { name: string } | null
}

interface Props {
  cast: CastMember[]
}

defineProps<Props>()

const scrollPosition = ref(0)
const showLeftArrow = ref(false)
const showRightArrow = ref(false)

function scroll(direction: 'left' | 'right') {
  const container = document.getElementById('cast-carousel')
  if (container) {
    const scrollAmount = 300
    const newPosition = direction === 'left'
        ? Math.max(0, scrollPosition.value - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, scrollPosition.value + scrollAmount)

    container.scrollTo({ left: newPosition, behavior: 'smooth' })
    scrollPosition.value = newPosition
    updateArrowVisibility()
  }
}

function updateArrowVisibility() {
  const container = document.getElementById('cast-carousel')
  if (container) {
    const { scrollLeft, scrollWidth, clientWidth } = container

    showLeftArrow.value = scrollLeft > 0

    showRightArrow.value = scrollLeft < scrollWidth - clientWidth
  }
}

function checkScrollability() {
  const container = document.getElementById('cast-carousel')
  if (container) {
    const { scrollWidth, clientWidth } = container

    const hasOverflow = scrollWidth > clientWidth

    if (hasOverflow) {
      updateArrowVisibility()
    } else {
      showLeftArrow.value = false
      showRightArrow.value = false
    }
  }
}

onMounted(async () => {
  await nextTick()
  checkScrollability()

  const container = document.getElementById('cast-carousel')
  if (container) {
    container.addEventListener('scroll', updateArrowVisibility)
  }

  window.addEventListener('resize', checkScrollability)
})
</script>

<template>
  <div v-if="cast.length" class="space-y-4">
    <h2 class="text-2xl font-semibold">Cast</h2>
    <div class="relative">
      <button
          v-if="showLeftArrow"
          @click="scroll('left')"
          class="absolute -left-8 top-1/2 transform -translate-y-[50px] bg-white bg-opacity-20 backdrop-blur-sm w-12 h-12 rounded-full cursor-pointer hover:bg-red-500 hover:bg-opacity-80 duration-150 ease-in-out transition-all focus:outline-none flex items-center justify-center z-10"
      >
        <ChevronLeftIcon class="w-6 h-6 text-black" />
      </button>

      <div
          id="cast-carousel"
          class="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
      >
        <div
            v-for="member in cast"
            :key="member.person.id"
            class="flex-shrink-0 w-32 text-left"
        >
          <div class="relative">
            <img
                v-if="member.person.image"
                :src="member.person.image.medium"
                :alt="member.person.name"
                class="w-32 h-40 object-cover rounded-lg mb-2"
            />
            <div v-else class="w-32 h-40 bg-gray-700 rounded-lg mb-2 flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>
          <p class="text-sm font-medium truncate">{{ member.person.name }}</p>
          <p v-if="member.character" class="text-xs text-gray-400 truncate">{{ member.character.name }}</p>
        </div>
      </div>

      <button
          v-if="showRightArrow"
          @click="scroll('right')"
          class="absolute -right-8 top-1/2 transform -translate-y-[50px] bg-white bg-opacity-20 backdrop-blur-sm w-12 h-12 rounded-full cursor-pointer hover:bg-red-500 hover:bg-opacity-80 duration-150 ease-in-out transition-all focus:outline-none flex items-center justify-center z-10"
      >
        <ChevronRightIcon class="w-6 h-6 text-black" />
      </button>
    </div>
  </div>
</template>