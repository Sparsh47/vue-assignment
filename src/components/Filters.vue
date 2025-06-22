<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, computed } from 'vue'
import { AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  categories: string[]
  selectedCategories: string[]
  sortOrder: 'none' | 'asc' | 'desc'
}>()

const emit = defineEmits<{
  (e: 'update:selectedCategories', value: string[]): void
  (e: 'update:sortOrder', value: 'none' | 'asc' | 'desc'): void
}>()

const dropdownOpen = ref(false)
const internalSelected = ref<string[]>([])

watch(
    () => props.selectedCategories,
    (val) => {
      internalSelected.value = [...val]
    },
    { immediate: true }
)

watch(internalSelected, (newVal) => {
  emit('update:selectedCategories', [...newVal])
}, { deep: true })

function toggleCategory(cat: string) {
  const idx = internalSelected.value.indexOf(cat)
  if (idx > -1) {
    internalSelected.value.splice(idx, 1)
  } else {
    internalSelected.value.push(cat)
  }
}

function toggleSortOrder() {
  let newSortOrder: 'none' | 'asc' | 'desc'

  if (props.sortOrder === 'none') {
    newSortOrder = 'desc'
  } else if (props.sortOrder === 'desc') {
    newSortOrder = 'asc'
  } else {
    newSortOrder = 'none'
  }

  emit('update:sortOrder', newSortOrder)
}

const sortButtonText = computed(() => {
  switch (props.sortOrder) {
    case 'desc': return '↓'
    case 'asc': return '↑'
    default: return 'Sort '
  }
})

const sortButtonClass = computed(() => {
  const baseClass = "px-4 py-3 rounded-md text-white font-medium transition-colors duration-200 whitespace-nowrap flex items-center space-x-2 cursor-pointer"

  if (props.sortOrder === 'none') {
    return `${baseClass} bg-transparent hover:bg-white/10 border border-white/20`
  } else {
    return `${baseClass} bg-white/10 hover:bg-white/10 border border-white/20`
  }
})

function clearAllFilters() {
  internalSelected.value = []
  emit('update:sortOrder', 'none')
}

function closeDropdown() {
  dropdownOpen.value = false
}
</script>

<template>
  <div class="flex items-center space-x-4">
    <div class="relative">
      <button
          @click="dropdownOpen = !dropdownOpen"
          class="p-3 text-white rounded-md border border-white/20 hover:bg-white/10 cursor-pointer transition relative"
      >
        <AdjustmentsHorizontalIcon class="w-6 h-6" />
        <span
            v-if="internalSelected.length > 0"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
        >
          {{ internalSelected.length }}
        </span>
      </button>

      <div
          v-if="dropdownOpen"
          class="fixed inset-0 z-40"
          @click="closeDropdown"
      ></div>

      <div
          v-if="dropdownOpen"
          class="absolute right-0 mt-2 w-56 max-h-64 bg-stone-800 text-white rounded-lg border border-white/20 z-50 shadow-xl"
      >
        <div class="p-3 border-b border-white/20 flex justify-between items-center">
          <span class="font-medium text-sm">Filter by Genre</span>
          <button
              v-if="internalSelected.length > 0"
              @click="clearAllFilters"
              class="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Clear All
          </button>
        </div>

        <div class="max-h-48 overflow-auto">
          <ul class="p-2">
            <li
                v-for="cat in props.categories"
                :key="cat"
                class="flex items-center mb-2 hover:bg-white/5 p-2 rounded transition-colors"
            >
              <input
                  type="checkbox"
                  :id="`filter-${cat}`"
                  class="mr-3 h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  :checked="internalSelected.includes(cat)"
                  @change="toggleCategory(cat)"
              />
              <label :for="`filter-${cat}`" class="text-sm cursor-pointer flex-1">{{ cat }}</label>
            </li>
          </ul>
        </div>

        <div v-if="props.categories.length === 0" class="p-4 text-center text-gray-400 text-sm">
          No genres available
        </div>
      </div>
    </div>

    <button
        @click="toggleSortOrder"
        :class="sortButtonClass"
    >
      <span>{{ sortButtonText }}</span>
    </button>
  </div>
</template>

<style scoped>
.max-h-48::-webkit-scrollbar {
  width: 6px;
}

.max-h-48::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.max-h-48::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.max-h-48::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>