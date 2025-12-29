<script setup lang="ts">
import type { FileOrFolder } from '@/types';

const props = defineProps<{
  items: FileOrFolder[],
  parentFolder?: number | false,
  markedFilesAndFolders?: number[],
}>();

// emit for original custom event "selected"
const emit = defineEmits<{
  selected: [id: number]
}>();

function handleSelect(id: number) {
  // corresponds to idStr in original
  emit('selected', id);
}
</script>

<template>
  <fieldset>
    <legend>Mapper og filer</legend>
    <ul>
      <li v-for="item in props.items" :key="item.id">
        <!-- link with click handler -->
        <a href="#" @click.prevent="handleSelect(item.id)">
        <span v-if="item.content">🗎</span>
        <span v-else>📁</span>
        {{ item.name }}
        </a>
      </li>
    </ul>
  </fieldset>
</template>

<style scoped>
  a {
    text-decoration: none;
  }
  li {
    list-style: none;
    padding: 0;
  }
</style>
