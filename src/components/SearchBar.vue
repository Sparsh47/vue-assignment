<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{ query: string }>()
const emit = defineEmits<{ (e: 'update:query', val: string): void }>()

function onInput(e: Event) {
  emit('update:query', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <input
      :value="props.query"
      @input="onInput"
      type="text"
      placeholder="Enter show name"
      class="w-full flex-1 px-4 py-3 rounded-md bg-transparent border border-white/20 text-white placeholder-stone-500 text-base focus:outline-none"
  />
</template>