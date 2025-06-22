<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/vue/24/outline";

type BannerItem = {
  id: number;
  title: string;
  summary: string;
  genre: string[];
  rating: number;
  url: string;
};

const props = defineProps({
  slides: {
    type: Array<BannerItem>,
    required: true
  }
})

const currentIndex = ref(0)
let interval = null

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.slides.length
}

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + props.slides.length) % props.slides.length
}

onMounted(() => {
  interval = setInterval(next, 5000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <div class="relative w-full overflow-hidden rounded-4xl">
    <div
        class="flex transition-transform duration-500"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
          v-for="(slide, index) in slides"
          :key="index"
          class="w-full flex-shrink-0 relative"
      >
        <img
            :src="slide.url"
            alt="Carousel Slide"
            class="w-full h-[400px] md:h-[700px] object-cover"
        />
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/100 to-black/30"></div>
        <div class="absolute bottom-10 left-10 w-full z-10 text-white space-y-2">
          <h2 class="text-5xl font-bold uppercase">{{slide.title}}</h2>
          <div class="flex flex-wrap gap-2">
            <span
                v-for="(g, i) in slide.genre"
                :key="i"
                class="text-xs font-medium text-white bg-white/20 px-3 py-1 rounded-full uppercase"
            >
              {{ g }}
            </span>
          </div>
          <p class="text-sm text-gray-200 leading-relaxed max-h-24 max-w-4/5 overflow-hidden">
            <span v-html="slide.summary" class="line-clamp-2"></span>
          </p>
          <router-link :to="`/shows/${slide.id}`">
            <button class="py-3 px-10 bg-red-500 hover:bg-red-800 ease-in-out duration-150 transition-all cursor-pointer text-white font-semibold rounded-xl uppercase">Watch</button>
          </router-link>
        </div>
      </div>
    </div>

    <button
        @click="prev"
        class="absolute left-5 top-1/2 transform -translate-y-1/2 bg-white/10 bg-opacity-50 w-12 h-12 rounded-full cursor-pointer hover:bg-red-500/10 duration-150 ease-in-out transition-all focus:outline-none flex items-center justify-center"
    >
      <ChevronLeftIcon class="w-6 h-6 text-white" />
    </button>

    <button
        @click="next"
        class="absolute right-5 top-1/2 transform -translate-y-1/2 bg-white/10 bg-opacity-50 w-12 h-12 rounded-full cursor-pointer hover:bg-red-500/10 duration-150 ease-in-out transition-all focus:outline-none flex items-center justify-center"
    >
      <ChevronRightIcon class="w-6 h-6 text-white" />
    </button>
  </div>
</template>