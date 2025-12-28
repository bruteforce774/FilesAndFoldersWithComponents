<script setup lang="ts">
import type { FileOrFolder } from '@/types';

const props = defineProps<{
  items: FileOrFolder[],
  parentFolder?: number | false,
  markedFilesAndFolders?: number[],
}>();
</script>

<template>
</template>
