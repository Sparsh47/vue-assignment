<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import ShowHeader from "../components/ShowHeader.vue";
import CastCarousel from "../components/CastCarousel.vue";
import SeasonSelector from '../components/SeasonSelector.vue'
import EpisodesCarousel from '../components/EpisodesCarousel.vue'

type CastMember = {
  person: { id: number; name: string; image: { medium: string } | null }
  character: { name: string } | null
}

type Episode = {
  id: number;
  name: string;
  season: number;
  number: number;
  airdate: string;
  summary: string | null;
  image: { medium: string; original: string } | null;
}

type ShowImage = {
  id: number;
  type: 'poster' | 'banner' | 'background' | 'typography' | null;
  main: boolean;
  resolutions: {
    medium?: { url: string; width: number; height: number };
    original: { url: string; width: number; height: number };
  };
}

type ShowDetails = {
  id: number
  name: string
  summary: string
  genres: string[]
  rating: { average: number | null }
  image: { original: string } | null
  _embedded: {
    cast: CastMember[]
    episodes: Episode[]
  }
}

const route = useRoute()
const showId = Number(route.params.id)

const show = ref<ShowDetails | null>(null)
const bannerImage = ref<string | null>(null)
const error = ref<string | null>(null)
const loading = ref(true)
const selectedSeason = ref<number | null>(null)
const selectedEpisode = ref<Episode | null>(null)
const episodesCarouselRef = ref<InstanceType<typeof EpisodesCarousel> | null>(null)

const groupedEpisodes = computed(() => {
  if (!show.value) return {}
  return show.value._embedded.episodes.reduce((acc: Record<number, Episode[]>, ep) => {
    acc[ep.season] = acc[ep.season] || []
    acc[ep.season].push(ep)
    return acc
  }, {})
})

const seasons = computed(() => {
  return Object.keys(groupedEpisodes.value).map(Number).sort((a, b) => a - b)
})

const currentSeasonEpisodes = computed(() => {
  if (!selectedSeason.value) return []
  return groupedEpisodes.value[selectedSeason.value] || []
})

async function fetchBannerImage(showId: number) {
  try {
    const { data } = await axios.get<ShowImage[]>(`https://api.tvmaze.com/shows/${showId}/images`)

    const bannerImg = data.find(img => img.type === 'banner')
    const backgroundImg = data.find(img => img.type === 'background')
    const fallbackImg = data.find(img => img.resolutions.original?.width > 800)

    const selectedImg = bannerImg || backgroundImg || fallbackImg

    if (selectedImg?.resolutions.original?.url) {
      bannerImage.value = selectedImg.resolutions.original.url
    }
  } catch (e) {
    console.warn('Failed to fetch banner images, using default poster')
    bannerImage.value = show.value?.image?.original || null
  }
}

async function fetchDetails() {
  try {
    const { data } = await axios.get<ShowDetails>(
        `https://api.tvmaze.com/shows/${showId}?embed[]=cast&embed[]=episodes`
    )
    show.value = data

    await fetchBannerImage(showId)

    if (seasons.value.length > 0) {
      selectedSeason.value = seasons.value[0]
    }
  } catch (e) {
    console.error(e)
    error.value = 'Failed to load show details.'
  } finally {
    loading.value = false
  }
}

function onSeasonChange(season: number) {
  selectedSeason.value = season
  selectedEpisode.value = null
  if (episodesCarouselRef.value) {
    episodesCarouselRef.value.resetScroll()
  }
}

function onEpisodeSelect(episode: Episode) {
  selectedEpisode.value = selectedEpisode.value?.id === episode.id ? null : episode
}

onMounted(fetchDetails)
</script>

<template>
  <div class="min-h-screen text-white p-6">
    <div v-if="loading" class="text-center text-gray-400">Loading show details...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <div v-else-if="show" class="space-y-8">
      <ShowHeader
          :name="show.name"
          :summary="show.summary"
          :genres="show.genres"
          :rating="show.rating"
          :image="{ original: bannerImage || show.image?.original || '' }"
      />

      <CastCarousel :cast="show._embedded.cast" />

      <div v-if="seasons.length" class="space-y-6">
        <SeasonSelector
            :seasons="seasons"
            :selected-season="selectedSeason"
            @update:selected-season="onSeasonChange"
        />

        <EpisodesCarousel
            ref="episodesCarouselRef"
            :episodes="currentSeasonEpisodes"
            :selected-episode-id="selectedEpisode?.id || null"
            @select-episode="onEpisodeSelect"
        />
      </div>
    </div>
  </div>
</template>