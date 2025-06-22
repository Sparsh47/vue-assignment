<script setup lang="ts">

interface Props {
  name: string
  summary: string
  genres: string[]
  rating: { average: number | null }
  image: { original: string } | null
}

const props = defineProps<Props>()

</script>

<template>
  <div class="space-y-8">
    <img class="w-full h-[300px] md:h-[600px] object-cover rounded-4xl" :src="props?.image.original" :alt="props?.name" />

    <div class="space-y-4">
      <h1 class="text-4xl font-bold">{{ name }}</h1>
      <div class="flex flex-wrap gap-2">
        <span
            v-for="genre in genres"
            :key="genre"
            class="px-3 py-1 bg-white/10 rounded-full text-sm text-red-500"
        >
          {{ genre }}
        </span>
      </div>
      <div class="text-red-500">Rating: {{ rating.average ?? 'N/A' }}</div>
    </div>

    <div class="prose prose-invert max-w-none" v-html="summary"></div>
  </div>
</template>