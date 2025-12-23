<script setup lang="ts">
/**
 * Breadcrumbs Component
 *
 * Converted from Version 2: src/components/Breadcrumbs.ts
 *
 * Shows the current folder path like: Handlelister > Oktober
 * or "<i>rotmappe</i>" if at root level
 */

interface Props {
  texts?: string[]
}

// Define props using Composition API
const props = withDefaults(defineProps<Props>(), {
  texts: () => []
})
</script>

<template>
  <fieldset>
    <legend>Her er du nå</legend>
    <span v-if="!props.texts || props.texts.length === 0">
      <i>rotmappe</i>
    </span>
    <span v-else>
      &gt; {{ props.texts.join(' > ') }}
    </span>
  </fieldset>
</template>

<style scoped>
/* Styles will be added later when we add Pico CSS */
</style>