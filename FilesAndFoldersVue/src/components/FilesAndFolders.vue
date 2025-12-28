<script setup lang="ts">
import type { FileOrFolder } from '@/types';

const props = defineProps<{
  items: FileOrFolder[],
  parentFolder?: number | false,
  markedFilesAndFolders?: number[],
}>();
</script>

<template>
  <fieldset>
    <legend>Mapper og filer</legend>
    <li v-for="item in props.items" :key="item.id">
      <span v-if="item.content">🗎</span>
      <span v-else>📁</span>
    </li>
  </fieldset>
</template>
