<script setup lang="ts">
import { HeartIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <header class="w-full flex items-center justify-center bg-primary px-4 py-2 border-b-[1px] border-white/5">
    <nav class="max-w-7xl w-full flex items-center justify-between">
      <router-link to="/" class="flex items-center">
        <img src="/logo.png" alt="Logo" class="h-12 w-auto" />
      </router-link>

      <div class="flex items-center space-x-4">
        <router-link to="/favourites">
          <HeartIcon class="h-6 w-6 text-red-500" />
        </router-link>
      </div>
    </nav>
  </header>
</template>
