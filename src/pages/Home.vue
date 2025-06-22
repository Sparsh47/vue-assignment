<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'
import axios from 'axios'

import Carousel from '../components/Carousel.vue'
import SearchBar from '../components/SearchBar.vue'
import FiltersDropdown from '../components/Filters.vue'
import MovieGrid from '../components/MovieGrid.vue'

type Movie = {
  id: number
  title: string
  posterUrl: string
  rating: number
  genres: string[]
}

type BannerItem = {
  id: number
  title: string
  summary: string
  genre: string[]
  rating: number
  url: string
}

const showsBanners = ref<BannerItem[]>([])
const moviesList   = ref<Movie[]>([])
const loading      = ref(false)
const error        = ref<string | null>(null)

const query              = ref('')
const selectedCategories = ref<string[]>([])
const sortOrder          = ref<'none' | 'asc' | 'desc'>('none')

const availableCategories = computed(() =>
    Array.from(new Set(moviesList.value.flatMap(m => m.genres))).sort()
)

const filteredMovies = computed(() => {
  let filtered = moviesList.value.filter(m => {
    return selectedCategories.value.length === 0 ||
        selectedCategories.value.some(cat => m.genres.includes(cat))
  })

  if (sortOrder.value === 'asc') {
    filtered = [...filtered].sort((a, b) => a.rating - b.rating)
  } else if (sortOrder.value === 'desc') {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating)
  }

  return filtered
})

async function searchShows(searchQuery: string) {
  if (loading.value) return

  loading.value = true
  error.value   = null

  try {
    let apiUrl: string
    let allShows: any[]

    if (searchQuery.trim()) {
      apiUrl = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchQuery)}`
      const { data: searchResults } = await axios.get(apiUrl)
      allShows = searchResults.map((result: any) => result.show)
    } else {
      apiUrl = 'https://api.tvmaze.com/shows'
      const { data } = await axios.get(apiUrl)
      allShows = data
    }

    if (selectedCategories.value.length > 0) {
      selectedCategories.value = []
    }
    if (sortOrder.value !== 'none') {
      sortOrder.value = 'none'
    }

    moviesList.value = allShows.map((s: any) => ({
      id: s.id,
      title: s.name,
      posterUrl: s.image?.medium || '',
      rating: s.rating?.average || 0,
      genres: s.genres || []
    }))

    const bannerMeta = allShows.slice(0, 5).map((s: any) => ({
      id:      s.id,
      title:   s.name,
      genre:   s.genres || [],
      summary: s.summary || '',
      rating:  s.rating?.average || 0,
      url:     ''
    }))

    getBannerImages(bannerMeta).then(banners => {
      showsBanners.value = banners
    }).catch(console.error)

  } catch (e) {
    console.error(e)
    error.value = searchQuery ? 'Failed to search shows.' : 'Failed to load shows.'
  } finally {
    loading.value = false
  }
}

async function getBannerImages(meta: Omit<BannerItem,'url'>[]) {
  const res: BannerItem[] = []
  for (const item of meta) {
    try {
      const { data } = await axios.get(`https://api.tvmaze.com/shows/${item.id}/images`)
      const bg = data.find((img: any) => img.type === 'background')
      res.push({ ...item, url: bg?.resolutions?.original?.url || '' })
    } catch {
      res.push({ ...item, url: '' })
    }
  }
  return res
}

let searchTimeout: NodeJS.Timeout | null = null
watch(query, (newQuery, oldQuery) => {
  if (newQuery === oldQuery) return

  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    searchShows(newQuery)
    searchTimeout = null
  }, 500)
}, { flush: 'post' })

onMounted(() => searchShows(''))
</script>

<template>
  <div class="w-full min-h-screen p-5 space-y-8">
    <Carousel :slides="showsBanners" />

    <div class="w-full flex items-center space-x-4 mt-8">
      <SearchBar v-model:query="query" />
      <FiltersDropdown
          :categories="availableCategories"
          v-model:selectedCategories="selectedCategories"
          v-model:sortOrder="sortOrder"
      />
    </div>

    <div v-if="error" class="text-red-500">{{ error }}</div>

    <div v-if="loading" class="text-gray-400">Loading...</div>

    <MovieGrid :movies="filteredMovies" />
  </div>
</template>